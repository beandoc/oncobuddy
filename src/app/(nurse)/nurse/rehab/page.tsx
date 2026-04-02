import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  MoveUpRight,
  Dumbbell,
  Apple
} from "lucide-react";
import Link from "next/link";

/**
 * Rehab Tracker Dashboard - Nurse Portal.
 * High-fidelity monitoring of patient compliance across physical and nutritional tracks.
 */
export default async function RehabTrackerPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.NURSE) redirect("/login");

  // Fetching live data for assigned patients
  const patients = await prisma.patient.findMany({
    where: { 
        endedAt: null 
    },
    include: {
      user: true,
      symptomLogs: { take: 1, orderBy: { logDate: 'desc' } }
    },
    take: 8
  });

  // Mocked analytics for the Vanguard UI
  const metrics = [
    { label: "Overall Compliance", value: "84%", trend: "+12%", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Physical Activity", value: "62/80", trend: "+5", icon: Dumbbell, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Nutritional Adherence", value: "192", trend: "High", icon: Apple, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Pending Reviews", value: "12", trend: "-2", icon: Clock, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-4xl font-black font-outfit text-slate-900 tracking-tight italic">Rehabilitation <span className="text-indigo-600">Analytics</span></h1>
            <p className="text-sm font-bold text-slate-600">Cross-domain compliance monitoring for assigned clinical panels.</p>
         </div>
         <div className="flex items-center gap-3">
            <Button variant="outline" className="h-12 border-slate-200 text-slate-800 font-black text-xs uppercase tracking-widest gap-2">
                <Calendar className="w-4 h-4" /> Export Report
            </Button>
            <Button className="h-12 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest gap-2 shadow-xl hover:scale-105 transition-all">
                Update Protocol
            </Button>
         </div>
      </div>

      {/* Metric Overlay - High Contrast Labels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {metrics.map((m) => (
           <GlassCard key={m.label} className="!p-6 border-slate-100 hover:border-indigo-100 transition-all group">
              <div className="flex items-center justify-between mb-4">
                 <div className={`w-12 h-12 rounded-2xl ${m.bg} flex items-center justify-center ${m.color}`}>
                    <m.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                 </div>
                 <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">{m.trend}</span>
              </div>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1 opacity-70">{m.label}</p>
              <h3 className="text-3xl font-black font-outfit text-slate-900 italic">{m.value}</h3>
           </GlassCard>
         ))}
      </div>

      {/* Main Trackers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Patient Compliance Inventory */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black font-outfit text-slate-900 italic">Compliance <span className="text-indigo-600">Watchlist</span></h2>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Monitoring</span>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-900 uppercase tracking-widest">Patient Details</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-900 uppercase tracking-widest">Physical Adherence</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-900 uppercase tracking-widest">Nutritional Log</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-900 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {patients.map((p: any) => (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm font-black text-slate-400 flex items-center justify-center">
                                      {p.user.image ? <img src={p.user.image} className="w-full h-full object-cover" /> : p.preferredName?.charAt(0)}
                                   </div>
                                   <div>
                                      <p className="text-sm font-black text-slate-900 leading-none mb-1">{p.preferredName || p.user.firstName}</p>
                                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter italic">MRN: {p.mrn}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-500" style={{ width: '74%' }} />
                                   </div>
                                   <span className="text-xs font-black text-emerald-600">74%</span>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 italic">
                                   <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                   Logged Today
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <Link href={`/nurse/patients/${p.publicId}`}>
                                    <button className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </Link>
                             </td>
                          </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>

         {/* Insights & Interventions */}
         <div className="space-y-8">
            <h2 className="text-2xl font-black font-outfit text-slate-900 italic">Task <span className="text-rose-600">Interventions</span></h2>
            
            <GlassCard className="bg-slate-900 border-0 shadow-2xl !p-8 rounded-[36px] text-white space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Efficiency Gain</p>
                        <h4 className="text-xl font-black italic">Recovery IQ</h4>
                    </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-medium italic">Your assigned patients are showing an average compliance increase of <span className="text-indigo-400 font-black">12.4%</span> this week. Recommend updating Physical Therapy thresholds for stabilized cases.</p>
                <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl">Batch Update Limits</Button>
            </GlassCard>

            {/* Quick Filter / Categorization */}
            <div className="space-y-4">
               <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] ml-2">Monitor Filters</p>
               <div className="grid grid-cols-1 gap-2">
                  <button className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-slate-50 hover:border-indigo-100 transition-all">
                     <span className="text-sm font-black text-slate-900 italic">High Intensity Track</span>
                     <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">12</span>
                  </button>
                  <button className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-slate-50 hover:border-amber-100 transition-all opacity-60">
                     <span className="text-sm font-black text-slate-900 italic">Nutritional Watch</span>
                     <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">4</span>
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
