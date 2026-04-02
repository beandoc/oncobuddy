import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { DayCareUnitHub } from "@/components/dashboard/DayCareUnitHub";

/**
 * Nurse Day Care Unit (DCU) Management Terminal.
 * Operational view for chemotherapy shift execution and patient monitoring.
 */
export default async function NurseDayCare() {
  const session = await auth();
  if (!session || session.user.role !== Role.NURSE) redirect("/login");

  const nurse = await prisma.clinician.findUnique({
    where: { userId: session.user.id }
  });

  if (!nurse) return null;

  // Nurses see all sessions for their institution in the DCU
  const sessions = await prisma.dayCareSession.findMany({
    where: { 
      clinician: {
        institutionId: nurse.institutionId
      },
      date: { 
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setDate(new Date().getDate() + 2)) 
      }
    },
    include: {
      patient: true
    },
    orderBy: { date: 'asc' }
  });

  return (
    <div className="pb-20">
      <DayCareUnitHub sessions={sessions} currentUserRole="NURSE" />
    </div>
  );
}
