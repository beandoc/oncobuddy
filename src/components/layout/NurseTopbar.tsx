import { auth } from "@/lib/auth";
import { Search, Bell, Clock, ChevronRight, UserCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/core";
import { Role } from "@prisma/client";

/**
 * Nurse Topbar (Section A1, A2).
 * Features the mandatory 'Currently on shift' toggle and global patient search.
 */
export default async function NurseTopbar() {
  const session = await auth();
  if (!session) return null;

  return (
    <header className="h-16 fixed top-0 right-0 left-72 bg-white border-b border-slate-100 z-20 flex items-center justify-between px-8 backdrop-blur-md bg-white/90">
      {/* Search Bar (Section A1) */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search Patients, MRN, or ICD Codes..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-50 outline-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Global Clinical Controls (Section A2) */}
      <div className="flex items-center gap-6 ml-12">
        
        {/* Shift Toggle - MANDATORY (Section A1) */}
        <div className="flex items-center gap-3">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Currently on shift</p>
           <button className="relative w-11 h-6 bg-slate-200 rounded-full transition-colors hover:bg-slate-300 group">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm shadow-black/10 transition-transform transform translate-x-0 group-hover:translate-x-0.5" />
           </button>
        </div>

        <div className="w-[1px] h-6 bg-slate-100" />

        {/* Global Notifications */}
        <div className="flex items-center gap-4">
           <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
           </button>

           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-100 bg-slate-50">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{session.user.role}</span>
           </div>

           <button className="flex items-center gap-2 group p-1 pr-3 rounded-full hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
                 {session.user.name?.charAt(0)}
              </div>
              <p className="text-xs font-bold text-slate-700">Dr. {session.user.name?.split(' ').pop()}</p>
           </button>
        </div>
      </div>
    </header>
  );
}
