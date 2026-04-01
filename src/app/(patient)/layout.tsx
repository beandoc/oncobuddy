import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import PatientNavbar from "@/components/layout/PatientNavbar";

/**
 * Patient Layout Shell (Section B1).
 * Features a warmth-centric, high-visibility design for ill or fatigued users.
 * Optimized for low cognitive load with no fixed sidebars or overlapping panels.
 * Consistent 16px minimum body text and 44px touch targets. (Section B1).
 */
export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== Role.PATIENT) redirect("/login");

  return (
    <div className="min-h-screen bg-white md:bg-slate-50 flex flex-col font-outfit transition-colors selection:bg-indigo-100 selection:text-indigo-900">
      {/* Universal Patient Navigation (Section B2) */}
      <PatientNavbar />

      {/* Main Content (Section B1) */}
      <main className="flex-1 w-full max-w-5xl mx-auto pt-24 pb-48 px-6 md:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
           {children}
        </div>
      </main>

      {/* Desktop Accessibility Footer (Optional Context) */}
      <footer className="hidden md:flex h-16 border-t border-slate-100 items-center justify-center bg-white">
         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">Oncobuddy Health Companion v2.4.0-P | Secure Medical Platform</p>
      </footer>
    </div>
  );
}
