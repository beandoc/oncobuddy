import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AlertStatus } from "@prisma/client";
import { SidebarWrapper } from "./SidebarWrapper";
import { NurseSidebarClient } from "./NurseSidebarClient";

/**
 * High-Fidelity Nurse Sidebar (Section A2).
 * Prioritizes Alert counts and Shift status for operational responders.
 */
export default async function NurseSidebar() {
  const session = await auth();
  if (!session) return null;

  // Fetch Nurse-specific metrics (Section A2)
  const nurse = await prisma.clinician.findUnique({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: {
          patients: { where: { endedAt: null } },
          acknowledgedAlerts: { where: { alertStatus: AlertStatus.PENDING } }
        }
      }
    }
  });

  const unacknowledgedAlertCount = nurse?._count.acknowledgedAlerts || 0;
  const patientsCount = nurse?._count.patients || 0;

  return (
    <SidebarWrapper>
      <NurseSidebarClient 
        session={session} 
        unacknowledgedAlertCount={unacknowledgedAlertCount} 
        patientsCount={patientsCount} 
      />
    </SidebarWrapper>
  );
}
