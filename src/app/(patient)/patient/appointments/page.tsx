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
  Activity
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";
import Link from "next/link";

/**
 * Patient Appointments - Screen 5 (Section B7).
 * Vertical timeline view of upcoming and past clinical encounters.
 * Optimized for high-contrast (slate-950) visibility and clear clinical prep work.
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
    <div className="space-y-12 selection:bg-indigo-100 selection:text-indigo-900 pb-24 animate-in fade-in duration-700">
      
      {/* Page Header (Section B7) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
         <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-outfit tracking-tighter text-slate-950">Clinic <span className="text-indigo-600">Timeline</span></h1>
            <p className="text-slate-700 font-bold italic leading-relaxed max-w-2xl">Visualizing your clinical roadmap and consultation schedule.</p>
         </div>
         <div className="p-1.5 bg-slate-100 border-2 border-slate-50 rounded-[28px] flex items-center gap-2 shadow-inner">
            <button className="px-8 py-2.5 bg-white text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-2xl shadow-sm shadow-indigo-100 ring-1 ring-indigo-50">Operational</button>
            <button className="px-8 py-2.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider hover:text-slate-900 transition-colors">Calendar</button>
         </div>
      </div>

      <div className="space-y-20">
         
         {/* Upcoming Appointments (Section B7) */}
         <div className="space-y-10 relative">
            <div className="absolute left-7 top-10 bottom-0 w-1.5 bg-slate-100 shadow-inner" />
            
            <h3 className="text-2xl font-bold font-outfit text-slate-950 flex items-center gap-4 relative z-10 px-2">
               <div className="w-14 h-14 bg-white border-4 border-indigo-600 rounded-full flex items-center justify-center shadow-sm shadow-indigo-100 transition-transform hover:rotate-6">
                  <CalendarDays className="w-8 h-8 text-indigo-600" />
               </div>
               Active Appointments
            </h3>

            {(upcoming.length > 0) ? upcoming.map((app, i) => (
               <div key={app.id} className="relative pl-24 group">
                  <GlassCard className={`!p-12 border-2 border-slate-100 shadow-sm overflow-hidden group-hover:border-indigo-200 transition-all rounded-[48px] ${i === 0 ? 'bg-white ring-2 ring-indigo-50 shadow-indigo-100/40 translate-x-1' : 'bg-slate-50/20 border-dashed'}`}>
                     <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 relative z-10">
                        <div className="space-y-8 flex-1">
                           <div className="space-y-4">
                              <p className="text-4xl md:text-5xl font-bold font-outfit text-slate-950 italic tracking-tight">{new Date(app.scheduledDate).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                              <div className="flex items-center gap-8 text-indigo-600 font-bold text-sm tracking-[0.2em] uppercase mt-6 bg-indigo-50 px-6 py-2 rounded-full border border-indigo-100 w-fit">
                                 <span className="flex items-center gap-3"><Clock className="w-5 h-5" /> {new Date(app.scheduledDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                 <div className="w-2 h-2 bg-indigo-200 rounded-full" />
                                 <span className="flex items-center gap-3"><Activity className="w-5 h-5 shadow-sm" /> Clinical Hub</span>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                              <div className="flex items-center gap-6 group/item p-3 rounded-2xl hover:bg-white border-2 border-transparent hover:border-slate-50 transition-all">
                                 <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all shadow-inner border border-slate-100">
                                    <User className="w-6 h-6" />
                                 </div>
                                 <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-slate-600 tracking-wider leading-none">Clinician Assigned</p>
                                    <p className="text-base font-bold text-slate-950">{app.attendingClinician || "Dr. Singh & Oncology Team"}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-6 group/item p-3 rounded-2xl hover:bg-white border-2 border-transparent hover:border-slate-50 transition-all">
                                 <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all shadow-inner border border-slate-100">
                                    <MapPin className="w-6 h-6" />
                                 </div>
                                 <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-slate-600 tracking-wider leading-none">Clinic Location</p>
                                    <p className="text-base font-bold text-slate-950">Oncology Wing A, Level 3</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Prep Section (High Visibility) */}
                        <div className="w-full lg:w-80 p-8 bg-amber-50 rounded-xl border-2 border-amber-100/50 space-y-6 shadow-sm shadow-amber-50/50">
                           <div className="flex items-center gap-4 text-amber-700">
                              <div className="w-10 h-10 rounded-xl bg-white border border-amber-100 flex items-center justify-center shadow-sm"><ShieldAlert className="w-6 h-6" /></div>
                              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Prep Protocol</span>
                           </div>
                           <p className="text-sm font-bold italic leading-relaxed text-amber-950/80">
                              MANDATORY: Bring your PET-CT history and all active medication strips. Fasting is required if noted in your portal messages.
                           </p>
                           <hr className="border-amber-200" />
                           <div className="space-y-1">
                              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Reschedule Inquiry Only</p>
                              <a href="tel:+91222222222" className="flex items-center gap-3 text-sm font-bold text-slate-950 hover:text-rose-600 transition-colors">
                                 <PhoneCall className="w-5 h-5 text-rose-600" /> 022-2222-2222
                              </a>
                           </div>
                        </div>
                     </div>
                  </GlassCard>
               </div>
            )) : (
               <div className="pl-24 py-16 opacity-40 font-bold text-slate-400 text-base uppercase tracking-[0.3em]">Operational Timeline Empty</div>
            )}
         </div>

         {/* Past Appointments - High Contrast (Section B7) */}
         <div className="space-y-10 relative">
            <div className="absolute left-7 top-10 bottom-0 w-1.5 bg-slate-100 shadow-inner" />
            <h3 className="text-2xl font-bold font-outfit text-slate-300 flex items-center gap-4 relative z-10 px-2">
               <div className="w-14 h-14 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center shadow-sm shadow-slate-50 transition-transform">
                  <History className="w-8 h-8 text-slate-300" />
               </div>
               Clinical History
            </h3>

            {past.map(app => (
               <div key={app.id} className="relative pl-24 group">
                  <div className="p-8 bg-white border-2 border-slate-50 rounded-xl flex items-center justify-between group hover:border-indigo-100 hover:shadow-sm transition-all cursor-pointer shadow-sm">
                     <div className="flex items-center gap-10">
                          <div className="text-center w-16 flex flex-col pt-1 border-r-2 border-slate-50 pr-4">
                             <span className="text-[11px] font-bold uppercase text-indigo-600 leading-none mb-1 tracking-wider">{new Date(app.scheduledDate).toLocaleDateString(undefined, { month: 'short' })}</span>
                             <span className="text-3xl font-bold font-outfit text-slate-950">{new Date(app.scheduledDate).getDate()}</span>
                          </div>
                          <div className="space-y-2">
                             <p className="text-xl font-bold text-slate-950 leading-none group-hover:text-indigo-600 transition-colors">Case Record: Consultation Summary</p>
                             <p className="text-[11px] font-bold uppercase text-slate-600 tracking-wider flex items-center gap-3">
                                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Attended</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
                                <span>Dr. {app.attendingClinician || 'Lead Oncology'}</span>
                             </p>
                          </div>
                     </div>
                     <ChevronRight className="w-8 h-8 text-slate-200 group-hover:text-indigo-600 transition-transform group-hover:translate-x-2" />
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Rescheduling Disclaimer - High Visibility (Section B7) */}
      <GlassCard className="bg-slate-950 border-slate-800 !p-12 flex flex-col md:flex-row items-center justify-between gap-12 rounded-[48px] shadow-[0_40px_80px_rgba(0,0,0,0.2)]">
         <div className="space-y-4 text-center md:text-left max-w-2xl">
            <h4 className="text-3xl font-bold font-outfit text-white leading-none">Appointment Discrepancy?</h4>
            <p className="text-base text-slate-400 font-bold italic leading-relaxed">
               Online rescheduling is disabled for clinical safety. If you need to modify your visit, please consult Clinic Support via the hotline below.
            </p>
         </div>
         <Button variant="ghost" className="h-16 px-12 rounded-full border-2 border-white/20 text-white font-bold uppercase text-xs tracking-wider hover:bg-white hover:text-black gap-3 transition-all flex items-center shadow-sm">
            <PhoneCall className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Support Hotline
         </Button>
      </GlassCard>
    </div>
  );
}
