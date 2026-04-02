import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  MoreHorizontal,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight
} from "lucide-react";
import { Role } from "@prisma/client";

/**
 * Oncologist My Calendar - Screen 4.
 * High-performance clinical scheduling hub with deep patient context.
 * Features a three-pane architecture: Date Navigation, Timeline, and Preparation Detail. (Section 4).
 */
export default async function OncologistCalendar() {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  // Fetch upcoming clinical appointments (Section 4)
  const appointments = await prisma.appointment.findMany({
    where: { 
      attendingClinician: session.user.id,
      scheduledDate: { gte: new Date() }
    },
    include: { 
      patient: {
        include: { user: true }
      }
    },
    orderBy: { scheduledDate: 'asc' },
    take: 10
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full pb-20 animate-in fade-in duration-700">
      
      {/* Left Pane: Date Navigation & Sync Status (Section 4) */}
      <div className="w-full lg:w-80 space-y-8">
         <GlassCard className="!p-6 border-slate-100 bg-white shadow-sm shadow-slate-100/50">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-bold font-outfit text-slate-900 leading-none">Schedule <span className="text-indigo-600">Sync</span></h3>
               <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full border border-slate-50"><ChevronLeft className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full border border-slate-50"><ChevronRight className="w-4 h-4" /></Button>
               </div>
            </div>
            
            {/* Custom Calendar Grid (Visual Prototype) */}
            <div className="grid grid-cols-7 gap-1 mb-6 text-center">
               {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                  <span key={d} className="text-[10px] font-bold text-slate-300 py-2">{d}</span>
               ))}
               {Array.from({ length: 31 }).map((_, i) => (
                  <div key={i} className={`aspect-square flex items-center justify-center rounded-xl text-[11px] font-bold transition-all cursor-pointer ${i === 11 ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>
                     {i + 1}
                     {/* Indicator for Appts */}
                     {([3, 11, 15, 22].includes(i+1)) && (
                        <div className={`absolute bottom-1 w-1 h-1 rounded-full ${i === 11 ? 'bg-white' : 'bg-indigo-400'}`} />
                     )}
                  </div>
               ))}
            </div>

            <div className="pt-6 border-t border-slate-50 space-y-4">
               <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">EMR Connection</p>
                  <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500 uppercase tracking-wider">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
                  </span>
               </div>
               <p className="text-[10px] text-slate-500 italic leading-relaxed">External FHIR sync active. 4 updates since login.</p>
               <Button className="w-full h-11 bg-white border border-slate-100 text-indigo-600 font-bold hover:bg-indigo-50 text-xs shadow-sm">Sync Now</Button>
            </div>
         </GlassCard>

         <GlassCard className="!p-6 border-amber-100 bg-amber-50/20 shadow-none">
            <h4 className="text-xs font-bold uppercase text-amber-600 tracking-wider mb-3 flex items-center gap-2">
               <AlertCircle className="w-3.5 h-3.5" /> High Precision Tasks
            </h4>
            <div className="space-y-4">
               <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                  <p className="text-[10px] text-amber-900 font-medium leading-relaxed">Review preparation labs for Mr. J. Doe (10:30am appt).</p>
               </div>
               <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                  <p className="text-[10px] text-amber-900 font-medium leading-relaxed">Confirm infusion chair availability for Screen 14.</p>
               </div>
            </div>
         </GlassCard>
      </div>

      {/* Center Pane: Timeline (Section 4) */}
      <div className="flex-1 space-y-8">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900">Clinical <span className="text-indigo-600">Timeline</span></h1>
               <p className="text-slate-500 font-medium">Friday, October 12th — Panel Visibility Active.</p>
            </div>
            <Button variant="secondary" className="h-12 px-8 gap-3 bg-slate-950 font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all">
               <Plus className="w-5 h-5" /> New Appointment
            </Button>
         </div>

         <div className="space-y-4 pt-4">
            {appointments.length > 0 ? (
               appointments.map((appt: any, i: number) => {
                  const timeStr = new Date(appt.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                  const isAm = new Date(appt.scheduledDate).getHours() < 12;
                  
                  return (
                     <GlassCard key={appt.id} className={`!p-0 border-0 group transition-all hover:translate-x-2 relative overflow-hidden bg-white hover:shadow-sm hover:shadow-indigo-50`}>
                        <div className="flex items-stretch">
                           <div className="w-24 p-6 flex flex-col items-center justify-center border-r border-slate-50 bg-slate-50/30">
                              <span className="text-base font-bold text-slate-900 font-serif leading-none">{timeStr}</span>
                              <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider mt-2">{isAm ? 'AM' : 'PM'}</span>
                           </div>
                           <div className="flex-1 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                              <div className="flex items-center gap-6">
                                 <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100  transition-all">
                                    <User className="w-5 h-5" />
                                 </div>
                                 <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-800 leading-none italic underline decoration-transparent group-hover:decoration-indigo-200 decoration-2 underline-offset-4 transition-all">
                                       {appt.patient.preferredName || `${appt.patient.user.firstName} ${appt.patient.user.lastName}`}
                                    </p>
                                    <div className="flex items-center gap-3 pt-2">
                                       <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">{appt.appointmentType.replace(/_/g, ' ')}</span>
                                       <div className="w-1 h-1 rounded-full bg-slate-200" />
                                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">{appt.patient.mrn}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider leading-none border shadow-sm ${appt.status === 'CONFIRMED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                                    {appt.status}
                                 </div>
                                 <Link href={`/oncologist/patients/${appt.patient.publicId}`} className="h-10 w-10 p-0 border border-slate-100 rounded-xl hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <ArrowUpRight className="w-4 h-4" />
                                 </Link>
                              </div>
                           </div>
                        </div>
                     </GlassCard>
                  );
               })
            ) : (
               <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-100">
                     <CalendarIcon className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">No upcoming clinical appointments synchronized for today.</p>
               </div>
            )}
         </div>
      </div>

      {/* Right Pane: Contextual Sidebar (Section 4) */}
      <div className="w-full lg:w-96 space-y-8 bg-slate-50/50 p-8 rounded-xl border border-slate-100 shadow-inner">
         <div className="space-y-2">
            <h3 className="text-xl font-bold font-outfit text-slate-900 border-b border-indigo-100 pb-2">Preparation <span className="text-indigo-600">Insight</span></h3>
            <p className="text-[11px] text-slate-500 font-medium">Next patient coordination details.</p>
         </div>

         <GlassCard className="!p-8 bg-white border-indigo-50 shadow-sm shadow-indigo-100/30 scale-105 origin-top translate-y-4">
            <div className="flex items-center gap-6 mb-8">
               <div className="w-16 h-16 rounded-3xl bg-indigo-600 shadow-sm shadow-indigo-100 flex items-center justify-center font-bold text-white text-2xl">J</div>
               <div className="space-y-1">
                  <p className="text-xl font-bold text-slate-900 leading-none">John Doe</p>
                  <p className="text-[10px] font-bold uppercase text-indigo-500 tracking-[0.2em] pt-2">Scheduled: 10:30am</p>
               </div>
            </div>

            <div className="space-y-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                     <Clock className="w-3.5 h-3.5" /> Prep Checklist
                  </p>
                  <div className="space-y-3">
                     {[
                        { label: 'Blood Labs Review', done: true },
                        { label: 'Hydration Protocol', done: true },
                        { label: 'Infusion Chair Signed', done: false }
                     ].map((item, j) => (
                        <div key={item.label} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                           <span className="text-[10px] font-bold text-slate-600">{item.label}</span>
                           {item.done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200" />}
                        </div>
                     ))}
                  </div>
               </div>

               <Button className="w-full h-14 bg-indigo-600 hover:bg-slate-950 font-bold text-xs uppercase tracking-wider text-white shadow-sm shadow-indigo-100 transition-all active:scale-95 group">
                  Open Clinical Record <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </Button>
            </div>
         </GlassCard>

         <div className="pt-12 space-y-6">
            <div className="space-y-2">
               <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Clinical Environment</h4>
               <p className="text-xs font-bold text-slate-700">Room 402 - Level 4 Oncology</p>
            </div>
            <div className="flex gap-3">
               <Button variant="outline" className="flex-1 h-12 bg-white border-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-wider shadow-sm">View Map</Button>
               <Button variant="outline" className="flex-1 h-12 bg-white border-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-wider shadow-sm">Triage Desk</Button>
            </div>
         </div>
      </div>
    </div>
  );
}
