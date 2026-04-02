"use client";

import { useState } from "react";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  ChevronRight, 
  ChevronLeft,
  Stethoscope, 
  Heart, 
  CheckCircle2, 
  Activity,
  ClipboardList,
  Fingerprint
} from "lucide-react";

import { registerNewPatient } from "@/lib/actions/clinical.actions";
import { useRouter } from "next/navigation";

/**
 * Nurse/Oncologist Patient Registration - Screen 7.
 * Hardened 3-step clinical onboarding workflow.
 */
export default function NursePatientRegistration() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mrn: "",
    dateOfBirth: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    setIsSubmitting(true);
    const result = await registerNewPatient({
      ...formData,
      institutionId: "default",
    });

    if (result.success) {
      setStep(3);
    } else {
      alert(result.error);
    }
    setIsSubmitting(false);
  };

  const FormStepIndicator = ({ num, label, active, completed }: any) => (
    <div className={`flex flex-col items-center gap-3 group transition-all ${active ? "scale-110" : ""}`}>
       <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center font-black text-lg tracking-tighter transition-all duration-500 ${active ? "bg-slate-950 text-white shadow-2xl shadow-indigo-200 rotate-3" : completed ? "bg-emerald-500 text-white shadow-lg" : "bg-white border-2 border-slate-100 text-slate-300"}`}>
          {completed ? <CheckCircle2 className="w-7 h-7" /> : num}
       </div>
       <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${active ? "text-slate-900" : "text-slate-400"}`}>{label}</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 pt-8">
      {/* Clinical Header ... */}
      <div className="text-center space-y-4">
         <div className="flex items-center justify-center gap-3 mb-2 px-6 py-2 bg-slate-50 border border-slate-100 rounded-full w-fit mx-auto shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic font-serif">Registry Enrollment Protocol</span>
         </div>
         <h1 className="text-5xl font-black font-outfit tracking-tighter text-slate-950 italic">Clinical <span className="text-indigo-600">Onboarding</span></h1>
         <p className="text-slate-500 font-bold italic italic opacity-70 max-w-xl mx-auto">Initiate high-fidelity case management and ICD-O-3 registry enrollment.</p>
      </div>

      <div className="flex items-center justify-center gap-16 md:gap-24 relative max-w-2xl mx-auto">
         <div className="absolute top-7 left-0 right-0 h-1 bg-slate-100 -z-10 rounded-full overflow-hidden">
            <div className={`h-full bg-indigo-600 transition-all duration-1000 ease-out`} style={{ width: `${((step - 1) / 2) * 100}%` }} />
         </div>
         <FormStepIndicator num="1" label="Identity" active={step === 1} completed={step > 1} />
         <FormStepIndicator num="2" label="Clinical Team" active={step === 2} completed={step > 2} />
         <FormStepIndicator num="3" label="Access Hub" active={step === 3} completed={step > 3} />
      </div>

      <div className={`transition-all duration-500`}>
         {step === 1 && (
            <GlassCard className="!p-16 border-2 border-slate-50 shadow-[0_50px_100px_rgba(0,0,0,0.04)] rounded-[56px] bg-white relative overflow-hidden group">
               <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-indigo-50/50 rounded-full blur-[100px] pointer-events-none" />
               <div className="space-y-12 relative z-10">
                  <div className="flex items-center justify-between border-b-2 border-slate-50 pb-8">
                     <h3 className="text-2xl font-black font-outfit flex items-center gap-4 italic italic">
                        <Fingerprint className="w-8 h-8 text-indigo-600" />
                        Patient Identity Matrix
                     </h3>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">Step 01 / 03</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 italic">Legal First Name</label>
                        <input type="text" value={formData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} placeholder="John" className="w-full h-16 px-8 bg-slate-50/50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[24px] text-base font-black italic tracking-tight transition-all placeholder:text-slate-300 outline-none shadow-inner" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 italic">Legal Last Name</label>
                        <input type="text" value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} placeholder="Doe" className="w-full h-16 px-8 bg-slate-50/50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[24px] text-base font-black italic tracking-tight transition-all placeholder:text-slate-300 outline-none shadow-inner" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 italic">Institutional MRN</label>
                        <input type="text" value={formData.mrn} onChange={e => handleInputChange('mrn', e.target.value)} placeholder="MRN-882910" className="w-full h-16 px-8 bg-slate-50/50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[24px] text-base font-black tracking-widest text-indigo-600 transition-all outline-none shadow-inner" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 italic">Biological DOB</label>
                        <input type="date" value={formData.dateOfBirth} onChange={e => handleInputChange('dateOfBirth', e.target.value)} className="w-full h-16 px-8 bg-slate-50/50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[24px] text-base font-black transition-all outline-none shadow-inner" />
                     </div>
                     <div className="space-y-3 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 italic">Principal Patient Email</label>
                        <input type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="john.doe@oncology.cloud" className="w-full h-16 px-8 bg-slate-50/50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[24px] text-base font-black italic tracking-tight transition-all outline-none shadow-inner" />
                     </div>
                  </div>

                  <div className="flex items-center justify-end pt-10 border-t-2 border-slate-50">
                     <Button onClick={() => setStep(2)} className="h-16 px-12 gap-4 bg-slate-950 text-white rounded-[28px] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95 group">
                        Proceed to Clinical Team
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                     </Button>
                  </div>
               </div>
            </GlassCard>
         )}

         {step === 2 && (
            <GlassCard className="!p-16 border-2 border-slate-50 shadow-[0_50px_100px_rgba(0,0,0,0.04)] rounded-[56px] bg-white relative overflow-hidden group">
               <div className="space-y-12 relative z-10">
                  <div className="flex items-center justify-between border-b-2 border-slate-50 pb-8">
                     <h3 className="text-2xl font-black font-outfit flex items-center gap-4 italic italic">
                        <Stethoscope className="w-8 h-8 text-indigo-600" />
                        Clinical Cluster Assignment
                     </h3>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">Step 02 / 03</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-8">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 italic">Primary Medical Oncologist</label>
                           <div className="p-6 rounded-[32px] border-2 border-indigo-100 bg-indigo-50/30 flex items-center gap-5 shadow-inner">
                              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black">AR</div>
                              <div className="flex-1">
                                 <p className="text-base font-black text-slate-900 italic">Dr. Anvesh Rathore</p>
                                 <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">Selected Lead</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8 bg-slate-50/50 p-10 rounded-[40px] border-2 border-slate-100 shadow-inner">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic mb-6">Initial Clinical Pulse</h4>
                        <div className="space-y-6 text-center">
                           <p className="text-sm font-bold text-slate-600 italic">Data will be broadcast to clinical terminals in real-time.</p>
                           <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                              <Activity className="w-10 h-10" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-10 border-t-2 border-slate-50">
                     <Button onClick={() => setStep(1)} variant="ghost" className="h-16 px-10 gap-3 text-slate-400 font-black uppercase text-xs tracking-widest">
                        <ChevronLeft className="w-6 h-6" /> Back
                     </Button>
                     <Button onClick={handleRegister} disabled={isSubmitting} className="h-16 px-12 gap-4 bg-slate-950 text-white rounded-[28px] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:bg-emerald-600 transition-all active:scale-95 group">
                        {isSubmitting ? "Enrolling Case..." : "Finalize Release"}
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                     </Button>
                  </div>
               </div>
            </GlassCard>
         )}

         {step === 3 && (
            <GlassCard className="!p-16 border-2 border-emerald-100 shadow-[0_50px_100px_rgba(16,185,129,0.06)] rounded-[56px] bg-white relative overflow-hidden group">
               <div className="space-y-12 relative z-10 text-center">
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-100/50 rotate-[-4deg] animate-bounce">
                     <CheckCircle2 className="w-12 h-12" />
                  </div>
                  
                  <div className="space-y-4">
                     <h3 className="text-4xl font-black font-outfit italic italic tracking-tight text-slate-950 uppercase">Case Released.</h3>
                     <p className="text-base text-slate-500 font-bold italic italic max-w-md mx-auto">
                        Identity established. {formData.firstName} has been successfully added to the clinical registry. Live sync is active across all institution terminals.
                     </p>
                  </div>

                  <div className="flex flex-col items-center gap-8 pt-12 border-t-2 border-slate-50">
                     <Button onClick={() => router.push('/nurse/patients')} className="h-20 px-24 bg-indigo-600 text-white rounded-[32px] font-black uppercase text-sm tracking-[0.4em] shadow-2xl shadow-indigo-100 hover:bg-slate-950 transition-all hover:scale-105 active:scale-95 group">
                        Go to Patient Panel
                        <Activity className="w-6 h-6 ml-4" />
                     </Button>
                  </div>
               </div>
            </GlassCard>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
         {[
            { icon: ClipboardList, label: "Registry Sync", color: "indigo", text: "Enabling registry on creation auto-assigns molecular markers." },
            { icon: Activity, label: "High Precision", color: "emerald", text: "Atomic transactions ensure registry integrity." },
            { icon: Heart, label: "Live Broadcast", color: "rose", text: "Oncology terminals update as soon as the case is released." }
         ].map((block, i) => (
            <GlassCard key={i} className="!p-10 border-slate-50 bg-white/50 space-y-6">
               <div className={`w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center`}>
                  <block.icon className="w-6 h-6" />
               </div>
               <div className="space-y-2">
                  <h4 className="text-base font-black text-slate-900 italic italic uppercase">{block.label}</h4>
                  <p className="text-xs text-slate-500 font-bold italic italic leading-relaxed opacity-70">{block.text}</p>
               </div>
            </GlassCard>
         ))}
      </div>
    </div>
  );
}
