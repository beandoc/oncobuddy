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
      <GlassCard className="!p-0 border-indigo-100 bg-indigo-50/20 shadow-indigo-100/10 overflow-hidden">
         <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
            <div className="flex items-center gap-4 text-indigo-900">
               <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black ring-4 ring-white shadow-sm">!</div>
               <div>
                  <p className="text-sm font-bold font-outfit uppercase tracking-widest text-indigo-800">Alert Center Status</p>
                  <p className="text-xs text-indigo-700/70 font-medium italic italic">You are currently monitoring {alerts.length} active breaches across your panel.</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="ghost" className="h-10 px-6 gap-2 font-bold text-[10px] uppercase tracking-widest border-indigo-100 text-indigo-600 hover:bg-white shadow-sm transition-all hover:translate-y-[-2px]">
                   <Info className="w-3.5 h-3.5" /> MD On-Call Status: Active
                </Button>
            </div>
         </div>
      </GlassCard>

      {/* Screen Title (Professional Clinical) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900 italic italic underline decoration-indigo-600/30 underline-offset-8">Life-Cycle <span className="text-indigo-600">Breaches</span></h1>
            <p className="text-slate-500 font-medium italic italic">Priority review required for clinical stability thresholds.</p>
         </div>
         <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-11 px-6 gap-2 font-bold text-[10px] uppercase tracking-widest border-slate-100 bg-white hover:bg-slate-50 shadow-sm transition-all">
               <Filter className="w-4 h-4" /> Filter Panel
            </Button>
            <Button variant="secondary" className="h-11 px-8 gap-3 bg-slate-950 font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all active:scale-95 group">
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
            <div key={s.label} className={`flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-100 shadow-lg ${s.shadow} group cursor-pointer hover:border-indigo-200 transition-all`}>
               <div className={`w-3 h-3 rounded-full ${s.color} animate-pulse shadow-sm`} />
               <span className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em] group-hover:text-indigo-600 transition-colors leading-none italic italic">{s.label}: {s.count}</span>
            </div>
         ))}
      </div>

      {/* Main Alert Feed (Section 4) */}
      <div className="space-y-10">
         <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold font-outfit text-slate-900 border-b-2 border-indigo-600 pb-2">Review Required</h3>
            <span className="text-sm font-black text-slate-300 uppercase tracking-widest">{unacknowledgedAlerts.length} Unresolved</span>
         </div>
         
         <div className="grid grid-cols-1 gap-6">
            {unacknowledgedAlerts.map((alert: any) => (
               <GlassCard key={alert.id} className={`!p-0 border-0 group transition-all hover:shadow-2xl hover:shadow-indigo-100/30 overflow-hidden relative bg-white`}>
                  {/* MD Severity Sidebar Indicator (Section 4) */}
                  <div className={`absolute left-0 top-0 bottom-0 w-2.5 ${alert.alertSeverity === AlertSeverity.EMERGENCY ? "bg-rose-600" : alert.alertSeverity === AlertSeverity.URGENT ? "bg-orange-500" : "bg-amber-500"} shadow-xl`} />
                  
                  <div className="p-10 pl-12 flex flex-col xl:flex-row gap-12 justify-between items-start">
                     <div className="flex flex-col md:flex-row gap-10 flex-1">
                        {/* Patient Identity Block (Section 4) */}
                        <div className="flex items-center gap-6 min-w-[320px] bg-slate-50/50 p-6 rounded-[32px] border border-slate-100 group-hover:bg-indigo-50/30 transition-colors">
                           <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-2xl border-4 border-white shadow-xl group-hover:shadow-indigo-100 transition-all transform group-hover:rotate-3">
                              {alert.log.patient.preferredName?.charAt(0)}
                           </div>
                           <div className="space-y-1.5 flex-1">
                              <p className="text-xl font-bold text-slate-900 leading-tight italic italic underline decoration-transparent group-hover:decoration-indigo-200 transition-all decoration-2 underline-offset-4 pointer-events-none">
                                 {alert.log.patient.preferredName || "Anonymous Patient"}
                              </p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-2">MRN {alert.log.patient.mrn}</p>
                              <div className="flex items-center gap-3 pt-1">
                                 <span className="px-3 py-1 rounded-full bg-white text-[9px] font-black uppercase text-slate-400 border border-slate-100 leading-none">Stage II Breast</span>
                                 <span className="px-3 py-1 rounded-full bg-white text-[9px] font-black uppercase text-indigo-500 border border-indigo-100 leading-none">Cycle 4</span>
                              </div>
                           </div>
                        </div>

                        {/* Professional Clinical Logic (Section 4) */}
                        <div className="flex-1 space-y-4">
                           <div className="flex items-center gap-3">
                               <p className="text-base font-black text-slate-900 uppercase tracking-tighter italic border-b border-rose-500 pb-1">Toxicity Breach: {alert.alertType.replace(/_/g, ' ')}</p>
                           </div>
                           <p className="text-[13px] text-slate-600 leading-relaxed max-w-xl font-medium font-outfit italic italic underline decoration-slate-100 decoration-1 underline-offset-4">
                              Grade 3 threshold breach detected in {alert.alertType.replace(/_/g, ' ').toLowerCase()} reporting. Breach occurred during chemotherapy recovery phase.
                           </p>
                           <div className="flex items-center gap-8 pt-4">
                              {/* Clinical Sparkline Placeholder (Section 4) */}
                              <div className="h-10 w-48 flex items-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                 {[2, 3, 1, 4, 3, 3, 4].map((g, i) => (
                                    <div key={i} className={`flex-1 rounded-full transition-all duration-700 ${g >= 3 ? "bg-rose-500" : "bg-emerald-500"}`} style={{ height: `${(g/4)*100}%` }} />
                                 ))}
                              </div>
                              <div className="flex flex-col gap-1.5">
                                 <p className="text-[10px] text-slate-400 font-bold flex items-center gap-2 uppercase tracking-widest"><Clock className="w-4 h-4 text-indigo-400" /> Breeched 4h 12m ago</p>
                                 <p className="text-[10px] text-teal-600 font-black flex items-center gap-2 uppercase tracking-widest animate-pulse italic italic"><Activity className="w-4 h-4" /> Log Source: Clinical Proxy</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Professional Acknowledgment Column (Section 4) */}
                     <div className="w-full xl:w-auto space-y-6 md:min-w-[240px]">
                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] group-hover:bg-indigo-50 transition-colors">
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-3 italic italic">MD Sign-off Required</p>
                           <p className="text-xs font-bold text-slate-700 leading-none">Nurse Maya marked as <span className="text-indigo-600">Escalated</span></p>
                           <p className="text-[9px] text-slate-400 italic mt-2 italic italic">"Patient distress elevating post-Cycle 4. Professional review needed."</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <Button variant="ghost" className="flex-1 h-12 bg-white hover:bg-rose-50 border-rose-100 font-black text-[10px] uppercase tracking-widest text-rose-600 shadow-sm transition-all">Dismiss</Button>
                           <Button variant="secondary" className="flex-1 h-12 bg-indigo-600 hover:bg-slate-950 font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-indigo-100 transition-all hover:scale-[1.03]">Sign-off Alert</Button>
                        </div>
                     </div>
                  </div>

                  {/* Contextual Quick Actions Floor (Section 4) */}
                  <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors group-hover:bg-white group-hover:border-indigo-100">
                     <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-10 px-6 gap-3 text-[10px] font-black uppercase tracking-widest bg-white hover:bg-indigo-50 border-slate-100 hover:border-indigo-200 transition-all text-slate-600 shadow-sm">
                           <PhoneCall className="w-4 h-4 text-emerald-600" /> Patient Emergency Line
                        </Button>
                        <Button variant="outline" className="h-10 px-6 gap-3 text-[10px] font-black uppercase tracking-widest bg-white hover:bg-indigo-50 border-slate-100 hover:border-indigo-200 transition-all text-slate-600 shadow-sm">
                           <MessageSquare className="w-4 h-4 text-indigo-600" /> Triage Nurse maya
                        </Button>
                     </div>
                     <div className="flex items-center gap-6">
                        <Link href={`/oncologist/patients/${alert.log.patient.publicId}`} className="text-[10px] font-bold uppercase text-slate-400 hover:text-indigo-600 tracking-widest flex items-center gap-2 transition-colors">
                           Full Clinical Record <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <div className="h-4 w-px bg-slate-200 md:block hidden" />
                        <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest animate-pulse italic italic font-serif">Awaiting MD PIN sign-off</p>
                     </div>
                  </div>
               </GlassCard>
            ))}
         </div>
      </div>
    </div>
  );
}
