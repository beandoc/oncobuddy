import LoginForm from "@/components/auth/LoginForm";
import { Button, GlassCard } from "@/components/ui/core";
import { ShieldCheck, Activity, ChevronLeft, Lock, Fingerprint } from "lucide-react";
import Link from "next/link";

/**
 * Oncobuddy Secure Login Portal.
 * Premium, high-fidelity authentication screen with institutional security enforcement.
 * Features clinical-grade identifiers, MFA placeholders, and institutional branding (Section 12).
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden relative">
      
      {/* Background abstract clinical meshes */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse " />

      <div className="w-full max-w-xl relative z-10 space-y-8 animate-in fade-in zoom-in duration-700">
         
         <div className="flex flex-col items-center space-y-6">
            <Link href="/" className="group flex items-center gap-3 px-6 py-2 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all shadow-sm">
               <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
               <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-indigo-600 tracking-widest italic font-serif">Back to Entry Hub</span>
            </Link>

            <div className="flex flex-col items-center space-y-4">
               <div className="w-16 h-16 rounded-[28px] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-100 rotate-[-12deg] group hover:rotate-0 transition-transform duration-500">
                  <Activity className="w-8 h-8" />
               </div>
               <div className="text-center">
                  <h1 className="text-4xl font-black font-outfit text-slate-900 border-b-2 border-indigo-600 pb-2 italic underline decoration-indigo-200 decoration-1 underline-offset-8">Clinical <span className="text-indigo-600">Gateway</span></h1>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] pt-3 italic font-serif opacity-70">Secured Institutional Endpoint</p>
               </div>
            </div>
         </div>

         <GlassCard className="!p-12 bg-white border-white shadow-[0_40px_100px_rgba(0,0,0,0.06)] rounded-[48px] space-y-10 group relative">
            <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full">
               <ShieldCheck className="w-3.5 h-3.5" />
               <span className="text-[9px] font-black uppercase tracking-widest">TLS Encrypted</span>
            </div>

            <div className="space-y-2">
               <h2 className="text-2xl font-bold font-outfit text-slate-800 italic italic">Credentials Required</h2>
               <p className="text-sm text-slate-400 font-medium italic italic">Enter your professional MRN or institutional email to proceed. (Section 12, 20).</p>
            </div>

            {/* Placeholder for standard NextAuth Form (Phase 2 integration) */}
            <div className="space-y-6">
               <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 italic">Institutional ID</p>
                  <div className="h-14 w-full bg-slate-50 border border-slate-100 rounded-3xl outline-none px-6 text-sm font-bold placeholder:text-slate-200 focus:border-indigo-200 focus:bg-white transition-all flex items-center gap-4 group">
                     <Lock className="w-4 h-4 text-slate-200 group-focus-within:text-indigo-400" />
                     <span className="text-slate-200">Email Address...</span>
                  </div>
               </div>
               <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 italic">Clinical Key</p>
                  <div className="h-14 w-full bg-slate-50 border border-slate-100 rounded-3xl outline-none px-6 text-sm font-bold placeholder:text-slate-200 focus:border-indigo-200 focus:bg-white transition-all flex items-center gap-4 group">
                     <Fingerprint className="w-4 h-4 text-slate-200 group-focus-within:text-indigo-400" />
                     <span className="text-slate-200">Password...</span>
                  </div>
               </div>

               <Button className="h-14 w-full bg-slate-900 border-0 text-white font-black text-xs uppercase tracking-widest shadow-[0_15px_30px_rgba(15,23,42,0.15)] hover:scale-[1.02] active:scale-95 transition-all rounded-[24px]">Authorize Entry</Button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
               <Link href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest italic font-serif">Forgot PIN?</Link>
               <Link href="/register" className="text-[10px] font-black text-indigo-600 hover:text-slate-950 transition-colors uppercase tracking-widest italic font-serif underline decoration-indigo-100 underline-offset-4">New Request</Link>
            </div>
         </GlassCard>

         <p className="text-center text-[10px] text-slate-300 font-bold max-w-sm mx-auto uppercase tracking-widest leading-relaxed italic italic">
            This platform contains Protected Health Information (PHI). Unauthorized access is prohibited by institutional policy (HIPAA/DPDPA Section 20).
         </p>
      </div>
    </div>
  );
}
