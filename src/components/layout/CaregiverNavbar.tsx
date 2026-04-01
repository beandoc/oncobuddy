import { auth } from "@/lib/auth";
import { 
  Home, 
  Heart, 
  Calendar, 
  MessageSquare, 
  MoreHorizontal, 
  Bell, 
  ShieldCheck,
  ChevronDown,
  UserCircle2,
  BookOpen,
  Users
} from "lucide-react";
import Link from "next/link";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Caregiver Navigation Suite (Section C2).
 * Features a top-nav architecture for desktop and a mobile-optimized tab-bar.
 * Design Philosophy: Supportive, clear, and dual-role focused (Section C1).
 * Includes the mandatory Patient Context Switcher.
 */
export default async function CaregiverNavbar() {
  const session = await auth();
  if (!session || session.user.role !== Role.CAREGIVER) return null;

  // In a real implementation, we'd fetch the active patient from the session/context
  const activePatientName = "Jane Doe"; 

  const DesktopLink = ({ href, icon: Icon, label }: any) => (
    <Link 
      href={href} 
      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-teal-600 hover:bg-teal-50/50 transition-all group"
    >
      <Icon className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
      {label}
    </Link>
  );

  const MobileTab = ({ href, icon: Icon, label, badge }: any) => (
    <Link href={href} className="flex-1 flex flex-col items-center justify-center py-2 relative">
      <Icon className="w-6 h-6 text-slate-400 mb-1" />
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">{label}</span>
      {badge && (
        <span className="absolute top-1 right-1/2 translate-x-4 px-1.5 py-0.5 rounded-full bg-rose-500 text-[8px] text-white font-black">
          {badge}
        </span>
      )}
    </Link>
  );

  return (
    <>
      {/* Desktop Top Navigation Bar (Section C2) */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-slate-100 z-50 hidden md:flex items-center justify-center border-t-4 border-t-teal-500 shadow-sm">
        <div className="max-w-7xl w-full mx-auto px-8 flex items-center justify-between">
           {/* Left: Platform Logo & Patient Switcher */}
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-100">
                    <ShieldCheck className="w-5 h-5 text-white" />
                 </div>
                 <span className="text-xl font-bold font-outfit text-slate-900 tracking-tight">Oncobuddy</span>
              </div>
              
              <div className="w-[1px] h-8 bg-slate-100" />
              
              <button className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-teal-50 border border-teal-100 hover:bg-teal-100 transition-colors group">
                 <Users className="w-4 h-4 text-teal-600" />
                 <div className="text-left">
                    <p className="text-[9px] font-black text-teal-500 uppercase tracking-widest leading-none mb-1">Viewing Patient</p>
                    <p className="text-sm font-bold text-teal-900 leading-none">{activePatientName}</p>
                 </div>
                 <ChevronDown className="w-4 h-4 text-teal-400 group-hover:translate-y-0.5 transition-transform" />
              </button>
           </div>

           {/* Center: Navigation Links (Section C2) */}
           <nav className="flex items-center gap-4">
              <DesktopLink href="/caregiver/dashboard" icon={Home} label="Home" />
              <DesktopLink href="/caregiver/health" icon={Heart} label="Patient Health" />
              <DesktopLink href="/caregiver/appointments" icon={Calendar} label="Appointments" />
              <DesktopLink href="/caregiver/messages" icon={MessageSquare} label="Messages" />
              <DesktopLink href="/caregiver/resources" icon={BookOpen} label="Resources" />
           </nav>

           {/* Right: Notifications & Profile */}
           <div className="flex items-center gap-4">
              <button className="p-2.5 text-slate-400 hover:text-teal-600 transition-colors relative">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              
              <div className="w-[1px] h-6 bg-slate-200 mx-1" />
              
              <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-100 hover:border-teal-200 transition-all group overflow-hidden shadow-sm">
                 <UserCircle2 className="w-6 h-6 text-slate-400 group-hover:text-teal-600" />
              </button>
           </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (Section C2) */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 md:hidden flex items-center justify-between pb-4 px-4 z-50 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.05)]">
         <MobileTab href="/caregiver/dashboard" icon={Home} label="Home" />
         <MobileTab href="/caregiver/health" icon={Heart} label="Health" />
         <MobileTab href="/caregiver/appointments" icon={Calendar} label="Visits" />
         <MobileTab href="/caregiver/messages" icon={MessageSquare} label="Msgs" />
         <MobileTab href="/caregiver/more" icon={MoreHorizontal} label="More" />
      </nav>
    </>
  );
}
