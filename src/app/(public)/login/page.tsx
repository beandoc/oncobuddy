import LoginForm from "@/components/auth/LoginForm";
import { Activity, ChevronLeft, ShieldCheck, Lock, Fingerprint } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/**
 * Vanguard Clinical Gateway - High-Fidelity Login.
 * Redesigned as a Split-Screen premium portal for institutional stakeholders.
 * Features clinical-grade animations, cinematic visuals, and hardened auth vectors. (Section 12, 20).
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      
      {/* 1. Cinematic Clinical Visual (Section 20) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden group">
         {/* Layered cinematic overlays */}
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-emerald-600/10 z-10" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950 z-10" />
         
         <Image 
            src="/artifacts/login_hero.png" 
            alt="Clinical Analytics Vanguard" 
            fill 
            className="object-cover opacity-60 scale-110 group-hover:scale-100 transition-transform duration-[8s] ease-out"
            priority
         />

         <div className="absolute bottom-20 left-20 right-20 z-20 space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-white shadow-2xl">
               <Activity className="w-8 h-8" />
            </div>
            <div className="space-y-2">
               <h2 className="text-5xl font-black font-outfit text-white tracking-tight leading-tight italic">Coordinating <span className="text-indigo-400">Onco-Pathology</span> IQ</h2>
               <p className="text-lg text-white/50 font-medium italic italic">A unified ecosystem for toxicity triage and clinical oversight.</p>
            </div>
            <div className="flex items-center gap-6 pt-10 border-t border-white/5 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
               <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">PRO-CTCAE</span>
               <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">HIPAA COMPLIANT</span>
               <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">ICD-O-3 Sync</span>
            </div>
         </div>
      </div>

      {/* 2. Professional Form Terminal (Section 12) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20 relative bg-[#FDFDFF]">
         
         {/* Back Navigation */}
         <div className="absolute top-12 left-12 lg:left-20">
            <Link href="/" className="group flex items-center gap-3 text-slate-400 hover:text-indigo-600 transition-all">
               <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:border-indigo-100">
                  <ChevronLeft className="w-4 h-4" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] italic font-serif">Back to Entry</span>
            </Link>
         </div>

         <div className="w-full max-w-sm space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse shadow-[0_0_10px_#4f46e5]" />
                  <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.5em] font-serif">Oncobuddy Gateway</span>
               </div>
               <h1 className="text-4xl font-black font-outfit text-slate-950 tracking-tighter leading-none italic">Secured Institutional Endpoint</h1>
               <p className="text-sm text-slate-400 font-medium italic opacity-70">Access your clinical dashboard via protected Mrn-Token protocol.</p>
            </div>

            <LoginForm />

            <div className="pt-20 border-t border-slate-50">
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] leading-relaxed text-center lg:text-left italic">
                  Protected Health Information (PHI) access monitored under <br/> institutional oversight (DPDPA Section 20, 2026).
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
