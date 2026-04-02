import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { BarChart3, TrendingUp, Download, Share2, Activity, PieChart, LineChart, ChevronRight } from "lucide-react";
import { Role } from "@prisma/client";

export default async function ReportsPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
         <div className="space-y-2">
            <h1 className="text-5xl font-bold font-outfit tracking-tight text-slate-950 italic leading-none">
              Clinical <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Reporting</span>
            </h1>
            <p className="text-slate-500 font-medium italic opacity-80 pt-2">Advanced panel performance metrics and PRO-CTCAE outcome analysis.</p>
         </div>
         <div className="flex items-center gap-4">
            <Button className="h-14 px-8 bg-slate-950 text-white rounded-[24px] font-bold text-xs uppercase tracking-wider shadow-sm hover:scale-105 transition-all flex items-center gap-3">
               <Download className="w-4 h-4" /> Export Panel Data
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
            { label: 'Triage Efficiency', value: '94%', icon: Activity, color: 'indigo' },
            { label: 'Symptom Resolution', value: '4.2 Days', icon: TrendingUp, color: 'emerald' },
            { label: 'MD Response Time', value: '18m', icon: BarChart3, color: 'amber' },
            { label: 'Patient Retention', value: '99.1%', icon: Share2, color: 'rose' }
         ].map((stat, i) => (
            <GlassCard key={i} className="hover:bg-white border-white/50 shadow-sm !p-8 transition-transform group hover:-translate-y-1">
               <stat.icon className={`w-8 h-8 text-${stat.color}-600 mb-6`} />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
               <h4 className="text-3xl font-bold font-outfit text-slate-950 tracking-tighter">{stat.value}</h4>
            </GlassCard>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <GlassCard className="!p-8 rounded-[48px] border-white/50 bg-slate-950 text-white space-y-10 shadow-sm shadow-slate-900/40">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-bold font-outfit italic tracking-tight text-white border-b-2 border-indigo-500 pb-2">Toxicity Distribution (G3+)</h3>
               <PieChart className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="space-y-6">
               {[
                  { name: 'Nausea / Vomiting', value: 45, color: 'bg-indigo-500' },
                  { name: 'Neuropathy', value: 28, color: 'bg-emerald-500' },
                  { name: 'Hematological', value: 18, color: 'bg-amber-500' },
                  { name: 'Cardiac Events', value: 9, color: 'bg-rose-500' }
               ].map(item => (
                  <div key={item.name} className="space-y-2">
                     <div className="flex justify-between text-xs font-bold uppercase text-indigo-100/50 tracking-wider">
                        <span>{item.name}</span>
                        <span>{item.value}%</span>
                     </div>
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} w-[${item.value}%]`} style={{ width: `${item.value}%` }} />
                     </div>
                  </div>
               ))}
            </div>
         </GlassCard>

         <div className="space-y-8">
            <h3 className="text-2xl font-bold font-outfit italic tracking-tight text-slate-900 border-b-2 border-indigo-100 pb-2">Panel Longitudinal Trends</h3>
            <div className="grid grid-cols-1 gap-6">
               {[
                  { title: 'Quality of Life Index', trend: '+12%', color: 'emerald' },
                  { title: 'Emergency Room Re-admissions', trend: '-8%', color: 'indigo' },
                  { title: 'Medication Adherence (Self-log)', trend: '+4%', color: 'indigo' }
               ].map((card, i) => (
                  <GlassCard key={i} className="hover:bg-white border-white/50 !p-8 group hover:border-indigo-100 transition-all cursor-pointer">
                     <div className="flex items-center justify-between">
                        <div>
                           <h4 className="text-lg font-bold font-outfit text-slate-900 group-hover:text-indigo-600 transition-colors">{card.title}</h4>
                           <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mt-1">Trailing 90 Days</p>
                        </div>
                        <div className={`text-${card.color}-600 font-bold text-xl italic  transition-transform`}>{card.trend}</div>
                     </div>
                  </GlassCard>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
