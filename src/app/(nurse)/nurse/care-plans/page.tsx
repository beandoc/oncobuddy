import { Clipboard, List, Calendar, Activity, CheckCircle2, ChevronRight, Download, FileText, Plus } from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Nurse Care Plans Dashboard - Vanguard Terminal.
 * Centralized repository for active treatment protocols and supportive care blueprints.
 */
export default async function NurseCarePlansPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.NURSE) redirect("/login");

  const activePlans = [
    { 
      id: 'CP-001', 
      patient: 'John Doe', 
      protocol: 'FOLFOX + Bevacizumab', 
      cycle: '4 of 12', 
      lastUpdate: '2024-03-28',
      status: 'On-Track',
      priority: 'Routine'
    },
    { 
      id: 'CP-002', 
      patient: 'Sarah Smith', 
      protocol: 'Pembrolizumab Q3W', 
      cycle: '8 of 35', 
      lastUpdate: '2024-03-31',
      status: 'Toxicities Reported',
      priority: 'Urgent'
    },
    { 
      id: 'CP-003', 
      patient: 'Robert Brown', 
      protocol: 'Adjuvant AC-T', 
      cycle: '2 of 8', 
      lastUpdate: '2024-04-01',
      status: 'Waiting for Labs',
      priority: 'High'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
         <div>
            <h1 className="text-5xl font-bold font-outfit text-slate-900 tracking-tight">Care <span className="text-indigo-600 underline underline-offset-8 decoration-indigo-100">Repository</span></h1>
            <p className="text-base font-bold text-slate-600 mt-2">Managing active clinical blueprints for {activePlans.length} patients.</p>
         </div>
         <div className="flex items-center gap-3">
            <Button variant="outline" className="h-12 px-6 gap-2 border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-wider hover:bg-slate-50">
               <Download className="w-4 h-4" /> Export All
            </Button>
            <Button className="h-12 px-8 gap-3 bg-slate-950 text-white font-bold text-[11px] uppercase tracking-wider shadow-sm hover:scale-105 transition-all">
               <Plus className="w-5 h-5" /> Initiate New Plan
            </Button>
         </div>
      </div>

      {/* Main Grid Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         
         {/* Left Column: Active Plans Table */}
         <div className="lg:col-span-2 space-y-8">
            <h3 className="text-2xl font-bold font-outfit text-slate-900">Active <span className="text-indigo-600">Blueprints</span></h3>
            
            <div className="space-y-4">
               {activePlans.map((plan) => (
                  <GlassCard key={plan.id} className="group !p-0 border-slate-100 overflow-hidden hover:border-indigo-200 transition-all shadow-sm hover:shadow-sm">
                     <div className="flex items-stretch">
                        <div className={`w-2 ${plan.priority === 'Urgent' ? "bg-rose-500" : plan.priority === 'High' ? "bg-amber-500" : "bg-emerald-500"}`} />
                        <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                           <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Patient Identity</p>
                              <p className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{plan.patient}</p>
                              <p className="text-[10px] font-bold text-slate-500">{plan.id}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Active Protocol</p>
                              <p className="text-sm font-bold text-slate-800">{plan.protocol}</p>
                              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-1">Cycle {plan.cycle}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Clinical Status</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <div className={`w-2 h-2 rounded-full ${plan.priority === 'Urgent' ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
                                 <p className={`text-[11px] font-bold uppercase tracking-tighter ${plan.priority === 'Urgent' ? "text-rose-600" : "text-emerald-700"}`}>{plan.status}</p>
                              </div>
                           </div>
                           <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" className="w-10 h-10 !p-0 rounded-xl hover:bg-indigo-50 text-indigo-600 border border-slate-100">
                                 <FileText className="w-5 h-5" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-10 px-6 rounded-xl border border-indigo-100 text-indigo-600 font-bold text-[10px] uppercase tracking-wider hover:bg-slate-950 hover:text-white transition-all">
                                 Manage
                              </Button>
                           </div>
                        </div>
                     </div>
                  </GlassCard>
               ))}
            </div>
         </div>

         {/* Right Column: Templates & Supportive Blueprints */}
         <div className="space-y-10">
            <div className="space-y-6">
               <h3 className="text-2xl font-bold font-outfit text-slate-900">Care <span className="text-slate-400">Templates</span></h3>
               <div className="space-y-3">
                  {[
                     { title: "Toxicity Management G3+", color: "bg-rose-50 text-rose-600" },
                     { title: "Nutrition: High-Protein Diet", color: "bg-emerald-50 text-emerald-600" },
                     { title: "Palliative Symptom Vector", color: "bg-indigo-50 text-indigo-600" },
                     { title: "Day-Care Discharge Flow", color: "bg-slate-50 text-slate-600" }
                  ].map((temp, i) => (
                     <button key={i} className="w-full text-left p-5 bg-white border border-slate-100 rounded-[24px] hover:border-indigo-100 transition-all flex items-center justify-between group shadow-sm hover:shadow-md">
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${temp.color}`}>
                              <Clipboard className="w-5 h-5" />
                           </div>
                           <span className="text-xs font-bold uppercase tracking-wider text-slate-900">{temp.title}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-transform" />
                     </button>
                  ))}
               </div>
            </div>

            <GlassCard className="bg-indigo-600 text-white border-0 shadow-sm relative overflow-hidden p-8 group">
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <CheckCircle2 className="w-6 h-6" />
                     </div>
                     <h4 className="text-xl font-bold font-outfit italic leading-none">Compliance Audit</h4>
                  </div>
                  <p className="text-sm font-medium text-indigo-100 leading-relaxed">
                     All care plans must be re-verified by the institutional oncology board every 14 days to remain active in the clinical workflow.
                  </p>
                  <Button variant="ghost" className="w-full bg-white/10 hover:bg-white text-white hover:text-indigo-600 font-bold text-[10px] uppercase tracking-wider border-0 h-12 rounded-2xl">
                     View Audit Schedule
                  </Button>
               </div>
               <Activity className="absolute bottom-[-20px] right-[-20px] w-48 h-48 text-white/5  transition-transform duration-700" />
            </GlassCard>
         </div>

      </div>
    </div>
  );
}
