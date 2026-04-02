import { auth } from "@/lib/auth";
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2,
  ChevronRight,
  ClipboardList
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
     { mrn: "982312", name: "MICHAEL SCOTT", grades: [2, 1, 3, 0, 1, 3, 1, 0, 0, 0], spike: true },
     { mrn: "112093", name: "SARAH SMITH", grades: [3, 0, 1, 2, 2, 0, 0, 0, 0, 2], spike: false },
     { mrn: "449102", name: "ROBERT BROWN", grades: [1, 2, 0, 0, 3, 1, 0, 1, 0, 1], spike: false },
     { mrn: "009218", name: "DWIGHT SCHRUTE", grades: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0], spike: false },
     { mrn: "882103", name: "SARAH WILLIAMS", grades: [4, 3, 2, 1, 3, 4, 1, 2, 0, 0], spike: true },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* Symptom Header (Section A6) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
         <div className="space-y-1">
            <h1 className="text-5xl font-black font-outfit tracking-tight text-slate-900 italic italic">Toxicity <span className="text-indigo-600 underline underline-offset-8 decoration-indigo-100">Surveillance</span></h1>
            <p className="text-base font-bold text-slate-600 italic">Institutional clinical monitoring grid for {session.user.name}.</p>
         </div>
         <div className="flex items-center gap-3">
            <Button variant="outline" className="h-12 px-6 gap-2 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 hover:bg-slate-50">
               <Download className="w-4 h-4" /> Export Panel
            </Button>
            <Button className="h-12 px-8 bg-slate-950 text-white font-black text-[11px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
               <Activity className="w-5 h-5 mr-2" /> Proactive Analysis
            </Button>
         </div>
      </div>

      {/* Analytical Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <GlassCard className="!p-8 border-rose-100 bg-rose-50/20 rounded-[40px] shadow-sm group">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.3em] mb-4 italic italic flex items-center gap-2 animate-pulse"><div className="w-2 h-2 rounded-full bg-rose-600" /> Critical Spike</p>
            <div className="flex items-start gap-6">
               <TrendingUp className="w-10 h-10 text-rose-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
               <div className="space-y-2">
                  <h4 className="text-xl font-black font-outfit leading-tight italic text-rose-950 uppercase">Anxiety markers +14%</h4>
                  <p className="text-xs text-rose-700/70 font-bold italic">Aggregated across 32 patients this operational window. Restaging pattern detected.</p>
               </div>
            </div>
         </GlassCard>
         
         <GlassCard className="!p-8 border-emerald-100 bg-emerald-50/20 rounded-[40px] shadow-sm group">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4 italic flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-600" /> Panel Recovery</p>
            <div className="flex items-start gap-6">
               <TrendingDown className="w-10 h-10 text-emerald-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
               <div className="space-y-2">
                  <h4 className="text-xl font-black font-outfit leading-tight italic text-emerald-950 uppercase">Nausea Average -22%</h4>
                  <p className="text-xs text-emerald-700/70 font-bold italic">Following institutional update for anti-emetic protocols last Friday.</p>
               </div>
            </div>
         </GlassCard>

         <GlassCard className="!p-8 border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-all rounded-[40px] shadow-sm">
            <div className="flex flex-col gap-2">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Log Latency</p>
               <h4 className="text-xl font-black font-outfit text-slate-900 italic uppercase">Missing Submissions</h4>
               <p className="text-xs text-slate-500 font-bold italic">8 patients haven not reported in 24h.</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-xl group-hover:scale-110 transition-all">
               8
            </div>
         </GlassCard>
      </div>

      {/* Patient-Symptom Heatmap (Section A6) */}
      <GlassCard className="!p-0 border-slate-200 overflow-hidden shadow-2xl rounded-[48px] bg-white">
         <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-2xl font-black font-outfit italic text-slate-900 flex items-center gap-4 uppercase">
               Clinical Heatmap
               <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse border border-rose-100 shadow-sm">Live Monitoring</span>
            </h3>
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" /> Grade 0-1</div>
               <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-200" /> Grade 2</div>
               <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none"><div className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-sm shadow-rose-200" /> Grade 3-4</div>
            </div>
         </div>
         <div className="overflow-x-auto p-10 custom-scrollbar">
            <table className="w-full text-left table-fixed min-w-[1200px]">
               <thead>
                  <tr>
                     <th className="w-72 py-6 text-[11px] font-black text-slate-950 uppercase tracking-[0.2em] italic">Patient Identity</th>
                     {symptoms.map(s => (
                        <th key={s} className="py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{s}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {heatmapData.map(p => (
                     <tr key={p.mrn} className="group hover:bg-slate-50/50 transition-all">
                        <td className="py-8 pr-8">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-200 flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                 {p.name.charAt(0)}
                              </div>
                              <div className="space-y-1">
                                 <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors italic leading-none">{p.name}</p>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic leading-none">MRN-{p.mrn}</p>
                              </div>
                              {p.spike && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 ml-auto animate-pulse" />}
                           </div>
                        </td>
                        {p.grades.map((g, i) => (
                           <td key={i} className="py-4 px-1.5 focus:outline-none">
                              <div 
                                className={`w-full aspect-square xl:h-12 rounded-2xl flex items-center justify-center font-black text-xs transition-all hover:scale-110 cursor-pointer shadow-sm group-hover:shadow-md ${
                                   g === 0 ? "bg-slate-50/30 text-slate-200 border border-slate-50" :
                                   g <= 1 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                   g === 2 ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                   "bg-rose-600 text-white border border-rose-500"
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

      {/* Compliance Insight Stripe */}
      <GlassCard className="bg-slate-950 text-white border-0 shadow-2xl rounded-[48px] overflow-hidden group p-10 relative cursor-default">
         <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-transparent opacity-50" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4">
               <h3 className="text-3xl font-black font-outfit italic italic leading-none tracking-tight">Institutional Protocol Accuracy</h3>
               <p className="text-sm text-slate-400 font-bold italic leading-relaxed max-w-2xl">
                  Historical analysis shows a 12.5m average triage response for consecutive Grade 3 breaches. Handover success rate is currently 92%.
               </p>
            </div>
            <div className="flex items-center gap-12 flex-shrink-0">
               <div className="text-center group-hover:translate-y-[-4px] transition-transform">
                  <p className="text-[42px] font-black font-outfit leading-none mb-2 text-indigo-400">12.5m</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Triage Velocity</p>
               </div>
               <div className="text-center group-hover:translate-y-[-4px] transition-transform delay-75">
                  <p className="text-[42px] font-black font-outfit leading-none mb-2 text-emerald-400">92%</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Panel Stability</p>
               </div>
            </div>
         </div>
         <ClipboardList className="absolute bottom-[-50px] left-[-50px] w-80 h-80 text-white/5 -rotate-12 group-hover:scale-110 transition-transform duration-1000" />
      </GlassCard>
    </div>
  );
}
