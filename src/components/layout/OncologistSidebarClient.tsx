"use client";

import { usePathname } from "next/navigation";
import { useNav } from "@/lib/nav-context";
import Link from "next/link";
import { 
  LayoutGrid, 
  Users, 
  Bell, 
  Calendar, 
  Activity,
  BookOpen, 
  Inbox, 
  Database, 
  BarChart3, 
  Users2, 
  Settings, 
  LogOut,
  UserPlus
} from "lucide-react";

export function OncologistSidebarClient({ session, patientCount, alertCount }: any) {
  const pathname = usePathname();
  const { isOpen } = useNav();

  const NavItem = ({ href, icon: Icon, label, badge }: { href: string; icon: any; label: string; badge?: number }) => {
    const active = pathname === href;
    
    return (
      <Link 
        href={href}
        className={`flex items-center justify-between px-5 py-2.5 rounded-xl transition-all duration-300 group ${
          active 
            ? "bg-slate-900 text-white shadow-lg" 
            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
        } ${!isOpen && 'px-0 justify-center'}`}
      >
        <div className={`flex items-center ${isOpen ? 'gap-4' : 'gap-0'}`}>
          <Icon className={`w-4 h-4 transition-all duration-300 ${active ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`} />
          {isOpen && <span className={`text-[12px] font-bold uppercase tracking-tight font-outfit ${active ? "text-white" : ""}`}>{label}</span>}
        </div>
        {isOpen && badge !== undefined && badge > 0 && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? "bg-white text-slate-950" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </Link>
    );
  };

  const SectionLabel = ({ children }: { children: string }) => (
    isOpen ? (
      <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 mb-3">
         {children}
      </p>
    ) : (
      <div className="h-px bg-slate-100 my-5 mx-4" />
    )
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-100 transition-all duration-500">
      <div className={`${isOpen ? 'p-6 space-y-6' : 'p-4 space-y-5 pt-6'}`}>
        <Link href="/oncologist/dashboard" className={`flex items-center ${isOpen ? 'gap-4' : 'justify-center'}`}>
           <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
              <Activity className="w-6 h-6" />
           </div>
           {isOpen && (
             <div className="overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
                <span className="font-bold font-outfit text-xl tracking-tight text-slate-900">OncoBuddy</span>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider leading-none mt-1">Clinical Suite</p>
             </div>
           )}
        </Link>

        {/* Identity Core Block */}
        <div className={`flex items-center bg-slate-50 rounded-2xl border border-slate-100 translate-z-0 transition-all duration-500 ${isOpen ? 'gap-4 p-4' : 'p-2 justify-center'}`}>
           <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-white text-base shrink-0">
              {session.user.name?.charAt(0) || "D"}
           </div>
           {isOpen && (
             <div className="flex-1 min-w-0 overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
                <p className="text-slate-900 font-bold text-sm uppercase tracking-tight truncate">Dr. {session.user.name?.split(' ').pop() || "Oncologist"}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Institution PI</p>
             </div>
           )}
        </div>

        {/* Performance Strips */}
        {isOpen ? (
          <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Panel</p>
                <span className="text-lg font-bold text-slate-900 font-outfit">{patientCount}</span>
             </div>
             <div className={`p-2 rounded-lg border transition-all duration-300 text-center ${alertCount > 0 ? 'border-rose-100 bg-rose-50/50' : 'border-slate-100 bg-slate-50'}`}>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Alerts</p>
                <span className={`text-lg font-bold font-outfit ${alertCount > 0 ? 'text-rose-700' : 'text-slate-900'}`}>{alertCount}</span>
             </div>
          </div>
        ) : (
          <div className="space-y-2 animate-in fade-in duration-500">
             <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-900 mx-auto">
                {patientCount}
             </div>
             <div className={`w-10 h-10 rounded-lg border flex items-center justify-center text-xs font-bold mx-auto ${alertCount > 0 ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
                {alertCount}
             </div>
          </div>
        )}
      </div>

      <nav className={`flex-1 px-6 py-2 overflow-y-auto space-y-0.5 ${!isOpen && 'px-2'}`}>
        <SectionLabel>Control Tower</SectionLabel>
        <NavItem href="/oncologist/dashboard" icon={LayoutGrid} label="Panel HUD" />
        <NavItem href="/oncologist/patients" icon={Users} label="Patient Vault" />
        <NavItem href="/oncologist/daycare" icon={Activity} label="Monitoring Unit" />
        <NavItem href="/oncologist/alerts" icon={Bell} label="Signal Box" badge={alertCount} />
        <NavItem href="/oncologist/calendar" icon={Calendar} label="Agenda" />

        <SectionLabel>Clinical Lab</SectionLabel>
        <NavItem href="/nurse/registration" icon={UserPlus} label="Enrollment Hub" />
        <NavItem href="/oncologist/registry" icon={Database} label="Meta Registry" />
        <NavItem href="/oncologist/reports" icon={BarChart3} label="Panel Insight" />

        <SectionLabel>Settings</SectionLabel>
        <NavItem href="/oncologist/team" icon={Users2} label="Clinical Staff" />
        <NavItem href="/oncologist/settings" icon={Settings} label="Access Core" />
      </nav>

      <div className={`${isOpen ? 'p-6' : 'p-4'} border-t border-slate-100 space-y-3 pb-6`}>
        <Link href="/api/auth/signout" className={`flex items-center justify-center w-full h-12 rounded-xl bg-slate-50 text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all ${!isOpen && 'px-0'}`}>
           <LogOut className="w-4 h-4" />
           {isOpen && <span className="ml-3">Sign Out</span>}
        </Link>
        {isOpen && <p className="text-[8px] font-bold text-slate-300 text-center uppercase tracking-widest">Build 2.4.1</p>}
      </div>
    </div>
  );
}
