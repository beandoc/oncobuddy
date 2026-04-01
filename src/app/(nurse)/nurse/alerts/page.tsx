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
  UserCircle2,
  Clock,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { Role, AlertStatus, AlertSeverity } from "@prisma/client";

/**
 * Nurse Alert Inbox - Screen 3 (Default Landing).
 * The primary operational queue for front-line responders.
 * Severity-first ordering with mandatory shift awareness.
 */
export default async function NurseAlertInbox() {
  const session = await auth();
  if (!session || session.user.role !== Role.NURSE) redirect("/login");

  // Fetch alerts in strict severity order (Section A3)
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
      { alertSeverity: 'desc' }, // EMERGENCY/URGENT first
      { createdAt: 'asc' }       // Oldest first within severity (most overdue)
    ]
  });

  const unacknowledgedAlerts = alerts.filter(a => a.alertStatus === AlertStatus.PENDING);
  const acknowledgedAlerts = alerts.filter(a => a.alertStatus === AlertStatus.ACKNOWLEDGED);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Shift Awareness Banner (Section A3) */}
      <GlassCard className="!p-0 border-amber-200 bg-amber-50/50 shadow-amber-100/10 overflow-hidden">
         <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-4">
            <div className="flex items-center gap-4 text-amber-900">
               <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-black">!</div>
               <div>
                  <p className="text-sm font-bold">You are marked as <span className="text-amber-600">OFF SHIFT</span>. Alerts are queued.</p>
                  <p className="text-[11px] text-amber-700/70 font-medium">Toggle status to receive real-time Emergency breaches.</p>
               </div>
            </div>
            <Button variant="secondary" className="bg-amber-600 hover:bg-amber-700 h-10 font-bold text-xs px-6">
               Go On Shift
            </Button>
         </div>
      </GlassCard>

      {/* Inbox Header (Section A3) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <h1 className="text-4xl font-bold font-outfit tracking-tight">Alert <span className="text-rose-600">Inbox</span></h1>
            <p className="text-slate-500 mt-2 font-medium">Front-line clinical responders triage queue.</p>
         </div>
         <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-10 px-4 gap-2 font-bold text-[10px] uppercase tracking-widest border-slate-100 hover:bg-slate-50">
               <Filter className="w-3.5 h-3.5" /> Filter
            </Button>
            <Button variant="secondary" className="h-10 px-6 gap-2 bg-slate-950 font-bold text-xs shadow-lg">
               <CheckCircle2 className="w-4 h-4" /> Bulk Acknowledge
            </Button>
         </div>
      </div>

      {/* Severity Counters (Section A3) */}
      <div className="flex flex-wrap gap-3">
         {[
           { label: 'Emergency', count: 1, color: 'bg-rose-500' },
           { label: 'Urgent', count: 3, color: 'bg-orange-500' },
           { label: 'Moderate', count: alerts.length - 4, color: 'bg-amber-500' },
           { label: 'Informational', count: 2, color: 'bg-indigo-500' }
         ].map(s => (
            <div key={s.label} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm transition-transform hover:scale-105 cursor-pointer">
               <div className={`w-2 h-2 rounded-full ${s.color}`} />
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{s.label}: {s.count}</span>
            </div>
         ))}
      </div>

      {/* Unacknowledged Alerts Section (Section A3) */}
      <div className="space-y-6">
         <h3 className="text-xl font-bold font-outfit flex items-center gap-2">
            Requires Action
            <span className="text-[10px] font-black uppercase text-slate-300 ml-2">({unacknowledgedAlerts.length})</span>
         </h3>
         
         <div className="space-y-4">
            {unacknowledgedAlerts.map(alert => (
               <GlassCard key={alert.id} className={`!p-0 border-0 group transition-all hover:shadow-2xl hover:shadow-indigo-100 overflow-hidden relative`}>
                  {/* Severity Border (Section A3) */}
                  <div className={`absolute left-0 top-0 bottom-0 w-2 ${alert.alertSeverity === AlertSeverity.URGENT ? "bg-rose-500" : "bg-amber-500"}`} />
                  
                  <div className="p-6 pl-8">
                     <div className="flex flex-col xl:flex-row gap-8 justify-between">
                        {/* Patient Identity (Section A3) */}
                        <div className="flex items-center gap-4 min-w-[280px]">
                           <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-lg">
                              {alert.log.patient.preferredName?.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-900 leading-tight flex items-center gap-2">
                                 {alert.log.patient.preferredName || "Patient"}
                                 <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">MRN {alert.log.patient.mrn}</p>
                              <p className="text-[10px] font-medium text-slate-500 italic mt-0.5">Stage II Breast Cancer</p>
                           </div>
                        </div>

                        {/* Alert Detail (Section A3) */}
                        <div className="flex-1 space-y-2">
                           <div className="flex items-center gap-2">
                               <p className="text-sm font-black text-rose-600 uppercase tracking-tighter">Consecutive Grade 3 Threshold Breach</p>
                               <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-black uppercase text-slate-500">Symptom: {alert.alertType.replace(/_/g, ' ')}</span>
                           </div>
                           <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                              Patient reported nausea at Grade 3 or above for 4 consecutive days. Threshold set at 3 days.
                           </p>
                           <div className="flex items-center gap-4 pt-2">
                              {/* Symptom Sparkline Prototype (Section A3) */}
                              <div className="h-6 w-32 flex items-end gap-1 opacity-50">
                                 {[2, 2, 1, 3, 3, 3, 3].map((g, i) => (
                                    <div key={i} className={`flex-1 rounded-sm ${g >= 3 ? "bg-rose-500" : "bg-emerald-500"}`} style={{ height: `${(g/4)*100}%` }} />
                                 ))}
                              </div>
                              <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-widest"><Clock className="w-3.5 h-3.5" /> 2h 14m ago</p>
                           </div>
                        </div>

                        {/* Status / Oncologist Info (Section A3) */}
                        <div className="text-right min-w-[200px]">
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Oncologist</p>
                           <p className="text-xs font-bold text-slate-700 leading-none">Dr. oncologistTeam — Not Yet Acknowledged</p>
                           <div className="mt-6 flex justify-end gap-2">
                              <Button variant="ghost" size="sm" className="h-8 !px-3 font-bold text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100">Ignore</Button>
                              <Button variant="secondary" size="sm" className="h-8 !px-4 bg-indigo-600 hover:bg-black font-bold text-[10px] uppercase tracking-widest">Acknowledge</Button>
                           </div>
                        </div>
                     </div>

                     {/* Action Buttons Row - High Priority (Section A3) */}
                     <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Button variant="outline" className="h-9 px-4 gap-2 text-xs font-bold bg-white hover:bg-slate-50 border-slate-100">
                              <PhoneCall className="w-4 h-4 text-emerald-600" /> Call Patient Now
                           </Button>
                           <Button variant="outline" className="h-9 px-4 gap-2 text-xs font-bold bg-white hover:bg-slate-50 border-slate-100">
                              <MessageSquare className="w-4 h-4 text-indigo-600" /> Send MSG
                           </Button>
                        </div>
                        <div className="flex items-center gap-3">
                           <Button variant="ghost" className="h-9 px-4 gap-2 text-xs font-bold text-slate-500 hover:bg-slate-50">
                              View Full Log <ExternalLink className="w-3.5 h-3.5" />
                           </Button>
                           <Button variant="ghost" className="h-9 px-4 gap-2 text-xs font-bold text-rose-500 hover:bg-rose-50 italic">
                              Escalate <AlertTriangle className="w-4 h-4" />
                           </Button>
                        </div>
                     </div>
                  </div>
               </GlassCard>
            ))}
         </div>
      </div>

      {/* Acknowledged - Pending Resolution (Section A3) */}
      <div className="space-y-6 pt-12">
         <div className="w-full h-px bg-slate-100 relative">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-white text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Lifecycle Divider</span>
         </div>
         <h3 className="text-xl font-bold font-outfit text-slate-400 flex items-center gap-2">
            Acknowledged — Pending Resolution
            <span className="text-[10px] font-black uppercase text-slate-200 ml-2">({acknowledgedAlerts.length})</span>
         </h3>
         
         {/* Placeholder for acknowledged cards */}
         <div className="p-12 text-center border-2 border-dashed border-slate-50 rounded-3xl opacity-30 select-none">
            <p className="text-sm font-bold text-slate-400 font-outfit uppercase tracking-widest">Active Triages ({acknowledgedAlerts.length})</p>
         </div>
      </div>
    </div>
  );
}
