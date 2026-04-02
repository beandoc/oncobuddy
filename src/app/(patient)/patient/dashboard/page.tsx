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
  Stethoscope,
  AlertTriangle,
  TrendingUp,
  Map
} from "lucide-react";
import { Role } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

/**
 * Vanguard Patient Dashboard - Clinical Master View.
 * High-fidelity hub for symptom logging, prescriptions, and report tracking. (Section B3).
 * Redesigned for absolute typographic contrast (slate-900) and clinical safety.
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
      
      {/* 1. Vanguard Clinical Header - Maximized Contrast */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-6">
         <div className="space-y-3">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-[22px] bg-slate-950 flex items-center justify-center text-white shadow-2xl transition-transform hover:rotate-3">
                  <Activity className="w-8 h-8" />
               </div>
               <div>
                  <h1 className="text-4xl md:text-5xl font-black font-outfit text-slate-950 tracking-tighter leading-none italic">Hello, {patient.preferredName}</h1>
                  <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] mt-3 italic flex items-center gap-2">
                     <Clock className="w-4 h-4 text-indigo-600" /> Wednesday, 12 March 2026 • Treatment Day 12
                  </p>
               </div>
            </div>
         </div>

         {/* 2. Clinical Vitality Index */}
         <div className="flex items-center gap-6 p-2 rounded-[36px] bg-white shadow-2xl border-2 border-slate-50">
            <div className="px-8 py-3 flex flex-col border-r-2 border-slate-50">
               <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1.5 opacity-80">Vitality Index</p>
               <div className="flex items-center gap-2">
                  <div className="h-2 w-14 bg-indigo-600 rounded-full shadow-sm" />
                  <span className="text-xl font-black text-slate-950 leading-none italic">Stable</span>
               </div>
            </div>
            <div className="px-8 py-3 flex flex-col pr-10">
               <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1.5 opacity-80">Oversight</p>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]" />
                  <span className="text-sm font-black text-slate-950 uppercase tracking-tighter">Active Sync</span>
               </div>
            </div>
         </div>
      </div>

      {/* 3. Clinical Emergency Triage (P0 Action) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <GlassCard className="lg:col-span-3 !p-10 border-rose-100 bg-white group hover:border-rose-300 transition-all shadow-xl shadow-rose-50/50">
            <div className="flex flex-col md:flex-row items-center gap-8">
               <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border-2 border-rose-100 shadow-inner group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-10 h-10" />
               </div>
               <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="space-y-1">
                     <h2 className="text-2xl font-black font-outfit text-slate-950 tracking-tight italic">Emergency Red Flags</h2>
                     <p className="text-sm text-slate-600 font-bold leading-relaxed italic">Fever > 100.4°F, Severe pain, or Shortness of Breath require immediate triage.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                     <Link href="/patient/messages" className="bg-rose-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-950 transition-all shadow-lg active:scale-95">Report Red Flag Now</Link>
                     <a href="tel:+918888888888" className="bg-white text-rose-600 border-2 border-rose-100 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all shadow-sm">Call Night Nurse</a>
                  </div>
               </div>
            </div>
         </GlassCard>
         <GlassCard className="!p-8 border-slate-100 bg-slate-950 text-white flex flex-col justify-between group shadow-2xl">
            <div className="space-y-2">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Support Sync</p>
               <h4 className="text-xl font-bold font-outfit italic leading-tight">Clinic Status: <span className="text-emerald-400">Open</span></h4>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter leading-relaxed pt-4">Expected response time: <span className="text-white">12 minutes</span></p>
         </GlassCard>
      </div>

      {/* 4. Logic-Driven Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Column: Triage & Appointments */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Primary Action: Symptom Triage */}
            <GlassCard className="!p-0 border-slate-950 bg-slate-950 text-white shadow-[0_40px_80px_rgba(0,0,0,0.15)] overflow-hidden group hover:-translate-y-1 transition-all duration-500">
               <div className="p-12 space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full translate-x-32 -translate-y-32" />
                  
                  <div className="flex items-center justify-between relative z-10">
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                           <Heart className="w-7 h-7 fill-white" />
                        </div>
                        <div>
                           <p className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400">Clinical Protocol</p>
                           <h2 className="text-3xl font-black font-outfit leading-none tracking-tight mt-1 italic">Vitals & Toxicity</h2>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-500/30 text-emerald-400">
                        <Flame className="w-4 h-4 fill-emerald-400" />
                        <span className="text-[10px] font-black tracking-widest uppercase">12 Day Streak</span>
                     </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                     <h2 className="text-2xl md:text-3xl font-black font-outfit leading-tight italic">How is your energy today?</h2>
                     <p className="text-lg text-slate-400 font-bold italic leading-relaxed max-w-xl">Daily toxicity monitoring allows Dr. {primaryOncologist?.user.lastName || 'Oncologist'} to maintain safe dosing thresholds.</p>
                  </div>

                  <Link href="/patient/symptoms/log" className="w-full h-16 bg-white text-slate-950 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 hover:text-white transition-all group flex items-center justify-center gap-4 relative z-10">
                     Initialize Symptom Journal <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
               </div>
            </GlassCard>

            {/* Smart Module: Appointments & Reports Vault */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <GlassCard className="border-slate-100 shadow-xl !p-8 space-y-8 group bg-white">
                  <div className="flex items-center justify-between">
                     <h4 className="text-xl font-black font-outfit text-slate-950 italic">Next Visit</h4>
                     <Calendar className="w-6 h-6 text-indigo-600" />
                  </div>
                  {nextEvent ? (
                     <div className="space-y-6">
                        <div>
                           <p className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.4em] mb-3 italic">
                              {nextEvent.eventType === 'DAY_CARE' ? 'Shift: Chemotherapy' : 'Clinic: Consultation'}
                           </p>
                           <p className="text-4xl font-black text-slate-950 tracking-tighter leading-none italic">{new Date(nextEvent.scheduledDate).toLocaleDateString('en-IN', { weekday: 'long' })}</p>
                           <p className="text-base font-black text-slate-600 mt-3 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {new Date(nextEvent.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })} at {nextEvent.eventType === 'DAY_CARE' ? (nextEvent.shift === 'MORNING' ? '09:00am' : '02:00pm') : '10:30am'}
                           </p>
                        </div>
                        <Link href="/patient/appointments" className="flex items-center gap-3 pt-4 text-[10px] font-black uppercase text-indigo-600 tracking-widest cursor-pointer group-hover:translate-x-1 transition-transform">
                           View Prep List (Fasting) <ChevronRight className="w-4 h-4" />
                        </Link>
                     </div>
                  ) : (
                     <p className="text-slate-600 text-sm font-black italic">No upcoming visits found.</p>
                  )}
               </GlassCard>

               <GlassCard className="border-slate-100 shadow-xl !p-8 space-y-8 bg-white/50">
                  <div className="flex items-center justify-between">
                     <h4 className="text-xl font-black font-outfit text-slate-950 italic">Latest Reports</h4>
                     <FileText className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="space-y-4">
                     <div className="p-5 rounded-3xl bg-white border-2 border-slate-50 hover:border-indigo-100 transition-all cursor-pointer group shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                           <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Radiology</p>
                           <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                        </div>
                        <p className="text-sm font-black text-slate-950 leading-none italic">PET-CT Thorax Review</p>
                        <p className="text-[10px] font-black text-slate-400 mt-2.5 uppercase tracking-widest">Available now</p>
                     </div>
                     <div className="p-5 rounded-3xl bg-slate-50 opacity-60 border-2 border-transparent">
                        <p className="text-sm font-black text-slate-950 leading-none italic">Lab: CBC/KFT Profile</p>
                        <p className="text-[10px] font-black text-slate-400 mt-2.5 uppercase tracking-widest">Processing...</p>
                     </div>
                  </div>
               </GlassCard>
            </div>
         </div>

         {/* Right Column: Prescriptions & Roadmap */}
         <div className="space-y-8">
            
            {/* Treatment Roadmap (Clinical Roadmap) */}
            <GlassCard className="!p-8 border-indigo-100 bg-indigo-50/30 shadow-2xl space-y-6">
               <div className="flex items-center justify-between">
                  <h4 className="text-xl font-black font-outfit text-slate-950 italic">Treatment Path</h4>
                  <Map className="w-6 h-6 text-indigo-600" />
               </div>
               <div className="space-y-6 pt-2">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center font-black text-indigo-600 text-sm">4</div>
                     <div className="flex-1 space-y-1">
                        <p className="text-sm font-black text-slate-950 uppercase leading-none">Cycle 4 (Day 12)</p>
                        <p className="text-[10px] font-bold text-slate-600 italic">AC-T Regimen • 16 Cycles Total</p>
                     </div>
                  </div>
                  <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                     <div className="h-full bg-indigo-600 w-[68%] shadow-[0_0_15px_rgba(79,70,229,0.4)]" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest">
                     <span>Phase: Active Chemo</span>
                     <span className="text-indigo-600">68% Done</span>
                  </div>
               </div>
            </GlassCard>

            {/* Smart Prescriptions */}
            <GlassCard className="border-slate-100 shadow-xl !p-8 space-y-8 bg-white">
               <div className="flex items-center justify-between">
                  <h4 className="text-xl font-black font-outfit text-slate-950 italic">Medication Log</h4>
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600"><Pill className="w-5 h-5" /></div>
               </div>
               <div className="space-y-6">
                  {[
                     { name: 'Pantoprazole 40mg', info: '1-0-0 (Empty Stomach)', time: '07:30 AM', taken: true },
                     { name: 'Ondansetron 8mg', info: '1-1-1 (SOS Nausea)', time: 'Next due 2:00 PM', taken: false }
                  ].map((med, i) => (
                     <div key={i} className={`flex items-start gap-4 ${med.taken ? 'opacity-40' : ''}`}>
                        <button className={`w-6 h-6 rounded-lg border-2 mt-0.5 transition-all flex items-center justify-center ${med.taken ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'}`}>
                           {med.taken && <ShieldCheck className="w-4 h-4 text-white" />}
                        </button>
                        <div>
                           <p className="text-sm font-black text-slate-950 leading-none italic">{med.name}</p>
                           <p className="text-[10px] font-black text-slate-600 mt-2 uppercase tracking-tighter">{med.info}</p>
                           <p className="text-[9px] font-black text-indigo-600 mt-1 uppercase tracking-widest">{med.time}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </GlassCard>

            {/* Support Resources Track */}
            <GlassCard className="!p-8 border-slate-50 shadow-lg space-y-6 bg-slate-50/30">
               <div className="flex items-center justify-between">
                  <h4 className="text-xl font-black font-outfit text-slate-950">Learning Lab</h4>
                  <GraduationCap className="w-6 h-6 text-indigo-400" />
               </div>
               <div className="space-y-4">
                  <p className="text-sm font-black text-slate-950 leading-relaxed italic border-l-4 border-indigo-600 pl-4 py-1">"Managing Fatigue during active Taxane therapy."</p>
                  <Link href="/patient/learn" className="w-full h-12 bg-white border-2 border-slate-100 rounded-2xl text-indigo-600 hover:bg-slate-50 flex items-center justify-center font-black text-[10px] uppercase tracking-[0.2em] transition-all">Continue Pathway</Link>
               </div>
            </GlassCard>
            
         </div>
      </div>

      {/* 5. Mood Wellbeing Hub */}
      <GlassCard className="!p-12 border-slate-100 shadow-2xl bg-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 blur-[80px] rounded-full translate-x-32 -translate-y-32" />
         <div className="text-center space-y-3 mb-10 relative z-10">
            <h4 className="text-4xl font-black font-outfit text-slate-950 tracking-tighter italic">How's your mental vitality?</h4>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] font-serif">Quick wellbeing check-in for your Nurse Navigator.</p>
         </div>
         <div className="flex items-center justify-center gap-6 max-w-2xl mx-auto relative z-10">
            {['😔', '😕', '😐', '🙂', '✨'].map((emoji, i) => (
               <button key={i} className="w-24 h-24 rounded-[36px] bg-slate-50 hover:bg-indigo-600 border-2 border-slate-50 hover:border-indigo-400 transition-all group flex flex-col items-center justify-center gap-2 active:scale-90 shadow-sm hover:shadow-xl hover:shadow-indigo-100">
                  <span className="text-4xl grayscale group-hover:grayscale-0 transition-all group-hover:scale-125 group-hover:rotate-6">{emoji}</span>
               </button>
            ))}
         </div>
      </GlassCard>
    </div>
  );
}
