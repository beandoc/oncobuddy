import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Bell, 
  Search, 
  Filter, 
  ChevronRight, 
  Activity, 
  Clock,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Smartphone,
  ChevronDown,
  Inbox
} from "lucide-react";
import { Role, AlertStatus, AlertSeverity } from "@prisma/client";

/**
 * Alert Inbox - Screen 4.
 * Primary screen for reviewing and managing symptom threshold alerts.
 */
export default async function AlertInboxPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  const clinician = await prisma.clinician.findUnique({
    where: { userId: session.user.id },
    include: {
      acknowledgedAlerts: {
        include: { 
          log: {
            include: {
              patient: true,
              entries: true
            }
          }
        },
        orderBy: [
           { alertSeverity: 'desc' },
           { createdAt: 'desc' }
        ]
      }
    }
  });

  if (!clinician) redirect("/oncologist/dashboard");

  const pendingAlerts = clinician.acknowledgedAlerts.filter(a => a.alertStatus === AlertStatus.PENDING);
  const totalCount = clinician.acknowledgedAlerts.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Alert Filter Bar (Section 6) */}
      <GlassCard className="!p-4 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="secondary" size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-9 font-bold">Unacknowledged</Button>
           <Button variant="ghost" size="sm" className="text-slate-500 h-9 font-bold">Acknowledged</Button>
           <Button variant="ghost" size="sm" className="text-slate-500 h-9 font-bold">Escalated</Button>
           <Button variant="ghost" size="sm" className="text-slate-500 h-9 font-bold">Resolved</Button>
           
           <div className="w-[1px] h-6 bg-slate-100 mx-2" />
           
           <div className="flex gap-1.5 ring-1 ring-slate-100 rounded-xl p-1 bg-slate-50/50">
              <Button variant="ghost" size="sm" className="h-7 text-[9px] font-bold uppercase tracking-widest text-rose-600 bg-white shadow-sm px-2">Emergency</Button>
              <Button variant="ghost" size="sm" className="h-7 text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 px-2">Urgent</Button>
              <Button variant="ghost" size="sm" className="h-7 text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 px-2">Moderate</Button>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input className="w-56 h-9 pl-9 pr-4 rounded-xl border border-slate-100 bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-100 outline-none transition-all focus:bg-white" placeholder="Search alerts by patient..." />
           </div>
           <Button variant="outline" size="sm" className="text-slate-500 border-slate-100 h-9 flex items-center gap-2 font-bold">
              Sort: Recent
              <ChevronDown className="w-3.5 h-3.5 opacity-50" />
           </Button>
        </div>
      </GlassCard>

      {/* Alert List View (Section 6) */}
      <div className="space-y-4">
        {pendingAlerts.length > 0 ? (
          pendingAlerts.map((alert) => (
            <GlassCard key={alert.id} className={`group border-l-[6px] transition-all hover:translate-x-1 ${alert.alertSeverity === AlertSeverity.URGENT ? "border-l-rose-500 hover:border-rose-200" : "border-l-amber-500 hover:border-amber-200"}`}>
               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Block: Patient & Severity */}
                  <div className="flex items-center gap-5 lg:w-[280px]">
                     <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 shrink-0">
                        {alert.log.patient.preferredName?.charAt(0) || "P"}
                     </div>
                     <div className="min-w-0">
                        <p className="text-sm font-bold group-hover:text-indigo-600 transition-colors truncate">
                           {alert.log.patient.preferredName || "Anonymous Patient"}
                        </p>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md ${alert.alertSeverity === AlertSeverity.URGENT ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}>
                           {alert.alertSeverity} SEVERITY
                        </span>
                     </div>
                  </div>

                  {/* Center Block: Alert Detail */}
                  <div className="flex-1 space-y-1 pr-6 border-r border-slate-50 lg:border-r">
                     <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        Symptom Spike: <span className="text-indigo-600">Grade 3 Nausea</span> detected for 3 consecutive days.
                     </h4>
                     <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
                        Last Logged Value: Grade 4 (Extreme) on 2026-04-01 14:12 with note: "Difficulty keeping any medications down today."
                     </p>
                  </div>

                  {/* Right Block: Coordination Status */}
                  <div className="flex items-center gap-8 min-w-[240px]">
                     <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Nurse Navigator</p>
                        </div>
                        <p className="text-xs font-bold text-slate-700">Navigator Team • <span className="text-emerald-600">Acknowledge 1h ago</span></p>
                     </div>
                     <div className="text-[10px] text-slate-300 font-bold text-right flex-1 truncate">
                        <Clock className="w-3 h-3 inline mr-1 opacity-50" />
                        2 HOURS AGO
                     </div>
                  </div>

                  {/* Actions Block */}
                  <div className="flex items-center gap-2 pl-4">
                     <Button variant="secondary" size="sm" className="bg-indigo-600 hover:bg-slate-950 font-bold h-9">
                        Acknowledge
                     </Button>
                     <Button variant="outline" size="sm" className="h-9 w-9 !p-0 border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-slate-50">
                        <Smartphone className="w-4 h-4" />
                     </Button>
                     <Button variant="outline" size="sm" className="h-9 w-9 !p-0 border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-slate-50">
                        <MoreVertical className="w-4 h-4" />
                     </Button>
                  </div>
               </div>
            </GlassCard>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
             <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6">
                <Inbox className="w-10 h-10" />
             </div>
             <h3 className="text-xl font-bold font-outfit text-slate-400">Your clinical inbox is clear</h3>
             <p className="text-sm text-slate-400 mt-2">All symptom threshold alerts have been successfully triaged.</p>
          </div>
        )}
      </div>

      {/* Bulk Action Bar Stub - Float Center */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-950 text-white rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl z-50 animate-in slide-in-from-bottom duration-500 scale-95 opacity-0 pointer-events-none">
         <p className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">3 Alerts Selected</p>
         <div className="w-[1px] h-4 bg-white/20" />
         <div className="flex items-center gap-4">
            <button className="text-xs font-bold hover:text-indigo-400 transition-colors uppercase tracking-widest">Acknowledge</button>
            <button className="text-xs font-bold hover:text-rose-400 transition-colors uppercase tracking-widest">Escalate</button>
            <button className="text-xs font-bold hover:text-slate-400 transition-colors uppercase tracking-widest">Acknowledge</button>
         </div>
      </div>
    </div>
  );
}
