import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Heart, 
  ChevronRight, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  Activity,
  Flame,
  Clock,
  ExternalLink,
  ChevronUp,
  UserCircle,
  MoreVertical,
  Users,
  CheckSquare
} from "lucide-react";
import { Role } from "@prisma/client";

/**
 * Caregiver Dashboard Home - Screen 1 (Section C3).
 * Supportive overview focused on patient status and imminent coordination tasks.
 * Design Philosophy: Dual-role navigation with plain-language clinical summaries.
 */
export default async function CaregiverDashboardHome() {
  const session = await auth();
  if (!session || session.user.role !== Role.CAREGIVER) redirect("/login");

  // Mock data for patient context Jane Doe (activePatientId)
  const patient = {
    preferredName: "Jane Doe",
    cancerType: "Stage II Breast Cancer",
    statusText: "Receiving chemotherapy — Cycle 3 of 6",
    wellbeingScore: 6,
    wellbeingLabel: "Doing fairly well",
    lastLogDate: "yesterday",
    accessLevel: "VIEW_AND_LOG" as const, // C1 access gate
  };

  const nextAppt = {
     title: "Oncology Clinic Appointment",
     dateLabel: "Thursday at 10:30am",
     location: "Main Clinic — Wing A",
     prep: "Please ensure Jane completes her fasting 8 hours before."
  };

  return (
    <div className="space-y-10 selection:bg-teal-100 selection:text-teal-900 pb-20">
      
      {/* Patient Status Card (Section C3) */}
      <GlassCard className="!p-0 border-teal-100 bg-white shadow-sm shadow-teal-100/30 overflow-hidden group">
         <div className="grid grid-cols-1 md:grid-cols-4">
            <div className="md:col-span-3 p-10 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-2xl border-4 border-white shadow-sm">J</div>
                  <div className="space-y-1">
                     <h1 className="text-3xl font-bold font-outfit tracking-tight text-slate-900">Support for <span className="text-teal-600">{patient.preferredName}</span></h1>
                     <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider leading-none">Last sync with clinical team: Today, 14:15</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-1.5 p-5 bg-teal-50/30 border border-teal-100/50 rounded-xl">
                     <p className="text-[9px] font-bold uppercase text-teal-600 tracking-wider mb-1 leading-none">Clinical Status</p>
                     <p className="text-lg font-bold text-slate-900 leading-tight">{patient.cancerType}</p>
                     <p className="text-xs text-slate-500 font-medium mt-2">{patient.statusText}</p>
                  </div>
                  <div className="space-y-1.5 p-5 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center gap-6">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-2xl text-teal-600 shadow-sm">{patient.wellbeingScore}</div>
                     <div>
                        <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider leading-none mb-1">Reported Wellbeing</p>
                        <p className="text-base font-bold text-slate-900 leading-tight">{patient.wellbeingLabel}</p>
                        <p className="text-[10px] text-teal-600 font-bold mt-1.5 uppercase leading-none">Logged {patient.lastLogDate}</p>
                     </div>
                  </div>
               </div>
            </div>
            {/* Today at a Glance Sidebar (Section C3) */}
            <div className="bg-slate-50 md:border-l border-slate-100 p-8 flex flex-col justify-center space-y-6">
               <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Today at a glance</h4>
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                     <p className="text-xs font-bold text-slate-700">Appt at 10:30am Today</p>
                  </div>
                  <div className="flex items-center gap-3 opacity-40">
                     <CheckSquare className="w-4 h-4 text-slate-300" />
                     <p className="text-xs font-bold text-slate-400">Log Submitted</p>
                  </div>
                  <div className="flex items-center gap-3 opacity-40">
                     <Activity className="w-4 h-4 text-slate-300" />
                     <p className="text-xs font-bold text-slate-400">Rehab: Pending</p>
                  </div>
               </div>
               {patient.accessLevel === 'VIEW_AND_LOG' && (
                  <button className="text-xs font-bold uppercase text-teal-600 tracking-wider mt-4 hover:text-slate-950 transition-colors text-left flex items-center gap-2 group">
                     Submit Log for {patient.preferredName.split(' ')[0]} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
               )}
            </div>
         </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <div className="space-y-10">
            {/* Upcoming Appointment Prep Card (Section C3) */}
            <GlassCard className="border-slate-100 shadow-sm !p-10 space-y-8 h-fit relative overflow-hidden bg-white/70">
               <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center shadow-sm">
                     <Calendar className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-xl font-bold font-outfit text-slate-900 border-b border-indigo-50 pb-2">Treatment Coordination</h4>
                     <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mt-1">Next Appt: {nextAppt.dateLabel}</p>
                  </div>
               </div>
               
               <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-xl space-y-3 relative z-10">
                  <p className="text-sm font-bold text-slate-800 leading-tight">Help {patient.preferredName} prepare:</p>
                  <ul className="space-y-3 pt-2">
                     {['Ensure Jane remains fasting after 2am', 'Pack infusion bag (blanket, books)', 'Confirm return transport'].map(item => (
                        <li key={item} className="flex items-start gap-3">
                           <button className="w-5 h-5 rounded-lg border-2 border-slate-200 mt-0.5" />
                           <span className="text-xs text-slate-500 font-medium italic leading-tight capitalize">{item}</span>
                        </li>
                     ))}
                  </ul>
               </div>

               <Button variant="ghost" className="w-full h-12 border-slate-100 text-slate-500 font-bold hover:bg-slate-50 gap-2 relative z-10 text-[10px] uppercase tracking-wider">
                  View Full Appointment Schedule
               </Button>
            </GlassCard>
         </div>

         <div className="space-y-10">
            {/* Care Team Card (Section C3) */}
            <GlassCard className="border-teal-100 shadow-sm !p-10 space-y-8 h-fit bg-teal-50/10">
               <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold font-outfit text-slate-900 border-b border-teal-50 pb-3">Clinical Care Team</h4>
                  <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider animate-pulse italic font-serif">Support Active</p>
               </div>
               <div className="space-y-8">
                  {/* Nurse Navigator */}
                  <div className="flex items-center justify-between group cursor-pointer hover:bg-white/50 p-2 rounded-2xl transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 font-serif ring-4 ring-white shadow-sm transition-all transform ">N</div>
                        <div>
                           <p className="text-sm font-bold text-slate-900 group-hover:text-teal-600 leading-none">Nurse Maya</p>
                           <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mt-2 leading-none">Care Coordinator</p>
                        </div>
                     </div>
                     {patient.accessLevel === 'VIEW_AND_LOG' ? (
                        <Button variant="ghost" className="h-10 px-4 rounded-xl border border-teal-100 text-teal-600 font-bold text-[10px] uppercase tracking-wider hover:bg-white shadow-sm flex items-center gap-2">
                           <MessageSquare className="w-4 h-4" /> Message
                        </Button>
                     ) : (
                        <button className="p-2 text-slate-300 pointer-events-none opacity-50"><MessageSquare className="w-5 h-5" /></button>
                     )}
                  </div>
                  {/* Primary Oncologist */}
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4 opacity-70">
                        <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-300 text-xs">Dr.</div>
                        <div>
                           <p className="text-sm font-bold text-slate-600 leading-none">Dr. Sharma</p>
                           <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mt-2 leading-none">Medical Oncologist</p>
                        </div>
                     </div>
                     <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wider w-24 text-right">Caregiver: View Only</p>
                  </div>
               </div>
            </GlassCard>

            {/* Caregiver Wellbeing Widget (Section C7 Inspiration) */}
            <div className="p-10 bg-slate-950 rounded-xl text-white overflow-hidden relative shadow-sm group cursor-pointer">
               <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-teal-500/20 to-transparent group-hover:scale-150 transition-transform duration-700" />
               <div className="relative z-10 space-y-4">
                  <h4 className="text-2xl font-bold font-outfit tracking-tight leading-tight">"Don't pour from an empty cup."</h4>
                  <p className="text-xs text-slate-400 font-medium italic leading-relaxed max-w-xs">
                     Remember to look after your own health today. Checking in on yourself helps you provide better care for Jane.
                  </p>
                  <button className="text-[10px] font-bold uppercase text-teal-400 tracking-[0.3em] flex items-center gap-2 pt-2 transition-all hover:translate-x-1">
                     Explore Caregiver Wellbeing <ChevronRight className="w-3.5 h-3.5" />
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
