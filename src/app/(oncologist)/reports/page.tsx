import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Bell, 
  Clock, 
  Activity, 
  Download, 
  Calendar, 
  Search, 
  Filter, 
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Role } from "@prisma/client";

/**
 * Reports & Analytics - Screen 8.
 * Population-level view of clinical outcomes and trends.
 */
export default async function ReportsPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  const SummaryCard = ({ title, value, label, trend, trendValue, colorClass }: any) => (
    <GlassCard className="transition-all ">
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">{title}</p>
       <div className="flex items-baseline gap-2">
          <h3 className={`text-4xl font-bold font-outfit ${colorClass || "text-slate-900"}`}>{value}</h3>
          <span className="text-xs font-bold text-slate-500">{label}</span>
       </div>
       <div className="flex items-center gap-1 mt-4">
          <div className={`p-1 rounded ${trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
             {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          </div>
          <span className={`text-[10px] font-bold ${trend === 'up' ? "text-emerald-500" : "text-rose-500"}`}>{trendValue}%</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase ml-2 tracking-tighter">vs last month</span>
       </div>
    </GlassCard>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Analytics Header (Section 10) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-4xl font-bold font-outfit tracking-tight">Clinical <span className="text-indigo-600">Analytics</span></h1>
           <p className="text-slate-500 mt-2">Aggregate population-level insights for your panel.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="h-10 px-4 gap-2 font-bold text-xs border-slate-100 hover:bg-slate-50">
              <Download className="w-4 h-4" /> Export Panel CSV
           </Button>
           <Button variant="secondary" size="sm" className="h-10 px-6 gap-2 bg-slate-950 hover:bg-black font-bold">
              <BarChart3 className="w-4 h-4" /> Full Outcome Report
           </Button>
        </div>
      </div>

      {/* Date Range Selector (Section 10) */}
      <GlassCard className="!p-1 border-slate-100 flex items-center bg-white w-fit">
         <Button variant="ghost" size="sm" className="h-8 px-4 text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50/50">Last 30 Days</Button>
         <Button variant="ghost" size="sm" className="h-8 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600">60 Days</Button>
         <Button variant="ghost" size="sm" className="h-8 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600">90 Days</Button>
         <Button variant="ghost" size="sm" className="h-8 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600">All Time</Button>
      </GlassCard>

      {/* Panel Overview Row (Section 10) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <SummaryCard title="Active Panel" value="42" label="Patients" trend="up" trendValue={8} />
         <SummaryCard title="Wellness Avg" value="7.4" label="/ 10.0" trend="up" trendValue={12} colorClass="text-emerald-600" />
         <SummaryCard title="Alert Volume" value="112" label="Alerts" trend="down" trendValue={5} colorClass="text-rose-600" />
         <SummaryCard title="Triage Time" value="1.8" label="Hours" trend="up" trendValue={4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Symptom Burden Chart (Section 10) - Mock Implementation */}
         <GlassCard className="!p-8 border-slate-100 shadow-sm relative overflow-hidden group">
            <h4 className="text-xl font-bold font-outfit mb-8">Average Symptom Burden</h4>
            <div className="space-y-6">
               {[
                  { name: "Fatigue", grade: 2.8, patients: 38, color: "bg-amber-400" },
                  { name: "Nausea", grade: 2.1, patients: 24, color: "bg-emerald-400" },
                  { name: "Pain", grade: 1.8, patients: 15, color: "bg-emerald-400" },
                  { name: "Anxiety", grade: 3.4, patients: 32, color: "bg-rose-400" },
                  { name: "Loss of Appetite", grade: 1.4, patients: 12, color: "bg-slate-200" }
               ].map((sym, i) => (
                  <div key={i} className="space-y-2 group cursor-pointer">
                     <div className="flex justify-between items-baseline">
                         <span className="text-xs font-bold text-slate-800">{sym.name}</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{sym.patients} Patients reporting</span>
                     </div>
                     <div className="h-4 w-full bg-slate-50 rounded-full border border-slate-100 overflow-hidden relative">
                        <div className={`h-full ${sym.color} transition-all duration-1000 group-hover:opacity-90`} style={{ width: `${(sym.grade/4)*100}%` }} />
                        <span className="absolute inset-y-0 left-2 flex items-center text-[9px] font-bold uppercase text-white drop-shadow-sm tracking-tight leading-none">Grade Avg: {sym.grade}</span>
                     </div>
                  </div>
               ))}
            </div>
            <div className="mt-12 flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl border-dashed">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Trend Insight</p>
               <p className="text-xs font-medium text-slate-600">Anxiety markers +14% vs previous cycle (expected pre-restaging)</p>
            </div>
         </GlassCard>

         {/* Alert Response Report (Section 10) */}
         <GlassCard className="!p-0 border-slate-100 shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
               <h4 className="text-xl font-bold font-outfit">Alert Lifecycle Audit</h4>
               <Button variant="ghost" size="sm" className="h-8 !px-3 font-bold text-indigo-600 hover:bg-indigo-50">View Details</Button>
            </div>
            <div className="divide-y divide-slate-50">
               {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className={`w-1.5 h-10 rounded-full ${i % 3 === 0 ? "bg-rose-500" : "bg-emerald-500"}`} />
                        <div>
                           <p className="text-sm font-bold text-slate-900 leading-none">Emergency Threshold Breach</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Patient MRN-982312 • Grade 4 Nausea</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-bold text-slate-800">1.2h Triage</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Acknowledged by Nurse</p>
                     </div>
                  </div>
               ))}
            </div>
         </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {/* Education Engagement Chart Stub */}
         <GlassCard className="bg-indigo-600 text-white border-0 shadow-sm shadow-indigo-500/20">
            <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider mb-4">Patient Education Hub</p>
            <div className="flex items-center gap-6">
               <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90">
                     <circle className="text-white/10" strokeWidth="6" stroke="currentColor" fill="transparent" r="44" cx="48" cy="48" />
                     <circle className="text-emerald-400" strokeWidth="6" strokeDasharray="276" strokeDashoffset="55" strokeLinecap="round" stroke="currentColor" fill="transparent" r="44" cx="48" cy="48" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-2xl font-bold">82%</span>
                  </div>
               </div>
               <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-tight">Active Engagement</p>
                  <p className="text-[10px] text-white/70">38 patients actively completing learning paths this week.</p>
               </div>
            </div>
         </GlassCard>
      </div>
    </div>
  );
}
