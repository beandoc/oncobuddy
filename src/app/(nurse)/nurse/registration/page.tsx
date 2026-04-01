import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Calendar, 
  ClipboardList, 
  Stethoscope, 
  Heart, 
  CheckCircle2, 
  Eye, 
  ChevronRight,
  Info 
} from "lucide-react";
import { Role } from "@prisma/client";

/**
 * Nurse Patient Registration - Screen 7.
 * 3-step clinical onboarding workflow.
 * Identity, Clinical Assignment, and Patient Onboarding steps (Section A7).
 */
export default async function NursePatientRegistration() {
  const session = await auth();
  if (!session || session.user.role !== Role.NURSE) redirect("/login");

  const FormStep = ({ num, label, active, completed }: any) => (
    <div className="flex flex-col items-center gap-2 group cursor-pointer transition-all">
       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm tracking-tighter ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : completed ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"}`}>
          {completed ? <CheckCircle2 className="w-5 h-5" /> : num}
       </div>
       <p className={`text-[10px] font-black uppercase tracking-widest ${active ? "text-indigo-600" : "text-slate-400"}`}>{label}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Registration Header (Section A7) */}
      <div className="text-center space-y-3">
         <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <UserPlus className="w-8 h-8" />
         </div>
         <h1 className="text-4xl font-bold font-outfit tracking-tight">Onboard <span className="text-indigo-600">New Patient</span></h1>
         <p className="text-slate-500 font-medium">Initiate clinical team assignment and ICD-O-3 enrollment.</p>
      </div>

      {/* Step Tracker (Section A7) */}
      <div className="flex items-center justify-center gap-16 relative">
         <div className="absolute top-5 left-1/2 -translate-x-1/2 w-48 h-px bg-slate-100 -z-10" />
         <FormStep num="1" label="Identity" active />
         <FormStep num="2" label="Clinical Team" />
         <FormStep num="3" label="Access & Onboarding" />
      </div>

      {/* Identity Form - Step 1 (Section A7) */}
      <GlassCard className="!p-12 border-slate-100 shadow-xl overflow-hidden relative group">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><UserPlus className="w-48 h-48" /></div>
         
         <div className="space-y-12 relative z-10">
            <div className="flex items-center justify-between border-b border-slate-50 pb-6">
               <h3 className="text-xl font-bold font-outfit flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                  Primary Identity & Demographics
               </h3>
               <Button variant="ghost" size="sm" className="h-8 !px-3 font-bold text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100">Check for Duplicates</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">First Name (Legal)</label>
                  <input type="text" placeholder="John" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-1 focus:ring-indigo-100 transition-all font-medium" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name (Legal)</label>
                  <input type="text" placeholder="Doe" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-1 focus:ring-indigo-100 transition-all font-medium" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Medical Record Number (MRN)</label>
                  <div className="relative">
                     <input type="text" placeholder="MRN-000000" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-1 focus:ring-indigo-100 transition-all font-bold tracking-widest" />
                     <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-indigo-600 hover:scale-110 transition-transform">Auto-Generate</button>
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                  <div className="relative">
                     <input type="date" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-1 focus:ring-indigo-100 transition-all font-medium" />
                  </div>
               </div>
               <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Primary Clinical Contact (Email)</label>
                  <div className="relative group">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                     <input type="email" placeholder="john.doe@patient.care" className="w-full h-12 pl-12 pr-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-1 focus:ring-indigo-100 transition-all font-medium" />
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-between pt-12">
               <div className="flex items-center gap-3 text-slate-400">
                  <Info className="w-4 h-4" />
                  <p className="text-[10px] uppercase font-black">Verify all registry data before completing Step 2</p>
               </div>
               <div className="flex items-center gap-4">
                  <Button variant="ghost" className="h-12 px-8 font-bold text-slate-400">Save as Draft</Button>
                  <Button variant="secondary" className="h-12 px-10 gap-2 bg-slate-950 hover:bg-black font-black uppercase text-xs tracking-widest shadow-xl shadow-black/10">
                     Next Phase <ChevronRight className="w-4 h-4" />
                  </Button>
               </div>
            </div>
         </div>
      </GlassCard>

      {/* Protocol Reminders - Sticky Section (Section A7) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 flex flex-col gap-4">
            <ClipboardList className="w-6 h-6 text-indigo-600" />
            <h4 className="text-sm font-bold font-outfit uppercase tracking-tight">Clinical Registry Workflow</h4>
            <p className="text-xs text-indigo-900/60 leading-relaxed font-medium italic">Enabling registry on account creation auto-assigns relevant ICD-O-3 pathology markers.</p>
         </div>
         <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 flex flex-col gap-4">
            <Stethoscope className="w-6 h-6 text-emerald-600" />
            <h4 className="text-sm font-bold font-outfit uppercase tracking-tight">Oncologist Linkage</h4>
            <p className="text-xs text-emerald-900/60 leading-relaxed font-medium italic">Assign primary oncologist in Step 2 to enable real-time alert forwarding.</p>
         </div>
         <div className="p-6 bg-rose-50/50 rounded-3xl border border-rose-100/50 flex flex-col gap-4">
            <Heart className="w-6 h-6 text-rose-600" />
            <h4 className="text-sm font-bold font-outfit uppercase tracking-tight">Onboarding Invitation</h4>
            <p className="text-xs text-rose-900/60 leading-relaxed font-medium italic">Preview registration invitation before dispatch to ensure literacy level alignment.</p>
         </div>
      </div>
    </div>
  );
}
