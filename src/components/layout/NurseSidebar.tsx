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

  const NavItem = ({ href, icon: Icon, label, badge, active = false, large = false }: any) => (
    <Link 
      href={href} 
      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
        active 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 shadow-offset-2" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${large ? "w-6 h-6" : ""} ${active ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`} />
        <span className={`text-sm ${large ? "font-bold" : "font-medium"} tracking-tight`}>{label}</span>
      </div>
      {badge > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? "bg-white text-indigo-600" : "bg-rose-500 text-white shadow-sm"}`}>
          {badge}
        </span>
      )}
    </Link>
  );

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-white border-r border-slate-100 flex flex-col z-30 shadow-sm">
      {/* Sidebar Header (Section A2) */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-8">
           <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-xl italic leading-none">O</span>
           </div>
           <h1 className="text-xl font-bold font-outfit text-slate-900 tracking-tight">Oncobuddy</h1>
        </div>

        {/* Identity Card (Section A2) */}
        <div className="flex items-center gap-4 mb-4">
           <div className="w-12 h-12 rounded-full ring-2 ring-slate-100 p-0.5">
              <div className="w-full h-full rounded-full bg-slate-200 relative overflow-hidden">
                 {session.user.image ? <Image src={session.user.image} alt="" fill className="object-cover" /> : null}
              </div>
           </div>
           <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">{session.user.name}</p>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mt-0.5">Nurse Navigator</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{patientsCount} Assigned Patients</p>
           </div>
        </div>

        {/* Shift Pill & Alert Pulse (Section A2) */}
        <div className="flex flex-col gap-3">
           <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-slate-400" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Off Shift</span>
              </div>
              <div className="w-6 h-3 bg-slate-200 rounded-full relative">
                 <div className="absolute left-0.5 top-0.5 w-2 h-2 bg-white rounded-full" />
              </div>
           </div>

           <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all ${unacknowledgedAlertCount > 0 ? "border-rose-100 bg-rose-50/50" : "border-slate-50 bg-slate-50"}`}>
              <div className="flex items-center gap-3">
                 <div className={`relative ${unacknowledgedAlertCount > 0 ? "animate-pulse" : ""}`}>
                    <Bell className={`w-5 h-5 ${unacknowledgedAlertCount > 0 ? "text-rose-600" : "text-slate-400"}`} />
                    {unacknowledgedAlertCount > 0 && <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-600 rounded-full border-2 border-white" />}
                 </div>
                 <span className={`text-[11px] font-black uppercase tracking-widest ${unacknowledgedAlertCount > 0 ? "text-rose-600" : "text-slate-400"}`}>
                    {unacknowledgedAlertCount} Pending Alerts
                 </span>
              </div>
           </div>
        </div>
      </div>

      {/* Navigation (Section A2) */}
      <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-8">
         {/* My Work Section */}
         <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">My Work</p>
            <div className="space-y-1">
               <NavItem href="/nurse/alerts" icon={AlertTriangle} label="Alert Inbox" badge={unacknowledgedAlertCount} large />
               <NavItem href="/nurse/patients" icon={Users} label="My Patients" />
               <NavItem href="/nurse/daycare" icon={Activity} label="Day Care Unit" />
               <NavItem href="/nurse/tasks" icon={CheckSquare} label="Tasks" badge={3} />
               <NavItem href="/nurse/messages" icon={MessageSquare} label="Messages" badge={8} />
               <NavItem href="/nurse/appointments" icon={Calendar} label="Appointments" />
            </div>
         </div>

         {/* Patient Care Section */}
         <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Patient Care</p>
            <div className="space-y-1">
               <NavItem href="/nurse/symptoms" icon={Activity} label="Symptom Overview" />
               <NavItem href="/nurse/education" icon={GraduationCap} label="Education Progress" />
               <NavItem href="/nurse/rehab" icon={BarChart2} label="Rehab Tracker" />
               <NavItem href="/nurse/care-plans" icon={Clipboard} label="Care Plans" />
            </div>
         </div>

         {/* Tools Section */}
         <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Tools</p>
            <div className="space-y-1">
               <NavItem href="/nurse/registration" icon={UserPlus} label="Patient Registration" />
               <NavItem href="/nurse/guides" icon={BookOpen} label="Guide Library" />
               <NavItem href="/nurse/settings" icon={Settings} label="Settings" />
            </div>
         </div>
      </nav>

      {/* Sidebar Footer (Section A2) */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-2">
         <Button variant="outline" className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 h-10 font-bold text-xs gap-2 group">
            <AlertTriangle className="w-4 h-4 group-hover:animate-shake" />
            Escalate to Oncologist
         </Button>
         
         <div className="flex items-center justify-between px-2 py-2">
            <button className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center gap-1.5">
               <HelpCircle className="w-3.5 h-3.5" /> Support
            </button>
            <button className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest flex items-center gap-1.5">
               <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
         </div>
         <p className="text-[8px] text-center text-slate-300 font-bold uppercase tracking-tighter">Oncobuddy Clinical v2.4.0-N</p>
      </div>
    </aside>
  );
}
