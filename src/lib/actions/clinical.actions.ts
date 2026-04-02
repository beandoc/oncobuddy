"use server";

import { prisma } from "@/lib/prisma";
import { Role, AccountStatus, ClinicianRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function registerNewPatient(formData: {
  firstName: string;
  lastName: string;
  email: string;
  mrn: string;
  dateOfBirth: string;
  oncologistId?: string;
  institutionId: string;
}) {
  try {
    const temporaryPassword = await bcrypt.hash("oncobuddy123", 12);

    // Atomic Transaction for Medical Registry Enrollment (Section A7)
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Patient User Record
      const user = await tx.user.create({
        data: {
          email: formData.email,
          passwordHash: temporaryPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: Role.PATIENT,
          accountStatus: AccountStatus.ACTIVE,
          institutionId: formData.institutionId,
        },
      });

      // 2. Create Clinical Patient Record
      const patient = await tx.patient.create({
        data: {
          userId: user.id,
          mrn: formData.mrn,
          preferredName: formData.firstName,
          dateOfBirth: new Date(formData.dateOfBirth),
          institutionId: formData.institutionId,
          gender: "PREFER_NOT_TO_SAY",
          sexAtBirth: "FEMALE",
          maritalStatus: "MARRIED",
          primaryPhone: "9999999999",
        },
      });

      // 3. Link to Clinical Team (Oncologist)
      if (formData.oncologistId) {
        await tx.patientClinicalTeam.create({
          data: {
            patientId: patient.id,
            clinicianId: formData.oncologistId,
            clinicianRole: ClinicianRole.ONCOLOGIST,
            isPrimary: true,
          }
        });
      }

      return patient;
    });

    // Global Registry Revalidation (Ensures Live Sync across portals)
    revalidatePath("/oncologist/dashboard");
    revalidatePath("/nurse/patients");
    revalidatePath("/oncologist/patients");

    return { success: true, patientId: result.id };
  } catch (error) {
    console.error("❌ High-Fidelity Registration Failure:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Clinical Engine Fault";
    return { 
      success: false, 
      error: (error as any).code === 'P2002' ? "Identity Crash: MRN or Email already in registry." : errorMessage
    };
  }
}
