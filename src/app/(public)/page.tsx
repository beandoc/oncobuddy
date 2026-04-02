import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button, GlassCard } from "@/components/ui/core";
import { 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Search, 
  Users, 
  ChevronRight,
  Heart,
  Stethoscope,
  UserCheck
} from "lucide-react";
import { Role } from "@prisma/client";

/**
 * Oncobuddy Public Landing - Role Entry Hub.
 * Premium, high-fidelity entry point for the multi-stakeholder clinical ecosystem.
 * Features institutional branding, role-based redirection, and clinical trust markers.
 */
export default async function LandingPage() {
  const session = await auth();

  // 🔄 Automatic Redirect if already logged in (Role-based)
  if (session?.user) {
    const role = session.user.role;
    if (role === Role.ONCOLOGIST) redirect("/oncologist/dashboard");
    if (role === Role.NURSE) redirect("/nurse/dashboard");
    if (role === Role.PATIENT) redirect("/patient/dashboard");
    if (role === Role.CAREGIVER) redirect("/caregiver/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-24 bg-white/70 backdrop-blur-3xl border-b border-indigo-50/50 z-50 px-10 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
               <Activity className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black font-outfit tracking-tight italic">Onco<span className="text-indigo-600">buddy</span></span>
         </div>
         <div className="hidden md:flex items-center gap-10">
            {['Platforms', 'Clinical Review', 'Patient Access', 'Registry'].map(item => (
               <Link key={item} href="#" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">{item}</Link>
            ))}
         </div>
         <Link href="/login">
            <Button className="h-12 px-8 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Sign In Session</Button>
         </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-10 max-w-[1400px] mx-auto overflow-visible">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12 animate-in fade-in slide-in-from-left duration-1000">
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] animate-fade-in">
                     <ShieldCheck className="w-3.5 h-3.5" /> MD-Oversight Certified
                  </div>
                  <h1 className="text-8xl font-black font-outfit text-slate-900 leading-[0.9] tracking-tight">
                     Coordinating <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 italic underline decoration-indigo-200/50 decoration-4 underline-offset-[16px]">Clinical Excellence</span>
                  </h1>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl italic italic opacity-90">
                     A unified oncology ecosystem bridging Clinicians, Patients, and Caregivers through high-fidelity data intelligence and proactive toxicity management.
                  </p>
               </div>

               <div className="flex flex-wrap items-center gap-6">
                  <Link href="/login">
                     <Button className="h-20 px-12 bg-indigo-600 text-white rounded-[28px] font-black text-sm uppercase tracking-widest shadow-[0_30px_60px_rgba(79,70,229,0.3)] hover:bg-slate-950 transition-all flex items-center gap-4 group hover:-translate-y-1 overflow-hidden">
                        Enter Clinical Portal <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </Button>
                  </Link>
                  <Button variant="ghost" className="h-20 px-10 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-indigo-50 rounded-[28px] border-2 border-transparent hover:border-indigo-100 transition-all">View Research Atlas</Button>
               </div>

               <div className="flex items-center gap-8 pt-8">
                  <div className="flex -space-x-4">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 shadow-sm" />
                     ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic font-serif opacity-70">Trusted by 14+ Institutions & Clinical Panels</p>
               </div>
            </div>

            {/* Visual Column - Section 20 */}
            <div className="relative group animate-in zoom-in fade-in duration-1000 delay-300">
               <div className="absolute inset-x-0 -top-20 -bottom-20 bg-indigo-600/5 blur-[140px] rounded-full scale-110 z-0" />
               <div className="relative z-10 p-4 rounded-[56px] border-2 border-white bg-white/30 backdrop-blur-3xl shadow-[0_60px_120px_rgba(0,0,0,0.1)] transition-transform duration-700 hover:rotate-[-1deg]">
                  <div className="relative rounded-[48px] overflow-hidden border-[12px] border-white shadow-2xl bg-white aspect-[4/5] md:aspect-[3/4]">
                     <img src="/artifacts/clinical_hero_graphic_1775057815758.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s] ease-out" alt="Clinical Dashboards" />
                     
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />

                     {/* Floating Micro-Cards */}
                     <div className="absolute top-12 -right-6 bg-white/95 backdrop-blur-xl p-6 rounded-[28px] shadow-2xl border border-indigo-50/50 group-hover:-translate-y-2 transition-transform duration-500">
                        <div className="flex items-center gap-4">
                           <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner"><Users className="w-5 h-5" /></div>
                           <div>
                              <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Panel Active</p>
                              <p className="text-xl font-bold text-slate-900 leading-none italic italic">482 Patients</p>
                           </div>
                        </div>
                     </div>
                     <div className="absolute bottom-12 -left-6 bg-white/95 backdrop-blur-xl p-6 rounded-[28px] shadow-2xl border border-indigo-50/50 group-hover:translate-y-2 transition-transform duration-500">
                        <div className="flex items-center gap-4">
                           <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner"><Search className="w-5 h-5" /></div>
                           <div>
                              <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Diagnosis Sync</p>
                              <p className="text-xl font-bold text-indigo-900 leading-none italic italic">HER2+ Registry</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Role Ecosystem Section (Request 7) */}
      <section className="bg-slate-50/50 py-32 px-10 border-t border-indigo-50">
         <div className="max-w-[1400px] mx-auto space-y-20">
            <div className="text-center space-y-4">
               <h2 className="text-4xl font-bold font-outfit text-slate-900 italic italic">The <span className="text-indigo-600 underline decoration-indigo-100 underline-offset-8">Coordination Engine</span></h2>
               <p className="text-slate-500 font-medium italic italic underline decoration-indigo-200">Four specialized interfaces, one high-fidelity clinical mission.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                  { icon: Stethoscope, role: 'Oncologist', color: 'indigo', desc: 'Panel situational awareness, emergency triage, and toxicity signature sign-offs.' },
                  { icon: UserCheck, role: 'Onco Nurse', color: 'emerald', desc: 'Patient onboarding, alert acknowledgment, and medication adherence oversight.' },
                  { icon: Heart, role: 'Patient', color: 'rose', desc: 'Low-cognitive load symptom logging, learning paths, and personalized rehab.' },
                  { icon: Users, role: 'Caregiver', color: 'amber', desc: 'Supportive health tracking, proxy logging, and resource coordination.' }
               ].map((card, i) => (
                  <Link key={i} href="/login" className="block focus:ring-4 focus:ring-indigo-100 rounded-[32px] transition-all">
                    <GlassCard className="group h-full hover:bg-white border-transparent hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all cursor-pointer !p-10">
                       <div className={`w-14 h-14 rounded-2xl bg-${card.color}-50 text-${card.color}-600 flex items-center justify-center mb-8 border border-${card.color}-100 group-hover:scale-110 transition-transform shadow-sm`}>
                          <card.icon className="w-7 h-7" />
                       </div>
                       <h3 className="text-2xl font-black font-outfit text-slate-900 mb-4">{card.role}</h3>
                       <p className="text-[13px] text-slate-500 font-medium leading-relaxed italic italic mb-8">{card.desc}</p>
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Enter Portal <ChevronRight className="w-4 h-4" /></div>
                    </GlassCard>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* Compliance / Footer - Section 20 */}
      <footer className="py-20 px-10 border-t border-indigo-50 text-center space-y-6">
         <div className="flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            <span className="text-xl font-black italic">PRO-CTCAE</span>
            <span className="text-xl font-black italic">CTCAE v5.0</span>
            <span className="text-xl font-black italic">ICD-O-3</span>
            <span className="text-xl font-black italic">DPDPA</span>
         </div>
         <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.5em] italic font-serif">Built for Clinical Decision Support • Institutional Use Only</p>
      </footer>
    </div>
  );
}
