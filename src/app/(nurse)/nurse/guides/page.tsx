import { Search, BookOpen, Clock, ArrowRight, Play, FileText, Bookmark, Activity } from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import Link from "next/link";

/**
 * Nurse Guide Library - Vanguard Terminal.
 * Centralized repository for clinical protocols and patient education material.
 */
export default function GuideLibraryPage() {
  const guides = [
     { id: 1, title: "Managing Grade 3 Diarrhea", category: "Symptom Management", duration: "12 min", format: "Article", color: "text-rose-600", bg: "bg-rose-50" },
     { id: 2, title: "Post-Chemo Physical Exercises", category: "Rehabilitation", duration: "8 min", format: "Video", color: "text-indigo-600", bg: "bg-indigo-50" },
     { id: 3, title: "Neutropenic Diet Protocols", category: "Nutrition", duration: "15 min", format: "Protocol", color: "text-emerald-600", bg: "bg-emerald-50" },
     { id: 4, title: "Port-a-cath Access Safety", category: "Clinical Procedure", duration: "5 min", format: "Checklist", color: "text-amber-600", bg: "bg-amber-50" },
     { id: 5, title: "Oral Mucositis Interventions", category: "Symptom Management", duration: "10 min", format: "Article", color: "text-rose-600", bg: "bg-rose-50" },
     { id: 6, title: "Baseline ECOG Evaluation", category: "Assessment", duration: "4 min", format: "Guide", color: "text-slate-600", bg: "bg-slate-100" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* Search Header */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end justify-between border-b border-slate-100 pb-12">
         <div className="space-y-2">
            <h1 className="text-5xl font-black font-outfit text-slate-900 tracking-tight italic">Protocol <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4">Vault</span></h1>
            <p className="text-base font-bold text-slate-600">Secure access to clinical guidelines and patient optimization resources.</p>
         </div>
         <div className="relative w-full md:w-[400px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-600 transition-colors" />
            <input 
               type="text" 
               placeholder="Search clinical guides..." 
               className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-50 rounded-3xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all shadow-sm" 
            />
         </div>
      </div>

      {/* Recommended for Your Shift */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black font-outfit text-slate-900 italic">Clinical <span className="text-emerald-600">Briefings</span></h2>
            <Link href="#" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">See All Activity</Link>
         </div>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard className="!p-10 bg-indigo-600 border-0 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-indigo-200 tracking-widest">Mandatory Reading</span>
                    </div>
                    <h3 className="text-3xl font-black text-white italic leading-tight">Patient Registry<br/>Transition Protocol (2.1)</h3>
                    <p className="text-sm text-indigo-100 font-medium max-w-sm">New guidelines for documenting ID-O-3 codes in the primary site registry for all new enrollments.</p>
                    <div className="flex items-center gap-4 pt-4">
                        <Button className="h-14 px-8 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Review Now</Button>
                        <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">6 Min Read</span>
                    </div>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <BookOpen className="w-64 h-64 text-white" />
                </div>
            </GlassCard>

            <GlassCard className="!p-10 bg-slate-900 border-0 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                            <Play className="w-5 h-5 fill-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Clinical Video</span>
                    </div>
                    <h3 className="text-3xl font-black text-white italic leading-tight">Triage Workflow<br/>Optimization Training</h3>
                    <p className="text-sm text-slate-400 font-medium max-w-sm">A recording of the latest clinical review session covering effective G3 alert escalation pathways.</p>
                    <div className="flex items-center gap-4 pt-4">
                        <Button className="h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all outline-none border-0">Watch Session</Button>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">12 Min Video</span>
                    </div>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Activity className="w-64 h-64 text-white" />
                </div>
            </GlassCard>
         </div>
      </div>

      {/* Guide Gallery - High Contrast */}
      <div className="space-y-8">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black font-outfit text-slate-900 italic italic">Resource <span className="text-slate-400">Library</span></h2>
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button className="px-4 py-2 bg-white text-[10px] font-black uppercase tracking-widest text-slate-900 rounded-xl shadow-sm">All Resources</button>
                <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Most Used</button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((g) => (
                <GlassCard key={g.id} className="hover:bg-white border-slate-50 hover:border-indigo-100 !p-8 group transition-all rounded-[32px] cursor-pointer shadow-sm hover:shadow-xl">
                    <div className="flex items-start justify-between mb-8">
                        <div className={`w-14 h-14 rounded-2xl ${g.bg} flex items-center justify-center ${g.color}`}>
                            {g.format === "Video" ? <Play className="w-6 h-6 fill-current" /> : g.format === "Protocol" ? <FileText className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                        </div>
                        <button className="p-3 text-slate-300 hover:text-indigo-600 transition-colors">
                            <Bookmark className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${g.color}`}>{g.category}</span>
                        <h4 className="text-xl font-black text-slate-900 leading-tight italic group-hover:text-indigo-600 transition-colors">{g.title}</h4>
                    </div>
                    <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase">{g.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                            Open <ArrowRight className="w-3 h-3" />
                        </div>
                    </div>
                </GlassCard>
            ))}
         </div>
      </div>

    </div>
  );
}
