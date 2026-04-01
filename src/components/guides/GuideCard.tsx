import React from "react";
import { GlassCard, Button } from "@/components/ui/core";
import { BookOpen, Calendar, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { GuideContent } from "@/services/guides";

export function GuideCard({ guide }: { guide: GuideContent }) {
  return (
    <GlassCard className="flex flex-col h-full group hover:translate-y-[-4px] transition-all">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
           <div className="px-2 py-1 rounded bg-secondary/10 text-secondary text-[10px] font-bold">
              {guide.cancerType.toUpperCase()}
           </div>
           <ShieldCheck className="w-4 h-4 text-emerald-500 opacity-50" />
        </div>
        <h3 className="text-xl font-bold font-outfit group-hover:text-secondary transition-colors">
          {guide.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
          {guide.subtitle}
        </p>
      </div>
      <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
            <Calendar className="w-3 h-3" />
            REVIEWED {new Date(guide.publishedAt).toLocaleDateString()}
         </div>
         <Link href={`/guides/${guide.slug}`}>
            <Button variant="ghost" size="sm" className="group/btn">
              Read Guide
              <ChevronRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
         </Link>
      </div>
    </GlassCard>
  );
}
