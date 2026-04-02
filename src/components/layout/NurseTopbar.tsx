'use client';

import { Search, Bell, ShieldCheck, Menu } from "lucide-react";
import { useNav } from "@/lib/nav-context";
import { useSession } from "next-auth/react";

/**
 * Nurse Topbar (Section A1, A2).
 * Features global patient search and responsive menu navigation.
 */
export default function NurseTopbar() {
  const { data: session } = useSession();
  const { toggle } = useNav();
  
  if (!session) return null;

  return (
    <header className="h-16 fixed top-0 right-0 left-0 lg:left-72 bg-white/90 border-b border-slate-100 z-20 flex items-center justify-between px-4 md:px-8 backdrop-blur-md">
      {/* Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button 
          onClick={toggle}
          className="p-2 -ml-2 rounded-xl hover:bg-slate-50 text-slate-700 lg:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="relative group flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search Patients, MRN..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-50 outline-none transition-all"
          />
        </div>
      </div>

      {/* Global Clinical Controls (Section A2) */}
      <div className="flex items-center gap-4 md:gap-6 ml-4">
        
        {/* Global Notifications */}
        <div className="flex items-center gap-2 md:gap-4">
           <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-600 rounded-full border-2 border-white" />
           </button>

           <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-100 bg-slate-50">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{session.user.role}</span>
           </div>

           <button className="flex items-center gap-2 group p-1 md:pr-3 rounded-full hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs overflow-hidden relative">
                 {session.user.image ? (
                   <img src={session.user.image} className="w-full h-full object-cover" />
                 ) : (
                   session.user.name?.charAt(0)
                 )}
              </div>
              <p className="hidden sm:block text-xs font-black text-slate-800 italic">{session.user.name?.split(' ').pop()}</p>
           </button>
        </div>
      </div>
    </header>
  );
}
