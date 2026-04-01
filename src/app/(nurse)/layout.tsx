import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import NurseSidebar from "@/components/layout/NurseSidebar";
import NurseTopbar from "@/components/layout/NurseTopbar";

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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Fixed Sidebar (Section A2) */}
      <NurseSidebar />

      {/* Main Content Area (Section A1) */}
      <div className="flex-1 ml-72 flex flex-col h-screen overflow-hidden">
        {/* Persistent Topbar (Section A1) */}
        <NurseTopbar />

        <div className="flex-1 flex overflow-hidden">
          {/* Central Scrollable Dashboard (Section A1) */}
          <main className="flex-1 overflow-y-auto no-scrollbar pt-16 px-8 py-8 h-full bg-white transition-all">
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
                
                {/* Contextual Placeholder (Section A4) */}
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 select-none pb-20">
                   <div className="w-16 h-16 rounded-full bg-slate-200 mb-4 flex items-center justify-center font-black text-2xl text-slate-400">!</div>
                   <p className="text-sm font-bold text-slate-400">Select a patient or alert<br/><span className="text-[10px] uppercase font-black">To begin operational notes</span></p>
                </div>
                
                <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm shadow-indigo-50/20">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">On-Shift Protocol</p>
                   <p className="text-xs text-slate-600 leading-relaxed font-medium">Verify patient identity before logging proxy symptoms or updating medications.</p>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
