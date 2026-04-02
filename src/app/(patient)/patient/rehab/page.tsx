import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  Activity, 
  PlayCircle, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  Flame, 
  ChevronRight, 
  History,
  Dumbbell
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";
import Link from "next/link";

/**
 * Patient Rehab Hub - Screen 4 (Section B6).
 * Features high-fidelity rehabilitation session tracking and progress monitoring.
 * Optimized for high-contrast (slate-950) visibility and ergonomic session CTAs.
 */
export default async function PatientRehabHub() {
  const session = await auth();
  if (!session || session.user.role !== Role.PATIENT) redirect("/login");

  const patient = await prisma.patient.findUnique({
    where: { userId: session.user.id },
    include: {
      rehabPrograms: {
        where: { deletedAt: null },
        take: 1,
        include: {
          sessions: { 
            where: { deletedAt: null },
            orderBy: { scheduledDate: 'asc' },
            take: 7 
          }
        }
      }
    }
  });

  const program = patient?.rehabPrograms[0];

  return (
    <div className="space-y-12 selection:bg-indigo-100 selection:text-indigo-900 pb-24 animate-in fade-in duration-700">
      
      {/* Page Header (Section B6) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
         <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-outfit tracking-tighter text-slate-950">My <span className="text-emerald-600">Recovery Lab</span></h1>
            <p className="text-slate-700 font-bold italic leading-relaxed max-w-2xl">Targeted clinical rehabilitation to maintain muscle mass and accelerate treatment recovery.</p>
         </div>
         {program && (
            <div className="flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-[24px] border-2 border-emerald-100 shadow-sm shadow-emerald-50/50">
               <Flame className="w-6 h-6 text-emerald-600 fill-emerald-600/10 shadow-sm" />
               <p className="text-[11px] font-bold text-emerald-950 uppercase tracking-[0.2em] whitespace-nowrap">Week {program.durationWeeks} • {Math.round(program.overallCompletionPercent)}% Strength Gain</p>
            </div>
         )}
      </div>

      <div className="space-y-16">
         
         {/* Today's Session Card - High Visibility (Section B6) */}
         <GlassCard className="!p-0 border-emerald-100 bg-white shadow-[0_40px_80px_rgba(16,185,129,0.1)] overflow-hidden group rounded-[48px]">
            <div className="grid grid-cols-1 md:grid-cols-2">
               <div className="p-12 md:p-16 space-y-10 relative z-10 bg-white">
                  <div className="space-y-4">
                     <p className="text-[11px] font-bold uppercase text-emerald-600 tracking-wider italic underline decoration-emerald-200 decoration-4 underline-offset-8">Primary Objective Today</p>
                     <h3 className="text-4xl font-bold font-outfit text-slate-950 leading-tight italic mt-6">Gentle Mobility for<br/>Systemic Recovery</h3>
                     <div className="flex flex-wrap items-center gap-8 pt-6">
                        <div className="flex items-center gap-3 text-slate-700 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                           <Clock className="w-5 h-5 text-indigo-600" />
                           <span className="text-xs font-bold uppercase tracking-wider">15 Minutes</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                           <PlayCircle className="w-5 h-5 text-indigo-600" />
                           <span className="text-xs font-bold uppercase tracking-wider">4 Sequence Sequence</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="space-y-6 pt-10 border-t-2 border-slate-50">
                     <Button variant="secondary" className="w-full h-18 bg-emerald-600 hover:bg-slate-950 text-white font-bold uppercase text-xs tracking-[0.3em] gap-4 shadow-sm shadow-emerald-100 group transition-all rounded-xl py-6">
                        Start Recovery Session
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                     </Button>
                     <p className="text-xs text-center text-slate-500 font-bold italic lowercase leading-relaxed">
                        Clinical input from your therapist implies focus on breathwork during Taxane days.
                     </p>
                  </div>
               </div>
               
               <div className="bg-slate-50/50 p-12 md:p-16 flex flex-col justify-between gap-12 border-l-2 border-slate-100/50">
                  <div className="space-y-8">
                     <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-2">Protocol Sequence</h4>
                     <div className="space-y-6">
                        {['Circular Breathwork', 'Gentle Neck Flex', 'Clinical Shoulder Rolls', 'Sitting Reach Path'].map((ex, i) => (
                           <div key={ex} className="flex items-center gap-6 group/ex transition-transform hover:translate-x-2">
                              <span className="text-sm font-bold text-slate-300 group-hover/ex:text-emerald-500 transition-colors">0{i+1}</span>
                              <p className="text-base font-bold text-slate-950 tracking-tight">{ex}</p>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="p-6 bg-white rounded-xl border-2 border-slate-100 flex items-center justify-between shadow-sm">
                     <p className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Temporal Record</p>
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1 rounded-lg">Last Active: Yesterday</p>
                  </div>
               </div>
            </div>
         </GlassCard>

         {/* Trackers Cluster (Section B6) */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
            <div className="md:col-span-2 space-y-10">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-2xl font-bold font-outfit text-slate-950">Milestone Tracking</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 px-4 py-2 rounded-full border border-slate-100">8 of 24 Units Logged</p>
               </div>
               
               <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                  {[...Array(16)].map((_, i) => (
                     <div key={i} className={`aspect-square rounded-[24px] flex flex-col items-center justify-center gap-2 border-2 transition-all hover:scale-110 ${i < 8 ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-lg shadow-emerald-50/50' : 'bg-white border-slate-100 text-slate-300'}`}>
                        <span className="text-xs font-bold uppercase tracking-tighter">{i + 1}</span>
                        {i < 8 ? <CheckCircle2 className="w-5 h-5 fill-emerald-500/10" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />}
                     </div>
                  ))}
               </div>
               
               <Link href="#" className="p-10 rounded-xl border-2 border-slate-100 bg-white shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-slate-50 rounded-[22px] flex items-center justify-center border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-3 shadow-inner transition-all duration-500">
                        <History className="w-8 h-8" />
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-xl font-bold text-slate-950">Strength History Archive</h4>
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Review past session performance and ratings.</p>
                     </div>
                  </div>
                  <ChevronRight className="w-8 h-8 text-slate-200 group-hover:text-emerald-600 transition-all translate-x-0 group-hover:translate-x-2" />
               </Link>
            </div>

            <div className="space-y-10">
               <h3 className="text-2xl font-bold font-outfit text-slate-950 border-b-4 border-slate-100 pb-4">The Clinical Why</h3>
               <div className="space-y-10">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <Dumbbell className="w-6 h-6 text-emerald-600" />
                        <span className="text-[11px] font-bold uppercase text-emerald-950 tracking-[0.2em]">Muscle Retention</span>
                     </div>
                     <p className="text-sm font-bold text-slate-700 leading-relaxed">
                        Maintaining clinical muscle mass during treatment is linked to reduced toxicity scores and 40% faster post-chemo recovery.
                     </p>
                  </div>
                  
                  <div className="p-10 bg-slate-950 rounded-xl text-white relative overflow-hidden group shadow-[0_40px_80px_rgba(0,0,0,0.2)]">
                     <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-6">Navigator Pro Tip</p>
                     <h4 className="text-2xl font-bold font-outfit leading-tight mb-4">Rest is Recovery.</h4>
                     <p className="text-sm text-slate-400 font-bold italic leading-relaxed">
                        Your cellular repair mechanisms work most efficiently during the scheduled Rest Days in your rehab pathway.
                     </p>
                     <div className="absolute bottom-[-20px] right-[-20px] w-32 h-32 bg-white/5 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-1000" />
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
