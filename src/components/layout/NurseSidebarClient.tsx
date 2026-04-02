"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Bell, 
  Users, 
  MessageSquare, 
  Calendar, 
  Activity, 
  Clipboard, 
  UserPlus, 
  BookOpen, 
  Settings, 
  LogOut, 
  AlertTriangle,
  ShieldCheck,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/core";
import { SidebarWrapper } from "./SidebarWrapper";

export function NurseSidebarClient({ session, unacknowledgedAlertCount, patientsCount }: any) {
  const pathname = usePathname();

  const NavItem = ({ href, icon: Icon, label, badge }: any) => {
    const active = pathname === href;
    
    return (
      <Link 
        href={href} 
        className={`flex items-center justify-between px-5 py-3 rounded-xl transition-all duration-300 group ${
          active 
            ? "bg-slate-900 text-white shadow-lg" 
            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
        }`}
      >
        <div className="flex items-center gap-4">
          <Icon className={`w-5 h-5 transition-all duration-300 ${active ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`} />
          <span className={`text-[12px] font-bold uppercase tracking-tight font-outfit ${active ? "text-white" : ""}`}>{label}</span>
        </div>
        {badge > 0 && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? "bg-white text-slate-950" : "bg-rose-600 text-white"}`}>
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <SidebarWrapper>
      <div className="flex flex-col h-full bg-white border-r border-slate-100">
        <div className="p-8 space-y-6">
          <Link href="/nurse/dashboard" className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <h1 className="text-2xl font-bold font-outfit text-slate-900 tracking-tight">OncoBuddy</h1>
          </Link>

          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold">
                {session.user.name?.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-slate-900 font-bold text-sm truncate uppercase tracking-tight">{session.user.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Nurse Navigator</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
             <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Alerts</p>
                <span className={`text-xl font-bold font-outfit ${unacknowledgedAlertCount > 0 ? "text-rose-600" : "text-slate-900"}`}>{unacknowledgedAlertCount}</span>
             </div>
             <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned</p>
                <span className="text-xl font-bold font-outfit text-slate-900">{patientsCount}</span>
             </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-4">Operations</p>
              <div className="space-y-1">
                 <NavItem href="/nurse/dashboard" icon={LayoutGrid} label="Control Desk" />
                 <NavItem href="/nurse/alerts" icon={AlertTriangle} label="Clinical Alerts" badge={unacknowledgedAlertCount} />
                 <NavItem href="/nurse/patients" icon={Users} label="Patient Panel" />
              </div>
           </div>

           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-4">Pathways</p>
              <div className="space-y-1">
                 <NavItem href="/nurse/symptoms" icon={Activity} label="Symptom Intake" />
                 <NavItem href="/nurse/rehab" icon={Activity} label="Recovery Desk" />
              </div>
           </div>

           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-4">Tools</p>
              <div className="space-y-1">
                 <NavItem href="/nurse/registration" icon={UserPlus} label="New Registration" />
              </div>
           </div>
        </nav>

        <div className="p-8 border-t border-slate-100 space-y-3 pb-8">
           <Link href="/api/auth/signout" className="flex items-center justify-center gap-3 w-full h-12 rounded-xl bg-slate-50 text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all">
              <LogOut className="w-4 h-4" />
              Sign Out
           </Link>
           <p className="text-[8px] font-bold text-slate-300 text-center uppercase tracking-widest">Build 2.4.1</p>
        </div>
      </div>
    </SidebarWrapper>
  );
}
