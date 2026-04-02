"use server";

import { prisma } from "@/lib/prisma";
import { DayCareStatus, DayCareShift } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Updates the status of a Day Care session.
 * Used for starting (RUNNING) or finishing (COMPLETED) chemotherapy sessions.
 */
export async function updateDayCareStatus(sessionId: string, status: DayCareStatus) {
  try {
    await prisma.dayCareSession.update({
      where: { id: sessionId },
      data: { status }
    });
    
    revalidatePath("/oncologist/daycare");
    revalidatePath("/nurse/daycare");
    return { success: true };
  } catch (error) {
    console.error("Failed to update Day Care status:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

/**
 * Defers a Day Care session to the next available day.
 */
export async function deferDayCareSession(sessionId: string, reason: string) {
  try {
    const session = await prisma.dayCareSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) throw new Error("Session not found");

    // Defer the current session
    await prisma.dayCareSession.update({
      where: { id: sessionId },
      data: { 
        status: DayCareStatus.DEFERRED,
        notes: reason 
      }
    });

    // Create a new session for the next business day (Monday-Saturday)
    let nextDate = new Date(session.date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    // If next day is Sunday, move to Monday
    if (nextDate.getDay() === 0) {
      nextDate.setDate(nextDate.getDate() + 1);
    }

    await prisma.dayCareSession.create({
      data: {
        patientId: session.patientId,
        clinicianId: session.clinicianId,
        date: nextDate,
        shift: session.shift,
        status: DayCareStatus.SCHEDULED,
        notes: `Deferred from ${session.date.toLocaleDateString()}: ${reason}`
      }
    });

    revalidatePath("/oncologist/daycare");
    revalidatePath("/nurse/daycare");
    return { success: true };
  } catch (error) {
    console.error("Failed to defer Day Care session:", error);
    return { success: false, error: "Internal Server Error" };
  }
}
