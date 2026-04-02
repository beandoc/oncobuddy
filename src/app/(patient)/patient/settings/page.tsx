import { auth } from "@/lib/auth";
import { 
  User, 
  Settings, 
  Bell, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  LogOut, 
  ChevronRight,
  Eye,
  Key,
  ShieldAlert
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";

/**
 * Patient Settings & Security - Screen 10 (Section B10).
 * Central hub for clinical profile management and security protocols.
 * Features high-contrast toggles for MFA, Biometrics, and Notification triage.
 */
export default async function PatientSettingsPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.PATIENT) redirect("/login");

  const SettingsSection = ({ title, icon: Icon, children }: any) => (
    <div className="space-y-6">
       <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-4 ml-2">
          <Icon className="w-5 h-5 text-indigo-600" />
          <h3 className="text-xl font-bold font-outfit text-slate-900 tracking-tight">{title}</h3>
       </div>
       <div className="grid grid-cols-1 gap-4">
          {children}
       </div>
    </div>
  );

  const SettingsItem = ({ label, sublabel, icon: Icon, actionLabel, actionType = "toggle", active = false }: any) => (
    <div className="p-6 bg-white border-2 border-slate-100 rounded-xl flex items-center justify-between group hover:border-indigo-100 transition-all shadow-sm">
       <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all">
             <Icon className="w-5 h-5" />
          </div>
          <div>
             <p className="text-sm font-bold uppercase leading-none text-slate-900">{label}</p>
             <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mt-1.5">{sublabel}</p>
          </div>
       </div>
       {actionType === "toggle" ? (
          <button className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${active ? 'bg-indigo-600 justify-end' : 'bg-slate-200 justify-start'}`}>
             <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
          </button>
       ) : (
          <button className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition-all">
             {actionLabel}
          </button>
       )}
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32 max-w-4xl mx-auto">
      
      {/* Settings Header (Section B10) */}
      <div className="space-y-4">
         <h1 className="text-4xl font-bold font-outfit text-slate-950 tracking-tighter">Settings <span className="text-indigo-600">& Security</span></h1>
         <p className="text-sm text-slate-600 font-medium">Manage your clinical environment and data privacy settings.</p>
      </div>

      <div className="grid grid-cols-1 gap-12">
         
         {/* Profile Triage (Section B10) */}
         <SettingsSection title="Personal Profile" icon={User}>
            <SettingsItem 
               label="Clinical Identity" 
               sublabel={`${session.user.name} • (session.user.email)`}
               icon={User} 
               actionType="button" 
               actionLabel="Update Details" 
            />
            <SettingsItem 
               label="Treatment Cycle Privacy" 
               sublabel="Mask my specific diagnosis in secondary apps"
               icon={ShieldAlert} 
               active={false}
            />
         </SettingsSection>

         {/* Security & Access (Section B10) */}
         <SettingsSection title="Secure Access" icon={Lock}>
            <SettingsItem 
               label="Two-Factor Triage (MFA)" 
               sublabel="Secure clinical logins via SMS or App"
               icon={Smartphone} 
               active={true}
            />
            <SettingsItem 
               label="Biometric Verification" 
               sublabel="Use FaceID/TouchID for faster access"
               icon={Eye} 
               active={true}
            />
            <SettingsItem 
               label="Session Security" 
               sublabel="Last active 2 minutes ago (Delhi, IN)"
               icon={Key} 
               actionType="button" 
               actionLabel="Show Devices" 
            />
         </SettingsSection>

         {/* Communication Preferences (Section B10) */}
         <SettingsSection title="Clinical Notifications" icon={Bell}>
            <SettingsItem 
               label="Toxicity Overrides" 
               sublabel="Push alerts for medication reminders"
               icon={Bell} 
               active={true}
            />
            <SettingsItem 
               label="Direct Message Sync" 
               sublabel="Notify me when clinical team responds"
               icon={ShieldCheck} 
               active={true}
            />
         </SettingsSection>

         {/* Dangerous Goods (Section B10) */}
         <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60">
            <div className="space-y-1 text-center md:text-left">
               <p className="text-xs font-bold text-slate-900 uppercase">Archive Clinical Data</p>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">This will not affect your hospital records.</p>
            </div>
            <div className="flex items-center gap-4">
               <Button variant="ghost" className="h-12 px-6 rounded-2xl text-rose-600 font-bold text-xs uppercase tracking-wider hover:bg-rose-50 border border-transparent hover:border-rose-100">Delete Account Instance</Button>
               <Link href="/api/auth/signout" className="h-12 px-8 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-xs uppercase tracking-wider hover:bg-slate-950 transition-all shadow-sm">
                  Secure Logout
               </Link>
            </div>
         </div>

      </div>
    </div>
  );
}
