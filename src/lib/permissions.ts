import { Role, AccessLevel } from "@prisma/client";

export type Resource = 
  | "PATIENT_RECORD"
  | "DIAGNOSIS"
  | "SYMPTOM_LOG"
  | "ALERT"
  | "GUIDE"
  | "PROGRESS"
  | "REHAB"
  | "APPOINTMENT"
  | "MESSAGE"
  | "CLINICAL_NOTE"
  | "AUDIT_LOG";

export type Action = "READ" | "WRITE" | "DELETE" | "ACKNOWLEDGE";

interface PermissionGate {
  role: Role;
  resource: Resource;
  action: Action;
  accessLevel?: AccessLevel;
}

const PERMISSION_MATRIX: PermissionGate[] = [
  // Oncologist
  { role: Role.ONCOLOGIST, resource: "PATIENT_RECORD", action: "READ" },
  { role: Role.ONCOLOGIST, resource: "PATIENT_RECORD", action: "WRITE" },
  { role: Role.ONCOLOGIST, resource: "DIAGNOSIS", action: "READ" },
  { role: Role.ONCOLOGIST, resource: "DIAGNOSIS", action: "WRITE" },
  { role: Role.ONCOLOGIST, resource: "SYMPTOM_LOG", action: "READ" },
  { role: Role.ONCOLOGIST, resource: "ALERT", action: "READ" },
  { role: Role.ONCOLOGIST, resource: "GUIDE", action: "READ" },
  { role: Role.ONCOLOGIST, resource: "PROGRESS", action: "READ" },
  { role: Role.ONCOLOGIST, resource: "REHAB", action: "WRITE" },
  { role: Role.ONCOLOGIST, resource: "APPOINTMENT", action: "READ" },
  { role: Role.ONCOLOGIST, resource: "MESSAGE", action: "WRITE" },
  { role: Role.ONCOLOGIST, resource: "CLINICAL_NOTE", action: "WRITE" },

  // Nurse
  { role: Role.NURSE, resource: "PATIENT_RECORD", action: "READ" },
  { role: Role.NURSE, resource: "DIAGNOSIS", action: "READ" },
  { role: Role.NURSE, resource: "SYMPTOM_LOG", action: "READ" },
  { role: Role.NURSE, resource: "ALERT", action: "READ" },
  { role: Role.NURSE, resource: "ALERT", action: "ACKNOWLEDGE" },
  { role: Role.NURSE, resource: "GUIDE", action: "READ" },
  { role: Role.NURSE, resource: "PROGRESS", action: "READ" },
  { role: Role.NURSE, resource: "REHAB", action: "READ" },
  { role: Role.NURSE, resource: "APPOINTMENT", action: "WRITE" },
  { role: Role.NURSE, resource: "MESSAGE", action: "WRITE" },
  { role: Role.NURSE, resource: "CLINICAL_NOTE", action: "WRITE" },

  // Patient
  { role: Role.PATIENT, resource: "PATIENT_RECORD", action: "READ" },
  { role: Role.PATIENT, resource: "PATIENT_RECORD", action: "WRITE" }, // Contact details only logic in code
  { role: Role.PATIENT, resource: "DIAGNOSIS", action: "READ" },
  { role: Role.PATIENT, resource: "SYMPTOM_LOG", action: "WRITE" },
  { role: Role.PATIENT, resource: "GUIDE", action: "READ" },
  { role: Role.PATIENT, resource: "PROGRESS", action: "WRITE" },
  { role: Role.PATIENT, resource: "REHAB", action: "WRITE" },
  { role: Role.PATIENT, resource: "APPOINTMENT", action: "READ" },
  { role: Role.PATIENT, resource: "MESSAGE", action: "WRITE" },
  { role: Role.PATIENT, resource: "CLINICAL_NOTE", action: "READ" }, // Visible notes check in code

  // Caregiver
  { role: Role.CAREGIVER, resource: "APPOINTMENT", action: "READ" },
  { role: Role.CAREGIVER, resource: "GUIDE", action: "READ" },
  { role: Role.CAREGIVER, resource: "PROGRESS", action: "READ" },
  { role: Role.CAREGIVER, resource: "SYMPTOM_LOG", action: "READ" },
  { role: Role.CAREGIVER, resource: "SYMPTOM_LOG", action: "WRITE", accessLevel: AccessLevel.VIEW_AND_LOG },
  { role: Role.CAREGIVER, resource: "REHAB", action: "WRITE", accessLevel: AccessLevel.VIEW_AND_LOG },
  { role: Role.CAREGIVER, resource: "MESSAGE", action: "WRITE", accessLevel: AccessLevel.VIEW_AND_LOG },
];

/**
 * Validates if a role is permitted to perform an action on a clinical resource.
 * This is the single source of truth for clinical authorization.
 */
export function canAccess(role: Role, resource: Resource, action: Action, currentAccessLevel?: AccessLevel): boolean {
  if (role === Role.ADMIN) return true;

  return PERMISSION_MATRIX.some(p => 
    p.role === role && 
    p.resource === resource && 
    p.action === action &&
    (!p.accessLevel || p.accessLevel === currentAccessLevel)
  );
}
