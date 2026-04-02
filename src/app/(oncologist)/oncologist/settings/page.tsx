import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  User, 
  Bell, 
  Shield, 
  Signature, 
  CheckCircle2, 
  ChevronRight, 
  LogOut, 
  Lock, 
  AlertTriangle,
  Briefcase
} from "lucide-react";
import { Role } from "@prisma/client";

/**
 * Oncologist Settings & Profile - Screen 7.
 * Professional clinician-facing profile management and security oversight.
 * Features clinical PIN management, alert threshold overrides, and 'MD Signature' workflows. (Section 4).
 */
export default async function OncologistSettings() {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Clinician Profile Title (Section 4) */}
      <div className="space-y-2 border-b border-slate-100 pb-8">
         <h1 className="text-5xl font-bold font-outfit tracking-tight text-slate-900">Clinical <span className="text-indigo-600 underline underline-offset-8 decoration-indigo-100">Oversight</span></h1>
         <p className="text-base font-bold text-slate-600">Professional configuration for Dr. {session.user.name?.split(' ').pop()}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
         
         {/* Navigation Menu (T3-Like Sidebar) */}
         <div className="space-y-3">
            {[
               { icon: User, label: 'Profile Information', active: true },
               { icon: Briefcase, label: 'Clinical Authority' },
               { icon: Bell, label: 'Alert Calibration' },
               { icon: Shield, label: 'Multi-Factor & PIN' },
               { icon: Signature, label: 'Digital Cryptography' }
            ].map(item => (
               <button key={item.label} className={`w-full flex items-center justify-between p-6 rounded-xl transition-all border-2 ${item.active ? 'bg-white border-indigo-100 text-slate-900 shadow-sm shadow-indigo-100/50' : 'bg-slate-50/50 border-transparent text-slate-500 hover:bg-white hover:border-slate-100 hover:text-slate-900 group'}`}>
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${item.active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600"}`}>
                        <item.icon className="w-5 h-5" />
                     </div>
                     <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${item.active ? 'text-indigo-600 opacity-100' : 'text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
               </button>
            ))}
            
            <div className="pt-12 px-4">
               <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 hover:text-rose-700 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign-out Session
               </button>
            </div>
         </div>

         {/* Settings Detail View (Section 4) */}
         <div className="lg:col-span-2 space-y-12">
            
            {/* Identity Block (Section 4) */}
            <GlassCard className="!p-10 border-slate-100 rounded-[48px] shadow-sm flex flex-col md:flex-row items-center gap-10">
               <div className="w-40 h-40 rounded-[48px] bg-slate-50 flex items-center justify-center font-bold text-slate-200 text-6xl shadow-inner border-4 border-white shadow-sm relative group overflow-hidden">
                  {session.user.image ? (
                    <img src={session.user.image} className="w-full h-full object-cover relative z-10" />
                  ) : (
                    session.user.name?.charAt(0)
                  )}
                  <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
               </div>
               <div className="space-y-6 flex-1 text-center md:text-left">
                  <div className="space-y-1">
                     <p className="text-xs font-bold uppercase text-indigo-600 tracking-wider font-serif leading-none">Institutional Authority</p>
                     <h2 className="text-4xl font-bold font-outfit text-slate-900 tracking-tight">Dr. {session.user.name?.split(' ').pop()}</h2>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                     <div className="flex flex-col">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Login Vector</p>
                        <p className="text-sm font-bold text-slate-700">{session.user.email}</p>
                     </div>
                     <div className="h-8 w-px bg-slate-100" />
                     <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Bio-Verified Active
                     </span>
                  </div>
                  <Button className="h-10 px-8 bg-slate-950 text-white rounded-2xl font-bold text-[10px] uppercase tracking-wider">Manage Credentials</Button>
               </div>
            </GlassCard>

            {/* Clinical Security Context (Section 4) - Deep Contrast */}
            <div className="space-y-8">
               <h3 className="text-2xl font-bold font-outfit text-slate-900 border-b border-indigo-50 pb-4">Clinical <span className="text-indigo-600">Security</span></h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassCard className="!p-8 bg-white border-slate-100 shadow-sm space-y-6 group  transition-all rounded-xl">
                     <div className="flex items-start justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-100 flex items-center justify-center"><Lock className="w-6 h-6" /></div>
                        <Button variant="ghost" className="h-8 px-4 font-bold text-[10px] uppercase tracking-wider text-indigo-600 hover:bg-indigo-50">Reset</Button>
                     </div>
                     <div className="space-y-2">
                        <p className="text-lg font-bold text-slate-900 leading-none">Digital Clinical PIN</p>
                        <p className="text-xs text-slate-600 font-bold leading-relaxed">Used for mandatory alert sign-offs and prescription proxy validation cycles.</p>
                     </div>
                     <div className="flex items-center gap-2 pt-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Enabled & Encrypted</span>
                     </div>
                  </GlassCard>

                  <GlassCard className="!p-8 bg-white border-slate-100 shadow-sm space-y-6 group  transition-all rounded-xl">
                     <div className="flex items-start justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-slate-950 text-white shadow-sm shadow-slate-200 flex items-center justify-center"><Shield className="w-6 h-6" /></div>
                        <Button variant="ghost" className="h-8 px-4 font-bold text-[10px] uppercase tracking-wider text-slate-400 hover:text-slate-900">Manage</Button>
                     </div>
                     <div className="space-y-2">
                        <p className="text-lg font-bold text-slate-900 leading-none">Vector MFA (TOTP)</p>
                        <p className="text-xs text-slate-600 font-bold leading-relaxed">Mandatory system-wide policy for Institutional Clinical Gatekeepers.</p>
                     </div>
                     <div className="flex items-center gap-2 pt-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">System Enforced Access</span>
                     </div>
                  </GlassCard>
               </div>
            </div>

            {/* Regulatory Transparency - (Section 4) */}
            <GlassCard className="border-rose-100 bg-rose-50/10 !p-10 relative overflow-hidden group rounded-[48px]">
               <div className="flex items-start gap-8 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-rose-100 text-rose-600 flex items-center justify-center shadow-sm shadow-rose-100/50 flex-shrink-0"><AlertTriangle className="w-7 h-7" /></div>
                  <div className="space-y-4 flex-1">
                     <p className="text-sm font-bold uppercase text-rose-700 tracking-wider leading-none">Institutional Steward Disclaimer</p>
                     <p className="text-sm text-slate-600 font-bold leading-relaxed">
                        Your professional profile is mapped to the clinical credential repository. Any changes to your specialization or panel capacity must be verified by the Hospital Executive. You are legally responsible for all MD Sign-offs performed under your PIN.
                     </p>
                  </div>
               </div>
            </GlassCard>
         </div>
      </div>
    </div>
  );
}
