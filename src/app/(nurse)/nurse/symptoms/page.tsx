import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2 
} from "lucide-react";
import { Button, GlassCard } from "@/components/ui/core";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Nurse Symptom Overview - Screen 6.
 * Aggregate monitoring hub for all assigned patients.
 * Features the Patient-Symptom Heatmap (Section A6) for proactive triage.
 */
export default async function NurseSymptomOverview() {
  const session = await auth();
  if (!session || session.user.role !== Role.NURSE) redirect("/login");

  const symptoms = ["Fatigue", "Pain", "Nausea", "Appetite", "Sleep", "Anxiety", "Bowel", "Shortness", "Skin", "Neuropathy"];

  // Mock Patient Data for Heatmap (Section A6)
  const heatmapData = [
     { name: "Patient MRN-982312", grades: [2, 1, 3, 0, 1, 3, 1, 0, 0, 0], spike: true },
     { name: "Patient MRN-112093", grades: [3, 0, 1, 2, 2, 0, 0, 0, 0, 2], spike: false },
     { name: "Patient MRN-449102", grades: [1, 2, 0, 0, 3, 1, 0, 1, 0, 1], spike: false },
     { name: "Patient MRN-009218", grades: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0], spike: false },
     { name: "Patient MRN-882103", grades: [4, 3, 2, 1, 3, 4, 1, 2, 0, 0], spike: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Symptom Header (Section A6) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <h1 className="text-4xl font-bold font-outfit tracking-tight">Symptom <span className="text-indigo-600">Surveillance</span></h1>
            <p className="text-slate-500 mt-2 font-medium">Aggregate shift-handover monitoring grid.</p>
         </div>
         <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-10 px-4 gap-2 font-bold text-[10px] uppercase tracking-widest border-slate-100">
               <Download className="w-3.5 h-3.5" /> Export Heatmap
            </Button>
            <Button variant="secondary" className="h-10 px-6 gap-2 bg-indigo-600 hover:bg-slate-950 font-bold text-xs shadow-lg">
               <Activity className="w-4 h-4" /> Proactive Review
            </Button>
         </div>
      </div>

      {/* Patient-Symptom Heatmap (Section A6) */}
      <GlassCard className="!p-0 border-slate-100 overflow-hidden shadow-md">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
               Panel Clinical Heatmap
               <span className="text-[10px] uppercase font-black text-rose-500 animate-pulse ml-2">Live Data</span>
            </h3>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Grade 0-1</div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase"><div className="w-2 h-2 rounded-full bg-amber-500" /> Grade 2</div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase"><div className="w-2 h-2 rounded-full bg-rose-500" /> Grade 3-4</div>
            </div>
         </div>
         <div className="overflow-x-auto p-6 pt-2">
            <table className="w-full text-left table-fixed min-w-[1000px]">
               <thead>
                  <tr>
                     <th className="w-56 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Identity</th>
                     {symptoms.map(s => (
                        <th key={s} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-tight">{s}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {heatmapData.map(p => (
                     <tr key={p.name} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pr-4">
                           <div className="flex items-center gap-2">
                              {p.spike && <div className="w-2 h-2 rounded-full bg-rose-600 ring-4 ring-rose-100 animate-pulse flex-shrink-0" title="Recent Spike detected" />}
                              <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate transition-colors">{p.name}</p>
                           </div>
                        </td>
                        {p.grades.map((g, i) => (
                           <td key={i} className="py-2 px-1">
                              <div 
                                className={`w-full aspect-square md:h-10 rounded-lg flex items-center justify-center font-bold text-[10px] transition-all hover:scale-110 cursor-pointer ${
                                   g === 0 ? "bg-slate-50 text-slate-300" :
                                   g <= 1 ? "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm shadow-emerald-100/20" :
                                   g === 2 ? "bg-amber-50 text-amber-600 border border-amber-100 shadow-sm shadow-amber-100/20" :
                                   "bg-rose-50 text-rose-600 border border-rose-100 shadow-sm shadow-rose-100/20"
                                }`}
                              >
                                 {g > 0 ? g : "-"}
                              </div>
                           </td>
                        ))}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </GlassCard>

      {/* Aggregate Spike Tracker (Section A6) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <GlassCard className="border-rose-100 bg-rose-50/20">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] mb-4">Urgent Spike Detected</p>
            <div className="flex items-start gap-4">
               <TrendingUp className="w-8 h-8 text-rose-600 flex-shrink-0" />
               <div>
                  <h4 className="text-lg font-bold font-outfit leading-tight italic text-rose-900">Anxiety markers +14%</h4>
                  <p className="text-xs text-rose-700/70 mt-2 font-medium">Aggregated across 32 patients this shift. Potential pre-restaging pattern.</p>
               </div>
            </div>
         </GlassCard>
         
         <GlassCard className="border-emerald-100 bg-emerald-50/20">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">Positive Trend</p>
            <div className="flex items-start gap-4">
               <TrendingDown className="w-8 h-8 text-emerald-600 flex-shrink-0" />
               <div>
                  <h4 className="text-lg font-bold font-outfit leading-tight italic text-emerald-900">Nausea Average -22%</h4>
                  <p className="text-xs text-emerald-700/70 mt-2 font-medium">Following the education path update for anti-emetic protocols.</p>
               </div>
            </div>
         </GlassCard>

         <GlassCard className="border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex flex-col gap-2">
               <h4 className="text-lg font-bold font-outfit">Missing Log Tracker</h4>
               <p className="text-xs text-slate-500 font-medium italic">8 patients without submission in 24h.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
               8
            </div>
         </GlassCard>
      </div>

      {/* Symptom Lifecycle Audit (Section A6) */}
      <GlassCard className="bg-slate-950 text-white border-0 shadow-2xl relative overflow-hidden">
         <div className="absolute right-0 top-0 bottom-0 w-64 opacity-5 bg-gradient-to-l from-indigo-500 to-transparent" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
               <h3 className="text-2xl font-bold font-outfit tracking-tight leading-none italic">Symptom Recovery Dashboard</h3>
               <p className="text-xs text-slate-400 font-medium">Shift handover protocol for Nurse Navigator Team.</p>
            </div>
            <div className="flex items-center gap-12">
               <div className="text-center">
                  <p className="text-[34px] font-black font-outfit leading-none mb-2">12.5</p>
                  <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">Avg Triage Speed (m)</p>
               </div>
               <div className="text-center">
                  <p className="text-[34px] font-black font-outfit leading-none mb-2 text-emerald-400">92%</p>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Response Success</p>
               </div>
            </div>
         </div>
      </GlassCard>
    </div>
  );
}
