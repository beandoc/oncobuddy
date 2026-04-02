import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import Link from "next/link";
import { 
  Activity,
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
  ChevronDown,
  Info
} from "lucide-react";
import { Role, AlertStatus, AlertSeverity } from "@prisma/client";

/**
 * Oncologist Alert Center - Screen 2 (Priority Screen).
 * Professional review-first dashboard for life-cycle clinical monitoring.
 * Severity-first ordering with mandatory shift awareness. (Request 4).
 */
export default async function OncologistAlertCenter() {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  // Fetch alerts prioritized by severity (Section 4)
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
      { createdAt: 'asc' }       // Oldest first within severity
    ],
    take: 20
  });

  const unacknowledgedAlerts = alerts.filter((a: any) => a.alertStatus === AlertStatus.PENDING);
  const acknowledgedAlerts = alerts.filter((a: any) => a.alertStatus === AlertStatus.ACKNOWLEDGED);

  return (
    <div className="space-y-8 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      
      {/* Clinician Shift Continuity Header (Section 4) */}
      <GlassCard className="!p-0 border-slate-100 bg-slate-50 shadow-sm overflow-hidden rounded-xl">
         <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-6">
            <div className="flex items-center gap-4 text-slate-900 font-sans">
               <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold shadow-md">!</div>
               <div>
                  <p className="text-sm font-bold font-outfit uppercase tracking-wider text-slate-800">Alert Center Status</p>
                  <p className="text-xs text-slate-500 font-medium">Monitoring {alerts.length} active breaches across panel.</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="ghost" className="h-10 px-6 gap-2 font-bold text-[10px] uppercase tracking-wider border-indigo-100 text-indigo-600 hover:bg-white shadow-sm transition-all ">
                   <Info className="w-3.5 h-3.5" /> MD On-Call Status: Active
                </Button>
            </div>
         </div>
      </GlassCard>

      {/* Screen Title (Professional Clinical) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
         <div className="space-y-1">
            <h1 className="text-3xl font-bold font-outfit tracking-tight text-slate-900">Clinical <span className="text-indigo-600">Breaches</span></h1>
            <p className="text-slate-500 font-medium pt-1 text-base">Priority review required for clinical stability thresholds.</p>
         </div>
         <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-11 px-6 gap-2 font-bold text-[10px] uppercase tracking-wider border-slate-100 bg-white hover:bg-slate-50 shadow-sm transition-all">
               <Filter className="w-4 h-4" /> Filter Panel
            </Button>
            <Button variant="secondary" className="h-11 px-8 gap-3 bg-slate-950 font-bold text-[11px] uppercase tracking-[0.2em] shadow-sm hover:scale-105 transition-all active:scale-95 group">
               <CheckCircle2 className="w-5 h-5 group-hover:text-emerald-400 transition-colors" /> Bulk Clear Moderate
            </Button>
         </div>
      </div>

      {/* Alert Severity Segmented Counters (Section 4) */}
      <div className="flex flex-wrap gap-4">
         {[
           { label: 'Emergency', count: alerts.filter((a: any) => a.alertSeverity === AlertSeverity.EMERGENCY).length, color: 'bg-rose-500', shadow: 'shadow-rose-100' },
           { label: 'Urgent', count: alerts.filter((a: any) => a.alertSeverity === AlertSeverity.URGENT).length, color: 'bg-orange-500', shadow: 'shadow-orange-100' },
           { label: 'Moderate', count: alerts.filter((a: any) => a.alertSeverity === AlertSeverity.MODERATE).length, color: 'bg-amber-500', shadow: 'shadow-amber-100' },
           { label: 'Informational', count: alerts.filter((a: any) => a.alertSeverity === AlertSeverity.INFORMATIONAL).length, color: 'bg-indigo-500', shadow: 'shadow-indigo-100' }
         ].map((s: any) => (
             <div key={s.label} className={`flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-100 shadow-sm transition-all cursor-default`}>
                <div className={`w-2.5 h-2.5 rounded-full ${s.color} shadow-sm`} />
                <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider transition-colors font-sans">{s.label}: {s.count}</span>
             </div>
         ))}
      </div>

      {/* Main Alert Feed (Section 4) */}
      <div className="space-y-10">
         <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold font-outfit text-slate-900 border-b-2 border-indigo-600 pb-2">Review Required</h3>
            <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">{unacknowledgedAlerts.length} Unresolved</span>
         </div>
         
         <div className="grid grid-cols-1 gap-6">
            {unacknowledgedAlerts.map((alert: any) => (
               <GlassCard key={alert.id} className={`!p-0 border border-slate-100 group transition-all hover:shadow-md overflow-hidden relative bg-white rounded-xl shadow-sm`}>
                  {/* MD Severity Sidebar Indicator (Section 4) */}
                  <div className={`absolute left-0 top-0 bottom-0 w-2 ${alert.alertSeverity === AlertSeverity.EMERGENCY ? "bg-rose-600" : alert.alertSeverity === AlertSeverity.URGENT ? "bg-orange-500" : "bg-amber-500"}`} />
                  
                  <div className="p-6 pl-8 flex flex-col xl:flex-row gap-8 justify-between items-start">
                     <div className="flex flex-col md:flex-row gap-8 flex-1">
                        {/* Patient Identity Block (Section 4) */}
                        <div className="flex items-center gap-5 min-w-[300px] bg-slate-50/50 p-4 rounded-2xl border border-slate-100 transition-colors">
                           <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xl border-2 border-white shadow-md">
                              {alert.log.patient.preferredName?.charAt(0)}
                           </div>
                           <div className="space-y-1.5 flex-1">
                              <p className="text-lg font-bold text-slate-900 leading-tight">
                                 {alert.log.patient.preferredName || "Anonymous Patient"}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">MRN {alert.log.patient.mrn}</p>
                              <div className="flex items-center gap-2 pt-2">
                                 <span className="px-2 py-0.5 rounded-full bg-white text-[9px] font-bold uppercase text-slate-500 border border-slate-100">Stage II Breast</span>
                                 <span className="px-2 py-0.5 rounded-full bg-white text-[9px] font-bold uppercase text-indigo-500 border border-indigo-100">Cycle 4</span>
                              </div>
                           </div>
                        </div>

                         {/* Professional Clinical Logic (Section 4) */}
                         <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                                <p className="text-base font-bold text-slate-900 uppercase tracking-tight border-b-2 border-rose-100 pb-1">Toxicity Breach: {alert.alertType.replace(/_/g, ' ')}</p>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed max-w-xl font-medium font-outfit">
                               Grade 3 threshold breach detected in {alert.alertType.replace(/_/g, ' ').toLowerCase()} reporting. Breach occurred during chemotherapy recovery phase.
                            </p>
                            <div className="flex items-center gap-8 pt-2">
                               {/* Clinical Sparkline Placeholder (Section 4) */}
                               <div className="h-8 w-40 flex items-end gap-1.5 opacity-60">
                                  {[2, 3, 1, 4, 3, 3, 4].map((g, i) => (
                                     <div key={i} className={`flex-1 rounded-full transition-all duration-700 ${g >= 3 ? "bg-rose-500" : "bg-emerald-500"}`} style={{ height: `${(g/4)*100}%` }} />
                                  ))}
                               </div>
                               <div className="flex flex-col gap-1">
                                  <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wider"><Clock className="w-3.5 h-3.5 text-indigo-400" /> Breeched 4h ago</p>
                                  <p className="text-[10px] text-teal-600 font-bold flex items-center gap-1.5 uppercase tracking-wider"><Activity className="w-3.5 h-3.5" /> Source: Patient Envoy</p>
                               </div>
                            </div>
                         </div>
                     </div>

                      {/* Professional Acknowledgment Column (Section 4) */}
                      <div className="w-full xl:w-auto space-y-4 md:min-w-[220px]">
                         <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Escalation Status</p>
                            <p className="text-xs font-bold text-slate-700 leading-none">Nurse Maya marked: <span className="text-indigo-600">Escalated</span></p>
                            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">"Patient distress elevating post-Cycle 4. Professional review needed."</p>
                         </div>
                         <div className="flex items-center gap-2">
                            <Button variant="ghost" className="flex-1 h-10 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 font-bold text-[10px] uppercase tracking-wider text-rose-600 transition-all rounded-lg">Dismiss</Button>
                            <Button className="flex-1 h-10 bg-indigo-600 hover:bg-slate-900 border-0 font-bold text-[10px] uppercase tracking-wider text-white shadow-md transition-all rounded-lg">Sign-off</Button>
                         </div>
                      </div>
                   </div>

                  {/* Contextual Quick Actions Floor (Section 4) */}
                  <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors hover:bg-white group-hover:border-indigo-100">
                     <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-9 px-4 gap-2 text-[10px] font-bold uppercase tracking-wider bg-white hover:bg-slate-50 border-slate-200 transition-all text-slate-600 shadow-sm rounded-lg">
                           <PhoneCall className="w-3.5 h-3.5 text-emerald-600" /> Patient Line
                        </Button>
                        <Button variant="outline" className="h-9 px-4 gap-2 text-[10px] font-bold uppercase tracking-wider bg-white hover:bg-slate-50 border-slate-200 transition-all text-slate-600 shadow-sm rounded-lg">
                           <MessageSquare className="w-3.5 h-3.5 text-indigo-600" /> Message Nurse
                        </Button>
                     </div>
                     <div className="flex items-center gap-6">
                        <Link href={`/oncologist/patients/${alert.log.patient.publicId}`} className="text-[10px] font-bold uppercase text-slate-400 hover:text-indigo-600 tracking-wider flex items-center gap-1.5 transition-colors">
                           Full Clinical Record <ExternalLink className="w-3 h-3" />
                        </Link>
                        <div className="h-4 w-px bg-slate-200 md:block hidden" />
                        <p className="text-[10px] font-bold uppercase text-indigo-500 tracking-wider">Awaiting MD Sign-off</p>
                     </div>
                  </div>
               </GlassCard>
            ))}
         </div>
      </div>
    </div>
  );
}
