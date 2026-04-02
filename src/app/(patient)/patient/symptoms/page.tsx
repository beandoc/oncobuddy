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
  ClipboardList,
  AlertCircle
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";
import Link from "next/link";

/**
 * Patient My Health Hub - Screen 2 (Section B4).
 * Central health monitoring hub for PROs (Patient Reported Outcomes).
 * Features high-contrast typography (slate-900) for clinical safety and visibility.
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
    <button className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all ${active ? "bg-white text-indigo-600 shadow-xl shadow-indigo-100 ring-2 ring-indigo-50" : "text-slate-500 hover:text-slate-900"}`}>
       <Icon className="w-4 h-4 shadow-sm" />
       {label}
    </button>
  );

  return (
    <div className="space-y-12 selection:bg-indigo-100 selection:text-indigo-900 pb-24 animate-in fade-in duration-700">
      
      {/* Page Header (Section B4) */}
      <div className="space-y-3">
         <h1 className="text-4xl md:text-5xl font-black font-outfit tracking-tighter text-slate-950 italic">My <span className="text-indigo-600">Health Journal</span></h1>
         <p className="text-slate-700 font-bold italic italic leading-relaxed max-w-2xl">Tracking your daily vitality and toxicity levels ensures your clinical team can proactively manage your care plan.</p>
      </div>

      {/* Sub-Navigation Pill Tabs (Section B4) */}
      <div className="p-2.5 bg-slate-100 border-2 border-slate-50 rounded-[40px] flex items-center justify-between gap-2 max-w-2xl mx-auto shadow-inner">
         <TabButton label="Log Today" icon={PlusCircle} active />
         <TabButton label="History" icon={History} />
         <TabButton label="Analytics" icon={TrendingUp} />
      </div>

      {/* Log Today View - High Contrast (Section B4) */}
      <div className="space-y-12">
         <GlassCard className="!p-12 border-indigo-100 shadow-2xl overflow-hidden relative group bg-white shadow-indigo-100/30">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-150 rotate-12 transition-all group-hover:scale-[2] group-hover:opacity-[0.05]"><Heart className="w-80 h-80 text-indigo-600" /></div>
            
            <div className="max-w-2xl space-y-10 relative z-10">
               <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                     <PlusCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-black font-outfit text-slate-950 leading-none italic italic underline decoration-indigo-600/10 decoration-8 underline-offset-[12px]">Initialize Daily Summary</h2>
                  <p className="text-lg text-slate-700 font-bold mt-6 leading-relaxed">
                     Your daily toxicity log is the primary triage vector for your Nurse Navigator. Reporting mild symptoms early prevents clinical complications.
                  </p>
               </div>

               <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-4 text-slate-950 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100"><Info className="w-5 h-5 text-white" /></div>
                     <p className="text-[11px] font-black uppercase tracking-widest leading-tight">Next Clinical Review: Today, 15:30 (Standard Triage Window)</p>
                  </div>
                  
                  <Link href="/patient/symptoms/log" className="w-full h-18 bg-indigo-600 hover:bg-slate-950 text-white rounded-[32px] font-black uppercase text-xs tracking-[0.3em] gap-4 shadow-2xl shadow-indigo-100 group transition-all flex items-center justify-center py-6">
                     Start Symptom Triage Center
                     <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Link>
               </div>
            </div>
         </GlassCard>

         {/* Symptom Trends (High Visibility) */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="border-emerald-200 bg-emerald-50/10 shadow-xl !p-10 group">
               <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-emerald-100 shadow-sm"><TrendingUp className="w-6 h-6 text-emerald-600" /></div>
                     <div className="space-y-1">
                        <h4 className="text-2xl font-black font-outfit italic text-emerald-950 leading-none">Vitality Score: 7.2</h4>
                        <p className="text-[10px] text-emerald-700 font-black uppercase tracking-widest mt-1">Improving trend (+14%)</p>
                     </div>
                  </div>
                  <div className="h-4 w-full bg-emerald-100/50 rounded-full overflow-hidden border border-emerald-100 shadow-inner">
                     <div className="h-full bg-emerald-500 w-[72%] shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                  </div>
               </div>
            </GlassCard>

            <GlassCard className="border-slate-100 shadow-xl !p-10 flex items-center justify-between group cursor-pointer bg-white hover:border-indigo-100 transition-all">
               <div className="space-y-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all"><Download className="w-6 h-6" /></div>
                  <div className="space-y-1">
                     <h4 className="text-xl font-black font-outfit text-slate-950 italic">Clinical PDF Report</h4>
                     <p className="text-xs text-slate-600 font-bold italic italic">Consolidated history for second opinions or travel.</p>
                  </div>
               </div>
               <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-indigo-600 transition-transform group-hover:translate-x-2" />
            </GlassCard>
         </div>

         {/* Recent Log History (Section B4) */}
         <div className="space-y-8 pt-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-2xl font-black font-outfit text-slate-950 italic">Log History Archive</h3>
               <Link href="#" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full hover:bg-slate-950 hover:text-white transition-all shadow-sm">View Comprehensive List</Link>
            </div>
            
            <div className="space-y-4">
               {patient?.symptomLogs.map(log => (
                  <div key={log.id} className="p-8 bg-white border-2 border-slate-50 rounded-[40px] flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50/50 transition-all cursor-pointer group shadow-sm relative overflow-hidden">
                     <div className="flex items-center gap-8 relative z-10">
                        <div className="w-16 h-16 rounded-[22px] bg-slate-50 border-2 border-slate-100 flex flex-col items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all shadow-inner">
                           <span className="text-[10px] uppercase leading-none mb-1">{new Date(log.logDate).toLocaleDateString(undefined, { month: 'short' })}</span>
                           <span className="text-2xl leading-none font-outfit">{new Date(log.logDate).getDate()}</span>
                        </div>
                        <div className="space-y-2">
                           <p className="text-lg font-black text-slate-950 leading-none italic italic capitalize">{new Date(log.logDate).toLocaleDateString(undefined, { weekday: 'long' })} Submission</p>
                           <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-3">
                              <span className="flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Wellbeing: {log.wellbeingScore}/10</span>
                              <div className="w-1 h-1 rounded-full bg-slate-200" />
                              <span className="flex items-center gap-2"><AlertCircle className="w-3.5 h-3.5 text-rose-500" /> {log.entries.length} Symptoms Recorded</span>
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 relative z-10">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100 shadow-sm">Status: Submitted</span>
                        <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                           <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-transform group-hover:translate-x-1" />
                        </div>
                     </div>
                  </div>
               ))}
               
               {(!patient?.symptomLogs || patient.symptomLogs.length === 0) && (
                  <div className="p-20 text-center border-4 border-dashed border-slate-100 rounded-[56px] opacity-60 bg-slate-50/50">
                     <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                     <p className="text-base font-black text-slate-400 font-outfit uppercase tracking-[0.3em] leading-none">Healthy Journal History Empty</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
