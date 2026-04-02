import { auth } from "@/lib/auth";
import { 
  BookOpen, 
  PlayCircle, 
  FileText, 
  TrendingUp, 
  ExternalLink, 
  ChevronRight, 
  Clock, 
  Heart,
  Download,
  Info
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Caregiver Resource Hub - Screen 5 (Section C7).
 * Supportive education center for both patient coordination and caregiver wellbeing.
 * Features Assigned Patient Guides and Caregiver-specific health literacy.
 */
export default async function CaregiverResourcesPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.CAREGIVER) redirect("/login");

  // Mock patient context for Jane Doe
  const patientName = "Jane Doe";

  const selfCareQuotes = [
    "Remember, you cannot pour from an empty cup. Looking after yourself helps you look after Jane.",
    "Small moments of rest are not a luxury—they are a clinical necessity for caregivers.",
    "You are doing an incredible job. Be as kind to yourself as you are to Jane.",
  ];
  const randomQuote = selfCareQuotes[Math.floor(Math.random() * selfCareQuotes.length)];

  const TabButton = ({ label, icon: Icon, active }: any) => (
    <button className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all ${active ? "bg-white text-teal-600 shadow-md ring-1 ring-slate-100" : "text-slate-400 hover:text-slate-600"}`}>
       <Icon className="w-4 h-4" />
       {label}
    </button>
  );

  return (
    <div className="space-y-12 selection:bg-teal-100 selection:text-teal-900 pb-20">
      
      {/* Page Header (Section C7) */}
      <div className="space-y-2">
         <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900">Guides & <span className="text-teal-600">Support</span></h1>
         <p className="text-sm text-slate-500 font-medium">Educational materials for both clinical coordination and your own wellbeing.</p>
      </div>

      {/* Sub-Navigation Pill Tabs (Section C7) */}
      <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-2 max-w-2xl mx-auto shadow-sm">
         <TabButton label="Patient's Guides" icon={BookOpen} active />
         <TabButton label="Caregiver Support" icon={Heart} />
      </div>

      <div className="space-y-16">
         
         {/* Patient's Guides Section (Section C7) */}
         <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-bold font-outfit text-slate-900 flex items-center gap-3 italic border-b border-teal-50 pb-2">
                  <BookOpen className="w-6 h-6 text-teal-400" />
                  Assigned for {patientName.split(' ')[0]}
               </h3>
               <div className="flex items-center gap-3 bg-teal-50 px-4 py-2 rounded-2xl border border-teal-100/50">
                  <Info className="w-4 h-4 text-teal-600" />
                  <p className="text-[10px] font-bold text-teal-800 uppercase tracking-wider leading-none">Shared with you by the care team</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                  { title: "Understanding HER2+ Treatment", type: "Video Guide", time: "4 min", color: "teal" },
                  { title: "Managing Side Effects at Home", type: "Handout", time: "8 min", color: "teal" }
               ].map(guide => (
                  <GlassCard key={guide.title} className="!p-8 group cursor-pointer hover:border-teal-100 transition-all shadow-md bg-white">
                     <div className="flex flex-col h-full justify-between gap-8">
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-slate-400 text-lg group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors shadow-sm">
                                 {guide.type.includes("Video") ? <PlayCircle className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                              </div>
                              <button className="p-2 text-slate-200 hover:text-teal-600 transition-colors"><Download className="w-4 h-4" /></button>
                           </div>
                           <h4 className="text-xl font-bold font-outfit text-slate-900 leading-tight italic underline decoration-slate-100 group-hover:decoration-teal-200 transition-all underline-offset-4">{guide.title}</h4>
                           <p className="text-xs text-slate-500 font-medium italic leading-relaxed">Read the same materials {patientName.split(' ')[0]} reads to stay informed during clinical visits.</p>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50 group-hover:border-teal-100/50 transition-colors">
                           <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{guide.time} • {guide.type}</span>
                           <Button variant="ghost" className="h-9 px-6 text-[10px] font-bold uppercase tracking-wider text-teal-600 hover:bg-teal-50 border border-teal-50 transition-all">Read Now</Button>
                        </div>
                     </div>
                  </GlassCard>
               ))}
            </div>
         </div>

         {/* Caregiver Specific Support Section (Section C7) */}
         <div className="space-y-8 pt-8">
            <h3 className="text-2xl font-bold font-outfit text-slate-900 flex items-center gap-3 border-b border-rose-50 pb-2">
               <Heart className="w-6 h-6 text-rose-400" />
               Your Own Wellbeing
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="md:col-span-2 space-y-6">
                  {[
                     { title: "The Caregiver's Fatigue Guide", desc: "How to identify and manage the unique exhaustion of clinical support." },
                     { title: "Mental Health Support Channels", desc: "Immediate resources and helplines for caregivers and family members." }
                  ].map(cguide => (
                     <GlassCard key={cguide.title} className="!p-6 flex items-center justify-between group hover:border-teal-100 transition-all bg-white shadow-sm">
                         <div className="space-y-2">
                            <h4 className="text-base font-bold text-slate-900">{cguide.title}</h4>
                            <p className="text-xs text-slate-500 font-medium italic max-w-md">{cguide.desc}</p>
                         </div>
                         <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-teal-600 transition-transform group-hover:translate-x-1" />
                     </GlassCard>
                  ))}
               </div>
               
               <div className="p-8 bg-slate-50 rounded-xl border border-slate-100 space-y-8">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-[0.2em]">External Support</h4>
                  <div className="space-y-6">
                     {['Cancer Council Care', 'Caregiver Action Network', 'Mental Health Support'].map(org => (
                        <a key={org} href="#" className="flex items-center justify-between text-xs font-bold text-slate-600 hover:text-teal-600 transition-colors p-2 -m-2 rounded-xl hover:bg-white group/org">
                           {org} <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover/org:text-teal-400" />
                        </a>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Self-Care Rotating Message Widget (Section C7) */}
         <GlassCard className="bg-slate-950 text-white border-0 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 bottom-0 w-64 opacity-10 bg-gradient-to-l from-teal-500 to-transparent flex items-center justify-center">
               <Heart className="w-32 h-32 text-white scale-150 group-hover:scale-[1.8] group-hover:rotate-6 transition-transform duration-1000" />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-500 mb-6 font-serif">Self-care reminder</p>
               <h3 className="text-3xl font-bold font-outfit tracking-tight leading-snug italic max-w-2xl px-4 text-teal-50 ring-1 ring-white/5 py-4 rounded-xl">
                  "{randomQuote}"
               </h3>
               <div className="mt-8 flex items-center gap-4 text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Rotating Support Engine v2.4</p>
               </div>
            </div>
         </GlassCard>
      </div>
    </div>
  );
}
