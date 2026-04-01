import { OncologistSidebar } from "@/components/layout/OncologistSidebar";
import { OncologistTopbar } from "@/components/layout/OncologistTopbar";

export default function OncologistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-inter">
      {/* 🟢 Column 1: Fixed Left Sidebar (288px) */}
      <OncologistSidebar />

      {/* 🔲 Column 2: Main Working Area (Fluid) */}
      <main className="flex-1 ml-72 flex flex-col relative">
        {/* Topbar persists across all clinical sub-pages */}
        <OncologistTopbar title="Dashboard Overview" />

        {/* Scrollable Clinical Content */}
        <div className="p-8 pb-20 max-w-[1600px] w-full mx-auto">
          {children}
        </div>
      </main>

      {/* 🔴 Column 3: Contextual Right Panel (320px Fixed Overlay) */}
      {/* This will be controlled via clinical-ui context in Phase 2 */}
      <aside className="fixed right-0 top-0 h-screen w-80 bg-white border-l border-slate-100 z-50 transform translate-x-full transition-transform duration-300 shadow-2xl overflow-y-auto">
         {/* Detail view content goes here */}
         <div className="p-10 text-center text-slate-400 italic">
            Patient Quick-View Context
         </div>
      </aside>
    </div>
  );
}
