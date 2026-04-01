import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Search, 
  ExternalLink, 
  BookOpen, 
  FileText, 
  Bookmark, 
  ChevronRight, 
  TrendingUp, 
  Layers, 
  Activity,
  Globe,
  Database,
  ShieldCheck,
  Plus
} from "lucide-react";
import { Role } from "@prisma/client";

/**
 * Oncologist Research & Guidelines - Screen 6.
 * Medical-grade knowledge hub for clinician-facing evidence.
 * Features institutional protocols, ESMO/NCCN deep-links, and ICD-O-3 logic stubs. (Section 4).
 */
export default async function OncologistResearch() {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Clinician Knowledge Header (Section 4) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
         <div className="space-y-2">
            <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900 italic italic">Medical <span className="text-indigo-600">Intelligence</span></h1>
            <p className="text-slate-500 font-medium italic italic underline decoration-indigo-200 decoration-2 underline-offset-4">Professional evidence-based repository (CMS-Integrated Section 4).</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
               <input type="text" placeholder="Protocol search (ICD-O-3)..." className="h-12 w-80 pl-12 pr-4 bg-white border border-slate-100 rounded-3xl text-xs font-black uppercase tracking-widest placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 shadow-sm transition-all" />
            </div>
            <Button variant="secondary" className="h-12 px-8 bg-indigo-600 hover:bg-slate-950 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all">Submit Protocol</Button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         
         {/* Main Research Feed (Section 4) */}
         <div className="lg:col-span-2 space-y-10">
            
            <div className="space-y-6">
               <h3 className="text-xl font-bold font-outfit text-slate-900 border-b border-indigo-100 pb-2 italic">Institutional Protocols</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                     { title: 'HER2+ Adj. Standard v4.1', type: 'Clinical Protocol', category: 'Breast Cancer', date: 'Oct 2025' },
                     { title: 'Nausea Grades 3-4 Mgmt.', type: 'Toxicity Logic', category: 'Supportive Care', date: 'Sep 2025' },
                     { title: 'Ovarian Cancer Registry v2', type: 'Data Collection', category: 'Research', date: 'Aug 2025' },
                     { title: 'Genetic Triage Flow 2026', type: 'Policy Document', category: 'Genetics', date: 'Draft' }
                  ].map((p, i) => (
                     <GlassCard key={i} className="group hover:bg-indigo-50/20 border-slate-50 hover:border-indigo-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all cursor-pointer">
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest border border-indigo-100 px-2 py-0.5 rounded-full">{p.category}</span>
                              <Bookmark className="w-3.5 h-3.5 text-slate-200 group-hover:text-indigo-400 transition-colors" />
                           </div>
                           <h4 className="text-lg font-bold font-outfit text-slate-800 italic group-hover:text-indigo-600 transition-colors">{p.title}</h4>
                           <div className="flex items-center justify-between pt-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.date}</p>
                              <div className="flex items-center gap-1 text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">View <ChevronRight className="w-3.5 h-3.5" /></div>
                           </div>
                        </div>
                     </GlassCard>
                  ))}
               </div>
            </div>

            <div className="space-y-6 pt-6">
               <h3 className="text-xl font-bold font-outfit text-slate-900 border-b border-indigo-100 pb-2 italic">Global External Standards</h3>
               <div className="space-y-4">
                  {[
                     { name: 'ESMO Clinical Guidelines', desc: 'Latest evidence-based recommendations for solid tumors 2025.', url: 'esmo.org' },
                     { name: 'NCCN Biomarker Database', desc: 'Genetic breach data matching across oncological pathways.', url: 'nccn.org' },
                     { name: 'PubMed Search API', desc: 'Live clinical result tracking for active patient panels.', url: 'nih.gov' }
                  ].map((ext, idx) => (
                     <div key={idx} className="flex items-center justify-between p-6 rounded-[32px] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-50 transition-all group cursor-pointer">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-all"><Globe className="w-6 h-6" /></div>
                           <div className="space-y-1">
                              <p className="text-sm font-bold text-slate-900 italic italic">{ext.name}</p>
                              <p className="text-xs text-slate-500 font-medium italic italic">{ext.desc}</p>
                           </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Sidebar: Utility & Stats (Section 4) */}
         <div className="space-y-10">
            {/* ICD-O-3 Fast Access - Section 4 */}
            <div className="space-y-6">
               <h3 className="text-xl font-bold font-outfit text-slate-900 italic italic">ICD-O-3 <span className="text-indigo-600">Quick-Ref</span></h3>
               <GlassCard className="!p-8 bg-slate-950 border-slate-900 shadow-2xl relative overflow-hidden group">
                  <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-indigo-500/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10 space-y-6">
                     <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] font-serif italic italic">Topography Code Lookup</p>
                     <div className="grid grid-cols-2 gap-3 pb-4">
                        {['C50.9', 'C18.9', 'C34.1', 'C61.9'].map(code => (
                           <div key={code} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-indigo-200 text-xs font-black tracking-widest text-center cursor-pointer hover:bg-indigo-600 hover:text-white transition-all shadow-xl">{code}</div>
                        ))}
                     </div>
                     <Button className="w-full h-12 bg-white text-slate-900 hover:bg-indigo-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest italic shadow-xl">Complete Atlas View</Button>
                  </div>
               </GlassCard>
            </div>

            <div className="space-y-6">
               <h3 className="text-xl font-bold font-outfit text-slate-900 italic italic">Research Progress</h3>
               <div className="space-y-4">
                  <GlassCard className="!p-6 bg-indigo-50/20 border-indigo-100 shadow-none">
                     <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none italic italic">Clinical Accuracy</p>
                        <span className="text-sm font-black text-indigo-600 font-outfit leading-none">98.2%</span>
                     </div>
                     <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 w-[98%]" />
                     </div>
                     <p className="text-[9px] text-slate-400 mt-4 leading-relaxed italic">Platform education guides reviewed for clinical validity across {session.user.name?.split(' ').pop()}'s panel.</p>
                  </GlassCard>
               </div>
            </div>

            {/* DPDPA/Regulatory Stub - Section 4 */}
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-[40px] shadow-inner text-center space-y-3">
               <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Medical Compliance</p>
               <p className="text-xs font-bold text-slate-700 italic italic leading-relaxed">External Guidelines (NCCN/ESMO) are linked as third-party evidence. Clinical judgment takes priority over automated stubs.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
