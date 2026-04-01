import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import CaregiverNavbar from "@/components/layout/CaregiverNavbar";
import { Info } from "lucide-react";

/**
 * Caregiver Layout Shell (Section C1).
 * Features a supportive, dual-role focused design for non-medical professionals.
 * Includes the mandatory persistent 'Patient Visibility Banner' (C1) and teal context accents.
 * Optimized for information-density without clinical overwhelm. (Section C1).
 */
export default async function CaregiverLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== Role.CAREGIVER) redirect("/login");

  // In a real implementation, we'd fetch the active patient from the session/context
  const activePatientName = "Jane Doe"; 

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-outfit transition-colors selection:bg-teal-100 selection:text-teal-900">
      {/* Universal Caregiver Navigation (Section C2) */}
      <CaregiverNavbar />

      <div className="pt-20">
         {/* Persistent Patient Visibility Banner - MANDATORY (Section C1) */}
         <div className="w-full h-10 bg-teal-50 border-b border-teal-100 flex items-center justify-center px-6 relative z-40">
            <p className="text-[10px] font-black text-teal-700 uppercase tracking-[0.2em] flex items-center gap-2">
               <Info className="w-3.5 h-3.5" />
               Currently viewing {activePatientName}'s treatment information
            </p>
         </div>

         {/* Main Content (Section C1) */}
         <main className="flex-1 w-full max-w-5xl mx-auto py-12 pb-32 px-6 md:px-8">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
               {children}
            </div>
         </main>
      </div>

      {/* Desktop Accessibility Footer (Optional Context) */}
      <footer className="hidden md:flex h-16 border-t border-slate-100 items-center justify-center bg-white">
         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">Oncobuddy Health Companion v2.4.0-C | Caregiver Mode Secured</p>
      </footer>
    </div>
  );
}
