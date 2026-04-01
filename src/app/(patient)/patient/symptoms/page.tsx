import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  Heart, 
  History, 
  TrendingUp, 
  ChevronRight, 
  PlusCircle, 
  Search, 
  FileText, 
  Download, 
  Info,
  Calendar,
  ClipboardList
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";

/**
 * Patient My Health Hub - Screen 2 (Section B4).
 * Central health monitoring hub for PROs (Patient Reported Outcomes).
 * Features the Log Today wizard, History, and simplified Trends.
 */
export default async function PatientHealthHub() {
  const session = await auth();
  if (!session || session.user.role !== Role.PATIENT) redirect("/login");

  const patient = await prisma.patient.findUnique({
    where: { userId: session.user.id },
    include: {
      symptomLogs: {
        take: 5,
        orderBy: { logDate: 'desc' },
        include: { entries: true }
      }
    }
  });

  const TabButton = ({ label, icon: Icon, active }: any) => (
    <button className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${active ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-100" : "text-slate-400 hover:text-slate-600"}`}>
       <Icon className="w-4 h-4" />
       {label}
    </button>
  );

  return (
    <div className="space-y-10 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      
      {/* Page Header (Section B4) */}
      <div className="space-y-2">
         <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900">My <span className="text-indigo-600">Health</span></h1>
         <p className="text-slate-500 font-medium italic">Track your progress and share updates with your care team.</p>
      </div>

      {/* Sub-Navigation Pill Tabs (Section B4) */}
      <div className="p-2 bg-slate-50 border border-slate-100 rounded-[32px] flex items-center justify-between gap-2 max-w-2xl mx-auto shadow-sm">
         <TabButton label="Log Today" icon={PlusCircle} active />
         <TabButton label="My History" icon={History} />
         <TabButton label="My Trends" icon={TrendingUp} />
      </div>

      {/* Log Today View - Initial CTA (Section B4) */}
      <div className="space-y-12">
         <GlassCard className="!p-12 border-slate-100 shadow-xl overflow-hidden relative group bg-white/70">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-[2]"><Heart className="w-64 h-64 text-rose-500" /></div>
            
            <div className="max-w-xl space-y-8 relative z-10">
               <div>
                  <h2 className="text-3xl font-bold font-outfit text-slate-900 leading-tight italic">How are you feeling<br/>this morning?</h2>
                  <p className="text-base text-slate-500 font-medium mt-4 leading-relaxed">
                     Your daily summary helps your Nurse Navigator triage symptoms before they become clinical challenges. It takes 2 minutes and is the most important part of your daily care.
                  </p>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-400 mb-6">
                     <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100"><Info className="w-4 h-4 text-indigo-600" /></div>
                     <p className="text-[10px] font-black uppercase tracking-widest leading-none">Next Review: Today, 15:30 by Clinical Team</p>
                  </div>
                  
                  <Button variant="secondary" className="w-full h-16 bg-indigo-600 hover:bg-slate-950 font-black uppercase text-sm tracking-[0.2em] gap-3 shadow-2xl shadow-indigo-100 group transition-all">
                     Start Daily Log
                     <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <button className="w-full py-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest text-center">
                     View My History first
                  </button>
               </div>
            </div>
         </GlassCard>

         {/* Symptom Trends Overview Stubs (Section B4) */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="border-emerald-100 bg-emerald-50/20 shadow-none">
               <div className="flex items-start gap-4">
                  <TrendingUp className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                  <div className="space-y-4">
                     <div>
                        <h4 className="text-lg font-bold font-outfit italic text-emerald-900 leading-tight">Your wellbeing index is 7.2</h4>
                        <p className="text-xs text-emerald-700/70 mt-1 font-bold uppercase tracking-tight">Improving over past 7 days</p>
                     </div>
                     <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[72%]" />
                     </div>
                  </div>
               </div>
            </GlassCard>

            <GlassCard className="border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors">
               <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-bold font-outfit text-slate-900">Symptom History PDF</h4>
                  <p className="text-xs text-slate-500 font-medium italic italic">Generate a clinical report for your external providers.</p>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:border-indigo-200 transition-all">
                  <Download className="w-5 h-5 text-indigo-600" />
               </div>
            </GlassCard>
         </div>

         {/* Recent Log History Strip (Section B4) */}
         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-bold font-outfit text-slate-900">Recent Logs</h3>
               <button className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform">See All</button>
            </div>
            
            <div className="space-y-3">
               {patient?.symptomLogs.map(log => (
                  <div key={log.id} className="p-6 bg-white border border-slate-100 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg hover:shadow-indigo-50/50 transition-all cursor-pointer group">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-colors">
                           <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900">{new Date(log.logDate).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Wellbeing: {log.wellbeingScore}/10 • {log.entries.length} Symptoms</p>
                        </div>
                     </div>
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Submitted</span>
                  </div>
               ))}
               
               {(!patient?.symptomLogs || patient.symptomLogs.length === 0) && (
                  <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-[48px] opacity-40 select-none">
                     <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                     <p className="text-sm font-bold text-slate-400 font-outfit uppercase tracking-widest leading-none">Your health report history will appear here</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
