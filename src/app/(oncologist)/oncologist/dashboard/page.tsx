import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Users, 
  Bell, 
  Calendar, 
  TrendingUp, 
  ChevronRight, 
  Search,
  Activity,
  UserPlus,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  ArrowDownRight
} from "lucide-react";
import { Role, AlertStatus, AlertSeverity } from "@prisma/client";
import Image from "next/image";

/**
 * Oncologist Dashboard Home (Overview) - Screen 1.
 * Provides complete situational awareness of the clinical panel.
 */
export default async function OncologistDashboard() {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  const clinician = await prisma.clinician.findUnique({
    where: { userId: session.user.id },
    include: {
      patients: {
        where: { endedAt: null },
        include: {
          patient: {
            include: {
              diagnoses: { take: 1, orderBy: { diagnosisDate: 'desc' } },
              symptomLogs: { take: 1, orderBy: { logDate: 'desc' } }
            }
          }
        },
        take: 10
      },
      acknowledgedAlerts: {
        where: { alertStatus: AlertStatus.PENDING },
        include: { 
          log: {
            include: {
              patient: true
            }
          }
        },
        orderBy: { alertSeverity: 'desc' }, // Severity first then date as per Sec 3
        take: 5
      }
    }
  });

  if (!clinician) return (
     <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h2 className="text-2xl font-bold font-outfit text-rose-600">Oncologist Profile Required</h2>
        <p className="text-slate-500 mt-2">Please contact your clinical administrator to initialize your panel.</p>
     </div>
  );

  const activeAlertCount = clinician.acknowledgedAlerts.length;
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  // Mock Trend Indicators (for v1)
  const MetricCard = ({ title, value, label, trend, trendValue, colorClass }: any) => (
    <GlassCard className="relative group overflow-hidden border-slate-100 hover:border-slate-200 transition-all">
       <div className="flex flex-col space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <div className="flex items-baseline gap-2">
             <h3 className={`text-3xl font-bold font-outfit ${colorClass}`}>{value}</h3>
             <span className="text-xs text-slate-500 font-medium">{label}</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
             {trend === 'up' ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-rose-500" />}
             <span className={`text-[10px] font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>{trendValue}%</span>
             <span className="text-[10px] text-slate-400 font-medium ml-1">vs last week</span>
          </div>
       </div>
    </GlassCard>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Time-of-day Header (Section 3) */}
      <h1 className="text-4xl font-bold font-outfit tracking-tight">
        {greeting}, <span className="text-indigo-600">Dr. {session.user.name?.split(' ').pop()}</span>
      </h1>

      {/* Summary Metric Cards Row (Section 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Patients" value={clinician.patients.length} label="Active" trend="up" trendValue={4} />
        <MetricCard title="Active Alerts" value={activeAlertCount} label="Pending" trend="down" trendValue={12} colorClass={activeAlertCount > 0 ? 'text-rose-600' : ''} />
        <MetricCard title="Appointments" value="8" label="Today" trend="up" trendValue={2} />
        <MetricCard title="Avg. Wellbeing" value="7.2" label="/ 10.0" trend="up" trendValue={1.5} colorClass="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Alert Summary Panel (Section 3) */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold font-outfit flex items-center gap-2">
               Unacknowledged Alerts
               <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold tracking-widest uppercase">High Priority</span>
            </h3>

            <div className="space-y-4">
              {clinician.acknowledgedAlerts.length > 0 ? (
                clinician.acknowledgedAlerts.map(alert => (
                  <GlassCard key={alert.id} className="hover:border-rose-200 transition-all cursor-pointer group">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${alert.alertSeverity === AlertSeverity.URGENT ? "bg-rose-50 text-rose-600 shadow-sm shadow-rose-100" : "bg-amber-50 text-amber-600"}`}>
                              {alert.alertSeverity === AlertSeverity.URGENT ? "!" : "i"}
                           </div>
                           <div>
                              <p className="text-sm font-bold group-hover:text-rose-600 transition-colors">
                                 {alert.log.patient.preferredName || "Anonymous Patient"}
                              </p>
                              <p className="text-[11px] text-slate-500 font-medium">
                                 {alert.alertType.replace(/_/g, ' ')} • Triggered 2h ago
                              </p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Navigator</p>
                           <p className="text-xs font-bold text-slate-600">Nurse Navigator Team</p>
                        </div>
                     </div>
                  </GlassCard>
                ))
              ) : (
                <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-emerald-200">
                   <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-6 h-6" />
                   </div>
                   <h4 className="font-bold text-emerald-900">All Alerts Acknowledged</h4>
                   <p className="text-xs text-emerald-600 mt-1 uppercase font-bold tracking-tighter">Last Update: Yesterday 18:45</p>
                </div>
              )}
              <Link href="/oncologist/alerts" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center px-2 group">
                 View all pending clinical alerts
                 <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
         </div>

         {/* Symptom Trend Mini Chart Sidebar (Section 3) */}
         <div className="space-y-6">
            <h3 className="text-xl font-bold font-outfit">Panel Insight</h3>
            <GlassCard className="bg-slate-900 border-0 shadow-2xl">
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Symptom Burden</p>
                     <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="h-32 w-full flex items-end gap-2 px-1">
                     {/* Mock graph bars */}
                     {[40, 70, 45, 90, 65, 30, 80].map((h, i) => (
                        <div key={i} className="flex-1 bg-white/10 rounded-t-lg group relative">
                           <div className={`absolute bottom-0 left-0 right-0 rounded-t-lg bg-indigo-500 transition-all duration-1000`} style={{ height: `${h}%` }}>
                              <div className="w-full h-1 bg-white/20" />
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="space-y-2">
                     <p className="text-xs text-white font-bold">Nausea severity +8% vs last cycle</p>
                     <p className="text-[10px] text-slate-400">Aggregated from 42 patient log submissions.</p>
                  </div>
               </div>
            </GlassCard>

            <GlassCard className="bg-indigo-50 border-indigo-100 dark:bg-slate-900 dark:border-slate-800">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                     82%
                  </div>
                  <div className="flex-1">
                     <p className="text-xs font-bold text-indigo-900 dark:text-indigo-100">Guide Engagement</p>
                     <p className="text-[10px] text-indigo-600/70 font-medium">Education paths reaching goals</p>
                  </div>
               </div>
            </GlassCard>
         </div>
      </div>

      {/* Today's Appointments Strip (Section 3) */}
      <div className="space-y-4 pt-4">
         <h3 className="text-xl font-bold font-outfit">Today's Appointments</h3>
         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6">
            {[1, 2, 3, 4, 5].map(i => (
               <GlassCard key={i} className="min-w-[280px] hover:border-slate-200 cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">09:30 AM</span>
                     <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold">CONFIRMED</span>
                  </div>
                  <p className="text-sm font-bold truncate group-hover:text-indigo-600 transition-colors">Patient Room 4 — Post-Op Review</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">MRN-982312 • Clinic 2B</p>
               </GlassCard>
            ))}
         </div>
      </div>

      {/* Patient Panel Snapshot Table (Section 3) */}
      <div className="space-y-4 pt-4">
         <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-outfit">Patient Panel Snapshot</h3>
            <Link href="/oncologist/patients" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Manage Panel</Link>
         </div>
         <GlassCard className="!p-0 overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Patient</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Cancer Type</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Stage</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Last Log</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {clinician.patients.map(p => (
                      <tr key={p.id} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                        <td className="px-6 py-4">
                           <div className={`w-3 h-3 rounded-full border-2 border-white ring-2 ring-slate-100 ${p.patient.symptomLogs.length > 0 ? "bg-emerald-500" : "bg-amber-500"}`} />
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold group-hover:text-indigo-600 transition-colors">{p.patient.preferredName || "Anonymous"}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{p.patient.mrn}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-xs font-bold text-slate-600">{p.patient.diagnoses[0]?.primarySiteDescription || "--"}</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded-md">
                              {p.patient.diagnoses[0]?.overallStage?.replace('STAGE_', '') || "--"}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-xs text-slate-500 font-medium">Recent</p>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="w-8 h-8 !p-0"><Activity className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" className="w-8 h-8 !p-0"><Bell className="w-4 h-4" /></Button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
         </GlassCard>
      </div>
    </div>
  );
}
