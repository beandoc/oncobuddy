import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  Bell, 
  Users, 
  CheckSquare, 
  MessageSquare, 
  Calendar, 
  Activity, 
  GraduationCap, 
  BarChart2, 
  Clipboard, 
  UserPlus, 
  BookOpen, 
  Settings, 
  LogOut, 
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { Role, AlertStatus } from "@prisma/client";
import { Button } from "@/components/ui/core";
import Image from "next/image";
import { SidebarWrapper } from "./SidebarWrapper";

/**
 * High-Fidelity Nurse Sidebar (Section A2).
 * Prioritizes Alert counts and Shift status for operational responders.
 */
export default async function NurseSidebar() {
  const session = await auth();
  if (!session) return null;

  // Fetch Nurse-specific metrics (Section A2)
  const nurse = await prisma.clinician.findUnique({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: {
          patients: { where: { endedAt: null } },
          acknowledgedAlerts: { where: { alertStatus: AlertStatus.PENDING } }
        }
      }
    }
  });

  const unacknowledgedAlertCount = nurse?._count.acknowledgedAlerts || 0;
  const patientsCount = nurse?._count.patients || 0;

  const NavItem = ({ href, icon: Icon, label, badge, active = false }: any) => (
    <Link 
      href={href} 
      className={`flex items-center justify-between px-5 py-3 rounded-[18px] transition-all duration-500 group ${
        active 
          ? "bg-slate-950 text-white shadow-2xl shadow-indigo-100" 
          : "text-slate-900/60 hover:bg-slate-50 hover:text-indigo-600"
      }`}
    >
      <div className="flex items-center gap-4">
        <Icon className={`w-5 h-5 transition-all duration-500 group-hover:scale-110 ${active ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`} />
        <span className={`text-[11px] font-black uppercase tracking-[0.2em] font-outfit ${active ? "italic" : ""}`}>{label}</span>
      </div>
      {badge > 0 && (
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border-2 border-white shadow-xl ${active ? "bg-white text-indigo-600" : "bg-rose-600 text-white animate-pulse"}`}>
          {badge}
        </span>
      )}
    </Link>
  );

  return (
    <SidebarWrapper>
      <div className="flex flex-col h-full bg-white border-r-2 border-slate-50 shadow-2xl">
        {/* Sidebar Header - High Fidelity (Section A2) */}
        <div className="p-8 space-y-10">
          <Link href="/nurse/dashboard" className="flex items-center gap-5 transition-transform active:rotate-[-4deg]">
             <div className="w-12 h-12 rounded-[22px] bg-slate-950 flex items-center justify-center shadow-2xl shadow-indigo-100 rotate-[-4deg] hover:rotate-0 transition-transform">
                <ShieldCheck className="w-7 h-7 text-white" />
             </div>
             <h1 className="text-3xl font-black font-outfit text-slate-950 tracking-tighter italic italic">Onco<span className="text-indigo-600">buddy</span></h1>
          </Link>

          {/* Clinical Identity Core (Section A2) */}
          <div className="flex items-center gap-5 p-4 bg-slate-950 rounded-[28px] shadow-2xl shadow-slate-200 border border-slate-900 group">
             <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-slate-950 text-base shadow-xl group-hover:rotate-6 transition-all duration-500 italic">
                {session.user.name?.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-white font-black text-sm italic truncate leading-none uppercase tracking-tight">{session.user.name}</p>
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-2">Nurse Navigator</p>
             </div>
          </div>

          {/* Operational Logic Cluster (Section A2) */}
          <div className="grid grid-cols-2 gap-3">
             <div className={`p-4 rounded-[22px] border-2 transition-all duration-700 shadow-sm ${unacknowledgedAlertCount > 0 ? "border-rose-100 bg-rose-50/50" : "border-slate-50 bg-slate-50/30"}`}>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 font-serif italic italic">Alerts</p>
                <div className="flex items-center gap-2">
                   <span className={`text-2xl font-black font-outfit ${unacknowledgedAlertCount > 0 ? "text-rose-600 animate-pulse" : "text-slate-950"}`}>{unacknowledgedAlertCount}</span>
                </div>
             </div>
             <div className="p-4 rounded-[22px] border-2 border-slate-50 bg-slate-50/30 shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 font-serif italic italic">Assigned</p>
                <span className="text-2xl font-black font-outfit text-slate-950">{patientsCount}</span>
             </div>
          </div>
        </div>

        {/* Navigation Vectors (Section A2) */}
        <nav className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-12 pb-32">
           {/* Section 1: Dashboard Authority */}
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 ml-4 italic italic">Operations Center</p>
              <div className="space-y-2">
                 <NavItem href="/nurse/dashboard" icon={LayoutGrid} label="Control Desk" />
                 <NavItem href="/nurse/alerts" icon={AlertTriangle} label="Clinical Alerts" badge={unacknowledgedAlertCount} />
                 <NavItem href="/nurse/patients" icon={Users} label="Patient Panel" />
                 <NavItem href="/nurse/messages" icon={MessageSquare} label="Broadcasts" badge={8} />
                 <NavItem href="/nurse/appointments" icon={Calendar} label="Operational Hub" />
              </div>
           </div>

           {/* Section 2: Medical Intelligence */}
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 ml-4 italic italic">Care Pathways</p>
              <div className="space-y-2">
                 <NavItem href="/nurse/symptoms" icon={Activity} label="Symptom Intake" />
                 <NavItem href="/nurse/education" icon={BookOpen} label="Resource Lab" />
                 <NavItem href="/nurse/rehab" icon={Activity} label="Recovery Desk" />
                 <NavItem href="/nurse/care-plans" icon={Clipboard} label="Clinical Plans" />
              </div>
           </div>

           {/* Section 3: Professional Tools */}
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 ml-4 italic italic">Institutional</p>
              <div className="space-y-2">
                 <NavItem href="/nurse/registration" icon={UserPlus} label="New Registration" />
                 <NavItem href="/nurse/settings" icon={Settings} label="Security Core" />
              </div>
           </div>
        </nav>

        {/* Sidebar Footer - High Authority (Section A2) */}
        <div className="p-8 border-t-2 border-slate-50 space-y-3 pb-12 bg-white">
           <Button variant="outline" className="w-full border-rose-300 text-rose-700 hover:bg-rose-50 h-14 rounded-[20px] font-black text-[10px] uppercase tracking-[0.3em] gap-3">
              <AlertTriangle className="w-5 h-5" />
              ESCALATE CASE
           </Button>
           
           <div className="flex items-center justify-between px-4 pt-2">
              <button className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest italic italic">Help Support</button>
              <button className="text-[10px] font-black text-rose-400 hover:text-rose-600 transition-colors uppercase tracking-widest italic italic">Discard Session</button>
           </div>
           <p className="text-[9px] text-center text-slate-200 font-black uppercase tracking-[0.2em] pt-6">Clinical Engine • v2.4.0</p>
        </div>
      </div>
    </SidebarWrapper>
  );
}

import { ShieldCheck, LayoutGrid } from "lucide-react";
