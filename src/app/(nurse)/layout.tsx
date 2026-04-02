import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import NurseSidebar from "@/components/layout/NurseSidebar";
import NurseTopbar from "@/components/layout/NurseTopbar";
import { Bell } from "lucide-react";
import { NavProvider } from "@/lib/nav-context";

/**
 * Nurse Layout Shell (Section A1).
 * Features a fixed three-column layout optimized for clinical operations.
 * Main: Scrollable center content. 
 * Sidebar: Fixed navigation. 
 * Contextual: 380px wide right drawer (Section A1).
 */
export default async function NurseLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== Role.NURSE) redirect("/login");

  return (
    <NavProvider>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Fixed Sidebar (Section A2) */}
        <NurseSidebar />

        {/* Main Content Area (Section A1) */}
        <div className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
          {/* Persistent Topbar (Section A1) */}
          <NurseTopbar />

          <div className="flex-1 flex overflow-hidden">
            {/* Central Scrollable Dashboard (Section A1) */}
            <main className="flex-1 overflow-y-auto no-scrollbar pt-16 px-4 md:px-8 py-8 h-full bg-white transition-all">
              <div className="max-w-7xl mx-auto pb-20">
                {children}
              </div>
            </main>

            {/* Contextual Right Panel - Wider 380px for Nurse Write Actions (Section A1) */}
            <aside className="w-[380px] h-full bg-slate-50/50 border-l border-slate-100 hidden xl:flex flex-col flex-shrink-0 animate-in slide-in-from-right duration-500">
               <div className="p-8 flex flex-col h-full">
                  <div className="flex items-baseline justify-between mb-8">
                     <h3 className="text-xl font-bold font-outfit text-indigo-900 leading-none">Operational <span className="text-indigo-400">Panel</span></h3>
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Quick Actions</span>
                  </div>
                  
                  {/* Clinical Signal Box - Replaces empty space (Section A4) */}
                  <div className="flex-1 space-y-6 pt-4 overflow-y-auto no-scrollbar">
                     <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                              <Bell className="w-4 h-4" />
                           </div>
                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Shift Awareness</p>
                        </div>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed italic">Next multidisciplinary meeting at <span className="text-indigo-600">14:00</span>. Review Panel G3 spikes before release.</p>
                     </div>

                     <div className="p-6 bg-slate-900 rounded-3xl shadow-xl space-y-4 group">
                        <p className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.2em] leading-none mb-4">Protocol Watch</p>
                        <div className="space-y-3">
                           {[
                              "Validate Dexamethasone timing",
                              "Confirm Neutropenia alerts",
                              "Update Chemotherapy waitlist"
                           ].map(item => (
                              <div key={item} className="flex items-center gap-3">
                                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                 <p className="text-[11px] font-black text-slate-300 italic group-hover:text-white transition-colors">{item}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm shadow-indigo-50/20 mt-6">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Patient Protocol</p>
                     <p className="text-xs text-slate-600 leading-relaxed font-medium font-serif italic">Verify patient identity before logging proxy symptoms or updating medications.</p>
                  </div>
               </div>
            </aside>
          </div>
        </div>
      </div>
    </NavProvider>
  );
}
