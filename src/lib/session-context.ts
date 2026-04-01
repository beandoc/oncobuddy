import { auth } from "@/lib/auth";
import { Role, AccessLevel } from "@prisma/client";
import { canAccess, Resource, Action } from "./permissions";
import { redirect } from "next/navigation";

export interface SessionContext {
  userId: string;
  role: Role;
  authorizedPatientIds: string[];
  clinicianId?: string;
  patientId?: string;
  caregiverId?: string;
  caregiverAccessMap?: Record<string, AccessLevel>;
}

/**
 * Single source of truth for every authorization decision in the application.
 * Re-verifies role and linkage from the session context on every request.
 */
export async function getSessionContext(): Promise<SessionContext | null> {
  const session = await auth();
  if (!session?.user) return null;

  return {
    userId: session.user.id,
    role: session.user.role,
    authorizedPatientIds: session.user.authorizedPatientIds || [],
    clinicianId: session.user.clinicianId,
    patientId: session.user.patientId,
    caregiverId: session.user.caregiverId,
    caregiverAccessMap: session.user.caregiverAccessMap as any,
  };
}

/**
 * Higher-order helper for data access within clinical contexts.
 * Enforces that the requested patient is in the user's authorized list.
 */
export async function ensurePatientAccess(targetPatientId: string, resource: Resource, action: Action) {
  const context = await getSessionContext();
  if (!context) redirect("/login");

  // 1. Role must have permission for this resource/action
  const hasBasePermission = canAccess(
    context.role, 
    resource, 
    action, 
    context.role === Role.CAREGIVER ? context.caregiverAccessMap?.[targetPatientId] : undefined
  );
  if (!hasBasePermission) throw new Error("403 Forbidden: Insufficient role permissions");

  // 2. Data flow principle: User must be linked to THIS specific patient
  if (!context.authorizedPatientIds.includes(targetPatientId)) {
    throw new Error("403 Forbidden: Patient not in authorized panel");
  }

  return context;
}
