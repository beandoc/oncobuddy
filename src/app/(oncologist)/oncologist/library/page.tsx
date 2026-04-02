import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { BookOpen, Search, Filter, Play, FileText, Download, Bookmark, ChevronRight } from "lucide-react";
import { Role } from "@prisma/client";

export default async function LibraryPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
         <div className="space-y-2">
            <h1 className="text-5xl font-black font-outfit tracking-tight text-slate-950 italic italic leading-none">
              Education <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Library</span>
            </h1>
            <p className="text-slate-500 font-medium italic italic opacity-80 pt-2">Curated clinical education and rehab pathways for patient assignment.</p>
         </div>
         <div className="flex items-center gap-4">
            <Button className="h-14 px-8 bg-slate-950 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
               <PlusCircle className="w-4 h-4" /> Upload Asset
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {[
            { title: 'Post-Op Recovery Guide', type: 'PDF', duration: '12 Pages', category: 'Surgical Rehab' },
            { title: 'Managing Chemotherapy Fatigue', type: 'VIDEO', duration: '08:45', category: 'Toxicity MGMT' },
            { title: 'Nutrition for Immunotherapy', type: 'ARTICLE', duration: '5 min read', category: 'Dietary' },
            { title: 'HER2+ Targeted Therapy FAQ', type: 'PDF', duration: '4 Pages', category: 'Molecular' },
            { title: 'Breathwork for Anxiety', type: 'VIDEO', duration: '12:20', category: 'Mental Health' },
            { title: 'PICC Line Maintenance', type: 'VIDEO', duration: '05:10', category: 'Care' }
         ].map((asset, i) => (
            <GlassCard key={i} className="group hover:bg-white border-white/50 hover:border-indigo-100 hover:shadow-xl transition-all cursor-pointer !p-8 rounded-[32px]">
               <div className="flex items-start justify-between mb-8">
                  <div className={`p-4 rounded-2xl ${asset.type === 'VIDEO' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                     {asset.type === 'VIDEO' ? <Play className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                  </div>
                  <Button variant="ghost" size="sm" className="w-10 h-10 rounded-xl hover:bg-slate-50 !p-0"><Bookmark className="w-4 h-4" /></Button>
               </div>
               <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-2 font-serif">{asset.category}</p>
               <h3 className="text-xl font-black font-outfit text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors italic">{asset.title}</h3>
               <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{asset.duration}</span>
                  <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Assign <ChevronRight className="w-4 h-4" /></div>
               </div>
            </GlassCard>
         ))}
      </div>
    </div>
  );
}

import { PlusCircle } from "lucide-react";
