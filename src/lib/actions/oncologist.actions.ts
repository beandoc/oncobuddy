"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Update clinical notes for a patient.
 * Professional MD override protocol for case documentation.
 */
export async function updatePatientClinicalNotes(patientId: string, notes: string) {
  try {
    await prisma.patient.update({
      where: { id: patientId },
      data: { clinicalNotes: notes }
    });
    
    revalidatePath(`/oncologist/patients/${patientId}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to update clinical notes:", error);
    return { success: false, error: "Internal Clinical Sync Fault" };
  }
}

/**
 * Update core patient demographics (Clinical Bypass).
 */
export async function updatePatientDemographics(patientId: string, data: { preferredName: string; mrn: string }) {
  try {
    await prisma.patient.update({
      where: { id: patientId },
      data: { 
        preferredName: data.preferredName,
        mrn: data.mrn
      }
    });

    revalidatePath("/oncologist/dashboard");
    revalidatePath("/oncologist/patients");
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to update demographics:", error);
    return { success: false, error: "Registry Collision Fault" };
  }
}
