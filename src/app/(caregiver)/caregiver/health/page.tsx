import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  Heart, 
  History, 
  TrendingUp, 
  PlusCircle, 
  ChevronRight, 
  Info, 
  AlertCircle,
  FileText,
  CheckCircle2
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";

/**
 * Caregiver Patient Health - Screen 2 (Section C4).
 * Focused view into the patient's health status with supporting roles.
 * Includes simplified trends and proxy logging for authorized carers.
 */
export default async function CaregiverHealthPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.CAREGIVER) redirect("/login");

  // Mock patient context for Jane Doe
  const patient = {
    preferredName: "Jane Doe",
    accessLevel: "VIEW_AND_LOG" as const,
    hasTodayLog: false,
    wellbeingIndex: 6.8,
  };

  const TabButton = ({ label, icon: Icon, active }: any) => (
    <button className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all ${active ? "bg-white text-teal-600 shadow-md ring-1 ring-slate-100" : "text-slate-400 hover:text-slate-600"}`}>
       <Icon className="w-4 h-4" />
       {label}
    </button>
  );

  return (
    <div className="space-y-10 selection:bg-teal-100 selection:text-teal-900 pb-20">
      
      {/* Page Header (Section C4) */}
      <div className="space-y-2">
         <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900">{patient.preferredName}'s <span className="text-teal-600">Health</span></h1>
         <p className="text-slate-500 font-medium">Monitor {patient.preferredName.split(' ')[0]}'s symptoms and support their daily logging.</p>
      </div>

      {/* Sub-Navigation Pill Tabs (Section C4) */}
      <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-2 max-w-2xl mx-auto shadow-sm">
         <TabButton label="Today's Log" icon={PlusCircle} active />
         <TabButton label="Log History" icon={History} />
         <TabButton label="Symptom Trends" icon={TrendingUp} />
      </div>

      {/* Today's Log View (Section C4) */}
      <div className="space-y-12">
         {/* Proxy Submission Card (Section C4) */}
         {!patient.hasTodayLog ? (
            <GlassCard className="!p-12 border-teal-100 shadow-sm overflow-hidden relative group bg-white/70">
               <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-[2] text-teal-500"><Heart className="w-64 h-64" /></div>
               
               <div className="max-w-xl space-y-8 relative z-10">
                  <div className="space-y-4">
                     <h2 className="text-3xl font-bold font-outfit text-slate-900 leading-tight">Support {patient.preferredName.split(' ')[0]} with today's log.</h2>
                     <p className="text-base text-slate-500 font-medium leading-relaxed">
                        It looks like {patient.preferredName.split(' ')[0]} hasn't submitted their symptom log today. If they are feeling unwell, you can submit on their behalf.
                     </p>
                  </div>

                  <div className="p-5 bg-teal-50/50 rounded-xl border border-teal-100/50 flex items-start gap-4">
                     <Info className="w-5 h-5 text-teal-600 mt-0.5" />
                     <p className="text-xs font-bold text-teal-900/70 leading-relaxed">
                        Your submission will be shared with the care team and marked as a caregiver-proxy entry. This helps {patient.preferredName.split(' ')[0]}'s nurse monitor their progress accurately.
                     </p>
                  </div>

                  {patient.accessLevel === 'VIEW_AND_LOG' ? (
                     <Button variant="secondary" className="w-full h-16 bg-teal-600 hover:bg-slate-950 font-bold uppercase text-sm tracking-[0.2em] gap-3 shadow-sm shadow-teal-100 group transition-all">
                        Submit Today's Log
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </Button>
                  ) : (
                     <Button variant="ghost" disabled className="w-full h-16 border-slate-200 text-slate-400 font-bold uppercase text-xs tracking-wider gap-2 bg-slate-50 cursor-not-allowed">
                        Contact Jane's care team to request submission access
                     </Button>
                  )}
               </div>
            </GlassCard>
         ) : (
            <div className="p-12 border-2 border-dashed border-slate-100 rounded-[48px] text-center opacity-50 select-none bg-white">
               <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto mb-4" />
               <p className="text-sm font-bold text-slate-500 font-outfit uppercase tracking-wider leading-none">Today's log is already submitted</p>
            </div>
         )}

         {/* Simplified Trends Overview (Section C4) */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="border-teal-100 bg-teal-50/20 shadow-none !p-8">
               <div className="flex items-start gap-6">
                  <TrendingUp className="w-10 h-10 text-teal-600 flex-shrink-0" />
                  <div className="space-y-4 flex-1">
                     <div className="flex justify-between items-end">
                        <div>
                           <h4 className="text-lg font-bold font-outfit italic text-teal-900 leading-tight">Wellbeing Trend</h4>
                           <p className="text-[10px] text-teal-700/70 mt-1 font-bold uppercase tracking-tight">INDEX: {patient.wellbeingIndex}</p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">Stable</span>
                     </div>
                     <div className="h-3 w-full bg-teal-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 w-[68%] shadow-sm" />
                     </div>
                     <p className="text-[11px] font-medium text-teal-800/60 leading-relaxed">Overall, {patient.preferredName.split(' ')[0]}'s wellbeing has been stable over the past two weeks.</p>
                  </div>
               </div>
            </GlassCard>

            <GlassCard className="border-slate-100 !p-8 flex items-center justify-between group cursor-pointer hover:bg-white hover:border-teal-100 transition-all shadow-sm">
               <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-bold font-outfit text-slate-900">History Summary</h4>
                  <p className="text-xs text-slate-500 font-medium italic leading-relaxed">Read-only summary of logs from the past 30 days.</p>
               </div>
               <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center  group-hover:border-teal-200 transition-all group-hover:bg-white">
                  <History className="w-6 h-6 text-teal-600" />
               </div>
            </GlassCard>
         </div>

         {/* Privacy Disclaimer (Section C4) */}
         <div className="p-8 border border-slate-100 rounded-xl flex items-center gap-6 bg-slate-50/50">
            <AlertCircle className="w-6 h-6 text-slate-300" />
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
               To protect {patient.preferredName.split(' ')[0]}'s privacy, free-text notes and clinical annotations are not visible to caregivers. You are seeing a simplified summary of their health status.
            </p>
         </div>
      </div>
    </div>
  );
}
