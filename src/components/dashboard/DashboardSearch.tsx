"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";

/**
 * High-Fidelity Clinical Search Engine (Vanguard).
 * Orchestrates server-side panel filtering with real-time UI feedback.
 */
export function DashboardSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (val: string) => {
    setQuery(val);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (val) {
        params.set("q", val);
      } else {
        params.delete("q");
      }
      router.push(`/oncologist/dashboard?${params.toString()}`);
    });
  };

  const clearSearch = () => {
    setQuery("");
    router.push(`/oncologist/dashboard`);
  };

  return (
    <div className="relative group flex-1 max-w-xl">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
         {isPending ? (
            <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
         ) : (
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
         )}
      </div>
      <input 
        type="text" 
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search patients by name or MRN..." 
        className="w-full h-14 pl-14 pr-12 rounded-[22px] bg-white border-2 border-slate-100 focus:border-indigo-100 focus:shadow-[0_0_40px_rgba(79,70,229,0.05)] outline-none transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
      />
      {query && !isPending && (
         <button 
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 text-slate-400"
         >
            <X className="w-3 h-3" />
         </button>
      )}
    </div>
  );
}
