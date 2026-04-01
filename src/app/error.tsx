'use client';

import { useEffect } from 'react';
import { Button, GlassCard } from '@/components/ui/core';
import { AlertCircle, RefreshCcw, PhoneCall } from 'lucide-react';

/**
 * Global Clinical Error Boundary.
 * Provides mandatory clear instructions for patients and clinicians during unrecoverable state.
 * (Technical Guidance Section 2).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Section 9: Structured Logging of Client Errors
    console.error(' [CLINICAL_ERROR_BOUNDARY] ', {
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
      location: window.location.href
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-rose-100 selection:text-rose-900">
      <GlassCard className="max-w-2xl w-full !p-12 space-y-10 border-rose-100 bg-white shadow-2xl shadow-rose-100/50 relative overflow-hidden group">
         {/* Background clinical brand accent */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
         
         <div className="flex flex-col items-center text-center space-y-6 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-rose-50 border-4 border-white shadow-xl flex items-center justify-center text-rose-600 animate-pulse">
               <AlertCircle className="w-10 h-10" />
            </div>
            
            <div className="space-y-3">
               <h1 className="text-3xl font-bold font-outfit text-slate-900 tracking-tight italic underline decoration-rose-500/20 underline-offset-8">
                 System <span className="text-rose-600">Interruption</span>
               </h1>
               <p className="text-slate-500 font-medium italic leading-relaxed px-4">
                 A critical clinical logic error occurred. To ensure data integrity, the current session was paused.
               </p>
            </div>
         </div>

         {/* Mandatory Clinical Instruction - Section 2 */}
         <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-8 space-y-4">
            <p className="text-sm font-bold text-rose-900 flex items-center gap-2 italic">
               <span className="w-2 h-2 rounded-full bg-rose-600" /> Essential Instructions:
            </p>
            <p className="text-[13px] text-rose-800 leading-relaxed font-medium italic underline decoration-rose-200 decoration-1 underline-offset-4">
               Your most recent clinical data entry (Symptom Log or Medication Update) may NOT have been saved. Please verify your log history once the page reloads.
            </p>
            <div className="flex items-center gap-4 pt-2">
               <Button variant="outline" className="h-11 px-6 gap-3 text-[10px] font-black uppercase tracking-widest border-rose-200 bg-white text-rose-600 shadow-sm transition-all hover:bg-rose-50">
                  <PhoneCall className="w-4 h-4" /> Nurse Navigator
               </Button>
            </div>
         </div>

         <div className="flex flex-col items-center gap-4 pt-4">
            <Button 
               onClick={() => reset()}
               className="h-14 w-full bg-slate-900 border-0 text-white font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all group"
            >
               <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" /> Reload Clinical Workspace
            </Button>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic font-serif">Error Code: {error.digest || 'RUNTIME_FAULT'}</p>
         </div>
      </GlassCard>
    </div>
  );
}
