import { BookOpen, Search, Filter, Play, CheckCircle2, Clock, ChevronRight, Award, Plus, BarChart3, TrendingUp } from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Nurse Education Progress Terminal.
 * Tracking patient engagement with clinical protocols and instructional media.
 */
export default async function NurseEducationPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.NURSE) redirect("/login");

  const patients = [
    { name: "John Doe", progress: 85, activeModule: "Chemo Day 1 Survival", lastActivity: "2h ago", status: "Advanced" },
    { name: "Sarah Smith", progress: 20, activeModule: "Pre-Medication Intro", lastActivity: "1d ago", status: "Stalled" },
    { name: "Robert Brown", progress: 55, activeModule: "Supportive Care Diet", lastActivity: "5h ago", status: "On-Track" },
    { name: "Dwight Schrute", progress: 98, activeModule: "End-of-Cycle Tapering", lastActivity: "4m ago", status: "Near Completion" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* Header Architecture */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
         <div className="space-y-1">
            <h1 className="text-5xl font-black font-outfit tracking-tight text-slate-900 italic italic">Engagement <span className="text-indigo-600 underline underline-offset-8 decoration-indigo-100">Tracker</span></h1>
            <p className="text-base font-bold text-slate-600 italic mt-2">Monitoring clinical education compliance for {patients.length} patients.</p>
         </div>
         <div className="flex items-center gap-3">
            <Button variant="outline" className="h-12 px-6 gap-2 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 hover:bg-slate-50">
               <Filter className="w-4 h-4" /> Filter Vector
            </Button>
            <Button className="h-12 px-8 bg-slate-950 text-white font-black text-[11px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
               <Plus className="w-5 h-5 mr-2" /> Assign Module
            </Button>
         </div>
      </div>

      {/* Analytical Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
         <GlassCard className="!p-8 bg-indigo-600 text-white border-0 shadow-2xl rounded-[40px] relative overflow-hidden group">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 italic">Institutional Lead</p>
            <h4 className="text-3xl font-black font-outfit italic">68% <span className="text-indigo-200">Completion</span></h4>
            <div className="mt-6 flex items-center gap-2 group-hover:gap-4 transition-all">
               <p className="text-[10px] font-black uppercase tracking-widest leading-none">+12% vs National Average</p>
               <TrendingUp className="w-3.5 h-3.5 opacity-80" />
            </div>
            <BarChart3 className="absolute bottom-[-10px] right-[-10px] w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-700" />
         </GlassCard>

         <GlassCard className="!p-8 bg-white border-slate-100 shadow-sm rounded-[40px] flex items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner relative"><Award className="w-8 h-8" /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Learners</p>
               <p className="text-2xl font-black font-outfit text-slate-900 border-b-2 border-emerald-100 pb-1 italic italic">24 / 32</p>
            </div>
         </GlassCard>

         <GlassCard className="!p-8 bg-white border-slate-100 shadow-sm rounded-[40px] flex items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner relative"><Clock className="w-8 h-8 font-black" /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Attention Gap</p>
               <p className="text-2xl font-black font-outfit text-rose-600 border-b-2 border-rose-100 pb-1 italic italic">8 Patients</p>
               <p className="text-[9px] font-black uppercase text-rose-400 mt-2 tracking-tighter italic">Low Progress in 72h</p>
            </div>
         </GlassCard>
      </div>

      {/* Engagement Queue */}
      <div className="space-y-8 pt-6">
         <h3 className="text-2xl font-black font-outfit text-slate-900 italic">Patient <span className="text-slate-400">Status</span></h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patients.map((p) => (
               <GlassCard key={p.name} className="!p-0 border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group rounded-[40px]">
                  <div className="p-10 space-y-8">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-200 text-2xl relative overflow-hidden group-hover:scale-105 transition-all">
                              {p.name.charAt(0)}
                              <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors" />
                           </div>
                           <div>
                              <p className="text-lg font-black text-slate-900 italic uppercase leading-none">{p.name}</p>
                              <div className={`mt-2 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-block ${p.status === 'Advanced' ? 'bg-indigo-50 text-indigo-600' : p.status === 'Stalled' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                 {p.status}
                              </div>
                           </div>
                        </div>
                        <Button variant="ghost" className="w-10 h-10 !p-0 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all border border-slate-100 group-hover:border-indigo-200"><ChevronRight className="w-5 h-5 group-hover:text-indigo-600" /></Button>
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">{p.activeModule}</p>
                           <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">{p.progress}% Complete</p>
                        </div>
                        <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                           <div className={`h-full rounded-full transition-all duration-1000 ${p.progress > 80 ? 'bg-indigo-600 shadow-sm shadow-indigo-200' : p.progress > 50 ? 'bg-emerald-500 shadow-sm shadow-emerald-200' : 'bg-rose-400 shadow-sm shadow-rose-200'}`} style={{ width: `${p.progress}%` }} />
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-4">
                        <div className="flex items-center gap-2">
                           <Clock className="w-3.5 h-3.5 text-slate-400" />
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Last Engagement {p.lastActivity}</p>
                        </div>
                        <Button variant="ghost" className="h-9 px-4 text-[9px] font-black text-indigo-600 bg-indigo-50/10 hover:bg-indigo-600 hover:text-white rounded-xl transition-all uppercase tracking-widest">Send nudge</Button>
                     </div>
                  </div>
               </GlassCard>
            ))}
         </div>
      </div>

    </div>
  );
}
