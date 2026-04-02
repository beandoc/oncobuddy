'use client';

import { useNav } from "@/lib/nav-context";
import { Bell, Search, ChevronDown, User, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

/**
 * Oncologist Topbar - Persistent Header with Global Search and Profile.
 * Supports breadcrumbs and dynamic screen titles.
 */
export function OncologistTopbar({ title, breadcrumbs }: { title: string; breadcrumbs?: { label: string; href: string }[] }) {
  const { data: session } = useSession();
  const { toggle } = useNav();
  
  if (!session?.user) return null;

  return (
    <header className="h-16 px-4 md:px-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-30">
      {/* Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggle}
          className="p-2 -ml-2 rounded-xl hover:bg-slate-50 text-slate-700 lg:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Title & Breadcrumbs */}
      <div className="flex flex-col">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">
            {breadcrumbs.map((bc, i) => (
              <span key={bc.href} className="flex items-center gap-1.5">
                 <Link href={bc.href} className="hover:text-indigo-600 transition-colors">{bc.label}</Link>
                 {i < breadcrumbs.length - 1 && <span>•</span>}
              </span>
            ))}
          </nav>
        )}
        <h2 className="text-xl font-bold font-outfit tracking-tight text-slate-900">{title}</h2>
      </div>

      {/* Action Center */}
      <div className="flex items-center gap-4 lg:gap-6 ml-4">
        {/* Global Search Input (Section 3) */}
        <div className="relative group hidden md:block">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-600 transition-colors" />
           <input 
              type="text" 
              placeholder="Search patients..." 
              className="w-48 lg:w-80 h-10 pl-10 pr-4 rounded-xl border border-slate-100 bg-slate-50/50 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-50 outline-none transition-all group-focus-within:bg-white group-focus-within:border-indigo-100 shadow-sm"
           />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-slate-600">
           <Bell className="w-5 h-5" />
           <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-600 border-2 border-white ring-1 ring-rose-200 animate-pulse" />
        </button>

         {/* Profile Dropdown Trigger */}
         <div className="flex items-center gap-3 p-1.5 pl-3 border border-slate-100 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors group">
            <div className="hidden sm:flex flex-col text-right">
               <span className="text-xs font-bold text-slate-900 leading-tight">Dr. {session.user.name?.split(' ').pop()}</span>
               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Oncologist</span>
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
