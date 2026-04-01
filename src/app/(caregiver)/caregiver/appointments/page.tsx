import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  ChevronRight, 
  ShieldAlert, 
  CheckCircle2, 
  History,
  PhoneCall,
  CalendarDays,
  Info,
  CheckSquare
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";

/**
 * Caregiver Appointments Hub - Screen 3 (Section C5).
 * Detailed view into the patient's schedule to support logistics and preparation.
 * Includes vertical timeline, preparatory checklists, and appointment type legend.
 */
export default async function CaregiverAppointmentsPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.CAREGIVER) redirect("/login");

  // Mock patient context for Jane Doe
  const patientName = "Jane Doe";
  const appointments = [
    { id: 1, title: "Oncology Clinic Appointment", date: new Date("2026-03-12T10:30:00"), location: "Wing A, Level 3", attending: "Dr. Sharma", status: "SCHEDULED", prep: "Ensure Jane fasting after 2am. Pack pathology report from last visit." },
    { id: 2, title: "Blood Work", date: new Date("2026-03-10T11:45:00"), location: "Lab 2, Basement", attending: "Lab Technicians", status: "ATTENDED", prep: null },
  ];

  const upcoming = appointments.filter(a => new Date(a.date) >= new Date());
  const past = appointments.filter(a => new Date(a.date) < new Date()).reverse();

  return (
    <div className="space-y-10 selection:bg-teal-100 selection:text-teal-900 pb-20">
      
      {/* Page Header (Section C5) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
         <div className="space-y-4">
            <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900 italic italic">{patientName}'s <span className="text-teal-600">Visits</span></h1>
            <p className="text-sm text-slate-500 font-medium italic italic">Help manage {patientName.split(' ')[0]}'s coordination and logistics.</p>
         </div>
      </div>

      <div className="space-y-16">
         
         {/* Upcoming Appointments (Section C5) */}
         <div className="space-y-8 relative">
            <div className="absolute left-6 top-8 bottom-0 w-1 bg-slate-50" />
            
            <h3 className="text-xl font-bold font-outfit text-slate-900 flex items-center gap-3 relative z-10">
               <div className="w-12 h-12 bg-white border-2 border-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-100">
                  <CalendarDays className="w-6 h-6 text-teal-600" />
               </div>
               Help Coordinate
            </h3>

            {(upcoming.length > 0) ? upcoming.map((app, i) => (
               <div key={app.id} className="relative pl-16 md:pl-20 group">
                  <GlassCard className={`!p-10 border-slate-100 shadow-xl overflow-hidden group-hover:border-teal-100 transition-all ${i === 0 ? 'bg-white ring-1 ring-teal-50 shadow-teal-100/30' : 'bg-slate-50/30 border-dashed'}`}>
                     <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
                        <div className="space-y-6 flex-1">
                           <div className="space-y-2">
                              <p className="text-3xl font-bold font-outfit text-slate-900 italic italic">{new Date(app.date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                              <div className="flex items-center gap-6 text-teal-600 font-black text-[10px] tracking-widest uppercase mt-4">
                                 <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {new Date(app.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                 <div className="w-1.5 h-1.5 bg-teal-200 rounded-full" />
                                 <span>Clinic Visit</span>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                              <div className="flex items-center gap-4 group/item">
                                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover/item:bg-white border border-slate-100 transition-colors">
                                    <User className="w-4 h-4 text-slate-400 group-hover/item:text-teal-600" />
                                 </div>
                                 <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">Clinician</p>
                                    <p className="text-sm font-bold text-slate-700 leading-none">{app.attending}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4 group/item">
                                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover/item:bg-white border border-slate-100 transition-colors">
                                    <MapPin className="w-4 h-4 text-slate-400 group-hover/item:text-teal-600" />
                                 </div>
                                 <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">Location</p>
                                    <p className="text-sm font-bold text-slate-700 leading-none">{app.location}</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Prep Checklist Button (Section C5) */}
                        <div className="w-full lg:w-80 p-8 bg-teal-50 ring-1 ring-teal-100/50 rounded-[40px] space-y-6">
                           <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 text-teal-600">
                                 <ShieldAlert className="w-5 h-5 fill-teal-600/10" />
                                 <span className="text-[10px] font-black uppercase tracking-widest leading-none">Help Checklist</span>
                              </div>
                              <p className="text-[9px] font-bold text-teal-400 uppercase italic">Local only</p>
                           </div>
                           <div className="space-y-4">
                              <p className="text-xs font-bold italic italic leading-relaxed text-teal-950/70 border-b border-teal-100/50 pb-3">Jane must fast after 2am tonight.</p>
                              <Button variant="ghost" className="w-full h-11 bg-white hover:bg-teal-100 border-teal-100/50 text-teal-600 font-bold text-[10px] uppercase tracking-widest gap-2 shadow-sm shadow-teal-500/5">
                                 <CheckSquare className="w-4 h-4" /> Start Prep List
                              </Button>
                           </div>
                        </div>
                     </div>
                  </GlassCard>
               </div>
            )) : (
               <div className="pl-20 py-12 opacity-30 italic font-medium text-slate-400 text-sm">No upcoming appointments scheduled.</div>
            )}
         </div>

         {/* Past Appointments (Section C5) */}
         <div className="space-y-8 relative">
            <div className="absolute left-6 top-8 bottom-0 w-1 bg-slate-50" />
            <h3 className="text-xl font-bold font-outfit text-slate-300 flex items-center gap-3 relative z-10">
               <div className="w-12 h-12 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center shadow-lg shadow-slate-50">
                  <History className="w-6 h-6 text-slate-300" />
               </div>
               Past History
            </h3>

            {past.map(app => (
               <div key={app.id} className="relative pl-16 md:pl-20 group">
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] flex items-center justify-between group hover:bg-white transition-all cursor-pointer">
                     <div className="flex items-center gap-6">
                         <div className="text-center w-12 flex flex-col pt-1">
                            <span className="text-[10px] font-black uppercase text-teal-600 leading-none">{new Date(app.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                            <span className="text-xl font-black font-outfit text-slate-900">{new Date(app.date).getDate()}</span>
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-700 leading-none group-hover:text-teal-600">{app.title}</p>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1.5 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Completed</p>
                         </div>
                     </div>
                     <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-teal-300 transition-transform group-hover:translate-x-1" />
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Appointment Legend (Section C5) */}
      <div className="p-8 border border-slate-100 rounded-[32px] bg-slate-50/50 flex flex-wrap items-center gap-8 justify-center">
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-teal-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clinic Visit</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lab / Blood Work</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Imaging / Scan</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest underline underline-offset-4 decoration-rose-300">Missed / Canceled</span>
         </div>
      </div>
    </div>
  );
}
