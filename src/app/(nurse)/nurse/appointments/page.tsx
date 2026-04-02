import { Calendar, Clock, Video, MapPin, User, ChevronRight, Filter, Plus, MoreHorizontal, CheckCircle2 } from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Nurse Appointments/Scheduling Dashboard - Vanguard Terminal.
 * Operational view for clinical consultations and telehealth sessions.
 */
export default async function NurseAppointmentsPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.NURSE) redirect("/login");

  const appointments = [
    {
      id: 'APT-101',
      patient: 'Michael Scott',
      type: 'Telehealth',
      time: '09:00 AM',
      date: 'Today',
      purpose: 'Chemotherapy Toxicity Review',
      status: 'Ready to Join',
      priority: 'Routine'
    },
    {
      id: 'APT-102',
      patient: 'Pam Beesly',
      type: 'In-Clinic',
      time: '11:30 AM',
      date: 'Today',
      purpose: 'Cycle 3 Pre-medication Audit',
      status: 'On-Site',
      priority: 'High'
    },
    {
      id: 'APT-103',
      patient: 'Jim Halpert',
      type: 'Telehealth',
      time: '02:15 PM',
      date: 'Today',
      purpose: 'Post-Op Wound Assessment',
      status: 'Confirmed',
      priority: 'Urgent'
    },
    {
      id: 'APT-104',
      patient: 'Dwight Schrute',
      type: 'In-Clinic',
      time: '04:00 PM',
      date: 'Today',
      purpose: 'End-of-Cycle Consultation',
      status: 'Confirmed',
      priority: 'Routine'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
         <div className="space-y-1">
            <h1 className="text-5xl font-bold font-outfit text-slate-900 tracking-tight">Care <span className="text-indigo-600 underline underline-offset-8 decoration-indigo-100">Schedule</span></h1>
            <p className="text-base font-bold text-slate-600">Orchestrating {appointments.length} clinical sessions for current operating window.</p>
         </div>
         <div className="flex items-center gap-3">
            <Button variant="outline" className="h-12 px-6 gap-2 border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-wider hover:bg-slate-50">
               <Calendar className="w-4 h-4" /> View Month
            </Button>
            <Button className="h-12 px-8 gap-3 bg-slate-950 text-white font-bold text-[11px] uppercase tracking-wider shadow-sm hover:scale-105 transition-all">
               <Plus className="w-5 h-5" /> New Appointment
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 pt-4">
         
         {/* Left Side: Summary Stats & Filters */}
         <div className="space-y-8 lg:col-span-1">
            <div className="space-y-4">
               <p className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em] ml-2">Quick Stats</p>
               <div className="grid grid-cols-2 gap-4">
                  <GlassCard className="p-6 bg-white border-slate-100 text-center space-y-1 shadow-sm">
                     <p className="text-2xl font-bold font-outfit text-indigo-600">4</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Today</p>
                  </GlassCard>
                  <GlassCard className="p-6 bg-white border-slate-100 text-center space-y-1 shadow-sm">
                     <p className="text-2xl font-bold font-outfit text-emerald-600">12</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Weekly</p>
                  </GlassCard>
               </div>
            </div>

            <div className="space-y-4">
               <p className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em] ml-2">Session Type</p>
               <div className="space-y-2">
                  {['In-Clinic Red Sector', 'Institutional Telehealth', 'Support Group (Digital)'].map((f, i) => (
                     <label key={i} className="flex items-center gap-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-white transition-all group">
                        <div className="w-4 h-4 rounded border-2 border-slate-300 group-hover:border-indigo-500" />
                        <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase">{f}</span>
                     </label>
                  ))}
               </div>
            </div>

            <GlassCard className="bg-slate-950 text-white p-8 border-0 shadow-sm rounded-[36px] relative overflow-hidden group">
               <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] relative z-10">Next Session in 12m</p>
               <h4 className="text-xl font-bold font-outfit mt-2 relative z-10">Telehealth Queue</h4>
               <p className="text-xs text-slate-400 font-medium mt-2 relative z-10 leading-relaxed">
                  Michael Scott is already in the waiting room for the Toxicity Review.
               </p>
               <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-wider h-11 border-0 relative z-10 transition-all">
                  Join Room Now
               </Button>
               <Video className="absolute bottom-[-10px] right-[-10px] w-32 h-32 text-white/5  transition-transform duration-700" />
            </GlassCard>
         </div>

         {/* Middle & Right: Appointment Timeline */}
         <div className="lg:col-span-3 space-y-8">
            <h3 className="text-2xl font-bold font-outfit text-slate-900">Timeline <span className="text-indigo-600">Visibility</span></h3>
            
            <div className="space-y-6 relative ml-4 before:absolute before:left-0 before:top-4 before:bottom-4 before:w-px before:bg-slate-100">
               {appointments.map((apt, i) => (
                  <div key={apt.id} className="relative pl-12 group">
                     {/* Timeline Bullet */}
                     <div className={`absolute left-0 top-6 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow-md z-10 transition-all group-hover:scale-150 ${apt.status === 'Ready to Join' ? "bg-indigo-600" : "bg-slate-200"}`} />
                     
                     <GlassCard className={`!p-0 border-slate-100 overflow-hidden hover:border-indigo-100 transition-all shadow-sm hover:shadow-sm ${apt.status === 'Ready to Join' ? "ring-2 ring-indigo-100" : ""}`}>
                        <div className="flex items-stretch">
                           <div className="p-8 flex items-center justify-center bg-slate-50/50 border-r border-slate-100 w-32 flex-shrink-0">
                              <p className="text-lg font-bold font-outfit text-slate-900 text-center leading-none">{apt.time}</p>
                           </div>
                           <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                              <div className="space-y-1">
                                 <div className="flex items-center gap-2 mb-1">
                                    {apt.type === 'Telehealth' ? <Video className="w-3.5 h-3.5 text-indigo-500" /> : <MapPin className="w-3.5 h-3.5 text-emerald-500" />}
                                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{apt.type}</span>
                                 </div>
                                 <p className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{apt.patient}</p>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{apt.id}</p>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Purpose/Blueprint</p>
                                 <p className="text-sm font-bold text-slate-700 leading-snug">{apt.purpose}</p>
                              </div>
                              <div className="flex items-center justify-end gap-3">
                                 <div className="text-right">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${apt.status === 'Ready to Join' ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-100 text-slate-500"}`}>
                                       {apt.status}
                                    </span>
                                 </div>
                                 <Button variant="ghost" className="w-10 h-10 !p-0 rounded-xl hover:bg-slate-100"><MoreHorizontal className="w-5 h-5 text-slate-400" /></Button>
                              </div>
                           </div>
                        </div>
                     </GlassCard>
                  </div>
               ))}
            </div>

            {/* Empty State / Bottom Info */}
            <div className="p-10 border-2 border-dashed border-slate-100 rounded-xl text-center space-y-4">
               <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto text-slate-200">
                  <CheckCircle2 className="w-8 h-8" />
               </div>
               <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-900">End of Schedule</p>
                  <p className="text-xs text-slate-500 font-medium">All clinical sessions for the current operational window have been processed.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
