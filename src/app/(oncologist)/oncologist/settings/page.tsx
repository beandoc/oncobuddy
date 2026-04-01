import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  User, 
  Settings2, 
  Bell, 
  Shield, 
  Signature, 
  CheckCircle2, 
  ChevronRight, 
  LogOut, 
  Lock, 
  Eye, 
  Trash2,
  AlertTriangle,
  Clock,
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
    <div className="space-y-12 pb-20 animate-in fade-in duration-500 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Clinician Profile Title (Section 4) */}
      <div className="space-y-2">
         <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900 italic italic">Clinician <span className="text-indigo-600">Oversight</span></h1>
         <p className="text-sm text-slate-500 font-medium italic italic">Professional profile, security credentials, and clinical bypass settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
         
         {/* Navigation Menu (T3-Like Sidebar) */}
         <div className="space-y-3">
            {[
               { icon: User, label: 'Personal Information', active: true },
               { icon: Briefcase, label: 'Professional Status' },
               { icon: Bell, label: 'Alerting Preferences' },
               { icon: Shield, label: 'MFA & Clinical PIN' },
               { icon: Signature, label: 'Digital Sign-off' }
            ].map(item => (
               <button key={item.label} className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all border ${item.active ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-4">
                     <item.icon className="w-5 h-5" />
                     <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${item.active ? 'text-indigo-200' : 'text-slate-200'}`} />
               </button>
            ))}
            
            <div className="pt-12">
               <Button variant="ghost" className="w-full h-12 text-rose-500 font-bold justify-start gap-4 hover:bg-rose-50 rounded-3xl">
                  <LogOut className="w-5 h-5" /> Sign-out Session
               </Button>
            </div>
         </div>

         {/* Settings Detail View (Section 4) */}
         <div className="lg:col-span-2 space-y-12">
            
            {/* Identity Block (Section 4) */}
            <div className="flex flex-col md:flex-row items-center gap-10">
               <div className="w-40 h-40 rounded-[48px] bg-slate-100 flex items-center justify-center font-bold text-slate-300 text-6xl shadow-inner border-4 border-white shadow-2xl relative group overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-indigo-600/20 transition-colors" />
                  {session.user.name?.charAt(0)}
               </div>
               <div className="space-y-4 flex-1 text-center md:text-left">
                  <div className="space-y-1">
                     <p className="text-xs font-black uppercase text-indigo-600 tracking-widest italic font-serif leading-none italic">Senior Oncologist</p>
                     <h2 className="text-4xl font-black font-outfit text-slate-900 border-b border-slate-100 pb-2">Dr. {session.user.name?.split(' ').pop()}</h2>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4 pt-1">
                     <p className="text-xs font-bold text-slate-500">{session.user.email}</p>
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                     <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest leading-none">Registered Active</span>
                  </div>
               </div>
            </div>

            {/* Clinical Security Context (Section 4) */}
            <div className="space-y-8 pt-12">
               <h3 className="text-2xl font-bold font-outfit text-slate-900 border-b border-indigo-100 pb-2 italic">Clinical <span className="text-indigo-600">Security</span></h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassCard className="!p-8 bg-white border-slate-100 shadow-xl shadow-slate-50/50 space-y-6 group hover:translate-y-[-4px] transition-all">
                     <div className="flex items-start justify-between">
                        <div className="p-3.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100"><Lock className="w-5 h-5" /></div>
                        <Button variant="ghost" size="sm" className="h-8 px-4 font-black text-[9px] uppercase tracking-widest">Reset</Button>
                     </div>
                     <div className="space-y-2">
                        <p className="text-base font-bold text-slate-900 leading-none italic">Digital Clinical PIN</p>
                        <p className="text-[11px] text-slate-500 font-medium italic">Used for alert sign-offs and prescription proxy flows.</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest">Enabled</span>
                     </div>
                  </GlassCard>

                  <GlassCard className="!p-8 bg-white border-slate-100 shadow-xl shadow-slate-50/50 space-y-6 group hover:translate-y-[-4px] transition-all">
                     <div className="flex items-start justify-between">
                        <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-100"><Shield className="w-5 h-5" /></div>
                        <Button variant="ghost" size="sm" className="h-8 px-4 font-black text-[9px] uppercase tracking-widest">Manage</Button>
                     </div>
                     <div className="space-y-2">
                        <p className="text-base font-bold text-slate-900 leading-none italic">MFA Protection</p>
                        <p className="text-[11px] text-slate-500 font-medium italic">Mandatory 6-digit TOTP challenge on login.</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest">Active System Policy</span>
                     </div>
                  </GlassCard>
               </div>
            </div>

            {/* Alert Channel Configuration (Section 4) */}
            <div className="space-y-8 pt-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold font-outfit text-slate-900 leading-none italic italic">Alert <span className="text-indigo-600">Hand-off</span></h3>
                  <div className="px-4 py-1.5 rounded-full bg-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Updated: Today</div>
               </div>
               
               <div className="space-y-4">
                  {[
                     { label: 'Emergency Breaches', desc: 'Real-time SMS & In-App push notifications.', status: 'Override Active' },
                     { label: 'Shift Summary Digest', desc: 'Daily PDF audit of panel toxicity breaches.', status: 'Sent 6pm Daily' },
                     { label: 'Nurse Escalations', desc: 'Notification only after 2m nursing triage lag.', status: 'Clinical Buffer On' }
                  ].map((pref, k) => (
                     <div key={pref.label} className="p-6 rounded-[32px] bg-white border border-slate-100 hover:bg-indigo-50/20 transition-all flex items-center justify-between group shadow-sm">
                        <div className="space-y-1">
                           <p className="text-sm font-bold text-slate-900 italic italic leading-none">{pref.label}</p>
                           <p className="text-[10px] text-slate-500 font-medium italic italic">{pref.desc}</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-[9px] font-black uppercase text-indigo-600 tracking-widest leading-none bg-indigo-50 px-3 py-1.5 rounded-full">{pref.status}</span>
                           <div className="w-10 h-6 bg-indigo-600 rounded-full relative shadow-inner cursor-pointer">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Regulatory Transparency - (Section 4) */}
            <GlassCard className="border-indigo-100 bg-indigo-50/5 !p-8 shadow-inner shadow-slate-100/50">
               <div className="flex items-start gap-6">
                  <div className="p-3.5 rounded-2xl bg-white border border-indigo-100 text-indigo-600"><AlertTriangle className="w-5 h-5" /></div>
                  <div className="space-y-3 flex-1">
                     <p className="text-xs font-black uppercase text-slate-900 tracking-widest italic">Clinical Stewardship Disclaimer</p>
                     <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic italic">
                        Your professional profile is mapped to the institutional credential repository. Any changes to your specialization or panel capacity must be verified by the Clinical Lead. You are legally responsible for all MD Sign-offs performed under your PIN.
                     </p>
                  </div>
               </div>
            </GlassCard>
         </div>
      </div>
    </div>
  );
}
