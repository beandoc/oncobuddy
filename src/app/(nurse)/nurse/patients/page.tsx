import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Users, 
  Search, 
  Filter, 
  MessageSquare, 
  PhoneCall, 
  PlusCircle, 
  MoreVertical,
  Activity,
  History,
  AlertTriangle,
  ClipboardList,
  ChevronRight
} from "lucide-react";
import { Role, AlertStatus } from "@prisma/client";

/**
 * Nurse My Patients - Screen 4.
 * High-density panel management focused on daily care compliance (logging status).
 * Includes the 'Log on Behalf' clinical proxy submission action.
 */
export default async function NursePatientPanel() {
  const session = await auth();
  if (!session || session.user.role !== Role.NURSE) redirect("/login");

  const nurse = await prisma.clinician.findUnique({
    where: { userId: session.user.id },
    include: {
      patients: {
         where: { endedAt: null },
         include: {
            patient: {
               include: {
                  diagnoses: { take: 1, orderBy: { diagnosisDate: 'desc' } },
                  symptomLogs: { take: 1, orderBy: { logDate: 'desc' } },
                  _count: {
                     select: {
                        thresholds: { where: { isActive: true } }
                     }
                  }
               }
            }
         }
      }
    }
  });

  const SummaryPill = ({ label, value, colorClass }: any) => (
    <div className="flex items-baseline gap-3 px-6 py-3 bg-white border border-slate-50 rounded-2xl shadow-sm hover:translate-y-[-2px] transition-transform cursor-pointer group">
       <span className={`text-2xl font-black font-outfit ${colorClass}`}>{value}</span>
       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Panel Health Summary Bar (Section A4) */}
      <div className="flex items-center gap-6 py-4 px-2 overflow-x-auto no-scrollbar">
         <SummaryPill label="Total Patients" value={nurse?.patients.length || 0} colorClass="text-slate-900" />
         <SummaryPill label="Logs Due Today" value="8" colorClass="text-amber-500" />
         <SummaryPill label="Active Alerts" value="4" colorClass="text-rose-600" />
         <SummaryPill label="Unread Msgs" value="12" colorClass="text-indigo-600" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <h1 className="text-4xl font-bold font-outfit tracking-tight">Assigned <span className="text-indigo-600">Panel</span></h1>
            <p className="text-slate-500 mt-2 font-medium">Daily care tracking and compliance.</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" placeholder="Quick search..." className="pl-10 pr-4 py-2 border border-slate-100 rounded-xl text-sm focus:ring-1 focus:ring-indigo-100" />
            </div>
            <Button variant="secondary" className="h-10 px-6 gap-2 bg-slate-950 font-bold text-xs shadow-lg">
               <PlusCircle className="w-4 h-4" /> Add Patient
            </Button>
         </div>
      </div>

      {/* Patient List Table (Section A4) */}
      <GlassCard className="!p-0 border-slate-100 overflow-hidden shadow-md group">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Care Status</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Details</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Phase</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Today's Log</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alerts / Tasks</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {nurse?.patients.map(p => (
                     <tr key={p.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50 shadow-sm" />
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{p.patient.preferredName || "Anonymous"}</p>
                           <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{p.patient.mrn}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{p.patient.diagnoses[0]?.primarySiteDescription || "--"}</p>
                        </td>
                        <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold uppercase text-slate-500">On-Treatment Cycle 4</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <span className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-bold uppercase">Overdue 2h</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-rose-500 text-white rounded-md text-[10px] font-black uppercase">2 Alerts</span>
                              <span className="px-2 py-1 bg-indigo-500 text-white rounded-md text-[10px] font-black uppercase">3 Tasks</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="h-8 !px-3 font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 gap-1.5 transition-all">
                                 <History className="w-3.5 h-3.5" /> Log Proxy
                              </Button>
                              <div className="flex items-center">
                                 <Button variant="ghost" size="sm" className="w-8 h-8 !p-0"><PhoneCall className="w-3.5 h-3.5" /></Button>
                                 <Button variant="ghost" size="sm" className="w-8 h-8 !p-0"><MessageSquare className="w-3.5 h-3.5" /></Button>
                                 <Button variant="ghost" size="sm" className="w-8 h-8 !p-0"><MoreVertical className="w-3.5 h-3.5" /></Button>
                              </div>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <GlassCard className="bg-indigo-600 text-white border-0 shadow-xl shadow-indigo-500/20">
            <h4 className="text-xl font-bold font-outfit mb-4">Patient Compliance Tracker</h4>
            <div className="flex items-center gap-8">
               <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90">
                     <circle className="text-white/10" strokeWidth="6" stroke="currentColor" fill="transparent" r="44" cx="48" cy="48" />
                     <circle className="text-emerald-400" strokeWidth="6" strokeDasharray="276" strokeDashoffset="55" strokeLinecap="round" stroke="currentColor" fill="transparent" r="44" cx="48" cy="48" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-2xl font-black">82%</span>
                  </div>
               </div>
               <div>
                  <p className="text-xs font-bold uppercase tracking-tight">Active Logs Today</p>
                  <p className="text-xs text-indigo-100/70 mt-1 font-medium">32 of 40 patients have logged their symptoms before tea-time review.</p>
               </div>
            </div>
         </GlassCard>

         <GlassCard className="border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-lg font-bold font-outfit">New Patient Onboarding</h4>
                  <p className="text-xs text-slate-500">Initiate clinical team assignment and ICD-O-3 registry enrollment.</p>
               </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
         </GlassCard>
      </div>
    </div>
  );
}
