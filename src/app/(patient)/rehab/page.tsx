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

/**
 * Patient Rehab Hub - Screen 4 (Section B6).
 * Features high-fidelity rehabilitation session tracking and progress monitoring.
 * Optimized for focused engagement with clear session CTAs and rest day support.
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
    <div className="space-y-10 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      
      {/* Page Header (Section B6) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
         <div className="space-y-4">
            <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900">My <span className="text-emerald-600">Recovery</span></h1>
            <p className="text-slate-500 font-medium italic italic">Personalized physical rehabilitation for post-treatment strength.</p>
         </div>
         {program && (
            <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm">
               <Flame className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
               <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest whitespace-nowrap">Week {program.durationWeeks} • {Math.round(program.overallCompletionPercent)}% Complete</p>
            </div>
         )}
      </div>

      <div className="space-y-12">
         
         {/* Today's Session Card (Section B6) */}
         <GlassCard className="!p-0 border-emerald-100 bg-white/70 shadow-2xl shadow-emerald-500/10 overflow-hidden group">
            <div className="grid grid-cols-1 md:grid-cols-2">
               <div className="p-10 space-y-8 relative z-10 bg-white">
                  <div className="space-y-3">
                     <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Today's Session</p>
                     <h3 className="text-3xl font-bold font-outfit text-slate-900 leading-tight italic italic">Gentle Mobility for<br/>Energy Recovery</h3>
                     <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-2 text-slate-400">
                           <Clock className="w-4 h-4" />
                           <span className="text-xs font-bold uppercase tracking-tight">15 Minutes</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                           <PlayCircle className="w-4 h-4" />
                           <span className="text-xs font-bold uppercase tracking-tight">4 Exercises</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-slate-50">
                     <Button variant="secondary" className="w-full h-16 bg-emerald-600 hover:bg-slate-950 font-black uppercase text-sm tracking-[0.2em] gap-3 shadow-xl shadow-emerald-100 group transition-all">
                        Start Session Now
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1" />
                     </Button>
                     <p className="text-xs text-center text-slate-400 font-medium italic lowercase">Exercises suggested by your therapist based on your logs.</p>
                  </div>
               </div>
               
               <div className="bg-slate-50 p-10 flex flex-col justify-between gap-8 border-l border-slate-100/50">
                  <div className="space-y-6">
                     <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Included Exercises</h4>
                     <div className="space-y-4">
                        {['Circular Breath', 'Gentle Neck Flex', 'Shoulder Rolls', 'Sitting Reach'].map((ex, i) => (
                           <div key={ex} className="flex items-center gap-4 group/ex">
                              <span className="text-[10px] font-black text-slate-200 group-hover/ex:text-emerald-300 transition-colors">0{i+1}</span>
                              <p className="text-sm font-bold text-slate-700 tracking-tight">{ex}</p>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="p-4 bg-white/50 rounded-2xl border border-white flex items-center justify-between">
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Last Session</p>
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Yesterday, 10:15am</p>
                  </div>
               </div>
            </div>
         </GlassCard>

         {/* Program Timeline & My Progress (Section B6) */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4">
            <div className="md:col-span-2 space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-outfit text-slate-900 border-b-2 border-slate-100 pb-2">Program Progress</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">8 of 24 Sessions Done</p>
               </div>
               
               <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                  {[...Array(14)].map((_, i) => (
                     <div key={i} className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${i < 8 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-white border-slate-100 text-slate-300'}`}>
                        <span className="text-xs font-black uppercase tracking-tight">{i + 1}</span>
                        {i < 8 ? <CheckCircle2 className="w-4 h-4 fill-emerald-500/10" /> : <div className="w-1 h-1 rounded-full bg-slate-200" />}
                     </div>
                  ))}
               </div>
               
               <GlassCard className="border-slate-100 bg-slate-50/50 shadow-none !p-6 flex items-center justify-between group cursor-pointer hover:bg-white hover:border-emerald-100 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-emerald-200 shadow-sm transition-all">
                        <History className="w-5 h-5 text-emerald-600" />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-slate-700">Full Program History</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">View past session notes and ratings</p>
                     </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-all translate-x-0 group-hover:translate-x-1" />
               </GlassCard>
            </div>

            <div className="space-y-8">
               <h3 className="text-xl font-bold font-outfit text-slate-900 border-b-2 border-slate-100 pb-2">Why Rehab?</h3>
               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 mb-2">
                        <Dumbbell className="w-4 h-4 text-emerald-600" />
                        <span className="text-[10px] font-black uppercase text-emerald-900 tracking-[0.2em] leading-none">The Science</span>
                     </div>
                     <p className="text-sm font-bold text-slate-700 leading-snug">Muscle Retention</p>
                     <p className="text-xs text-slate-500 font-medium italic italic leading-relaxed">
                        Maintaining muscle mass during treatment is clinically linked to reduced side effects and faster post-chemo recovery.
                     </p>
                  </div>
                  
                  <div className="p-6 bg-slate-950 rounded-3xl text-white relative overflow-hidden group/rest">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Pro Tip</p>
                     <h4 className="text-lg font-bold font-outfit leading-tight mb-2 italic">Don't skip Rest Days.</h4>
                     <p className="text-xs text-slate-400 font-medium italic leading-relaxed">
                        Your body repairs cellular damage most effectively during scheduled rest periods of your rehab path.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
