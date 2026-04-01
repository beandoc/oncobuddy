import { prisma } from "./prisma";
import { AuditAction, Role } from "@prisma/client";
import { headers } from "next/headers";

/**
 * Logs a PHI-related action to the immutable audit trail.
 */
export async function logAudit({
  userId,
  userRole,
  action,
  resourceType,
  resourceId,
  notes,
  changedFields,
}: {
  userId: string;
  userRole: Role;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  notes?: string;
  changedFields?: any;
}) {
  const headerList = headers();
  const ipAddress = headerList.get("x-forwarded-for") || "unknown";
  const userAgent = headerList.get("user-agent") || "unknown";

  return await prisma.auditLog.create({
    data: {
      userId,
      userRole,
      action,
      resourceType,
      resourceId,
      notes,
      changedFields,
      ipAddress,
      userAgent,
      occurredAt: new Date(),
    },
  });
}
