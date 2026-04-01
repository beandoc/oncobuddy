import { auth } from "@/lib/auth";
import { 
  Home, 
  Heart, 
  BookOpen, 
  Activity, 
  MoreHorizontal, 
  Bell, 
  UserCircle2, 
  MessageCircle, 
  Calendar, 
  LogOut, 
  ShieldCheck,
  PhoneCall
} from "lucide-react";
import Link from "next/link";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Patient Navigation Suite (Section B2).
 * Features a high-fidelity desktop top-nav and a mobile-optimized bottom-tab-bar.
 * Design Philosophy: Warmth, clarity, and low cognitive load. (Section B1).
 */
export default async function PatientNavbar() {
  const session = await auth();
  if (!session || session.user.role !== Role.PATIENT) return null;

  const userInitials = session.user.name?.charAt(0) || "P";

  const DesktopLink = ({ href, icon: Icon, label }: any) => (
    <Link 
      href={href} 
      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all group"
    >
      <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
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
      {/* Desktop Top Navigation Bar (Section B2) */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-b border-slate-100 z-50 hidden md:flex items-center justify-center border-t-4 border-t-indigo-500">
        <div className="max-w-7xl w-full mx-auto px-8 flex items-center justify-between">
           {/* Platform Logo */}
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                 <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-outfit text-slate-900 tracking-tight">Oncobuddy</span>
           </div>

           {/* Navigation Links (Section B2) */}
           <nav className="flex items-center gap-4">
              <DesktopLink href="/patient/dashboard" icon={Home} label="Home" />
              <DesktopLink href="/patient/symptoms" icon={Heart} label="My Health" />
              <DesktopLink href="/patient/learn" icon={BookOpen} label="Learn" />
              <DesktopLink href="/patient/rehab" icon={Activity} label="Rehab" />
              <DesktopLink href="/patient/appointments" icon={Calendar} label="Appointments" />
              <DesktopLink href="/patient/messages" icon={MessageCircle} label="Messages" />
           </nav>

           {/* Profile Controls */}
           <div className="flex items-center gap-4">
              <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors relative">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              
              <div className="w-[1px] h-6 bg-slate-200 mx-2" />
              
              <button className="flex items-center gap-3 p-1.5 pr-4 rounded-full border border-slate-100 hover:bg-slate-50 transition-all">
                 <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-sm">
                    {userInitials}
                 </div>
                 <p className="text-sm font-bold text-slate-700">{(session.user as any).firstName}</p>
              </button>
           </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (Section B2) */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 md:hidden flex items-center justify-between pb-4 px-4 z-50">
         <MobileTab href="/patient/dashboard" icon={Home} label="Home" />
         <MobileTab href="/patient/symptoms" icon={Heart} label="My Health" />
         <MobileTab href="/patient/learn" icon={BookOpen} label="Learn" />
         <MobileTab href="/patient/rehab" icon={Activity} label="Rehab" />
         <MobileTab href="/patient/more" icon={MoreHorizontal} label="More" badge={3} />
      </nav>

      {/* Emergency Help Strip - MANDATORY (Section B1) */}
      <div className="fixed bottom-20 md:bottom-0 left-0 right-0 h-10 bg-rose-50/95 backdrop-blur-sm border-t border-rose-100 flex items-center justify-center z-40 px-6">
         <p className="text-[11px] font-bold text-rose-800 uppercase tracking-widest flex items-center gap-2">
            Feeling very unwell? 
            <a href="tel:+918888888888" className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full flex items-center gap-1.5 active:scale-95 transition-transform">
               <PhoneCall className="w-3 h-3" /> Call Care Team
            </a>
         </p>
      </div>
    </>
  );
}
