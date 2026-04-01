'use server';

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Role, AccountStatus, Gender, SexAtBirth, BloodGroup, MaritalStatus, ContactMethod, ContactTime, LiteracyLevel, AuditAction, Prisma } from "@prisma/client";
import { logAudit } from "@/lib/audit";

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  primaryPhone: z.string().min(10),
  password: z.string().min(8),
  consentGiven: z.string().refine((val) => val === "true", "Consent is required"),
});

export async function registerPatient(prevState: any, formData: FormData) {
  const validatedFields = registerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { firstName, lastName, email, primaryPhone, password, consentGiven } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: { email: ["Email already registered."] } };

    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create User and Patient in transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Fetch default institution (Section 12)
      let institution = await tx.institution.findFirst();
      if (!institution) {
        institution = await tx.institution.create({
          data: {
            institutionName: "OncoBuddy Clinical Network",
            slug: "default",
            emergencyPhoneNumber: "911",
          }
        });
      }

      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: Role.PATIENT,
          firstName,
          lastName,
          accountStatus: AccountStatus.ACTIVE,
          institutionId: institution.id,
        }
      });

      const patient = await tx.patient.create({
        data: {
          userId: user.id,
          institutionId: institution.id,
          mrn: `MRN-${Math.random().toString(36).substring(7).toUpperCase()}`,
          dateOfBirth: new Date("1980-01-01"),
          gender: Gender.PREFER_NOT_TO_SAY,
          sexAtBirth: SexAtBirth.MALE,
          maritalStatus: MaritalStatus.PREFER_NOT_TO_SAY,
          primaryPhone,
          consentGiven: true,
          consentTimestamp: new Date(),
          consentVersion: "v2.1",
          preferredLanguage: "en",
          literacyLevel: LiteracyLevel.STANDARD,
          preferredContactMethod: ContactMethod.EMAIL,
          preferredContactTime: ContactTime.MORNING,
        }
      });

      return { user, patient };
    });

    // Audit Log for clinical data creation
    await logAudit({
      userId: result.user.id,
      userRole: Role.PATIENT,
      action: "CREATE",
      resourceType: "Patient",
      resourceId: result.patient.id,
      notes: "Initial patient registration and consent",
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: { root: ["Database error occurred. Please try again."] } };
  }
}
