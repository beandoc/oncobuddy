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
  BookOpen, 
  Inbox, 
  Database, 
  BarChart3, 
  Users2, 
  Settings, 
  LogOut,
  HelpCircle
} from "lucide-react";
import Image from "next/image";

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
      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all group"
    >
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge > 0 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );

  const SectionLabel = ({ children }: { children: string }) => (
    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-8 mb-2">
      {children}
    </p>
  );

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-white border-r border-slate-100 flex flex-col z-40">
      {/* Header & Identity */}
      <div className="p-6">
        <Link href="/oncologist/dashboard" className="flex items-center gap-2 mb-8">
           <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white font-bold text-xl">O</div>
           <span className="font-outfit font-bold text-xl tracking-tight">Onco<span className="text-indigo-600">buddy</span></span>
        </Link>

        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
           <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white overflow-hidden relative">
              {session.user.image ? (
                <Image src={session.user.image} alt={session.user.name || ""} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-indigo-600 font-bold">
                  {session.user.name?.charAt(0) || "D"}
                </div>
              )}
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">Dr. {session.user.name?.split(' ').pop() || "Oncologist"}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Medical Oncology</p>
           </div>
        </div>

        {/* Live Metrics */}
        <div className="mt-4 flex gap-2">
           <div className="flex-1 bg-white p-2 rounded-xl border border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Patients</p>
              <p className="text-sm font-bold text-slate-700">{patientCount}</p>
           </div>
           <div className={`flex-1 bg-white p-2 rounded-xl border border-slate-100 text-center ${alertCount > 0 ? 'border-rose-100' : ''}`}>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Alerts</p>
              <p className={`text-sm font-bold ${alertCount > 0 ? 'text-rose-600' : 'text-slate-700'}`}>{alertCount}</p>
           </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto no-scrollbar">
        <SectionLabel>Clinical</SectionLabel>
        <NavItem href="/oncologist/dashboard" icon={LayoutGrid} label="Dashboard" />
        <NavItem href="/oncologist/patients" icon={Users} label="My Patients" />
        <NavItem href="/oncologist/alerts" icon={Bell} label="Alert Inbox" badge={alertCount} />
        <NavItem href="/oncologist/appointments" icon={Calendar} label="Appointments" />
        <NavItem href="/oncologist/messages" icon={MessageSquare} label="Messages" />

        <SectionLabel>Clinical Tools</SectionLabel>
        <NavItem href="/oncologist/library" icon={BookOpen} label="Education Library" />
        <NavItem href="/oncologist/assign" icon={Inbox} label="Assign Content" />
        <NavItem href="/oncologist/registry" icon={Database} label="Registry" />
        <NavItem href="/oncologist/reports" icon={BarChart3} label="Reports" />

        <SectionLabel>Administration</SectionLabel>
        <NavItem href="/oncologist/team" icon={Users2} label="Care Team" />
        <NavItem href="/oncologist/settings" icon={Settings} label="Settings" />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-50">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">
          <HelpCircle className="w-5 h-5" />
          <span>Help & Support</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-rose-600 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
        <div className="mt-2 px-4">
           <span className="text-[10px] text-slate-300 font-medium">v1.4.2 • Oncobuddy Build</span>
        </div>
      </div>
    </aside>
  );
}
