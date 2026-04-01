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
  PlusCircle
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Patient Learn Hub - Screen 4 (Section B5).
 * The primary education and health literacy center.
 * Features Assigned Learning Paths, Diagnosis Guides, and a full resource library.
 */
export default async function PatientLearnHub() {
  const session = await auth();
  if (!session || session.user.role !== Role.PATIENT) redirect("/login");

  const TabButton = ({ label, icon: Icon, active }: any) => (
    <button className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${active ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-100" : "text-slate-400 hover:text-slate-600"}`}>
       <Icon className="w-4 h-4" />
       {label}
    </button>
  );

  return (
    <div className="space-y-10 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      
      {/* Page Header (Section B5) */}
      <div className="space-y-2">
         <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900">My <span className="text-indigo-600">Learning</span></h1>
         <p className="text-slate-500 font-medium italic">Empowering you with information for every stage of your care.</p>
      </div>

      {/* Sub-Navigation Pill Tabs (Section B5) */}
      <div className="p-2 bg-slate-50 border border-slate-100 rounded-[32px] flex items-center justify-between gap-2 max-w-2xl mx-auto shadow-sm">
         <TabButton label="Learning Paths" icon={TrendingUp} active />
         <TabButton label="Diagnosis Guides" icon={PlusCircle} />
         <TabButton label="All Resources" icon={Search} />
      </div>

      <div className="space-y-12">
         
         {/* My Learning Paths (Section B5) */}
         <div className="space-y-6">
            <h3 className="text-xl font-bold font-outfit text-slate-900 flex items-center gap-3">
               <TrendingUp className="w-6 h-6 text-emerald-500" />
               Current Path
            </h3>
            
            <GlassCard className="!p-0 border-slate-100 shadow-2xl overflow-hidden relative group">
               <div className="p-10 space-y-8 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-50 pb-8">
                     <div className="space-y-3">
                        <h4 className="text-3xl font-bold font-outfit tracking-tight leading-none text-slate-900">Managing Side Effects</h4>
                        <p className="text-sm text-slate-500 font-medium italic">Week 1: Foundations of At-Home Care</p>
                     </div>
                     <div className="text-right">
                        <p className="text-3xl font-black font-outfit text-indigo-600 leading-none">40%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 px-2 py-0.5 bg-slate-50 rounded-full inline-block">Complete</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="space-y-3 p-4 rounded-3xl bg-slate-50 border border-slate-100/50">
                        <div className="flex items-center gap-2 text-emerald-600">
                           <CheckCircle2 className="w-4 h-4" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900">Completed</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-none">Understanding Fatigue</p>
                        <p className="text-xs text-slate-400 font-medium italic">5 minute video</p>
                     </div>
                     <div className="space-y-3 p-4 rounded-3xl bg-indigo-50 border border-indigo-100 relative group/next">
                        <div className="flex items-center gap-2 text-indigo-600">
                           <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900">Next Lesson</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-none">Nutrition During Chemotherapy</p>
                        <p className="text-xs text-slate-400 font-medium italic">8 minute reading</p>
                        <div className="absolute top-2 right-2 opacity-0 group-hover/next:opacity-100 transition-opacity translate-x-1 group-hover/next:translate-x-0">
                           <ChevronRight className="w-4 h-4 text-indigo-600" />
                        </div>
                     </div>
                     <div className="space-y-3 p-4 rounded-3xl bg-slate-50 border border-slate-100/50 opacity-40">
                        <div className="flex items-center gap-2 text-slate-400">
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Locked</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-none">Infection Risk Protocols</p>
                        <p className="text-xs text-slate-400 font-medium italic">8 minute reading</p>
                     </div>
                  </div>

                  <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 12 minutes left in this path</span>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <span>3 lessons remaining</span>
                     </div>
                     <Button variant="secondary" className="h-14 px-12 bg-indigo-600 hover:bg-slate-950 font-black uppercase text-xs tracking-widest gap-2 shadow-xl shadow-indigo-100 group transition-all">
                        Continue Learning
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
                     </Button>
                  </div>
               </div>
            </GlassCard>
         </div>

         {/* Diagnosis Guides (Section B5) */}
         <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-bold font-outfit text-slate-900 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-indigo-400" />
                  Your Diagnosis Guides
               </h3>
               <div className="flex items-center gap-3">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Simple Mode</p>
                  <div className="w-10 h-5 bg-indigo-600 rounded-full flex items-center justify-end p-0.5">
                     <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <GlassCard className="!p-8 group cursor-pointer hover:border-indigo-100 transition-all shadow-md">
                  <div className="flex flex-col h-full justify-between gap-8">
                     <div className="space-y-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 text-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                           <PlayCircle className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-bold font-outfit text-slate-900 leading-tight">Patient Video Guide:<br/>Understanding HER2+</h4>
                        <p className="text-sm text-slate-500 font-medium italic italic">A simplified walkthrough of your diagnosis and targeted treatment pathway.</p>
                     </div>
                     <div className="flex items-center justify-between pt-4 border-t border-slate-50 group-hover:border-indigo-100/50 transition-colors">
                        <span className="text-[10px] font-black uppercase text-slate-400">4 minute video</span>
                        <Button variant="ghost" className="h-9 px-4 text-[10px] font-black uppercase tracking-widest text-indigo-600 group-hover:bg-indigo-50 transition-colors">Watch Now</Button>
                     </div>
                  </div>
               </GlassCard>

               <GlassCard className="!p-8 group cursor-pointer hover:border-indigo-100 transition-all shadow-md">
                  <div className="flex flex-col h-full justify-between gap-8">
                     <div className="space-y-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 text-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                           <FileText className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-bold font-outfit text-slate-900 leading-tight">Handout: Managing<br/>Clinic Visit Anxiety</h4>
                        <p className="text-sm text-slate-500 font-medium italic italic">Practical tips and breathing exercises for your infusion clinic days.</p>
                     </div>
                     <div className="flex items-center justify-between pt-4 border-t border-slate-50 group-hover:border-indigo-100/50 transition-colors">
                        <span className="text-[10px] font-black uppercase text-slate-400">6 minute read</span>
                        <Button variant="ghost" className="h-9 px-4 text-[10px] font-black uppercase tracking-widest text-indigo-600 group-hover:bg-indigo-50 transition-colors">Read Now</Button>
                     </div>
                  </div>
               </GlassCard>
            </div>
         </div>

         {/* General Help CTA (Section B5) */}
         <GlassCard className="bg-slate-950 text-white border-0 shadow-2xl relative overflow-hidden group">
            <div className="absolute right-0 top-0 bottom-0 w-64 opacity-10 bg-gradient-to-l from-indigo-500 to-transparent flex items-center justify-center">
               <HelpCircle className="w-32 h-32 text-white scale-150 group-hover:rotate-12 transition-transform duration-700" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="space-y-3 text-center md:text-left">
                  <h3 className="text-2xl font-bold font-outfit tracking-tight leading-none italic italic">Questions about your education?</h3>
                  <p className="text-xs text-slate-400 font-medium italic max-w-lg">
                     Your Nurse Navigator can provide additional resources or explain any terminology in the guides.
                  </p>
               </div>
               <Button variant="ghost" className="h-12 px-8 rounded-full border border-white/20 text-white hover:bg-white hover:text-black font-bold text-xs gap-2 group/msg transition-all">
                  Message my Nurse <ChevronRight className="w-4 h-4 group-hover/msg:translate-x-1" />
               </Button>
            </div>
         </GlassCard>
      </div>
    </div>
  );
}
