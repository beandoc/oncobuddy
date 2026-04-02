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
import Link from "next/link";

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
  const activeAlerts = patients.reduce((acc: any, p: any) => acc + (p.patient.alerts || []).length, 0);

  const StatPill = ({ label, value, color, bgColor = 'bg-white' }: any) => (
    <div className={`flex flex-col gap-0.5 px-5 py-2.5 rounded-xl border ${bgColor} shadow-sm group cursor-default border-slate-100`}>
       <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider leading-none">{label}</span>
       <div className="flex items-center gap-2">
          <span className={`text-lg font-bold font-outfit ${color}`}>{value}</span>
       </div>
    </div>
  );

  return (
    <div className="space-y-10 selection:bg-indigo-100 selection:text-indigo-900 pb-20 animate-in fade-in duration-500">
      
      {/* Clinician Panel Summary Strip - Non-scrolling logic (Section 4) */}
      <div className="flex flex-wrap gap-3 pb-2">
         <StatPill label="Total Panel" value={patients.length} color="text-slate-900" />
         <StatPill label="Active Alerts" value={activeAlerts} color="text-rose-700" bgColor="bg-rose-50/50" />
         <StatPill label="Logs Due" value="4" color="text-amber-700" bgColor="bg-amber-50/50" />
         <StatPill label="Critical" value="1" color="text-rose-700" bgColor="bg-rose-100/50" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-6">
         <div className="space-y-0.5">
            <h1 className="text-2xl font-bold font-outfit tracking-tight text-slate-900">Panel <span className="text-indigo-600">Inventory</span></h1>
            <p className="text-slate-400 font-medium text-sm">Active clinical tracking for {patients.length} patients.</p>
         </div>
         <div className="flex items-center gap-2">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
               <input type="text" placeholder="Search MRN..." className="h-9 w-48 pl-9 pr-4 bg-white border border-slate-200 rounded-lg text-xs font-medium placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all shadow-sm" />
            </div>
            <Button variant="outline" className="h-9 px-4 gap-2 font-bold text-[10px] uppercase tracking-wider border-slate-200 bg-white hover:bg-slate-50 text-slate-500 shadow-sm transition-all rounded-lg">
               <Filter className="w-3.5 h-3.5" /> Filter
            </Button>
            <Link href="/nurse/registration">
                <Button className="h-9 px-5 gap-2 bg-slate-950 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm hover:bg-indigo-600 transition-all rounded-lg">
                   <PlusCircle className="w-3.5 h-3.5" /> Register
                </Button>
            </Link>
         </div>
      </div>

      {/* Patient Table - Grid Architecture (Section 4) */}
      <GlassCard className="!p-0 border-slate-100 shadow-sm overflow-hidden bg-white rounded-xl">
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                     <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Patient Identity</th>
                     <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Diagnosis / Cycle</th>
                     <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Log Status</th>
                     <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Alerts</th>
                     <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {patients.map(({ patient }: any) => (
                    <tr key={patient.id} className="group hover:bg-slate-50 transition-all cursor-pointer">
                       <td className="px-6 py-2.5">
                          <div className="flex items-center gap-4">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 transition-all border border-slate-200">
                                {patient.preferredName?.charAt(0) || patient.user.firstName?.charAt(0)}
                             </div>
                             <div className="space-y-0.5">
                                <Link href={`/oncologist/patients/${patient.publicId}`}>
                                   <p className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors">{patient.preferredName || `${patient.user.firstName} ${patient.user.lastName}`}</p>
                                </Link>
                                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">MRN: {patient.mrn}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-2.5">
                          <div className="space-y-1.5">
                             <p className="text-xs font-semibold text-slate-700 leading-none">{patient.diagnoses[0]?.primarySiteDescription || "Advanced Malignancy"}</p>
                             <div className="flex items-center gap-2 pt-0.5 font-sans leading-none">
                                <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-indigo-500 w-[75%]" />
                                </div>
                                <span className="text-[10px] font-bold uppercase text-indigo-500 tracking-tight">Cycle 4 of 6</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-2.5">
                          {patient.symptomLogs[0] ? (
                             <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                   <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider leading-none">Submitted</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase leading-none tracking-tight">{new Date(patient.symptomLogs[0].logDate).toLocaleDateString()}</p>
                             </div>
                          ) : (
                             <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                   <Clock className="w-3.5 h-3.5 text-amber-500" />
                                   <span className="text-[10px] font-bold uppercase text-amber-600 tracking-wider leading-none">Overdue</span>
                                </div>
                             </div>
                          )}
                       </td>
                       <td className="px-6 py-2.5 text-center">
                          <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-all ${patient.alerts.length > 0 ? "bg-rose-100 text-rose-600 ring-2 ring-rose-50" : "bg-slate-50 text-slate-300"}`}>
                             {patient.alerts.length}
                          </div>
                       </td>
                       <td className="px-6 py-2.5">
                          <div className="flex items-center justify-end gap-2">
                             <Button variant="ghost" className="h-8 px-2 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-wider transition-all">
                                <MessageSquare className="w-4 h-4" />
                             </Button>
                             <Button variant="ghost" className="h-8 px-2 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-wider transition-all">
                                <History className="w-4 h-4" />
                             </Button>
                             <Link href={`/oncologist/patients/${patient.publicId}`}>
                                <Button variant="ghost" className="h-8 w-8 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-500 flex items-center justify-center transition-all group">
                                   <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                             </Link>
                          </div>
                       </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </GlassCard>

      {/* Quick Action Clinical Navigation (Section 4) */}
      <GlassCard className="border-slate-100 bg-slate-50/50 !p-6 relative overflow-hidden group rounded-xl shadow-sm">
         <div className="absolute right-0 top-0 bottom-0 w-32 bg-indigo-500/5 transition-transform duration-700" />
         <div className="flex items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5">
               <h4 className="text-lg font-bold font-outfit text-slate-900 border-b border-indigo-100 pb-1.5">Clinical Proxy Administration</h4>
               <p className="text-xs text-slate-500 leading-relaxed max-w-xl font-medium">
                  Need to record a toxicity breach or mark attendance on behalf of a patient who cannot access the platform?
               </p>
               <button className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider flex items-center gap-2 pt-1 hover:translate-x-1 transition-all">
                  Open Clinical Proxy Gateway <ChevronRight className="w-3.5 h-3.5" />
               </button>
            </div>
            <div className="hidden md:flex flex-col items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm scale-110"><Activity className="w-5 h-5" /></div>
            </div>
         </div>
      </GlassCard>
    </div>
  );
}
