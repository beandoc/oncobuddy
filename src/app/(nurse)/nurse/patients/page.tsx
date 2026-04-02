import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Users, 
  Search, 
  MessageSquare, 
  PhoneCall, 
  PlusCircle, 
  MoreVertical,
  Activity,
  History,
  ChevronRight
} from "lucide-react";
import { Role } from "@prisma/client";
import Link from "next/link";

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
    <div className="flex items-baseline gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm  transition-transform cursor-pointer group">
       <span className={`text-2xl font-bold font-outfit ${colorClass}`}>{value}</span>
       <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Panel Health Summary Bar (Section A4) */}
      <div className="flex items-center gap-6 py-4 px-2 overflow-x-auto no-scrollbar">
         <SummaryPill label="Total Patients" value={nurse?.patients.length || 0} colorClass="text-slate-900" />
         <SummaryPill label="Logs Due Today" value="8" colorClass="text-amber-600" />
         <SummaryPill label="Active Alerts" value="4" colorClass="text-rose-600" />
         <SummaryPill label="Unread Msgs" value="12" colorClass="text-indigo-600" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900">Assigned <span className="text-indigo-600 underline underline-offset-4 decoration-indigo-100">Panel</span></h1>
            <p className="text-slate-600 mt-2 font-bold">Daily care tracking and compliance for {session.user.name?.split(' ').pop()}.</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input type="text" placeholder="Patient filters..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-50" />
            </div>
            <Link href="/nurse/registration">
               <Button className="h-10 px-6 gap-2 bg-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm hover:scale-105 transition-all">
                  <PlusCircle className="w-4 h-4" /> New Patient
               </Button>
            </Link>
         </div>
      </div>

      {/* Patient List Table (Section A4) - Contrast darkened */}
      <GlassCard className="!p-0 border-slate-100 overflow-hidden shadow-sm group rounded-xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                     <th className="px-6 py-5 text-[10px] font-bold text-slate-900 uppercase tracking-wider">Care Status</th>
                     <th className="px-6 py-5 text-[10px] font-bold text-slate-900 uppercase tracking-wider">Patient Details</th>
                     <th className="px-6 py-5 text-[10px] font-bold text-slate-900 uppercase tracking-wider">Current Phase</th>
                     <th className="px-6 py-5 text-[10px] font-bold text-slate-900 uppercase tracking-wider">Today's Log</th>
                     <th className="px-6 py-5 text-[10px] font-bold text-slate-900 uppercase tracking-wider">Alerts / Tasks</th>
                     <th className="px-6 py-5 text-[10px] font-bold text-slate-900 uppercase tracking-wider text-center">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {nurse?.patients.map(p => (
                     <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-6">
                           <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50 shadow-sm" />
                        </td>
                        <td className="px-6 py-6 border-l border-transparent group-hover:border-indigo-100">
                           <Link href={`/nurse/patients/${p.patient.publicId}`}>
                              <p className="text-sm font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{p.patient.preferredName || "Anonymous"}</p>
                           </Link>
                           <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider leading-none">MRN: {p.patient.mrn}</p>
                           <p className="text-[10px] text-slate-600 font-bold uppercase mt-1 leading-none">{p.patient.diagnoses[0]?.primarySiteDescription || "--"}</p>
                        </td>
                        <td className="px-6 py-6">
                            <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold uppercase text-slate-700 tracking-tighter">Cycle 4 (On-Treatment)</span>
                        </td>
                        <td className="px-6 py-6 text-center">
                            <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-full text-[10px] font-bold uppercase">Overdue 2h</span>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-tighter">2 Alerts</span>
                              <span className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-tighter">3 Tasks</span>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex items-center justify-center gap-2">
                              <Button variant="ghost" size="sm" className="h-9 px-4 font-bold text-[10px] uppercase tracking-wider hover:bg-indigo-50 hover:text-indigo-700 gap-1.5 transition-all border border-transparent hover:border-indigo-100 rounded-xl">
                                 <History className="w-3.5 h-3.5" /> Log Proxy
                              </Button>
                              <div className="flex items-center text-slate-400">
                                 <Button variant="ghost" size="sm" className="w-9 h-9 !p-0 rounded-xl"><PhoneCall className="w-4 h-4" /></Button>
                                 <Button variant="ghost" size="sm" className="w-9 h-9 !p-0 rounded-xl"><MessageSquare className="w-4 h-4" /></Button>
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
         <GlassCard className="bg-indigo-600 text-white border-0 shadow-sm relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
                <h4 className="text-2xl font-bold font-outfit">Panel Compliance</h4>
                <div className="flex items-center gap-8">
                   <div className="relative w-24 h-24">
                      <svg className="w-full h-full -rotate-90">
                         <circle className="text-white/10" strokeWidth="6" stroke="currentColor" fill="transparent" r="44" cx="48" cy="48" />
                         <circle className="text-emerald-400" strokeWidth="6" strokeDasharray="276" strokeDashoffset="55" strokeLinecap="round" stroke="currentColor" fill="transparent" r="44" cx="48" cy="48" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-2xl font-bold">82%</span>
                      </div>
                   </div>
                   <div className="space-y-1 max-w-[200px]">
                      <p className="text-[10px] font-bold uppercase text-indigo-200 tracking-wider">Active Logs Today</p>
                      <p className="text-xs text-indigo-100 font-medium">32 of 40 patients have submitted G3 symptom vectors before the afternoon triage review.</p>
                   </div>
                </div>
            </div>
            <Activity className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/5" />
         </GlassCard>

         <Link href="/nurse/registration">
            <GlassCard className="border-slate-200 flex items-center justify-between group cursor-pointer hover:bg-white hover:border-indigo-100 transition-all !p-8 rounded-[36px] h-full shadow-sm hover:shadow-sm">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl flex items-center justify-center  group-hover:rotate-6 transition-all duration-500">
                     <PlusCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-xl font-bold font-outfit">New Patient Onboarding</h4>
                     <p className="text-xs text-slate-600 font-bold">Initiate ICD-O-3 registry enrollment and team linkage.</p>
                  </div>
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                  <ChevronRight className="w-5 h-5" />
               </div>
            </GlassCard>
         </Link>
      </div>
    </div>
  );
}
