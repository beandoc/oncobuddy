import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Bell, 
  Search, 
  Filter, 
  ChevronRight, 
  PhoneCall, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ExternalLink
} from "lucide-react";
import { Role, AlertStatus, AlertSeverity } from "@prisma/client";

/**
 * Nurse Alert Inbox - Screen 3 (Default Landing).
 * The primary operational queue for front-line responders.
 * Severity-first ordering with mandatory clinical standby.
 */
export default async function NurseAlertInbox() {
  const session = await auth();
  if (!session || session.user.role !== Role.NURSE) redirect("/login");

  const alerts = await prisma.alert.findMany({
    where: { alertStatus: { in: [AlertStatus.PENDING, AlertStatus.ACKNOWLEDGED] } },
    include: {
      log: {
        include: {
          patient: true
        }
      }
    },
    orderBy: [
      { alertSeverity: 'desc' }, 
      { createdAt: 'asc' }
    ]
  });

  const unacknowledgedAlerts = alerts.filter(a => a.alertStatus === AlertStatus.PENDING);
  const acknowledgedAlerts = alerts.filter(a => a.alertStatus === AlertStatus.ACKNOWLEDGED);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Inbox Header (Section A3) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
         <div className="space-y-1">
            <h1 className="text-5xl font-black font-outfit tracking-tight text-slate-900 italic italic">Alert <span className="text-rose-600 underline underline-offset-8 decoration-rose-100">Inbox</span></h1>
            <p className="text-base font-bold text-slate-600 italic">Active clinical monitoring queue for {session.user.name}.</p>
         </div>
         <div className="flex items-center gap-3">
            <Button variant="outline" className="h-12 px-6 gap-2 font-black text-[10px] uppercase tracking-widest border-slate-200 text-slate-600 hover:bg-slate-50">
               <Filter className="w-3.5 h-3.5" /> Sector Filter
            </Button>
            <Button variant="secondary" className="h-12 px-8 gap-3 bg-slate-950 text-white font-black text-[11px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
               <CheckCircle2 className="w-5 h-5" /> Bulk Resolve
            </Button>
         </div>
      </div>

      {/* Severity Counters (Section A3) - High Contrast */}
      <div className="flex flex-wrap gap-4">
         {[
           { label: 'Emergency', count: 1, color: 'bg-rose-600 text-rose-600' },
           { label: 'Urgent', count: 3, color: 'bg-orange-600 text-orange-600' },
           { label: 'Waitlist', count: 12, color: 'bg-indigo-600 text-indigo-600' }
         ].map(s => (
            <div key={s.label} className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-slate-100 shadow-sm transition-all hover:translate-y-[-2px] cursor-pointer group hover:border-indigo-100">
               <div className={`w-2.5 h-2.5 rounded-full ${s.color.split(' ')[0]}`} />
               <span className="text-[11px] font-black uppercase text-slate-900 tracking-widest leading-none">{s.label}: {s.count}</span>
            </div>
         ))}
      </div>

      {/* Unacknowledged Alerts Section (Section A3) */}
      <div className="space-y-8">
         <h3 className="text-2xl font-black font-outfit text-slate-900 italic flex items-center gap-3">
            High Priority Active Queue
            <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-tighter">{unacknowledgedAlerts.length} PENDING</span>
         </h3>
         
         <div className="space-y-5">
            {unacknowledgedAlerts.map(alert => (
               <GlassCard key={alert.id} className={`!p-0 border-slate-100 group transition-all hover:shadow-2xl hover:shadow-indigo-100 overflow-hidden relative rounded-[40px]`}>
                  {/* Severity Border (Section A3) */}
                  <div className={`absolute left-0 top-0 bottom-0 w-2.5 ${alert.alertSeverity === AlertSeverity.URGENT ? "bg-rose-600" : "bg-orange-500"}`} />
                  
                  <div className="p-10 pl-12 flex flex-col gap-10">
                     <div className="flex flex-col xl:flex-row gap-12 justify-between">
                        {/* Patient Identity (Section A3) */}
                        <div className="flex items-center gap-6 min-w-[320px]">
                           <div className="w-16 h-16 rounded-full bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center font-black text-slate-200 text-2xl relative overflow-hidden">
                              {alert.log.patient.preferredName?.charAt(0)}
                              <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors" />
                           </div>
                           <div className="space-y-1">
                              <p className="text-xl font-black text-slate-900 leading-tight flex items-center gap-2 italic uppercase">
                                 {alert.log.patient.preferredName || "Patient"}
                              </p>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1 leading-none italic">MRN: {alert.log.patient.mrn}</p>
                              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-2 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit">Stage II Breast Cancer</p>
                           </div>
                        </div>

                        {/* Alert Detail (Section A3) */}
                        <div className="flex-1 space-y-4">
                           <div className="flex items-center gap-3">
                               <p className="text-base font-black text-rose-600 uppercase tracking-tighter italic italic">Consecutive Grade 3 Threshold Breach</p>
                               <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest leading-none">Vect: {alert.alertType.replace(/_/g, ' ')}</span>
                           </div>
                           <p className="text-sm text-slate-600 font-bold italic leading-relaxed max-w-xl">
                              Patient reported nausea at G3 intensity for 4 consecutive days. Threshold breach detected in current treatment cycle.
                           </p>
                           <div className="flex items-center gap-6 pt-2">
                              {/* Symptom Sparkline Prototype (Section A3) */}
                              <div className="h-10 w-48 flex items-end gap-1.5 opacity-80 bg-slate-50 p-2 rounded-xl">
                                 {[2, 2, 1, 3, 3, 3, 3, 3].map((g, i) => (
                                    <div key={i} className={`flex-1 rounded-lg transition-all ${g >= 3 ? "bg-rose-600 shadow-sm shadow-rose-200" : "bg-emerald-500"}`} style={{ height: `${(g/4)*100}%` }} />
                                 ))}
                              </div>
                              <div className="flex flex-col">
                                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none italic">Incident Window</p>
                                 <p className="text-[10px] text-slate-900 font-black flex items-center gap-1 uppercase tracking-widest mt-1 italic"><Clock className="w-3.5 h-3.5" /> 2h 14m ago</p>
                              </div>
                           </div>
                        </div>

                        {/* Status / Oncologist Info (Section A3) */}
                        <div className="xl:text-right min-w-[240px]">
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Oncologist Lead</p>
                           <p className="text-sm font-black text-slate-900 leading-none italic italic">Dr. oncologistTeam</p>
                           <p className="text-[10px] text-rose-600 font-black uppercase tracking-[0.1em] mt-2 italic">Awaiting Nurse Triage</p>
                           <div className="mt-8 flex xl:justify-end gap-2">
                              <Button variant="ghost" size="sm" className="h-10 px-6 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-950 border border-transparent hover:border-slate-100 rounded-2xl transition-all">Ignore Segment</Button>
                              <Button variant="secondary" size="sm" className="h-10 px-6 bg-indigo-600 hover:bg-slate-950 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl transition-all">Acknowledge</Button>
                           </div>
                        </div>
                     </div>

                     {/* Action Buttons Row - High Priority (Section A3) */}
                     <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                           <Button className="h-11 px-6 gap-3 bg-white border-2 border-emerald-100 text-emerald-700 hover:bg-emerald-50 font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-sm transition-all group">
                              <PhoneCall className="w-4 h-4 group-hover:animate-shake" /> Direct Dial Patient
                           </Button>
                           <Button className="h-11 px-6 gap-3 bg-white border-2 border-indigo-50 text-indigo-700 hover:bg-indigo-50 font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-sm transition-all group">
                              <MessageSquare className="w-4 h-4" /> Message Sync
                           </Button>
                        </div>
                        <div className="flex items-center gap-4">
                           <Button variant="ghost" className="h-11 px-6 gap-3 text-[10px] font-black text-slate-600 hover:bg-slate-50 uppercase tracking-widest rounded-2xl italic">
                              Full Toxicity Log <ExternalLink className="w-4 h-4" />
                           </Button>
                           <div className="h-8 w-px bg-slate-100 mx-2" />
                           <Button variant="ghost" className="h-11 px-6 gap-3 text-[10px] font-black text-rose-600 hover:bg-rose-50 uppercase tracking-widest rounded-2xl italic">
                              Escalate Breach <AlertTriangle className="w-5 h-5 shadow-rose-200" />
                           </Button>
                        </div>
                     </div>
                  </div>
               </GlassCard>
            ))}
         </div>
      </div>

      {/* Acknowledged - Pending Resolution (Section A3) */}
      <div className="space-y-8 pt-20">
         <div className="w-full h-px bg-slate-100 relative">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 bg-white text-[11px] font-black uppercase text-slate-300 tracking-[0.4em] selection:bg-transparent">System Lifecycle Divider</span>
         </div>
         <h3 className="text-2xl font-black font-outfit text-slate-400 flex items-center gap-4 italic italic">
            Monitoring & Resolution
            <span className="px-3 py-1 bg-slate-50 text-slate-400 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-tighter">RESOLVED: 42 (Today)</span>
         </h3>
         
         <div className="p-20 text-center border-4 border-dashed border-slate-50 rounded-[64px] group hover:border-indigo-50 transition-all cursor-default">
            <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto text-slate-200 group-hover:scale-110 group-hover:text-indigo-200 transition-all duration-700">
               <CheckCircle2 className="w-10 h-10" />
            </div>
            <p className="text-lg font-black text-slate-300 font-outfit uppercase tracking-[0.2em] mt-8 italic">No Segment Latency Detected</p>
         </div>
      </div>
    </div>
  );
}
