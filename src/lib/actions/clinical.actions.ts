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
  gender: string;
  sexAtBirth: string;
  maritalStatus: string;
  address: string;
  occupation: string;
  educationLevel: string;
  tobaccoUsage: string;
  alcoholUsage: string;
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

      // 2. Create Clinical Patient Record (Global Registry Section)
      const patient = await tx.patient.create({
        data: {
          userId: user.id,
          mrn: formData.mrn,
          preferredName: formData.firstName,
          dateOfBirth: new Date(formData.dateOfBirth),
          institutionId: formData.institutionId,
          gender: formData.gender as any,
          sexAtBirth: formData.sexAtBirth as any,
          maritalStatus: formData.maritalStatus as any,
          primaryPhone: "9999999999",
          addressLine1: formData.address,
          occupation: formData.occupation,
          educationLevel: formData.educationLevel,
          tobaccoUsage: formData.tobaccoUsage,
          alcoholUsage: formData.alcoholUsage,
          vitalStatus: "ALIVE",
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

/**
 * High-Fidelity Multidisciplinary Referral (Section A2)
 * Orchestrates cross-specialty clinical transitions.
 */
export async function referToSpecialist(data: {
  patientId: string;
  specialistId: string;
  referralRole: ClinicianRole;
  isPrimary?: boolean;
}) {
  try {
    const result = await prisma.patientClinicalTeam.upsert({
      where: { 
        patientId_clinicianId_endedAt: {
          patientId: data.patientId,
          clinicianId: data.specialistId,
          endedAt: null
        }
      },
      update: {
        clinicianRole: data.referralRole,
        isPrimary: data.isPrimary ?? false
      },
      create: {
        patientId: data.patientId,
        clinicianId: data.specialistId,
        clinicianRole: data.referralRole,
        isPrimary: data.isPrimary ?? false
      }
    });

    revalidatePath("/oncologist/patients");
    revalidatePath(`/oncologist/patients/${data.patientId}`);
    return { success: true, referral: result };
  } catch (error) {
    console.error("❌ Referral Fault:", error);
    return { success: false, error: "Referral clinical engine exception." };
  }
}

/**
 * Multidisciplinary Treatment Execution (Section 734)
 * Hardens surgery and radiation lifecycle tracking.
 */
export async function updateClinicalTreatment(treatmentId: string, data: any) {
  try {
    const treatment = await prisma.treatment.update({
      where: { id: treatmentId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
    revalidatePath("/oncologist/patients");
    return { success: true, treatment };
  } catch (error) {
    console.error("❌ Treatment Update Fault:", error);
    return { success: false, error: "Clinical treatment reconciliation error." };
  }
}
