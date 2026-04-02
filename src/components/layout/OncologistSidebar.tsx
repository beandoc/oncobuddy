import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { SidebarWrapper } from "./SidebarWrapper";
import { OncologistSidebarClient } from "./OncologistSidebarClient";

/**
 * Oncologist Sidebar - React Server Component.
 * Orchestrates clinical data and hands off to high-fidelity client navigator.
 */
export async function OncologistSidebar() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ONCOLOGIST) return null;

  const clinician = await prisma.clinician.findUnique({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: {
          patients: { where: { endedAt: null } },
          acknowledgedAlerts: { where: { alertStatus: "PENDING" } }
        }
      }
    }
  });

  const patientCount = clinician?._count.patients || 0;
  const alertCount = clinician?._count.acknowledgedAlerts || 0;

  return (
    <SidebarWrapper>
      <OncologistSidebarClient 
        session={session} 
        patientCount={patientCount} 
        alertCount={alertCount} 
      />
    </SidebarWrapper>
  );
}
