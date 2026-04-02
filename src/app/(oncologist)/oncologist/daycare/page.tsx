import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { DayCareUnitHub } from "@/components/dashboard/DayCareUnitHub";

/**
 * Oncologist Day Care Unit (DCU) Management Terminal - Screen 1.
 * High-performance clinical oversight for chemotherapy shift transitions.
 */
export default async function OncologistDayCare() {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  const clinician = await prisma.clinician.findUnique({
    where: { userId: session.user.id }
  });

  if (!clinician) return null;

  const sessions = await prisma.dayCareSession.findMany({
    where: { 
      clinicianId: clinician.id,
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
      <DayCareUnitHub sessions={sessions} currentUserRole="ONCOLOGIST" />
    </div>
  );
}
