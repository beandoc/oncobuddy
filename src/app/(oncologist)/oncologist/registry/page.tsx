import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { Search, Filter, Database, FileText, Share2, Download, Table, ChevronRight, Activity } from "lucide-react";
import { Role } from "@prisma/client";

/**
 * Institutional Clinical Registry - Registry Explorer.
 * Professional-grade research and case inventory terminal.
 */
export default async function RegistryPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  // Fetch institutional registry metadata (Section 12)
  const institution = await prisma.institution.findFirst({
    where: { id: session.user.institutionId || undefined }
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Registry Terminal Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
         <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.4)]" />
               <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] font-serif">Registry Sync: Online</span>
            </div>
            <h1 className="text-5xl font-black font-outfit tracking-tight text-slate-950 italic italic leading-none">
              Institutional <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Registry</span>
            </h1>
            <p className="text-slate-500 font-medium italic italic opacity-80 pt-2">Full-fidelity case inventory and oncological tracking for {institution?.institutionName || "Clinical Network"}.</p>
         </div>
         <div className="flex items-center gap-4">
            <Button className="h-14 px-8 bg-indigo-600 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
               <Database className="w-4 h-4" /> Global Search
            </Button>
            <Button variant="outline" className="h-14 px-8 rounded-[24px] border-slate-100 bg-white hover:bg-slate-50 font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <Download className="w-4 h-4" /> Export SEER
            </Button>
         </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <GlassCard className="!p-4 bg-white/80 border-white/50 shadow-xl rounded-[32px]">
         <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Query Registry by MRN, Histology, or Biomarker (e.g. HER2+)..." 
                  className="w-full h-16 pl-16 pr-6 rounded-2xl bg-slate-50/50 border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none transition-all font-medium text-slate-900"
               />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
               <Button variant="outline" className="h-16 px-8 rounded-2xl bg-white border-slate-100 group">
                  <Filter className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
               </Button>
               <Button className="h-16 px-10 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Execute Search</Button>
            </div>
         </div>
      </GlassCard>

      {/* 3. Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
            { label: 'Registered Cases', value: '14,202', icon: FileText, color: 'indigo' },
            { label: 'Active Surveillance', value: '482', icon: Activity, color: 'emerald' },
            { label: 'Clinical Trials', value: '28', icon: Share2, color: 'amber' },
            { label: 'Reporting Rate', value: '98.4%', icon: Table, color: 'rose' }
         ].map((stat, i) => (
            <GlassCard key={i} className="hover:bg-white transition-all border-white/50 !p-8">
               <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-6 border border-${stat.color}-100`}>
                  <stat.icon className="w-6 h-6" />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <h4 className="text-3xl font-black font-outfit text-slate-950 tracking-tighter">{stat.value}</h4>
            </GlassCard>
         ))}
      </div>

      {/* 4. Empty State / Terminal View */}
      <div className="p-32 text-center bg-slate-50/50 rounded-[64px] border-2 border-dashed border-slate-100 relative overflow-hidden group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100/20 via-transparent to-transparent opacity-50 group-hover:scale-150 transition-transform duration-1000" />
         <div className="relative z-10 space-y-8">
            <div className="w-24 h-24 bg-white border-2 border-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-100/50 group-hover:rotate-12 transition-transform">
               <Database className="w-10 h-10" />
            </div>
            <div className="max-w-md mx-auto space-y-4">
               <h3 className="text-3xl font-black font-outfit text-slate-900 italic italic tracking-tight">Access Restricted to <span className="text-indigo-600">Institutional PI</span></h3>
               <p className="text-slate-500 font-medium italic opacity-70">Global registry access requires Primary Investigator authorization. Please use the "My Patients" portal for direct clinical care.</p>
            </div>
            <div className="pt-6">
               <Button className="h-14 px-10 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-950 transition-all">Submit Access Token</Button>
            </div>
            <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.5em] pt-12">Compliance standard: ICD-O-3 | SEER-18 | DPDPA</p>
         </div>
      </div>
    </div>
  );
}
