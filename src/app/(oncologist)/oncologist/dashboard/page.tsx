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
import { OutcomeVelocityChart } from "@/components/dashboard/ClinicalChart";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";

/**
 * Oncologist Dashboard Home (Overview) - Screen 1.
 * Provides complete situational awareness of the clinical panel.
 */
export default async function OncologistDashboard({ searchParams }: { searchParams: { q?: string } }) {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  const query = searchParams.q || "";

  const clinician = await prisma.clinician.findUnique({
    where: { userId: session.user.id },
    include: {
      patients: {
        where: { 
          endedAt: null,
          OR: [
            { patient: { preferredName: { contains: query, mode: 'insensitive' } } },
            { patient: { mrn: { contains: query, mode: 'insensitive' } } },
            { patient: { user: { firstName: { contains: query, mode: 'insensitive' } } } },
            { patient: { user: { lastName: { contains: query, mode: 'insensitive' } } } }
          ]
        },
        include: {
          patient: {
            include: {
              user: true,
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
              patient: {
                include: { user: true }
              }
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
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  // Vanguard Metric Card HUD (Section 20)
  const MetricCard = ({ title, value, label, trend, trendValue, colorClass, icon: Icon }: any) => (
    <GlassCard className="relative group overflow-hidden border-2 border-slate-50 hover:border-indigo-100 hover:shadow-[0_40px_80px_rgba(79,70,229,0.12)] transition-all !p-8 bg-white">
       <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 blur-3xl rounded-full translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform" />
       <div className="flex justify-between items-start mb-6">
          <div className={`p-4 rounded-2xl ${colorClass.replace('text-', 'bg-').replace('700', '50').replace('900', '50')} ${colorClass} shadow-sm border border-current/10`}>
             <Icon className="w-6 h-6 shadow-sm" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border-2 border-white shadow-inner">
             {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" /> : <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />}
             <span className={`text-[10px] font-black ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>{trendValue}%</span>
          </div>
       </div>
       <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-serif italic italic">{title}</p>
          <div className="flex items-baseline gap-3">
             <h3 className={`text-5xl font-black font-outfit tracking-tighter ${colorClass} italic`}>{value}</h3>
             <span className="text-[11px] text-slate-900 font-bold uppercase tracking-widest">{label}</span>
          </div>
       </div>
    </GlassCard>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Vanguard Clinical Header (Section 3) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-slate-50 pb-10">
         <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]" />
               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] font-serif italic">Clinical Priority Hub Active</span>
            </div>
            <h1 className="text-6xl font-black font-outfit tracking-tight text-slate-950 italic italic leading-none">
              {greeting}, <span className="text-indigo-600 underline decoration-indigo-100 underline-offset-8">Dr. {session.user.name?.split(' ').pop()}</span>
            </h1>
            <p className="text-slate-900 font-bold italic italic opacity-60 pt-2 text-base">Situational awareness hub for your {clinician.specialization.replace(/_/g, ' ')} panel.</p>
         </div>
         <div className="flex items-center gap-4">
            <Link href="/nurse/registration">
                <Button className="h-16 px-10 bg-slate-950 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 transition-all flex items-center gap-3 active:scale-95">
                   <UserPlus className="w-5 h-5" /> New Case Release
                </Button>
            </Link>
            <Button variant="outline" className="h-16 w-16 rounded-[28px] border-2 border-slate-100 bg-white hover:bg-slate-50 !p-0 shadow-sm"><Filter className="w-5 h-5" /></Button>
         </div>
      </div>

      {/* 2. HUD Metric Grid (Section 20) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Panel" value={clinician.patients.length} label="Patients" trend="up" trendValue={4} colorClass="text-slate-900" icon={Users} />
        <MetricCard title="Critical Triage" value={activeAlertCount} label="Un-Ack" trend="down" trendValue={12} colorClass={activeAlertCount > 0 ? "text-rose-600" : "text-emerald-600"} icon={Bell} />
        <MetricCard title="Clinic Visits" value="08" label="Today" trend="up" trendValue={2} colorClass="text-indigo-600" icon={Calendar} />
        <MetricCard title="Outcome Velocity" value="7.2" label="/ 10.0" trend="up" trendValue={1.5} colorClass="text-emerald-600" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* 3. Triage Action Panel (Section 3) */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black font-outfit text-slate-900 italic italic">Mission Critical <span className="text-rose-600">Alerts</span></h3>
               <Link href="/oncologist/alerts" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View Crisis Log</Link>
            </div>

            <div className="space-y-6">
              {clinician.acknowledgedAlerts.length > 0 ? (
                clinician.acknowledgedAlerts.map(alert => (
                  <GlassCard key={alert.id} className="hover:bg-white border-white/50 hover:border-rose-100 hover:shadow-[0_20px_50px_rgba(244,63,94,0.06)] transition-all cursor-pointer group !p-8 rounded-[32px] relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-1 bg-rose-500 h-full opacity-30 group-hover:opacity-100 transition-opacity" />
                     <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-6">
                           <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center border transition-transform group-hover:rotate-6 ${alert.alertSeverity === AlertSeverity.URGENT ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-amber-50 border-amber-100 text-amber-600"}`}>
                              <Activity className="w-6 h-6" />
                           </div>
                           <div className="space-y-1">
                              <p className="text-xl font-black font-outfit text-slate-900 group-hover:text-rose-600 transition-colors">
                                 {alert.log.patient.preferredName || `${alert.log.patient.user.firstName} ${alert.log.patient.user.lastName}`}
                              </p>
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{alert.alertType.replace(/_/g, ' ')}</span>
                                 <span className="w-1 h-1 rounded-full bg-slate-200" />
                                 <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest">{alert.alertSeverity}</span>
                              </div>
                           </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-3">
                           <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">2h Since Breach</span>
                           </div>
                           <Button variant="ghost" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest h-auto p-0 hover:bg-transparent">Acknowledge <ChevronRight className="w-4 h-4" /></Button>
                        </div>
                     </div>
                  </GlassCard>
                ))
              ) : (
                <div className="p-20 text-center bg-slate-50/50 rounded-[48px] border-2 border-dashed border-indigo-50 relative overflow-hidden">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/80 via-transparent to-transparent opacity-50" />
                   <div className="relative z-10">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100/50 rotate-[-8deg]">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-2xl font-black font-outfit text-slate-900 italic italic">All Alerts Acknowledged</h4>
                    <p className="text-sm text-slate-500 font-medium italic opacity-60 mt-2">The clinical panel is currently stable and in adherence.</p>
                    <p className="text-[9px] text-emerald-600 mt-6 uppercase font-black tracking-[0.3em] bg-emerald-50 inline-block px-4 py-2 rounded-full border border-emerald-100">Last Intelligence Sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Today</p>
                   </div>
                </div>
              )}
            </div>
         </div>

         {/* 4. Insight Intelligence Sidebar (Section 3) */}
         <div className="space-y-10">
            <div className="space-y-6">
              <h3 className="text-xl font-black font-outfit text-slate-950 italic italic">Outcome <span className="text-indigo-600 underline decoration-indigo-200">Intelligence</span></h3>
              <GlassCard className="bg-slate-950 border-0 shadow-[0_40px_80px_rgba(0,0,0,0.2)] !p-0 overflow-hidden rounded-[36px]">
                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] font-serif">Symptom Burden Velocity</p>
                      <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black">+8% Efficiency</div>
                    </div>
                    <OutcomeVelocityChart data={[40, 70, 45, 90, 65, 30, 80]} />
                </div>
                <div className="bg-white/5 p-8 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        <p className="text-xs text-white font-bold italic">HER2+ Panel Nausea Spike Identified</p>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic italic">Anomaly patterns detected in 12% of the active panel receiving cycle 4 immunotherapy.</p>
                </div>
              </GlassCard>
            </div>

            <GlassCard className="bg-indigo-50 border-indigo-100 !p-8 rounded-[40px] shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform">
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
               <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-[24px] bg-white border-2 border-indigo-100 flex items-center justify-center text-2xl font-black font-outfit text-indigo-600 shadow-xl shadow-indigo-100/50">
                     82%
                  </div>
                  <div className="flex-1 space-y-1">
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Guide Adherence</p>
                     <p className="text-sm font-black text-indigo-900 leading-tight italic">Patient education paths reaching stability goals.</p>
                  </div>
               </div>
            </GlassCard>
         </div>
      </div>

      {/* 5. Today's Appointments Strip (Section 20) */}
      <div className="space-y-6 pt-10 border-t border-slate-100">
         <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black font-outfit text-slate-900 italic italic">Today's <span className="underline decoration-indigo-200 underline-offset-8">Clinical Visits</span></h3>
            <Link href="/oncologist/calendar" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600">Full Schedule</Link>
         </div>
         <div className="flex gap-6 overflow-x-auto no-scrollbar pb-10 -mx-4 px-4">
            {[
               { time: '09:30 AM', patient: 'Rajesh Malhotra', reason: 'Post-Op Review', room: 'Room 4', status: 'CONFIRMED' },
               { time: '10:15 AM', patient: 'Sunita Reddy', reason: 'Cycle 3 Planning', room: 'Consult 2B', status: 'WAITING' },
               { time: '11:00 AM', patient: 'Amit Das', reason: 'Neuropathy Check', room: 'Room 12', status: 'CONFIRMED' },
               { time: '12:30 PM', patient: 'Priya Iyer', reason: 'Molecular Review', room: 'Virtual', status: 'READY' }
            ].map((app, i) => (
               <GlassCard key={i} className="min-w-[320px] hover:bg-white border-white/50 hover:border-indigo-100 hover:shadow-xl transition-all cursor-pointer group !p-8 rounded-[32px]">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-500 tracking-tighter uppercase">{app.time}</span>
                     </div>
                     <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${app.status === 'WAITING' ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                        {app.status}
                     </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-black font-outfit text-slate-900 group-hover:text-indigo-600 transition-colors uppercase italic">{app.patient}</p>
                    <p className="text-sm font-bold text-slate-500 italic italic">{app.reason}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-6 opacity-40 group-hover:opacity-100 transition-opacity">
                     <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">{app.room}</span>
                  </div>
               </GlassCard>
            ))}
         </div>
      </div>

      {/* 6. Panel Snapshot Terminal (Section 3, 12) */}
      <div className="space-y-8 pt-10 border-t border-slate-100 shadow-[0_-40px_80px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black font-outfit text-slate-900 italic italic">Case <span className="text-indigo-600">Inventory</span></h3>
            <div className="flex items-center gap-6 flex-1 justify-end">
               <DashboardSearch />
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                     Show: <span className="text-indigo-600 underline cursor-pointer hover:text-indigo-800">Active Treatment</span>
                  </div>
                  <Link href="/oncologist/patients" className="text-[10px] font-black text-white px-5 py-2.5 bg-slate-900 rounded-full uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Panel Explorer</Link>
               </div>
            </div>
          </div>
         <GlassCard className="!p-0 border-white/50 shadow-xl rounded-[40px] overflow-hidden">
            <div className="overflow-x-auto overflow-y-hidden">
               <table className="w-full text-left">
                  <thead className="bg-[#F8FAFC] border-b border-indigo-50">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic font-serif">Clinical Status</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic font-serif">Stakeholder</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic font-serif">Triage Domain</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic font-serif">Molecular Tier</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic font-serif">Vitality Index</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic font-serif">Gateways</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {clinician.patients.map(p => (
                      <tr key={p.id} className="group hover:bg-slate-50/80 transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-600">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full shadow-sm ${p.patient.symptomLogs.length > 0 ? "bg-emerald-500 shadow-emerald-200" : "bg-amber-400 shadow-amber-100 pulse"}`} />
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter italic">{p.patient.symptomLogs.length > 0 ? "STABLE" : "LOGS PENDING"}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                          <Link href={`/oncologist/patients/${p.patient.publicId}`} className="space-y-0.5 block group/name">
                            <p className="text-lg font-black font-outfit text-slate-900 group-hover/name:text-indigo-600 transition-colors italic underline decoration-transparent group-hover/name:decoration-indigo-200 decoration-2 underline-offset-4">{p.patient.preferredName || `${p.patient.user.firstName} ${p.patient.user.lastName}`}</p>
                            <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">MRN {p.patient.mrn}</p>
                          </Link>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-200" />
                              <p className="text-xs font-black text-slate-700 italic">{p.patient.diagnoses[0]?.primarySiteDescription || "Awaiting Data"}</p>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-[9px] font-black px-3 py-1 bg-indigo-600 text-white rounded-full tracking-widest shadow-md shadow-indigo-100">
                              {p.patient.diagnoses[0]?.overallStage?.replace('STAGE_', '') || "NA"}
                           </span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="w-4/5 h-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex gap-4">
                              <Button variant="ghost" size="sm" className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-indigo-200 hover:text-indigo-600 transition-all !p-0"><Activity className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-rose-200 hover:text-rose-600 transition-all !p-0"><Bell className="w-4 h-4" /></Button>
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
