import { OncologistSidebar } from "@/components/layout/OncologistSidebar";
import { OncologistTopbar } from "@/components/layout/OncologistTopbar";
import { NavProvider } from "@/lib/nav-context";

export default function OncologistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavProvider>
      <div className="min-h-screen bg-slate-50 flex font-inter">
        {/* 🟢 Column 1: Left Sidebar (Fixed 288px) */}
        <OncologistSidebar />

        {/* 🔲 Column 2: Main Working Area (Fluid) */}
        <main className="flex-1 lg:ml-72 flex flex-col relative w-full">
          {/* Topbar persists across all clinical sub-pages */}
          <OncologistTopbar title="Clinical Navigator" />

          {/* Scrollable Clinical Content */}
          <div className="p-4 md:p-12 pb-32 max-w-[1600px] w-full mx-auto">
            <div className="reveal-content">
              {children}
            </div>
          </div>
        </main>

        {/* 🔴 Column 3: Contextual Right Panel (320px Fixed Overlay) */}
        {/* Hidden on mobile, controlled via clinical-ui context in Phase 2 */}
        <aside className="fixed right-0 top-0 h-screen w-80 bg-white border-l border-slate-100 z-50 transform translate-x-full transition-transform duration-300 shadow-2xl overflow-y-auto hidden lg:block">
           <div className="p-10 text-center text-slate-400 italic">
              Patient Quick-View Context
           </div>
        </aside>
      </div>
    </NavProvider>
  );
}
