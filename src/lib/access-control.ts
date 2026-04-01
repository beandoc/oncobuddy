import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

/**
 * Ensures the user has the required role.
 * Can be used in Server Components, Server Actions, and API Routes.
 */
export async function requireRole(allowedRoles: Role | Role[]) {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  const roleList = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  if (!roleList.includes(session.user.role)) {
    // Role-Based Redirect Gate (Section 4)
    const roleRedirectMap: Record<Role, string> = {
      [Role.ONCOLOGIST]: "/oncologist/dashboard",
      [Role.NURSE]: "/nurse/dashboard",
      [Role.PATIENT]: "/patient/dashboard",
      [Role.CAREGIVER]: "/caregiver/dashboard",
      [Role.ADMIN]: "/admin/dashboard",
    };
    
    redirect(roleRedirectMap[session.user.role as Role] || "/login");
  }

  return session;
}

/**
 * Checks if the current user owns a specific patient resource.
 */
export async function ensurePatientAccess(patientId: string) {
  const session = await auth();
  if (!session) redirect("/login");

  // Patients can only access their own record
  if (session.user.role === Role.PATIENT) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { patient: true }
    });
    if (user?.patient?.id !== patientId) {
      redirect("/unauthorized");
    }
  }

  // Clinicians must have the patient in their panel (to be implemented with DB checks)
  // For now, let's keep it simple.
  return session;
}
