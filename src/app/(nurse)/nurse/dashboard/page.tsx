import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Bell, 
  ChevronRight, 
  Search,
  Filter,
  MessageSquare,
  AlertTriangle
} from "lucide-react";
import { Role, AlertStatus, AlertSeverity } from "@prisma/client";

export default async function NurseDashboard() {
  const session = await auth();
  if (!session || session.user.role !== Role.NURSE) redirect("/login");

  // Requirement 3: Enforce MFA for Nurses
  // if (!session.user.mfaEnabled) redirect("/auth/mfa-setup");

  const clinician = await prisma.clinician.findUnique({
    where: { userId: session.user.id },
    include: {
      patients: {
        where: { endedAt: null },
        include: {
          patient: {
            include: {
              diagnoses: { take: 1, orderBy: { diagnosisDate: 'desc' } }
            }
          }
        },
        take: 15 // Nurses often have broader panels
      },
      acknowledgedAlerts: {
        where: { alertStatus: AlertStatus.PENDING },
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });

  if (!clinician) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertTriangle className="w-16 h-16 text-rose-500 mb-4 opacity-20" />
      <h2 className="text-2xl font-bold font-outfit text-rose-600">Nurse Profile Not Linked</h2>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
       {/* Nurse Hub Header - Alert Centric (Section 3) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold font-outfit tracking-tight">
            Nurse <span className="text-rose-600 dark:text-rose-400">Navigator</span>
          </h1>
          <p className="text-slate-500 mt-2 flex items-center gap-2">
            Active Alerts: {clinician.acknowledgedAlerts.length} • Patient Panel: {clinician.patients.length}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">Triage Workflow</Button>
          <Button variant="secondary" size="sm" className="bg-rose-600 hover:bg-rose-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            Patient Inbox
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* High Priority Alerts - Nurse focus (Section 3) */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-xl font-bold font-outfit px-2">Priority Alerts</h3>
           <div className="grid grid-cols-1 gap-4">
              {clinician.acknowledgedAlerts.length > 0 ? (
                clinician.acknowledgedAlerts.map(alert => (
                  <GlassCard key={alert.id} className="border-l-4 border-rose-500 hover:translate-x-1 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                             {alert.alertSeverity === AlertSeverity.URGENT ? "!" : "i"}
                          </div>
                          <div>
                             <h4 className="font-bold">Severe Nausea (Grade 3)</h4>
                             <p className="text-xs text-slate-500">MRN: 982312 • Triggered 24m ago</p>
                          </div>
                       </div>
                       <Button variant="ghost" size="sm" className="group">
                          Triage
                          <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                       </Button>
                    </div>
                  </GlassCard>
                ))
              ) : (
                <div className="py-20 text-center text-slate-400 italic bg-slate-50/50 rounded-3xl border border-dashed">
                   Great work! All clinical alerts are currently resolved.
                </div>
              )}
           </div>
        </div>

        {/* Sidebar - Panel Management */}
        <div className="space-y-6">
           <GlassCard className="!p-0">
             <div className="p-6 border-b border-white/10">
                <h3 className="font-bold font-outfit">Patient Panel</h3>
             </div>
             <div className="p-4 space-y-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input className="w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50 text-sm" placeholder="Search name/MRN..." />
                 </div>
                 <div className="divide-y divide-slate-100 dark:divide-slate-800 h-[400px] overflow-y-auto">
                    {clinician.patients.map(p => (
                       <div key={p.id} className="py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer px-2 rounded-lg">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">P</div>
                             <div>
                                <p className="text-xs font-bold">{p.patient.preferredName || "Patient"}</p>
                                <p className="text-[10px] text-slate-400">{p.patient.mrn}</p>
                             </div>
                          </div>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                       </div>
                    ))}
                 </div>
             </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}
