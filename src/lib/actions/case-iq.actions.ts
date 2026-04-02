"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateCaseIQ(data: {
  patientId: string;
  treatmentId?: string;
  treatmentName: string;
  cyclesCompleted: number;
  numberOfCycles: number;
  nextStagingScanDate: string | null;
  performanceStatus: string;
}) {
  try {
    // 1. Update Patient Performance Status (ECOG)
    await prisma.patient.update({
      where: { id: data.patientId },
      data: { performanceStatus: data.performanceStatus }
    });

    // 2. Update Treatment Details if treatmentId exists
    if (data.treatmentId) {
      await prisma.treatment.update({
        where: { id: data.treatmentId },
        data: {
          treatmentName: data.treatmentName,
          cyclesCompleted: data.cyclesCompleted,
          numberOfCycles: data.numberOfCycles,
          nextStagingScanDate: data.nextStagingScanDate ? new Date(data.nextStagingScanDate) : null,
        }
      });
    }

    revalidatePath(`/oncologist/patients/${data.patientId}`);
    revalidatePath(`/oncologist/oncologist/patients/${data.patientId}`); // Assuming slug might match
    
    return { success: true };
  } catch (error) {
    console.error("❌ Case IQ Update Failure:", error);
    return { success: false, error: "Failed to update clinical context." };
  }
}
