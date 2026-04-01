import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Users, 
  Search, 
  Filter, 
  MessageSquare, 
  PlusCircle, 
  ChevronRight, 
  Calendar, 
  History, 
  Download,
  AlertCircle,
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { Role } from "@prisma/client";

/**
 * Oncologist Patient Panel - Screen 3.
 * Professional panel management tool for medical oncologists.
 * Features clinical summary strips, treatment cycle tracking, and role-based actions. (Section 4).
 */
export default async function OncologistPatientPanel() {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  const clinician = await prisma.clinician.findUnique({
    where: { userId: session.user.id },
    include: {
      patients: {
        include: {
          patient: {
            include: {
              user: true,
              diagnoses: true,
              symptomLogs: { take: 1, orderBy: { logDate: 'desc' } },
              alerts: { where: { alertStatus: 'PENDING' } }
            }
          }
        }
      }
    }
  });

  const patients = clinician?.patients || [];
  const activeAlerts = patients.reduce((acc, p) => acc + p.patient.alerts.length, 0);

  const StatPill = ({ label, value, color }: any) => (
    <div className={`flex flex-col gap-1 px-8 py-4 rounded-[28px] border bg-white shadow-sm transition-all hover:bg-indigo-50/20 group cursor-pointer border-slate-100`}>
       <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none italic italic">{label}</span>
       <div className="flex items-center gap-3">
          <span className={`text-2xl font-black font-outfit ${color}`}>{value}</span>
          <ArrowUpRight className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
       </div>
    </div>
  );

  return (
    <div className="space-y-10 selection:bg-indigo-100 selection:text-indigo-900 pb-20 animate-in fade-in duration-500">
      
      {/* Clinician Panel Summary Strip - Non-scrolling logic (Section 4) */}
      <div className="flex flex-wrap gap-4 pb-2">
         <StatPill label="Total Panel" value={patients.length} color="text-slate-900" />
         <StatPill label="Active Alerts" value={activeAlerts} color="text-rose-600" />
         <StatPill label="Logs Due Today" value="4" color="text-amber-500" />
         <StatPill label="Critical Heatmap" value="1" color="text-rose-600" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900 italic italic">Panel <span className="text-indigo-600">Inventory</span></h1>
            <p className="text-slate-500 font-medium italic italic">Active clinical tracking for {patients.length} patients.</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
               <input type="text" placeholder="Search by name or MRN..." className="h-12 w-64 pl-10 pr-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-widest placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm" />
            </div>
            <Button variant="outline" className="h-12 px-6 gap-2 font-bold text-[10px] uppercase tracking-widest border-slate-100 bg-white hover:bg-slate-50 text-slate-500 shadow-sm transition-all">
               <Filter className="w-4 h-4" /> Filter Panel
            </Button>
            <Button variant="secondary" className="h-12 px-8 gap-3 bg-indigo-600 hover:bg-slate-950 font-black text-[11px] uppercase tracking-widest shadow-2xl transition-all">
               <PlusCircle className="w-5 h-5" /> Register Patient
            </Button>
         </div>
      </div>

      {/* Patient Table - Grid Architecture (Section 4) */}
      <GlassCard className="!p-0 border-slate-100 shadow-2xl overflow-hidden bg-white/70">
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100/50">
                     <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Patient Identity</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Diagnosis / Cycle</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Log Status</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Alerts</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Coordination</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {patients.map(({ patient }) => (
                     <tr key={patient.id} className="group hover:bg-indigo-50/20 transition-all cursor-pointer">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-white group-hover:scale-110 transition-all border-4 border-transparent group-hover:border-indigo-100/50">
                                 {patient.preferredName?.charAt(0) || patient.user.firstName?.charAt(0)}
                              </div>
                              <div className="space-y-1">
                                 <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-none italic italic underline decoration-transparent group-hover:decoration-indigo-200 underline-offset-4 decoration-2">{patient.preferredName || `${patient.user.firstName} ${patient.user.lastName}`}</p>
                                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2 block leading-none italic italic">MRN: {patient.mrn}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="space-y-2">
                              <p className="text-xs font-bold text-slate-700 italic italic leading-none">{patient.diagnoses[0]?.diagnosisBodySite || "Advanced Malignancy"}</p>
                              <div className="flex items-center gap-2 pt-1.5 font-sans leading-none">
                                 <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[75%]" />
                                 </div>
                                 <span className="text-[10px] font-black uppercase text-indigo-500 tracking-tight">Cycle 4 of 6</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           {patient.symptomLogs[0] ? (
                              <div className="space-y-2">
                                 <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest leading-none">Submitted</span>
                                 </div>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase italic leading-none tracking-tight">{new Date(patient.symptomLogs[0].logDate).toLocaleDateString()}</p>
                              </div>
                           ) : (
                              <div className="space-y-2 animate-pulse">
                                 <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                                    <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest leading-none">Overdue</span>
                                 </div>
                              </div>
                           )}
                        </td>
                        <td className="px-8 py-6 text-center">
                           <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-black text-xs transition-all ${patient.alerts.length > 0 ? "bg-rose-100 text-rose-600 ring-4 ring-rose-50 animate-bounce" : "bg-slate-50 text-slate-300"}`}>
                              {patient.alerts.length}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" className="h-9 px-4 rounded-xl border border-slate-100 hover:bg-indigo-50 text-indigo-600 font-bold text-[10px] uppercase tracking-widest transition-all">
                                 <MessageSquare className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" className="h-9 px-4 rounded-xl border border-slate-100 hover:bg-indigo-50 text-indigo-600 font-bold text-[10px] uppercase tracking-widest transition-all">
                                 <History className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" className="h-9 w-9 rounded-xl border border-slate-100 hover:bg-indigo-50 text-indigo-600 flex items-center justify-center transition-all group">
                                 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </GlassCard>

      {/* Quick Action Clinical Navigation (Section 4) */}
      <GlassCard className="border-indigo-100 bg-indigo-50/10 !p-10 relative overflow-hidden group">
         <div className="absolute right-0 top-0 bottom-0 w-32 bg-indigo-500/5 group-hover:scale-150 transition-transform duration-700" />
         <div className="flex items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
               <h4 className="text-2xl font-bold font-outfit text-slate-900 border-b border-indigo-100 pb-2 italic italic">Clinical Proxy Administration</h4>
               <p className="text-sm text-slate-500 italic italic leading-relaxed max-w-xl">
                  Need to record a toxicity breach or mark attendance on behalf of a patient who cannot access the platform?
               </p>
               <button className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.3em] flex items-center gap-2 pt-2 hover:translate-x-1 transition-all">
                  Open Clinical Proxy Gateway <ChevronRight className="w-4 h-4" />
               </button>
            </div>
            <div className="hidden md:flex flex-col items-center gap-3">
               <div className="w-16 h-16 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-100/50 scale-125"><Activity className="w-8 h-8" /></div>
            </div>
         </div>
      </GlassCard>
    </div>
  );
}
