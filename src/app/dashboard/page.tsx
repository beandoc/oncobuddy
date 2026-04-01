import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Dashboard Redirect Dispatcher (Section 4).
 * Centralized server-side routing logic that ensures every user 
 * landing on /dashboard is pushed to their role-specific segment.
 */
export default async function DashboardRootPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const roleRedirectMap: Record<Role, string> = {
    [Role.ONCOLOGIST]: "/oncologist/dashboard",
    [Role.NURSE]: "/nurse/alerts", // Landing on Alert Inbox per A1
    [Role.PATIENT]: "/patient/dashboard",
    [Role.CAREGIVER]: "/caregiver/dashboard",
    [Role.ADMIN]: "/admin/dashboard",
  };

  const target = roleRedirectMap[session.user.role as Role] || "/login";
  redirect(target);
}
