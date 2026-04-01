import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { Bell, Search, ChevronDown, User, LogOut, Settings, LayoutGrid } from "lucide-react";
import Image from "next/image";

/**
 * Oncologist Topbar - Persistent Header with Global Search and Profile.
 * Supports breadcrumbs and dynamic screen titles.
 */
export async function OncologistTopbar({ title, breadcrumbs }: { title: string; breadcrumbs?: { label: string; href: string }[] }) {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <header className="h-16 px-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-30">
      {/* Title & Breadcrumbs */}
      <div className="flex flex-col">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
            {breadcrumbs.map((bc, i) => (
              <span key={bc.href} className="flex items-center gap-1.5">
                 <a href={bc.href} className="hover:text-indigo-600 transition-colors">{bc.label}</a>
                 {i < breadcrumbs.length - 1 && <span>•</span>}
              </span>
            ))}
          </nav>
        )}
        <h2 className="text-xl font-bold font-outfit tracking-tight">{title}</h2>
      </div>

      {/* Action Center */}
      <div className="flex items-center gap-6">
        {/* Global Search Input (Section 3) */}
        <div className="relative group hidden md:block">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
           <input 
              type="text" 
              placeholder="Search patients by name or MRN..." 
              className="w-80 h-10 pl-10 pr-4 rounded-xl border border-slate-100 bg-slate-50/50 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all group-focus-within:bg-white group-focus-within:border-indigo-100 group-focus-within:w-96 shadow-sm"
           />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
           <Bell className="w-5 h-5 text-slate-600" />
           <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-white ring-1 ring-rose-200 animate-pulse" />
        </button>

        {/* Profile Dropdown Trigger */}
        <div className="flex items-center gap-3 p-1.5 pl-3 border border-slate-100 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors group">
           <div className="flex flex-col text-right">
              <span className="text-xs font-bold leading-tight">Dr. {session.user.name?.split(' ').pop()}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Status: Active</span>
           </div>
           <div className="w-8 h-8 rounded-full bg-slate-100 relative overflow-hidden border border-white">
              {session.user.image ? (
                <Image src={session.user.image} alt="" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <User className="w-4 h-4" />
                </div>
              )}
           </div>
           <ChevronDown className="w-4 h-4 text-slate-400 mr-2 group-hover:translate-y-0.5 transition-transform" />
        </div>
      </div>
    </header>
  );
}
