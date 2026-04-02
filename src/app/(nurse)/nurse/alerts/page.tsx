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

  const unacknowledgedAlerts = alerts.filter((a: any) => a.alertStatus === AlertStatus.PENDING);
  const acknowledgedAlerts = alerts.filter((a: any) => a.alertStatus === AlertStatus.ACKNOWLEDGED);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Inbox Header (Section A3) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
         <div className="space-y-1 font-sans">
            <h1 className="text-3xl font-bold font-outfit tracking-tight text-slate-900">Alert <span className="text-rose-600">Inbox</span></h1>
            <p className="text-sm font-medium text-slate-500">Active monitoring queue: clinical triage.</p>
         </div>
         <div className="flex items-center gap-2">
            <Button variant="outline" className="h-10 px-5 gap-2 font-bold text-[11px] uppercase tracking-wider border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl">
               <Filter className="w-3.5 h-3.5" /> Sector
            </Button>
            <Button className="h-10 px-6 gap-3 bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider shadow-md hover:bg-rose-600 transition-all rounded-xl">
               <CheckCircle2 className="w-5 h-5" /> Bulk Resolve
            </Button>
         </div>
      </div>

      {/* Severity Counters (Section A3) - High Contrast */}
      <div className="flex flex-wrap gap-4">
         {[
           { label: 'Emergency', count: 1, color: 'bg-rose-600' },
           { label: 'Urgent', count: 3, color: 'bg-orange-600' },
           { label: 'Waitlist', count: 12, color: 'bg-indigo-600' }
         ].map(s => (
            <div key={s.label} className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-100 shadow-sm transition-all cursor-default hover:border-indigo-100">
               <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
               <span className="text-[11px] font-bold uppercase text-slate-600 tracking-wider leading-none">{s.label}: {s.count}</span>
            </div>
         ))}
      </div>

      {/* Unacknowledged Alerts Section (Section A3) */}
      <div className="space-y-8">
         <h3 className="text-2xl font-bold font-outfit text-slate-900 flex items-center gap-3">
            High Priority Active Queue
            <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-bold uppercase tracking-tighter">{unacknowledgedAlerts.length} PENDING</span>
         </h3>
         
         <div className="space-y-5">
            {unacknowledgedAlerts.map((alert: any) => (
                <GlassCard key={alert.id} className={`!p-0 border border-slate-100 group transition-all hover:shadow-md overflow-hidden relative rounded-xl bg-white shadow-sm`}>
                   {/* Severity Border (Section A3) */}
                   <div className={`absolute left-0 top-0 bottom-0 w-2 ${alert.alertSeverity === AlertSeverity.URGENT ? "bg-rose-600" : "bg-orange-500"}`} />
                   
                   <div className="p-6 pl-8 flex flex-col gap-6">
                      <div className="flex flex-col xl:flex-row gap-8 justify-between">
                         {/* Patient Identity (Section A3) */}
                         <div className="flex items-center gap-5 min-w-[300px] bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-white shadow-md flex items-center justify-center font-bold text-slate-400 text-xl overflow-hidden">
                               {alert.log.patient.preferredName?.charAt(0)}
                            </div>
                            <div className="space-y-0.5">
                               <p className="text-lg font-bold text-slate-900 leading-tight">
                                  {alert.log.patient.preferredName || "Patient"}
                               </p>
                               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">MRN: {alert.log.patient.mrn}</p>
                               <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-2 bg-indigo-50 px-2 rounded-lg w-fit">Stage II Breast Cancer</p>
                            </div>
                         </div>

                         {/* Alert Detail (Section A3) */}
                         <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                                <p className="text-base font-bold text-rose-600 uppercase tracking-tight">Threshold Breach</p>
                                <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[9px] font-bold uppercase tracking-wider leading-none">{alert.alertType.replace(/_/g, ' ')}</span>
                            </div>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
                               Patient reported nausea at G3 intensity for 4 consecutive days. Threshold breach detected in current treatment cycle.
                            </p>
                            <div className="flex items-center gap-6 pt-1">
                               {/* Symptom Sparkline Prototype (Section A3) */}
                               <div className="h-8 w-40 flex items-end gap-1.5 opacity-80 bg-slate-50 p-2 rounded-xl">
                                  {[2, 2, 1, 3, 3, 3, 3, 3].map((g, i) => (
                                     <div key={i} className={`flex-1 rounded-full transition-all ${g >= 3 ? "bg-rose-600 shadow-sm shadow-rose-200" : "bg-emerald-500"}`} style={{ height: `${(g/4)*100}%` }} />
                                  ))}
                               </div>
                               <div className="flex flex-col">
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Time Logged</p>
                                  <p className="text-[10px] text-slate-900 font-bold flex items-center gap-1 uppercase tracking-wider mt-0.5"><Clock className="w-3.5 h-3.5" /> 2h 14m ago</p>
                               </div>
                            </div>
                         </div>

                         {/* Status / Oncologist Info (Section A3) */}
                         <div className="xl:text-right min-w-[220px] space-y-4">
                            <div>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Oncologist Lead</p>
                               <p className="text-sm font-bold text-slate-900 leading-none">Dr. oncologistTeam</p>
                               <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider mt-2">Awaiting Triage</p>
                            </div>
                            <div className="flex xl:justify-end gap-2 pt-2">
                               <Button variant="ghost" className="h-9 px-4 font-bold text-[10px] uppercase tracking-wider text-slate-400 hover:text-slate-900 border border-slate-200 rounded-lg">Ignore</Button>
                               <Button className="h-9 px-4 bg-indigo-600 hover:bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm">Acknowledge</Button>
                            </div>
                         </div>
                      </div>

                      {/* Action Buttons Row - High Priority (Section A3) */}
                      <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                         <div className="flex items-center gap-3">
                            <Button className="h-10 px-5 gap-2 bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50 font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition-all group">
                               <PhoneCall className="w-3.5 h-3.5" /> Direct Dial
                            </Button>
                            <Button className="h-10 px-5 gap-2 bg-white border border-slate-200 text-indigo-700 hover:bg-indigo-50 font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition-all group">
                               <MessageSquare className="w-3.5 h-3.5" /> Message Sync
                            </Button>
                         </div>
                         <div className="flex items-center gap-4">
                            <Button variant="ghost" className="h-10 px-4 gap-2 text-[10px] font-bold text-slate-500 hover:bg-slate-50 uppercase tracking-wider rounded-lg">
                               Toxicity Log <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                            <div className="h-4 w-px bg-slate-200" />
                            <Button variant="ghost" className="h-10 px-4 gap-2 text-[10px] font-bold text-rose-600 hover:bg-rose-50 uppercase tracking-wider rounded-lg">
                               Escalate Breach <AlertTriangle className="w-4 h-4" />
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
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 bg-white text-[11px] font-bold uppercase text-slate-300 tracking-wider selection:bg-transparent">System Lifecycle Divider</span>
         </div>
         <h3 className="text-lg font-bold font-outfit text-slate-400 flex items-center gap-4">
            Monitoring & Resolution
            <span className="px-3 py-0.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-full text-[10px] font-bold uppercase tracking-wider">RESOLVED: 42 (Today)</span>
         </h3>
         
         <div className="p-20 text-center border-4 border-dashed border-slate-50 rounded-2xl group hover:border-indigo-50 transition-all cursor-default">
            <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center mx-auto text-slate-200  group-hover:text-indigo-200 transition-all duration-700">
               <CheckCircle2 className="w-10 h-10" />
            </div>
            <p className="text-lg font-bold text-slate-300 font-outfit uppercase tracking-[0.2em] mt-8">No Segment Latency Detected</p>
         </div>
      </div>
    </div>
  );
}
