"use client";

import { GlassCard, Button } from "@/components/ui/core";
import { 
  FlaskConical, 
  Plus, 
  ChevronRight, 
  TrendingUp, 
  AlertTriangle,
  ClipboardCheck,
  Activity
} from "lucide-react";
import { useState } from "react";

/**
 * Lab Vault Hub - High-Fidelity Clinical Lab Reconciliation.
 * Allows oncologists to review and enter CBC (Complete Blood Count) and KFT (Kidney Function Test).
 */
export default function LabVaultStub() {
  const [isAdding, setIsAdding] = useState(false);

  const LabResultRow = ({ label, value, unit, status, trend }: any) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 hover:border-indigo-100 transition-all group">
       <div className="flex items-center gap-4">
          <div className={`w-2 h-2 rounded-full ${status === 'low' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
          <div>
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1 font-serif">{label}</p>
             <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 italic">{value}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
             </div>
          </div>
       </div>
       <div className="flex items-center gap-4">
          <div className="text-right">
             <p className={`text-[10px] font-black uppercase tracking-tighter ${status === 'low' ? 'text-rose-600' : 'text-emerald-600'}`}>{status === 'low' ? 'Below Threshold' : 'Stable'}</p>
             <p className="text-[9px] text-slate-300 font-bold uppercase">{trend}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
       </div>
    </div>
  );

  return (
    <div className="space-y-6 pt-8">
      <div className="flex items-center justify-between px-2">
         <h3 className="text-2xl font-black font-outfit text-slate-900 italic italic flex items-center gap-4">
            <FlaskConical className="w-8 h-8 text-indigo-600" />
            Lab <span className="text-indigo-600">Vault</span>
         </h3>
         <Button onClick={() => setIsAdding(true)} variant="outline" className="h-10 px-6 gap-2 bg-indigo-50 border-indigo-100 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white shadow-xl shadow-indigo-100/20 transition-all rounded-full">
            <Plus className="w-4 h-4" /> Log Entry
         </Button>
      </div>

      <GlassCard className="!p-8 rounded-[40px] border-2 border-slate-50 bg-slate-50/30 shadow-inner space-y-8">
         {/* Active Triage Metric Strip */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 group hover:border-rose-100 transition-all">
               <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-serif italic italic">Hemoglobin Stability</p>
                  <AlertTriangle className="w-4 h-4 text-rose-500 animate-bounce" />
               </div>
               <div className="flex items-baseline gap-3">
                  <h4 className="text-4xl font-black font-outfit text-slate-950 italic">9.2</h4>
                  <span className="text-[11px] font-black text-slate-400 uppercase">g/dL</span>
               </div>
               <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden self-end">
                  <div className="h-full bg-rose-500 w-[60%]" />
               </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 group hover:border-emerald-100 transition-all">
               <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-serif italic italic">Neutrophil Count (ANC)</p>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
               </div>
               <div className="flex items-baseline gap-3">
                  <h4 className="text-4xl font-black font-outfit text-slate-950 italic">1,820</h4>
                  <span className="text-[11px] font-black text-slate-400 uppercase">cells/µL</span>
               </div>
               <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden self-end">
                  <div className="h-full bg-emerald-500 w-[85%]" />
               </div>
            </div>
         </div>

         {/* Detailed Result Terminal */}
         <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic italic ml-2">CBC / KFT Panel (Today, 10:45 AM)</span>
               <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">Verified by Clinical Proxy</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <LabResultRow label="White Blood Cells" value="4.8" unit="x10³/µL" status="stable" trend="+0.2" />
               <LabResultRow label="Platelets" value="184" unit="x10³/µL" status="stable" trend="-12" />
               <LabResultRow label="Creatinine" value="0.82" unit="mg/dL" status="stable" trend="Baseline" />
               <LabResultRow label="Potassium" value="3.1" unit="mEq/L" status="low" trend="-0.4" />
            </div>
         </div>

         {/* Institutional Validation */}
         <div className="p-6 bg-slate-950 rounded-[32px] text-white flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/5 shadow-sm">
                  <ClipboardCheck className="w-5 h-5 text-indigo-400" />
               </div>
               <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] font-serif italic italic leading-none mb-1">Clinical Reconciliation</p>
                  <p className="text-xs font-black italic italic leading-none">Last Oncologist Review: <span className="text-indigo-400">Dr. Singh (Yesterday)</span></p>
               </div>
            </div>
            <Button variant="ghost" className="h-10 px-6 rounded-full border border-white/10 text-white font-black uppercase text-[9px] tracking-widest hover:bg-white hover:text-black transition-all">Broadcast Lab Result</Button>
         </div>
      </GlassCard>

      {/* Entry Overlay (Mock) */}
      {isAdding && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
            <GlassCard className="w-full max-w-2xl !p-12 border-2 border-slate-50 bg-white shadow-2xl rounded-[56px] space-y-10 relative overflow-hidden">
               <div className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"><Activity className="w-8 h-8" /></div>
                  <h4 className="text-3xl font-black font-outfit italic italic text-slate-950">Clinical Result Entry</h4>
                  <p className="text-sm text-slate-500 font-bold italic italic opacity-70">Enrolling high-fidelity lab data for CBC/KFT reconciliation.</p>
               </div>
               
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">Parameter Value</label>
                     <input type="text" placeholder="e.g. 12.4" className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-base font-black italic transition-all focus:border-indigo-100 focus:bg-white outline-none" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">Measurement Unit</label>
                     <select className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-base font-black italic transition-all outline-none">
                        <option>g/dL (Hemoglobin)</option>
                        <option>cells/µL (ANC)</option>
                        <option>mg/dL (Creatinine)</option>
                     </select>
                  </div>
               </div>

               <div className="flex items-center gap-4 pt-6">
                  <Button onClick={() => setIsAdding(false)} variant="ghost" className="flex-1 h-16 rounded-[28px] text-slate-400 font-black uppercase text-xs tracking-widest">Discard Entry</Button>
                  <Button onClick={() => setIsAdding(false)} className="flex-1 h-16 rounded-[28px] bg-slate-950 text-white font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-indigo-100">Commit Record</Button>
               </div>
            </GlassCard>
         </div>
      )}
    </div>
  );
}
