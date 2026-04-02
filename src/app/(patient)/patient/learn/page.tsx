import { auth } from "@/lib/auth";
import { 
  BookOpen, 
  PlayCircle, 
  FileText, 
  TrendingUp, 
  HelpCircle, 
  Search, 
  ChevronRight, 
  Clock, 
  CheckCircle2,
  PlusCircle,
  Play
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";

/**
 * Patient Learn Hub - Screen 4 (Section B5).
 * The primary education and health literacy center.
 * Features high-contrast typography (slate-900) and large touch targets.
 */
export default async function PatientLearnHub() {
  const session = await auth();
  if (!session || session.user.role !== Role.PATIENT) redirect("/login");

  const TabButton = ({ label, icon: Icon, active }: any) => (
    <button className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-[28px] text-[11px] font-black uppercase tracking-widest transition-all ${active ? "bg-white text-indigo-600 shadow-xl shadow-indigo-100 ring-2 ring-indigo-50" : "text-slate-500 hover:text-slate-900"}`}>
       <Icon className="w-4 h-4 shadow-sm" />
       {label}
    </button>
  );

  return (
    <div className="space-y-12 selection:bg-indigo-100 selection:text-indigo-900 pb-24 animate-in fade-in duration-700">
      
      {/* Page Header (Section B5) */}
      <div className="space-y-3">
         <h1 className="text-4xl md:text-5xl font-black font-outfit tracking-tighter text-slate-950 italic">Patient <span className="text-indigo-600">Resource Lab</span></h1>
         <p className="text-slate-700 font-bold italic italic leading-relaxed max-w-2xl">Validated clinical information to empower your decisions throughout the treatment journey.</p>
      </div>

      {/* Sub-Navigation Pill Tabs (Section B5) */}
      <div className="p-2.5 bg-slate-100 border-2 border-slate-50 rounded-[40px] flex items-center justify-between gap-2 max-w-2xl mx-auto shadow-inner">
         <TabButton label="Pathways" icon={TrendingUp} active />
         <TabButton label="Guides" icon={PlusCircle} />
         <TabButton label="Resource Library" icon={Search} />
      </div>

      <div className="space-y-16">
         
         {/* My Learning Paths - High Fidelity (Section B5) */}
         <div className="space-y-8">
            <h3 className="text-2xl font-black font-outfit text-slate-950 flex items-center gap-4 italic px-2">
               <TrendingUp className="w-7 h-7 text-emerald-500" />
               Current Pathway Progress
            </h3>
            
            <GlassCard className="!p-0 border-indigo-100 shadow-2xl overflow-hidden relative group bg-white shadow-indigo-100/20">
               <div className="p-10 md:p-12 space-y-10 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b-2 border-slate-50 pb-10">
                     <div className="space-y-4">
                        <h4 className="text-4xl font-black font-outfit tracking-tight leading-none text-slate-950 italic">Managing Toxicity</h4>
                        <p className="text-base text-slate-600 font-bold italic italic">Week 1: Fundamentals of Home Care</p>
                     </div>
                     <div className="text-right">
                        <p className="text-5xl font-black font-outfit text-indigo-600 leading-none italic italic">40%</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-3 px-4 py-1 bg-slate-50 border border-slate-100 rounded-full inline-block shadow-sm">Completed Pathway</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="space-y-4 p-6 rounded-[32px] bg-emerald-50 border-2 border-emerald-100 shadow-sm transition-transform hover:scale-[1.02]">
                        <div className="flex items-center gap-3 text-emerald-700">
                           <CheckCircle2 className="w-5 h-5 fill-emerald-500/10" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Validated</span>
                        </div>
                        <p className="text-base font-black text-slate-900 leading-tight italic line-clamp-1">Understanding Fatigue</p>
                        <p className="text-xs text-emerald-600/70 font-black uppercase tracking-widest italic">5 Minute Audio</p>
                     </div>
                     <div className="space-y-4 p-6 rounded-[32px] bg-indigo-50 border-2 border-indigo-100 shadow-xl shadow-indigo-50 relative group/next transition-transform hover:scale-[1.02]">
                        <div className="flex items-center gap-3 text-indigo-600">
                           <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Active Objective</span>
                        </div>
                        <p className="text-base font-black text-slate-900 leading-tight italic line-clamp-1">Chemotherapy Nutrition</p>
                        <p className="text-xs text-indigo-600 font-black uppercase tracking-widest italic">8 Minute Module</p>
                        <div className="absolute top-4 right-4 opacity-0 group-hover/next:opacity-100 transition-opacity translate-x-2 group-hover/next:translate-x-0">
                           <ChevronRight className="w-5 h-5 text-indigo-600" />
                        </div>
                     </div>
                     <div className="space-y-4 p-6 rounded-[32px] bg-slate-50 border-2 border-slate-100 opacity-40 grayscale">
                        <div className="flex items-center gap-3 text-slate-400">
                           <div className="w-2 h-2 rounded-full bg-slate-400" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Locked Target</span>
                        </div>
                        <p className="text-base font-black text-slate-900 leading-tight italic line-clamp-1">Infection Protocols</p>
                        <p className="text-xs text-slate-400 font-black uppercase tracking-widest italic">8 Minute Module</p>
                     </div>
                  </div>

                  <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
                     <div className="flex items-center gap-6 text-xs font-black text-slate-600 uppercase tracking-widest">
                        <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100"><Clock className="w-4 h-4 text-indigo-600" /> 12 Minutes Left</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <span>3 Modules Remaining</span>
                     </div>
                     <Button variant="secondary" className="h-16 px-16 bg-indigo-600 hover:bg-slate-950 text-white font-black uppercase text-xs tracking-[0.3em] gap-3 shadow-2xl shadow-indigo-100 group transition-all rounded-[28px]">
                        Resume Pathway Activity
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                     </Button>
                  </div>
               </div>
            </GlassCard>
         </div>

         {/* Diagnosis Guides - High Contrast (Section B5) */}
         <div className="space-y-8 pt-8">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-2xl font-black font-outfit text-slate-950 flex items-center gap-4 italic">
                  <BookOpen className="w-7 h-7 text-indigo-600" />
                  Your Diagnosis Manuals
               </h3>
               <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-full border-2 border-white shadow-inner">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Aura Mode</p>
                  <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center justify-end p-0.5 shadow-sm">
                     <div className="w-5 h-5 bg-white rounded-full shadow-xl" />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <GlassCard className="!p-10 group cursor-pointer border-2 border-slate-50 hover:border-indigo-100 transition-all shadow-xl bg-white relative overflow-hidden">
                  <div className="flex flex-col h-full justify-between gap-10 relative z-10">
                     <div className="space-y-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner border border-slate-100">
                           <PlayCircle className="w-8 h-8" />
                        </div>
                        <h4 className="text-2xl font-black font-outfit text-slate-950 leading-tight italic italic">Understanding HER2+: A Video Guide</h4>
                        <p className="text-base text-slate-700 font-bold italic italic leading-relaxed">A simplified, clinically-validated walkthrough of your specific diagnosis and targeted Treatment cycle.</p>
                     </div>
                     <div className="flex items-center justify-between pt-8 border-t border-slate-50 group-hover:border-indigo-50 transition-all">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full">4 Minute Triage Video</span>
                        <Button variant="ghost" className="h-12 px-8 text-[11px] font-black uppercase tracking-widest text-indigo-600 group-hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 rounded-2xl">Broadcast Now</Button>
                     </div>
                  </div>
               </GlassCard>

               <GlassCard className="!p-10 group cursor-pointer border-2 border-slate-50 hover:border-indigo-100 transition-all shadow-xl bg-white relative overflow-hidden">
                  <div className="flex flex-col h-full justify-between gap-10 relative z-10">
                     <div className="space-y-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner border border-slate-100">
                           <FileText className="w-8 h-8" />
                        </div>
                        <h4 className="text-2xl font-black font-outfit text-slate-950 leading-tight italic italic">Manual: Managing Clinical Anxiety</h4>
                        <p className="text-base text-slate-700 font-bold italic italic leading-relaxed">Practical breathwork and cognitive strategies for your infusion clinic sessions.</p>
                     </div>
                     <div className="flex items-center justify-between pt-8 border-t border-slate-50 group-hover:border-indigo-50 transition-all">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full">6 Minute Resource</span>
                        <Button variant="ghost" className="h-12 px-8 text-[11px] font-black uppercase tracking-widest text-indigo-600 group-hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 rounded-2xl">Open Resource</Button>
                     </div>
                  </div>
               </GlassCard>
            </div>
         </div>

         {/* General Help CTA - High Visibility (Section B5) */}
         <GlassCard className="bg-slate-950 text-white border-0 shadow-2xl relative overflow-hidden group !p-12">
            <div className="absolute right-0 top-0 bottom-0 w-80 opacity-[0.05] bg-gradient-to-l from-indigo-500 to-transparent flex items-center justify-center pointer-events-none">
               <HelpCircle className="w-48 h-48 text-white scale-150 group-hover:rotate-12 transition-transform duration-1000" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="space-y-4 text-center md:text-left max-w-xl">
                  <h3 className="text-3xl font-black font-outfit tracking-tighter leading-none italic italic">Education Discrepancies?</h3>
                  <p className="text-base text-slate-400 font-bold italic italic leading-relaxed">
                     Your Nurse Navigator can explain any clinical terminology or provision additional targeted manuals for your care track.
                  </p>
               </div>
               <Link href="/patient/messages" className="h-16 px-12 bg-white text-slate-950 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 hover:text-white group/msg transition-all flex items-center justify-center gap-3">
                  Consult Navigator 
                  <ChevronRight className="w-5 h-5 group-hover/msg:translate-x-2 transition-transform" />
               </Link>
            </div>
         </GlassCard>
      </div>
    </div>
  );
}
