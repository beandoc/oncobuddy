import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import Link from "next/link";
import { 
  LayoutGrid, 
  Users, 
  Bell, 
  Calendar, 
  MessageSquare, 
  Activity,
  BookOpen, 
  Inbox, 
  Database, 
  BarChart3, 
  Users2, 
  Settings, 
  LogOut,
  HelpCircle,
  UserPlus,
  ChevronRight
} from "lucide-react";
import Image from "next/image";

import { SidebarWrapper } from "./SidebarWrapper";

/**
 * Oncologist Sidebar - React Server Component.
 * Reads session and live counts server-side for zero-layout-shift rendering.
 */
export async function OncologistSidebar() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ONCOLOGIST) return null;

  const clinician = await prisma.clinician.findUnique({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: {
          patients: { where: { endedAt: null } },
          acknowledgedAlerts: { where: { alertStatus: "PENDING" } }
        }
      }
    }
  });

  const patientCount = clinician?._count.patients || 0;
  const alertCount = clinician?._count.acknowledgedAlerts || 0;

  const NavItem = ({ href, icon: Icon, label, badge }: { href: string; icon: any; label: string; badge?: number }) => (
    <Link 
      href={href}
      className="flex items-center justify-between px-5 py-3.5 rounded-[18px] transition-all duration-500 group text-slate-900/60 hover:bg-slate-50 hover:text-indigo-600"
    >
      <div className="flex items-center gap-4">
        <Icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-all duration-500 group-hover:scale-110" />
        <span className="flex-1 text-[11px] font-black uppercase tracking-[0.2em] font-outfit">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border-2 border-white shadow-xl ${badge > 0 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );

  const SectionLabel = ({ children }: { children: string }) => (
    <p className="px-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-12 mb-6 italic italic opacity-60">
       {children}
    </p>
  );

  return (
    <SidebarWrapper>
      <div className="flex flex-col h-full bg-white border-r-2 border-slate-50 shadow-2xl">
        {/* Header & Identity - Ultra Premium (Section 3) */}
        <div className="p-8 space-y-10">
          <Link href="/oncologist/dashboard" className="flex items-center gap-5 transition-transform active:rotate-[-4deg]">
             <div className="w-12 h-12 rounded-[22px] bg-slate-950 flex items-center justify-center text-white shadow-2xl shadow-slate-900/40 rotate-[-4deg] hover:rotate-0 transition-transform">
                <Activity className="w-7 h-7" />
             </div>
             <div className="text-left">
                <span className="font-black font-outfit text-3xl tracking-tighter italic italic block leading-none">Onco<span className="text-indigo-600">buddy</span></span>
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-[0.5em] mt-1.5 ml-1 font-serif">Clinical Suite</p>
             </div>
          </Link>

          {/* Identity Core Block */}
          <div className="flex items-center gap-5 p-5 bg-slate-950 rounded-[30px] shadow-2xl shadow-slate-200 border border-slate-800 group">
             <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-slate-950 text-lg shadow-xl group-hover:rotate-6 transition-all duration-500 italic">
                {session.user.name?.charAt(0) || "D"}
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-[13px] font-black text-white italic truncate leading-none uppercase tracking-tight">Dr. {session.user.name?.split(' ').pop() || "Oncologist"}</p>
                <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mt-2 px-2 py-0.5 bg-indigo-500/10 rounded-full inline-block">Institution PI</p>
             </div>
          </div>

          {/* Clinical Performance Indicators */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50/50 p-4 rounded-[24px] border-2 border-slate-50 text-left shadow-sm">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-2 italic italic">Panel</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-2xl font-black text-slate-950 font-outfit italic leading-none">{patientCount}</p>
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Live</span>
                </div>
             </div>
             <div className={`p-4 rounded-[24px] border-2 text-left shadow-sm transition-all duration-700 ${alertCount > 0 ? 'border-rose-100 bg-rose-50/50 animate-pulse' : 'border-slate-50 bg-slate-50/50'}`}>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-2 italic italic">Alerts</p>
                <div className="flex items-baseline gap-2">
                   <p className={`text-2xl font-black font-outfit leading-none italic ${alertCount > 0 ? 'text-rose-600' : 'text-slate-950'}`}>{alertCount}</p>
                   {alertCount > 0 && <div className="w-2 h-2 rounded-full bg-rose-600 mb-1" />}
                </div>
             </div>
          </div>
        </div>

        {/* Navigation Vectors (Section 3) */}
        <nav className="flex-1 px-6 py-2 overflow-y-auto no-scrollbar selection:bg-indigo-100 space-y-1">
          <SectionLabel>Control Tower</SectionLabel>
          <NavItem href="/oncologist/dashboard" icon={LayoutGrid} label="Panel HUD" />
          <NavItem href="/oncologist/patients" icon={Users} label="Patient Vault" />
          <NavItem href="/oncologist/daycare" icon={Activity} label="Monitoring Unit" />
          <NavItem href="/oncologist/alerts" icon={Bell} label="Signal Box" badge={alertCount} />
          <NavItem href="/oncologist/calendar" icon={Calendar} label="Agenda" />

          <SectionLabel>Clinical Lab</SectionLabel>
          <NavItem href="/oncologist/library" icon={BookOpen} label="Asset Vault" />
          <NavItem href="/nurse/registration" icon={UserPlus} label="Enrollment Hub" />
          <NavItem href="/oncologist/assign" icon={Inbox} label="Task Queue" />
          <NavItem href="/oncologist/registry" icon={Database} label="Meta Registry" />
          <NavItem href="/oncologist/reports" icon={BarChart3} label="Panel Insight" />

          <SectionLabel>Institutional</SectionLabel>
          <NavItem href="/oncologist/team" icon={Users2} label="Clinical Staff" />
          <NavItem href="/oncologist/settings" icon={Settings} label="Access Core" />
        </nav>

        {/* Integrated Action Footer (Section 3) */}
        <div className="p-8 border-t-2 border-slate-50 space-y-3 pb-12 bg-white">
          <button className="w-full flex items-center justify-between px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-2xl transition-all group">
            <div className="flex items-center gap-4">
               <HelpCircle className="w-4 h-4" />
               <span>Protocol Support</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform duration-500" />
          </button>
          
          <div className="flex items-center justify-between px-6 pt-2">
             <Link href="/api/auth/signout" className="text-[10px] font-black text-rose-400 hover:text-rose-600 transition-colors uppercase tracking-widest italic italic underline underline-offset-4 decoration-rose-100">Discard Session</Link>
             <span className="text-[8px] text-slate-200 font-black uppercase tracking-[0.2em]">Build 2.4.0</span>
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
}
