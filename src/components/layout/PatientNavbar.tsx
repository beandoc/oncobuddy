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
  PhoneCall,
  Settings,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Patient Navigation Suite (Section B2).
 * Features a high-fidelity desktop top-nav and a mobile-optimized bottom-tab-bar.
 * Design Philosophy: Warmth, clarity, and low cognitive load. (Section B1).
 * Optimized for high-contrast accessibility (slate-900).
 */
export default async function PatientNavbar() {
  const session = await auth();
  if (!session || session.user.role !== Role.PATIENT) return null;

  const userInitials = session.user.name?.charAt(0) || "P";

  const DesktopLink = ({ href, icon: Icon, label }: any) => (
    <Link 
      href={href} 
      className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-[24px] text-[9px] font-black uppercase tracking-[0.2em] text-slate-900/60 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all group relative overflow-hidden"
    >
      <Icon className="w-5 h-5 text-slate-900/40 group-hover:text-indigo-600 transition-colors group-hover:scale-110 duration-500" />
      {label}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-indigo-600 rounded-full group-hover:w-4 transition-all duration-700" />
    </Link>
  );

  const MobileTab = ({ href, icon: Icon, label, badge }: any) => (
    <Link href={href} className="flex-1 flex flex-col items-center justify-center py-4 relative group active:scale-90 transition-transform">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
         <Icon className="w-6 h-6 text-slate-900 group-hover:text-indigo-600 transition-colors" />
      </div>
      <span className="text-[9px] font-black text-slate-900/60 group-hover:text-indigo-600 uppercase tracking-widest mt-1 duration-500">{label}</span>
      {badge && (
        <span className="absolute top-2 right-1/2 translate-x-5 px-2.5 py-1 rounded-full bg-rose-600 text-[8px] text-white font-black shadow-2xl border-2 border-white animate-pulse">
          {badge}
        </span>
      )}
    </Link>
  );

  return (
    <>
      {/* Desktop Top Navigation Bar - Ultra Premium (Section B2) */}
      <header className="fixed top-0 left-0 right-0 h-28 z-50 hidden md:flex items-center justify-center px-8">
        <div className="max-w-7xl w-full mx-auto p-4 glass-surface rounded-[40px] shadow-2xl shadow-indigo-100/20 border-white/40 flex items-center justify-between px-10 relative overflow-hidden backdrop-saturate-200">
           {/* Aura Effect (Premium Detail) */}
           <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-600/5 blur-3xl rounded-full aura-pulse" />

           {/* Platform Logo */}
           <Link href="/patient/dashboard" className="flex items-center gap-5 transition-transform hover:scale-105 active:scale-95 group relative z-10">
              <div className="w-14 h-14 rounded-[22px] bg-slate-950 flex items-center justify-center shadow-2xl shadow-slate-900/40 border border-slate-800 rotate-[-4deg] group-hover:rotate-0 transition-all duration-700">
                 <ShieldCheck className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-left">
                  <span className="text-3xl font-black font-outfit text-slate-950 tracking-tighter italic italic leading-none block">Onco<span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4 decoration-4">buddy</span></span>
                  <p className="text-[8px] font-black uppercase text-slate-400 tracking-[0.5em] mt-1 ml-1 font-serif">Patient Portal</p>
              </div>
           </Link>

           {/* Navigation Links - Centered (Section B2) */}
           <nav className="flex items-center gap-2 bg-slate-50/50 p-2 rounded-[32px] border border-slate-100/50 shadow-inner">
              <DesktopLink href="/patient/dashboard" icon={Home} label="Home" />
              <DesktopLink href="/patient/symptoms" icon={Heart} label="Health" />
              <DesktopLink href="/patient/learn" icon={BookOpen} label="Academy" />
              <DesktopLink href="/patient/rehab" icon={Activity} label="Recovery" />
              <DesktopLink href="/patient/appointments" icon={Calendar} label="Clinics" />
              <DesktopLink href="/patient/messages" icon={MessageCircle} label="Signals" />
           </nav>

           {/* Profile Cluster - Ultra Premium (Section B2) */}
           <div className="flex items-center gap-6 relative z-10">
              <button className="w-14 h-14 rounded-[24px] bg-white flex items-center justify-center text-slate-950 hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all relative border-2 border-slate-50 group shadow-sm active:scale-90">
                 <Bell className="w-7 h-7 group-hover:rotate-12 transition-transform duration-500" />
                 <span className="absolute top-4 right-4 w-3.5 h-3.5 bg-rose-600 rounded-full border-4 border-white shadow-xl animate-pulse" />
              </button>
              
              <Link href="/patient/settings" className="flex items-center gap-5 p-2 pr-8 rounded-[30px] border-2 border-slate-50 hover:border-indigo-100 hover:bg-white hover:shadow-2xl transition-all group shadow-sm">
                 <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center font-black text-white text-lg shadow-[0_10px_20px_rgba(0,0,0,0.2)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 italic">
                    {userInitials}
                 </div>
                 <div className="text-left">
                    <p className="text-[11px] font-black text-slate-950 leading-none uppercase tracking-[0.2em] font-outfit italic italic">{(session.user as any).firstName || session.user.name?.split(' ')[0]}</p>
                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity italic decoration-indigo-200 underline underline-offset-4">Security ID</p>
                 </div>
              </Link>
           </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar - Ultra Premium Glass (Section B2) */}
      <nav className="fixed bottom-10 left-8 right-8 h-24 glass-surface rounded-[40px] md:hidden flex items-center justify-between px-8 z-50 shadow-[0_40px_80px_rgba(0,0,0,0.1)] border-white/50 backdrop-saturate-200">
         <MobileTab href="/patient/dashboard" icon={Home} label="Home" />
         <MobileTab href="/patient/symptoms" icon={Heart} label="Health" />
         <MobileTab href="/patient/learn" icon={BookOpen} label="Learn" />
         <MobileTab href="/patient/rehab" icon={Activity} label="Rehab" />
         <MobileTab href="/patient/more" icon={MoreHorizontal} label="Context" badge={3} />
      </nav>

      {/* Global Clinical Emergency Overlay (Section B1) */}
      <div className="fixed bottom-0 left-0 right-0 h-10 bg-slate-950/80 backdrop-blur-md text-white flex items-center justify-center z-40 px-8 selection:bg-rose-900 border-t border-white/5">
         <div className="max-w-7xl w-full flex items-center justify-between">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] flex items-center gap-4 italic italic opacity-60">
               <ShieldCheck className="w-3 h-3 text-indigo-400" />
               High-Fidelity Triage Mode Active • 24/7 Monitoring
            </p>
            <Link href="tel:+918888888888" className="bg-rose-600 text-white px-6 py-1 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-rose-500 transition-all hover:px-8">
               <PhoneCall className="w-3.5 h-3.5" /> Emergency SOS
            </Link>
         </div>
      </div>
    </>
  );
}
