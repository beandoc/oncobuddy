import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  Activity, 
  Bell, 
  MessageSquare, 
  Eye,
  Calendar,
  MoreVertical,
  ChevronDown,
  ArrowUpDown
} from "lucide-react";
import { Role } from "@prisma/client";
import { OncologistTopbar } from "@/components/layout/OncologistTopbar";

/**
 * My Patients (Full Panel) - Screen 2.
 * Primary working screen for managing and monitoring the full panel.
 */
export default async function MyPatientsPage() {
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
              symptomLogs: { take: 1, orderBy: { logDate: 'desc' } },
              appointments: { 
                where: { scheduledDate: { gte: new Date() } },
                orderBy: { scheduledDate: 'asc' },
                take: 1
              }
            }
          }
        },
        orderBy: { assignedAt: 'desc' }
      }
    }
  });

  if (!clinician) redirect("/oncologist/dashboard");

  const totalCount = clinician.patients.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Search & Filter Bar (Section 4) */}
      <GlassCard className="!p-4 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="secondary" size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-9 font-bold">All Patients</Button>
           <Button variant="ghost" size="sm" className="text-slate-500 h-9 font-bold">Active Treatment</Button>
           <Button variant="ghost" size="sm" className="text-slate-500 h-9 font-bold">Post-Treatment</Button>
           <Button variant="ghost" size="sm" className="text-slate-500 h-9 font-bold">Surveillance</Button>
           <Button variant="ghost" size="sm" className="text-slate-400 h-9 font-bold opacity-50">Palliative</Button>
           
           <div className="w-[1px] h-6 bg-slate-100 mx-2" />
           
           <Button variant="outline" size="sm" className="text-slate-500 border-slate-100 h-9 font-bold flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" />
              More Filters
           </Button>
        </div>

        <div className="flex items-center gap-3">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mr-2">Showing {totalCount} patients</p>
           <Button variant="outline" size="sm" className="text-slate-500 border-slate-100 h-9 gap-2 font-bold">
              Sort: Urgency
              <ChevronDown className="w-3.5 h-3.5 opacity-50" />
           </Button>
        </div>
      </GlassCard>

      {/* Patient List Table (Section 4) */}
      <GlassCard className="!p-0 border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 w-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Activity className="w-4 h-4 mx-auto" /></th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Identity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clinical Diagnosis</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phase</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Log</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wellness</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {clinician.patients.map((p: any, idx: number) => (
                <tr key={p.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                  <td className="px-6 py-4">
                     <div className={`w-3.5 h-3.5 rounded-full border-2 border-white ring-1 ring-slate-100 mx-auto ${idx % 7 === 0 ? 'bg-rose-500 animate-pulse ring-rose-200' : 'bg-emerald-500'}`} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                       <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 ring-2 ring-white">
                          {p.patient.preferredName?.charAt(0) || "P"}
                       </div>
                       <div>
                          <p className="text-sm font-bold group-hover:text-indigo-600 transition-colors">{p.patient.preferredName || "Anonymous"}</p>
                          <p className="text-[10px] text-slate-400 font-bold tracking-tight">{p.patient.mrn}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-700 truncate max-w-xs">{p.patient.diagnoses[0]?.icd10Description || "No Registry Record"}</p>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase tracking-widest">
                           {p.patient.diagnoses[0]?.overallStage?.replace('STAGE_', '') || "STAGE TBD"}
                        </span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-xs font-medium text-slate-600">Active Treatment</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase">Cycle 4 of 6</p>
                  </td>
                  <td className="px-6 py-4">
                     <p className={`text-xs font-bold ${p.patient.symptomLogs.length > 0 ? "text-slate-700" : "text-rose-500"}`}>
                        {p.patient.symptomLogs.length > 0 ? "Today" : "3d Overdue"}
                     </p>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1 w-24">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                           <span>Score: 7.2</span>
                           <span className="text-emerald-500 uppercase">+2%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 w-[72%]" />
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                        <Button variant="ghost" size="sm" className="w-8 h-8 !p-0 hover:bg-white hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                           <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="w-8 h-8 !p-0 hover:bg-white hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                           <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="w-8 h-8 !p-0 hover:bg-white hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                           <MoreVertical className="w-4 h-4" />
                        </Button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Section 4) */}
        <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between bg-white">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Page 1 of 4 • 20 per page</p>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 px-4 text-[10px] uppercase font-bold tracking-widest disabled:opacity-30" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="h-8 px-4 text-[10px] uppercase font-bold tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all">Next</Button>
           </div>
        </div>
      </GlassCard>
    </div>
  );
}
