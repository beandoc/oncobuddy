import { auth } from "@/lib/auth";
import { 
  Settings, 
  HelpCircle, 
  LogOut, 
  ShieldCheck, 
  PhoneCall, 
  UserCircle2, 
  FileText, 
  Bell, 
  ChevronRight,
  Stethoscope,
  Heart
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";

/**
 * Patient Mobile Navigation Hub - Screen 9 (Section B9).
 * High-contrast menu for access to settings, support, and clinical identity.
 * Optimized for fatigued patients with large touch targets and absolute clarity.
 */
export default async function PatientMoreHub() {
  const session = await auth();
  if (!session || session.user.role !== Role.PATIENT) redirect("/login");

  const MenuLink = ({ href, icon: Icon, label, sublabel, destructive = false }: any) => (
    <Link 
      href={href} 
      className={`p-6 rounded-[32px] border-2 flex items-center justify-between group transition-all active:scale-[0.98] ${destructive ? 'border-rose-100 bg-rose-50/20' : 'border-slate-100 bg-white shadow-sm hover:border-indigo-100'}`}
    >
       <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${destructive ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-900 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-3'}`}>
             <Icon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
             <p className={`text-base font-black italic uppercase leading-none ${destructive ? 'text-rose-700' : 'text-slate-900'}`}>{label}</p>
             <p className={`text-[10px] font-black uppercase tracking-widest ${destructive ? 'text-rose-400' : 'text-slate-400'}`}>{sublabel}</p>
          </div>
       </div>
       <ChevronRight className={`w-5 h-5 ${destructive ? 'text-rose-300' : 'text-slate-200'}`} />
    </Link>
  );

  return (
    <div className="max-w-xl mx-auto space-y-10 animate-in fade-in duration-700 pb-32 md:hidden">
      
      {/* Platform Branding (Contextual) */}
      <div className="flex flex-col items-center text-center space-y-4 pt-4">
         <div className="w-20 h-20 rounded-[32px] bg-slate-950 flex items-center justify-center shadow-2xl shadow-indigo-100">
            <ShieldCheck className="w-10 h-10 text-white" />
         </div>
         <div className="space-y-1">
            <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tighter italic">Oncobuddy</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Patient Clinical Environment v2.4.0</p>
         </div>
      </div>

      {/* Identity Summary Card */}
      <GlassCard className="!p-8 border-slate-100 shadow-xl rounded-[40px] flex items-center gap-6 bg-white/70">
         <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-2xl shadow-2xl shadow-indigo-100">
            {session.user.name?.charAt(0)}
         </div>
         <div className="flex-1">
            <p className="text-xl font-black text-slate-900 italic leading-none">{session.user.name}</p>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-2 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">Active Treatment Cycle</p>
         </div>
      </GlassCard>

      {/* Primary Navigation Cluster */}
      <div className="space-y-4">
         <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em] ml-6 italic">Navigation Vectors</h3>
         <div className="grid grid-cols-1 gap-3">
            <MenuLink href="/patient/settings" icon={Settings} label="Clinical Settings" sublabel="Profile, MFA & Biometrics" />
            <MenuLink href="/patient/appointments" icon={Stethoscope} label="Care Team" sublabel="Direct Oncology Oversight" />
            <MenuLink href="/patient/symptoms/log" icon={Heart} label="Clinical Journal" sublabel="Daily Toxicity Monitoring" />
            <MenuLink href="/patient/learn" icon={FileText} label="Resource Vault" sublabel="Searchable Treatment Guides" />
         </div>
      </div>

      {/* Supportive Cluster */}
      <div className="space-y-4 pt-4">
         <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em] ml-6 italic">Support & Safety</h3>
         <div className="grid grid-cols-1 gap-3">
            <MenuLink href="tel:+918888888888" icon={PhoneCall} label="Emergency Triage" sublabel="Immediate Clinical Response" destructive />
            <MenuLink href="#" icon={HelpCircle} label="Help Center" sublabel="Navigation & Technical Support" />
            <MenuLink href="/api/auth/signout" icon={LogOut} label="Discard Session" sublabel="Secure Platform Logout" />
         </div>
      </div>

      {/* Professional Stewardship Disclaimer */}
      <div className="text-center px-10 pt-10 opacity-30">
         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
            Oncobuddy is a Clinical Support Tool only. In case of life-threatening emergencies, please proceed to your nearest Hospital Emergency Room immediately.
         </p>
      </div>

    </div>
  );
}
