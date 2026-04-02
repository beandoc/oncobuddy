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
  ShieldCheck,
  Search,
  FileText,
  Pill,
  Thermometer,
  Bell,
  ArrowUpRight,
  ClipboardCheck,
  Stethoscope
} from "lucide-react";
import { Role } from "@prisma/client";
import Image from "next/image";

/**
 * Vanguard Patient Dashboard - Clinical Master View.
 * High-fidelity hub for symptom logging, prescriptions, and report tracking. (Section B3).
 * Redesigned to replace legacy hospital portals with state-of-the-art aesthetics.
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
        take: 3
      },
      dayCareSessions: {
        where: { date: { gte: new Date(new Date().setHours(0,0,0,0)) } },
        orderBy: { date: 'asc' },
        take: 1,
        include: { clinician: { include: { user: true } } }
      }
    }
  });

  if (!patient) return null;

  const allEvents = [
    ...(patient.appointments || []).map((a: any) => ({ ...a, eventType: 'CLINIC_VISIT' })),
    ...(patient.dayCareSessions || []).map((d: any) => ({ ...d, scheduledDate: d.date, eventType: 'DAY_CARE' }))
  ].sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  const nextEvent: any = allEvents[0];
  const primaryOncologist = patient.clinicalTeam.find((t: any) => t.clinician.specialization === "MEDICAL_ONCOLOGIST")?.clinician;

  return (
    <div className="space-y-12 pb-24 selection:bg-indigo-100 selection:text-indigo-900 animate-in fade-in duration-1000">
      
      {/* 1. Vanguard Clinical Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-6">
         <div className="space-y-3">
            <div className="flex items-center gap-3">
               <div className="w-14 h-14 rounded-[20px] bg-slate-950 flex items-center justify-center text-white shadow-2xl shadow-slate-200">
                  <Activity className="w-7 h-7" />
               </div>
               <div>
                  <h1 className="text-4xl font-black font-outfit text-slate-900 tracking-tight leading-none">Welcome back, {patient.preferredName}</h1>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic flex items-center gap-2">
                     <Clock className="w-3.5 h-3.5" /> Wednesday, 12 March 2026
                  </p>
               </div>
            </div>
         </div>

         {/* 2. Clinical Vitality Index (State-of-the-Art) */}
         <div className="flex items-center gap-6 p-1.5 rounded-[32px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50">
            <div className="px-6 py-3 flex flex-col items-center border-r border-slate-50">
               <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1.5 opacity-60">Vitality Index</p>
               <div className="flex items-center gap-2">
                  <div className="h-2 w-12 bg-indigo-600 rounded-full" />
                  <span className="text-xl font-bold text-slate-900 leading-none italic">Stable</span>
               </div>
            </div>
            <div className="px-6 py-3 flex flex-col items-center">
               <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1.5 opacity-60">Status</p>
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                  <span className="text-sm font-bold text-slate-900">Active Oversight</span>
               </div>
            </div>
         </div>
      </div>

      {/* 3. Logic-Driven Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Column: Triage & Appointments */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Primary Action: Symptom Triage (Section B3) */}
            <GlassCard className="!p-0 border-white bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-[0_40px_80px_rgba(79,70,229,0.2)] overflow-hidden group hover:-translate-y-1 transition-all duration-500">
               <div className="p-10 space-y-8 relative overlow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-32 -translate-y-32" />
                  
                  <div className="flex items-center justify-between relative z-10">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                           <Heart className="w-6 h-6 fill-white" />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/70">Clinical Journal</p>
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                        <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                        <span className="text-[10px] font-black tracking-widest uppercase">12 Day Streak</span>
                     </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                     <h2 className="text-4xl font-bold font-outfit leading-none tracking-tight">How is your vitality today?</h2>
                     <p className="text-lg text-indigo-100/80 font-medium italic">Logging symptoms daily helps your clinical team adjust your care plan in real-time.</p>
                  </div>

                  <Button className="w-full h-16 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-slate-950 hover:text-white transition-all group flex items-center justify-center gap-3 relative z-10">
                     Log Daily Toxicity Survey <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
               </div>
            </GlassCard>

            {/* Smart Module: Appointments & Reports Vault */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* High-Fidelity Appointments */}
                <GlassCard className="border-slate-50 shadow-xl !p-8 space-y-8 group">
                  <div className="flex items-center justify-between">
                     <h4 className="text-lg font-black font-outfit text-slate-900 italic">Next Clinic Visit</h4>
                     <Calendar className="w-5 h-5 text-indigo-400" />
                  </div>
                  {nextEvent ? (
                     <div className="space-y-6">
                        <div>
                           <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] font-serif mb-2 italic">
                              {nextEvent.eventType === 'DAY_CARE' ? 'Chemotherapy Administration' : 'Clinical Consultation'}
                           </p>
                           <p className="text-3xl font-black text-slate-900 leading-none">{new Date(nextEvent.scheduledDate).toLocaleDateString('en-IN', { weekday: 'long' })}</p>
                           <p className="text-sm font-bold text-slate-400 mt-2">
                              {new Date(nextEvent.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })} at {nextEvent.eventType === 'DAY_CARE' ? (nextEvent.shift === 'MORNING' ? '09:00am' : '02:00pm') : '10:30am'}
                           </p>
                        </div>
                        {nextEvent.eventType === 'DAY_CARE' ? (
                           <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-start gap-3">
                              <Stethoscope className="w-5 h-5 text-indigo-600 mt-0.5 shadow-sm" />
                              <div className="space-y-1">
                                 <p className="text-[11px] font-black text-indigo-900 leading-relaxed uppercase tracking-tight">Day Care Unit (Level 4)</p>
                                 <p className="text-[9px] font-bold text-indigo-700/70 italic italic">Scheduled under Dr. {nextEvent.clinician.user.lastName}</p>
                              </div>
                           </div>
                        ) : (
                           <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100/50 flex items-start gap-3">
                              <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                              <p className="text-[11px] font-bold text-amber-900 leading-relaxed uppercase tracking-tight">Fasting Protocol Required: No food/water after 2:30 AM.</p>
                           </div>
                        )}
                        <div className="flex items-center gap-3 pt-2 text-[10px] font-black uppercase text-indigo-600 tracking-widest cursor-pointer group-hover:translate-x-1 transition-transform">
                           View Prep List <ChevronRight className="w-3 h-3" />
                        </div>
                     </div>
                  ) : (
                     <p className="text-slate-400 text-sm font-medium italic">No upcoming visits found.</p>
                  )}
               </GlassCard>

               {/* Secure Reports Vault (Section 11) */}
               <GlassCard className="border-slate-50 shadow-xl !p-8 space-y-8">
                  <div className="flex items-center justify-between">
                     <h4 className="text-lg font-black font-outfit text-slate-900 italic">Latest Reports</h4>
                     <FileText className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="space-y-4">
                     <div className="p-5 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-2">
                           <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Radiology</p>
                           <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-none italic">PET-CT Thorax Review</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2">Available: Yesterday, 14:30</p>
                     </div>
                     <div className="p-5 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-2">
                           <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Pathology</p>
                           <span className="w-2 h-2 rounded-full bg-slate-200" />
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-none italic">Molecular HER2 Profile</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2">Historical Record</p>
                     </div>
                  </div>
               </GlassCard>
            </div>
         </div>

         {/* Right Column: Prescriptions & Care Team */}
         <div className="space-y-8">
            
            {/* Smart Prescriptions (Actionable) */}
            <GlassCard className="border-white shadow-2xl !p-8 space-y-8 bg-white/80">
               <div className="flex items-center justify-between">
                  <h4 className="text-lg font-black font-outfit text-slate-900 italic">Today's Meds</h4>
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600"><Pill className="w-5 h-5" /></div>
               </div>
               <div className="space-y-6">
                  {[
                     { name: 'Pantoprazole 40mg', info: '1-0-0 (Empty Stomach)', time: '07:30 AM' },
                     { name: 'Ondansetron 8mg', info: '1-1-1 (SOS Nausea)', time: 'Last taken 4h ago' }
                  ].map((med, i) => (
                     <div key={i} className="flex items-start gap-4">
                        <button className="w-6 h-6 rounded-lg border-2 border-slate-100 hover:border-indigo-600 transition-colors mt-0.5" />
                        <div>
                           <p className="text-sm font-bold text-slate-900 leading-none italic">{med.name}</p>
                           <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-tighter">{med.info}</p>
                           <p className="text-[9px] font-black text-indigo-600 mt-0.5 tracking-widest">{med.time}</p>
                        </div>
                     </div>
                  ))}
               </div>
               <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-[0.2em] h-12 border-slate-50 hover:bg-slate-50 transition-colors">Manage Full List</Button>
            </GlassCard>

            {/* Care Team Navigation */}
            <div className="p-8 rounded-[40px] bg-slate-950 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
               <div className="space-y-6 relative z-10">
                  <p className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.2em]">Medical Oversight</p>
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/10 font-bold italic font-serif">M</div>
                     <div>
                        <p className="text-lg font-bold italic leading-none">{primaryOncologist ? `Dr. ${primaryOncologist.user.firstName} ${primaryOncologist.user.lastName}` : "Lead Oncologist"}</p>
                        <p className="text-xs text-white/50 mt-1.5 uppercase font-bold tracking-tighter">Onco-Pathology Panel</p>
                     </div>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-white/60">Responsive</span>
                     </div>
                     <Button className="h-10 px-6 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-transform active:scale-95">Consult</Button>
                  </div>
               </div>
            </div>

            {/* Supportive Resource assigned-track */}
            <GlassCard className="!p-8 border-slate-50 shadow-lg space-y-6">
               <div className="flex items-center justify-between">
                  <h4 className="text-lg font-black font-outfit text-slate-900">Education Track</h4>
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
               </div>
               <div className="space-y-4">
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[65%]" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed italic italic">"Managing Neuropathy symptoms during active Taxane therapy."</p>
                  <Button variant="ghost" className="w-full h-12 border-indigo-50 text-indigo-600 hover:bg-indigo-50 font-black text-[10px] uppercase tracking-[0.2em]">Next Lesson</Button>
               </div>
            </GlassCard>
            
         </div>
      </div>

      {/* 4. Mood Wellbeing Check-in */}
      <GlassCard className="!p-10 border-slate-50 shadow-2xl bg-white/90">
         <div className="text-center space-y-2 mb-8">
            <h4 className="text-3xl font-black font-outfit text-slate-900 tracking-tight leading-none italic">How's your mood today?</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-serif">A quick non-clinical check-in for the care team.</p>
         </div>
         <div className="flex items-center justify-center gap-6 max-w-2xl mx-auto">
            {['😔', '😕', '😐', '🙂', '✨'].map((emoji, i) => (
               <button key={i} className="w-20 h-20 rounded-[32px] bg-slate-50/50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group flex flex-col items-center justify-center gap-2 active:scale-90">
                  <span className="text-4xl grayscale group-hover:grayscale-0 transition-all group-hover:scale-110">{emoji}</span>
               </button>
            ))}
         </div>
      </GlassCard>
    </div>
  );
}
