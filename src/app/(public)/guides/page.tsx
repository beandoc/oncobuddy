import { getGuides } from "@/services/guides";
import { GuideCard } from "@/components/guides/GuideCard";
import { Search, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/core";

export const metadata = {
  title: "Clinical Education Hub | Oncobuddy",
  description: "Browse our library of clinician-reviewed oncology guides, pathophysiology explainers, and treatment navigation resources.",
};

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      {/* Search & Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-2">
           <GraduationCap className="w-3.5 h-3.5" />
           Patient Education Hub
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-outfit tracking-tight">
           Knowledge is <span className="text-gradient">Power</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
           Clinician-reviewed guides to help you navigate diagnosis, treatment, and recovery with clarity.
        </p>
      </div>

      <GlassCard className="max-w-xl mx-auto">
         <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              className="w-full pl-12 pr-4 py-3 rounded-xl border-0 bg-transparent focus:ring-0 outline-none placeholder:text-slate-400" 
              placeholder="Search guides (e.g. Breast Cancer Stage II)..."
            />
         </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>

      {/* Literacy note */}
      <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800 flex items-start gap-4">
         <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <Sparkles className="text-indigo-600 w-5 h-5" />
         </div>
         <div className="space-y-1">
            <h4 className="font-bold text-sm">Adaptive Literacy Support</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
               Oncobuddy automatically serves simplified or standard reading versions of these guides based on your profile preference. Log in to personalize your learning path.
            </p>
         </div>
      </div>
    </div>
  );
}
