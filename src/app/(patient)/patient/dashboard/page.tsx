import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Heart, 
  ChevronRight, 
  Calendar, 
  MessageCircle, 
  GraduationCap, 
  Activity,
  Flame,
  Clock,
  ExternalLink,
  ChevronUp,
  UserCircle,
  MoreVertical
} from "lucide-react";
import { Role } from "@prisma/client";
import Image from "next/image";

/**
 * Patient Dashboard Home - Screen 1 (Section B3).
 * Warm, personalized landing snapshots for care journey tracking.
 * Features the prioritized 'Today's Focus' logic (B3).
 */
export default async function PatientDashboardHome() {
  const session = await auth();
  if (!session || session.user.role !== Role.PATIENT) redirect("/login");

  const patient = await prisma.patient.findUnique({
    where: { userId: session.user.id },
    include: {
      diagnoses: { take: 1, orderBy: { diagnosisDate: 'desc' } },
      clinicalTeam: { include: { clinician: { include: { user: true } } } },
      appointments: { 
        where: { scheduledDate: { gte: new Date() } },
        orderBy: { scheduledDate: 'asc' },
        take: 5
      }
    }
  });

  if (!patient) return null;

  const nextAppointment = patient.appointments[0];
  const primaryOncologist = patient.clinicalTeam.find((t: any) => t.clinician.specialization === "ONCOLOGIST")?.clinician;

  const WellnessEmoji = ({ emoji, label }: any) => (
    <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-indigo-50 hover:border-indigo-100 transition-all group active:scale-95">
      <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{emoji}</span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="space-y-10 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      
      {/* Greeting Header (Section B3) */}
      <div className="space-y-4">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-slate-100 ring-4 ring-white shadow-xl flex items-center justify-center font-bold text-slate-400 text-2xl overflow-hidden relative">
               {session.user.image ? <Image src={session.user.image} alt="" fill className="object-cover" /> : session.user.name?.charAt(0)}
            </div>
            <div>
               <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900">Good morning, {patient.preferredName || "there"}</h1>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] mt-1 italic">Wednesday, 12 March 2026</p>
            </div>
         </div>
         
         <GlassCard className="!p-4 border-indigo-100 bg-indigo-50/20 shadow-none">
            <p className="text-xs font-medium text-slate-700 leading-relaxed">
               <span className="text-indigo-600 font-black">Today's focus:</span> Don't forget to log your symptoms today. Your care team is tracking your progress!
            </p>
         </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-8">
            
            {/* Daily Symptom Log Card (Section B3) */}
            <GlassCard className="!p-0 border-slate-100 shadow-xl overflow-hidden relative group">
               <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xl font-bold font-outfit text-slate-900 flex items-center gap-3">
                        <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
                        My Health Journal
                     </h3>
                     <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                        <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                        <span className="text-[10px] font-black text-amber-600 uppercase">12 Day Streak</span>
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <p className="text-lg font-bold text-slate-700 leading-tight">How are you feeling today?</p>
                     <p className="text-sm text-slate-500 leading-relaxed font-medium capitalize">Help your care team catch patterns early by logging your daily summary.</p>
                  </div>

                  <Button variant="secondary" className="w-full h-14 bg-indigo-600 hover:bg-slate-950 font-black uppercase text-xs tracking-widest gap-2 shadow-xl shadow-indigo-100 group">
                     Log My Symptoms
                     <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
               </div>
               <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last logged: Yesterday, 14:12</p>
                  <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest active:scale-95 transition-transform">See History</button>
               </div>
            </GlassCard>

            {/* Upcoming Appointment - Fasting Warning (Section B3) */}
            {nextAppointment && (
               <GlassCard className="border-slate-100 shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-indigo-500" />
                  <div className="p-8 space-y-4">
                     <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-indigo-500" />
                        <h4 className="text-lg font-bold font-outfit text-slate-900">Next Clinic Visit</h4>
                     </div>
                     <div className="space-y-1">
                        <p className="text-xl font-bold text-slate-800 leading-none">This Thursday at 10:30am</p>
                        <p className="text-xs text-slate-500 font-medium italic">with Dr. {primaryOncologist ? `${primaryOncologist.user.firstName} ${primaryOncologist.user.lastName}` : "Oncology Team"}</p>
                     </div>
                     <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100/50">
                        <p className="text-xs font-black text-rose-600 uppercase tracking-tight mb-1">Remember: Fasting required</p>
                        <p className="text-xs text-rose-800/70 leading-relaxed font-medium">Please avoid any food or drink (including water) after 2:30am on the day of your scan.</p>
                     </div>
                     <div className="flex items-center justify-between pt-2">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Location: Oncology Wing A</p>
                        <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 group">
                           View Prep <ChevronUp className="w-3.5 h-3.5 group-hover:animate-bounce" />
                        </button>
                     </div>
                  </div>
               </GlassCard>
            )}
         </div>

         <div className="space-y-8">
            
            {/* Care Team Card (Section B3) */}
            <GlassCard className="border-slate-100 shadow-lg !p-8 space-y-8 h-fit">
               <h4 className="text-lg font-bold font-outfit text-slate-900 border-b border-slate-50 pb-4">My Care Team</h4>
               <div className="space-y-6">
                  {/* Primary Oncologist */}
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                           {primaryOncologist?.user.firstName?.charAt(0)}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900 leading-none">Dr. {primaryOncologist?.user.firstName} {primaryOncologist?.user.lastName}</p>
                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1.5">Lead Oncologist</p>
                        </div>
                     </div>
                     <Button variant="ghost" size="sm" className="h-9 w-9 p-0 border border-slate-100"><MessageCircle className="w-4 h-4 text-indigo-600" /></Button>
                  </div>
                  {/* Nurse Navigator */}
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 italic font-serif">N</div>
                        <div>
                           <p className="text-sm font-bold text-slate-900 leading-none">Nurse Navigator Team</p>
                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1.5">Direct Response</p>
                        </div>
                     </div>
                     <Button variant="ghost" size="sm" className="h-9 w-9 p-0 border border-slate-100"><MessageCircle className="w-4 h-4 text-indigo-600" /></Button>
                  </div>
               </div>
            </GlassCard>

            {/* Learning Path (Section B3) */}
            <GlassCard className="border-slate-100 shadow-lg !p-8 space-y-6">
               <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold font-outfit text-slate-900">Education Path</h4>
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Action Required</p>
               </div>
               <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700 leading-none group-hover:text-indigo-600">Managing Chemotherapy Fatigue</p>
                  <p className="text-xs text-slate-400 font-medium mt-1 italic">Week 2: Nutrition and Exercise for Energy</p>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
                     <span>Lesson 2 of 5</span>
                     <span>40% Complete</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[40%]" />
                  </div>
               </div>
               <Button variant="ghost" className="w-full h-11 border-indigo-100 text-indigo-600 hover:bg-indigo-50 font-bold text-xs gap-2">
                  <GraduationCap className="w-4 h-4" /> Continue Learning
               </Button>
            </GlassCard>
            
            {/* Recent Message (Section B3) */}
            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100/50 flex flex-col gap-4 relative overflow-hidden group hover:bg-slate-100/50 transition-colors cursor-pointer">
               <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-sm" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New message from Nurse Navigator</p>
               </div>
               <p className="text-sm font-bold text-slate-700 line-clamp-2 italic leading-relaxed">
                  "Hi {patient.preferredName}, I saw your fatigue report from yesterday. Please make sure you are..."
               </p>
               <Button variant="ghost" className="h-9 !px-4 text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em] self-end hover:bg-white flex items-center gap-2">
                  Read & Reply <ChevronRight className="w-3.5 h-3.5" />
               </Button>
            </div>
         </div>
      </div>

      {/* Wellness Check-in Widget (Section B3) */}
      <GlassCard className="!p-8 space-y-6 border-slate-100 bg-white/70 shadow-2xl shadow-indigo-100/20">
         <div className="text-center space-y-1">
            <h4 className="text-2xl font-bold font-outfit text-slate-900 tracking-tight leading-none">How's your mood today?</h4>
            <p className="text-sm text-slate-400 font-medium italic">A quick check-in for your care team. No details needed.</p>
         </div>
         <div className="flex items-center gap-3 md:gap-6 overflow-x-auto no-scrollbar py-2">
            <WellnessEmoji emoji="😔" label="Struggling" />
            <WellnessEmoji emoji="😕" label="Unwell" />
            <WellnessEmoji emoji="😐" label="Okay" />
            <WellnessEmoji emoji="🙂" label="Steady" />
            <WellnessEmoji emoji="✨" label="Feeling Good" />
         </div>
      </GlassCard>
    </div>
  );
}
