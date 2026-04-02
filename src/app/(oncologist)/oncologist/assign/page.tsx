import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { Inbox, Search, Filter, BookOpen, Send, Users, ChevronRight, Activity, Clock } from "lucide-react";
import { Role } from "@prisma/client";

export default async function AssignPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
         <div className="space-y-2">
            <h1 className="text-5xl font-bold font-outfit tracking-tight text-slate-950 italic leading-none">
              Assign <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Resource</span>
            </h1>
            <p className="text-slate-500 font-medium italic opacity-80 pt-2">Direct transmission of clinical education and toxicity protocols to stakeholders.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <GlassCard className="!p-10 border-white/50 bg-white/80 shadow-sm rounded-[48px] space-y-10 group hover:shadow-indigo-100/50 transition-all">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-[24px] bg-indigo-50 text-indigo-600 flex items-center justify-center border-4 border-white shadow-sm">
                  <Users className="w-8 h-8" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-2xl font-bold font-outfit text-slate-900">Target Recipients</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Select Patients or Caregivers</p>
               </div>
            </div>
            
            <div className="space-y-4">
               <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search by name or cohort..." className="w-full h-16 pl-14 pr-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none transition-all font-medium text-slate-900" />
               </div>
               <div className="flex flex-wrap gap-2 pt-2">
                  {['Arjun Sharma', 'Maya Patel (Caregiver)', 'Chemo Cohort 4'].map(tag => (
                     <div key={tag} className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider border border-indigo-100 flex items-center gap-2">
                        {tag} <span className="opacity-40 cursor-pointer hover:opacity-100 transition-opacity">×</span>
                     </div>
                  ))}
               </div>
            </div>
         </GlassCard>

         <GlassCard className="!p-10 border-white/50 bg-white/80 shadow-sm rounded-[48px] space-y-10 group hover:shadow-indigo-100/50 transition-all">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-[24px] bg-emerald-50 text-emerald-600 flex items-center justify-center border-4 border-white shadow-sm">
                  <BookOpen className="w-8 h-8" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-2xl font-bold font-outfit text-slate-900">Resource Asset</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Select from Clinical Library</p>
               </div>
            </div>
            
            <div className="space-y-4">
               <div className="h-16 px-6 rounded-2xl bg-slate-50 border-2 border-indigo-100 flex items-center justify-between text-slate-900 font-bold group-hover:bg-white transition-all cursor-pointer">
                  <span>Managing Chemotherapy Fatigue</span>
                  <div className="flex items-center gap-3">
                     <span className="text-[9px] font-bold uppercase text-indigo-400 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Video</span>
                     <ChevronRight className="w-4 h-4 text-indigo-400" />
                  </div>
               </div>
               <p className="text-[10px] text-slate-400 font-medium px-2 underline decoration-slate-100">Patients will receive a push notification and email link to this material.</p>
            </div>
         </GlassCard>
      </div>

      <div className="p-12 text-center bg-indigo-50/20 border-2 border-indigo-100/50 rounded-2xl space-y-8 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
         <div className="relative z-10">
            <h3 className="text-3xl font-bold font-outfit text-slate-900 italic tracking-tight">Finalize Tactical Deployment</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 mt-10">
               <div className="flex items-center gap-4">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">3 Recipients Active</p>
               </div>
               <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instant Transmission</p>
               </div>
            </div>
            <div className="pt-10">
               <Button className="h-20 px-16 bg-slate-950 text-white rounded-xl font-bold text-sm uppercase tracking-wider shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:scale-105 transition-all flex items-center gap-6 group">
                  <Send className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" /> Execute Assignment
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
