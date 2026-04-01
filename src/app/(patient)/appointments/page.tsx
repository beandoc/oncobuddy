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
  CalendarDays
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";

/**
 * Patient Appointments - Screen 5 (Section B7).
 * Vertical timeline view of upcoming and past clinical encounters.
 * Features clinical prep-work (fasting requirements) and call-only rescheduling info.
 */
export default async function PatientAppointmentsPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.PATIENT) redirect("/login");

  const patient = await prisma.patient.findUnique({
    where: { userId: session.user.id },
    include: {
      appointments: {
        orderBy: { scheduledDate: 'asc' },
      }
    }
  });

  const appointments = patient?.appointments || [];
  const upcoming = appointments.filter(a => new Date(a.scheduledDate) >= new Date());
  const past = appointments.filter(a => new Date(a.scheduledDate) < new Date()).reverse();

  return (
    <div className="space-y-10 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      
      {/* Page Header (Section B7) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
         <div className="space-y-4">
            <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900">My <span className="text-indigo-600">Visits</span></h1>
            <p className="text-slate-500 font-medium italic italic text-sm">Track your clinic days and prepare for your appointments.</p>
         </div>
         <div className="p-1 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-1 shadow-sm">
            <button className="px-5 py-2 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm">Timeline</button>
            <button className="px-5 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors">Calendar</button>
         </div>
      </div>

      <div className="space-y-16">
         
         {/* Upcoming Appointments (Section B7) */}
         <div className="space-y-8 relative">
            <div className="absolute left-6 top-8 bottom-0 w-1 bg-slate-50" />
            
            <h3 className="text-xl font-bold font-outfit text-slate-900 flex items-center gap-3 relative z-10">
               <div className="w-12 h-12 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-100">
                  <CalendarDays className="w-6 h-6 text-indigo-600" />
               </div>
               Upcoming
            </h3>

            {(upcoming.length > 0) ? upcoming.map((app, i) => (
               <div key={app.id} className="relative pl-20 group">
                  <GlassCard className={`!p-10 border-slate-100 shadow-xl overflow-hidden group-hover:border-indigo-100 transition-all ${i === 0 ? 'bg-white ring-1 ring-indigo-50 shadow-indigo-100/30' : 'bg-slate-50/30 border-dashed'}`}>
                     <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
                        <div className="space-y-6 flex-1">
                           <div className="space-y-2">
                              <p className="text-3xl font-bold font-outfit text-slate-900 italic italic">{new Date(app.scheduledDate).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                              <div className="flex items-center gap-6 text-indigo-600 font-black text-sm tracking-widest uppercase mt-4">
                                 <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {new Date(app.scheduledDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                 <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full" />
                                 <span>Clinic Visit</span>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                              <div className="flex items-center gap-4 group/item">
                                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover/item:bg-white border border-slate-100 transition-colors">
                                    <User className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600" />
                                 </div>
                                 <div>
                                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Clinician</p>
                                    <p className="text-sm font-bold text-slate-700">{app.attendingClinician || "Oncology Team"}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4 group/item">
                                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover/item:bg-white border border-slate-100 transition-colors">
                                    <MapPin className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600" />
                                 </div>
                                 <div>
                                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Location</p>
                                    <p className="text-sm font-bold text-slate-700">Oncology Wing A, Level 3</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Prep Section (Section B7) */}
                        <div className="w-full lg:w-72 p-6 bg-amber-50 rounded-[32px] border border-amber-100/50 space-y-4">
                           <div className="flex items-center gap-2 text-amber-600">
                              <ShieldAlert className="w-5 h-5 fill-amber-600/10" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Appointment Check</span>
                           </div>
                           <p className="text-xs font-bold italic italic leading-relaxed text-amber-900/70">
                              Please remember to bring your most recent pathology report and a list of your current medications.
                           </p>
                           <hr className="border-amber-100" />
                           <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Reschedule Call only</p>
                           <a href="tel:+91222222222" className="flex items-center gap-2 text-xs font-bold hover:text-rose-600 transition-colors">
                              <PhoneCall className="w-4 h-4" /> 022-2222-2222
                           </a>
                        </div>
                     </div>
                  </GlassCard>
               </div>
            )) : (
               <div className="pl-20 py-12 opacity-30 italic font-medium text-slate-400 text-sm">No upcoming appointments scheduled.</div>
            )}
         </div>

         {/* Past Appointments (Section B7) */}
         <div className="space-y-8 relative">
            <div className="absolute left-6 top-8 bottom-0 w-1 bg-slate-50" />
            <h3 className="text-xl font-bold font-outfit text-slate-300 flex items-center gap-3 relative z-10">
               <div className="w-12 h-12 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center shadow-lg shadow-slate-50">
                  <History className="w-6 h-6 text-slate-300" />
               </div>
               Past Visits
            </h3>

            {past.map(app => (
               <div key={app.id} className="relative pl-20 group">
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] flex items-center justify-between group hover:bg-white transition-all cursor-pointer">
                     <div className="flex items-center gap-6">
                         <div className="text-center w-12 flex flex-col pt-1">
                            <span className="text-xs font-black uppercase text-indigo-600 leading-none">{new Date(app.scheduledDate).toLocaleDateString(undefined, { month: 'short' })}</span>
                            <span className="text-xl font-black font-outfit text-slate-900">{new Date(app.scheduledDate).getDate()}</span>
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-700 leading-none group-hover:text-indigo-600">Clinical Review</p>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1.5 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Attended</p>
                         </div>
                     </div>
                     <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-300 transition-transform group-hover:translate-x-1" />
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Rescheduling Disclaimer (Section B7) */}
      <GlassCard className="bg-slate-50 border-slate-100 !p-8 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="space-y-2 text-center md:text-left max-w-xl">
            <h4 className="text-lg font-bold font-outfit text-slate-900 leading-none">Need to reschedule?</h4>
            <p className="text-xs text-slate-500 font-medium italic lowercase">To ensure clinical safety, appointments can only be rescheduled over the phone. Online rescheduling is currently not available for Oncology departments.</p>
         </div>
         <Button variant="ghost" className="h-12 px-8 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-white flex items-center gap-2">
            <PhoneCall className="w-4 h-4" /> Call Clinic Support
         </Button>
      </GlassCard>
    </div>
  );
}
