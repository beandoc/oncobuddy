import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role, ClinicianRole, User as PrismaUser } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { 
    strategy: "database", // Ensures server-side session storage (Prisma-backed)
    maxAge: 24 * 60 * 60, // Default 24h, overridden by role-based logic or middleware check
    updateAge: 5 * 60, // 5m heartbeat
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await prisma.user.findUnique({
          where: { email },
          include: { 
            clinician: true,
            patient: true,
            caregiver: true
          }
        });

        if (!user || !user.passwordHash || user.accountStatus !== "ACTIVE") return null;

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordsMatch) {
          // Increment failed attempts and potentially lock account
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: { increment: 1 } }
          });
          return null;
        }

        // --- Role Specific Security Logic ---
        if (user.role === Role.ONCOLOGIST || user.role === Role.NURSE) {
          if (!user.mfaEnabled) {
            // Requirement 3: Mandatory MFA setup for clinicians
            // Since authorize cannot redirect itself in the same way, 
            // the signIn callback or a subsequent page guard should handle redirect.
          }
        }

        // Clear failed attempts upon success
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            failedLoginAttempts: 0,
            lastLoginAt: new Date(),
            // lastLoginIp handled by helper as headers() not available in some contexts here
          }
        });

        return user;
      },
    }),
  ],
  events: {
    async signIn({ user }: { user: any }) {
      // Requirement 4: Concurrent session control for clinicians
      if (user.role === Role.ONCOLOGIST || user.role === Role.NURSE) {
        // Find existing non-expired sessions for this clinician and delete them (1 concurrent session)
        await prisma.session.deleteMany({
          where: {
            userId: user.id,
            expires: { gte: new Date() }
          }
        });
      }

      await logAudit({
        userId: user.id,
        userRole: user.role as Role,
        action: "LOGIN",
        resourceType: "Auth",
        resourceId: user.id,
        notes: `Successful login as ${user.role}`,
      });
    }
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user && user) {
        const dbUser = user as any; // Loaded by PrismaAdapter
        
        session.user.id = dbUser.id;
        session.user.role = dbUser.role as Role;
        
        // --- High Criticality: Attach Authorized Patient Contexts ---
        if (session.user.role === Role.ONCOLOGIST || session.user.role === Role.NURSE) {
          const clinician = await prisma.clinician.findUnique({
            where: { userId: dbUser.id },
            include: { patients: { where: { endedAt: null } } }
          });
          session.user.clinicianId = clinician?.id;
          session.user.authorizedPatientIds = clinician?.patients.map((p: any) => p.patientId) || [];
          
          // idle timeout check logic (ideally handled via middleware/jwt callbacks)
        } else if (session.user.role === Role.PATIENT) {
          const patient = await prisma.patient.findUnique({
            where: { userId: dbUser.id }
          });
          session.user.patientId = patient?.id;
          session.user.authorizedPatientIds = patient?.id ? [patient.id] : [];
        } else if (session.user.role === Role.CAREGIVER) {
          const caregiver = await prisma.caregiver.findUnique({
            where: { userId: dbUser.id },
            include: { patients: { where: { isActive: true } } }
          });
          session.user.caregiverId = caregiver?.id;
          session.user.authorizedPatientIds = caregiver?.patients.map((p: any) => p.patientId) || [];
          
          // View Access Map
          const accessMap: Record<string, string> = {};
          caregiver?.patients.forEach((p: any) => {
             accessMap[p.patientId] = p.accessLevel;
          });
          session.user.caregiverAccessMap = accessMap;
        }
      }
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      clinicianId?: string;
      patientId?: string;
      caregiverId?: string;
      authorizedPatientIds: string[];
      caregiverAccessMap?: Record<string, string>;
    }
  }
}
