"use client";

import { useState } from "react";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Activity, 
  ShieldCheck, 
  TrendingUp, 
  Edit3, 
  X, 
  Check, 
  Clock,
  Calendar
} from "lucide-react";
import { updateCaseIQ } from "@/lib/actions/case-iq.actions";

interface CaseIQEditorProps {
  patientId: string;
  treatmentId?: string;
  initialRegimen: string;
  initialCyclesCompleted: number;
  initialTotalCycles: number;
  initialNextScan: string;
  initialEcog: string;
}

export function CaseIQEditor({
  patientId,
  treatmentId,
  initialRegimen,
  initialCyclesCompleted,
  initialTotalCycles,
  initialNextScan,
  initialEcog
}: CaseIQEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Local State
  const [regimen, setRegimen] = useState(initialRegimen);
  const [cyclesCompleted, setCyclesCompleted] = useState(initialCyclesCompleted);
  const [totalCycles, setTotalCycles] = useState(initialTotalCycles);
  const [nextScan, setNextScan] = useState(initialNextScan);
  const [ecog, setEcog] = useState(initialEcog);

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateCaseIQ({
        patientId,
        treatmentId,
        treatmentName: regimen,
        cyclesCompleted,
        numberOfCycles: totalCycles,
        nextStagingScanDate: nextScan ? new Date(nextScan).toISOString() : null,
        performanceStatus: ecog
      });
      
      if (result.success) {
        setIsEditing(false);
      } else {
        alert("Clinical Sync Failure: Check network or permissions.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = Math.min(100, Math.max(0, (cyclesCompleted / (totalCycles || 1)) * 100));

  if (isEditing) {
    return (
      <GlassCard className="bg-slate-900 border-indigo-500/30 shadow-2xl !p-8 rounded-[36px] space-y-6 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Editing Clinical Intelligence</h4>
            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="grid grid-cols-1 gap-5">
           <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Current Regimen Protocol</label>
              <input 
                value={regimen} 
                onChange={(e) => setRegimen(e.target.value)}
                className="w-full bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
              />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Cycles Done</label>
                <input 
                  type="number"
                  value={cyclesCompleted} 
                  onChange={(e) => setCyclesCompleted(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-2 text-sm outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Total Planned</label>
                <input 
                  type="number"
                  value={totalCycles} 
                  onChange={(e) => setTotalCycles(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-2 text-sm outline-none"
                />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Next Staging Scan</label>
              <input 
                type="date"
                value={nextScan ? new Date(nextScan).toISOString().split('T')[0] : ""} 
                onChange={(e) => setNextScan(e.target.value)}
                className="w-full bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-2 text-sm outline-none"
              />
           </div>

           <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-500 uppercase">ECOG Performance Status</label>
              <select 
                value={ecog} 
                onChange={(e) => setEcog(e.target.value)}
                className="w-full bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-2 text-sm outline-none"
              >
                  <option value="0">0 - Fully Active</option>
                  <option value="1">1 - Restricted Strenuous</option>
                  <option value="2">2 - Ambulatory / Self-Care</option>
                  <option value="3">3 - Limited Self-Care</option>
                  <option value="4">4 - Completely Disabled</option>
                  <option value="5">5 - Deceased</option>
              </select>
           </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
        >
          {loading ? "Syncing..." : <><Check className="w-4 h-4" /> Commit Changes</>}
        </Button>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4 group">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-outfit text-slate-950">Case <span className="text-indigo-600 underline decoration-indigo-200">IQ</span></h3>
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg bg-slate-100 text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-900 hover:text-white"
            >
                <Edit3 className="w-4 h-4" />
            </button>
        </div>
        <GlassCard className="bg-slate-950 border-0 shadow-2xl !p-8 rounded-[36px] space-y-8 relative overflow-hidden">
            {/* Ambient Background Detail */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none transition-all duration-1000 ${loading ? 'animate-pulse' : ''}`} />
            
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] font-serif">Regimen Intensity</p>
                    <h4 className="text-2xl font-bold text-white tracking-tight">{regimen || "Unspecified Protocol"}</h4>
                </div>
                <ShieldCheck className="w-6 h-6 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]" />
            </div>
            
            <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-wider font-serif">
                    <span>Cycle Progress</span>
                    <span className="text-white">Cycle {cyclesCompleted} of {totalCycles}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-1000 ease-out" 
                      style={{ width: `${progressPercent}%` }} 
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-white/5">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Next Staging Scan</p>
                        <p className="text-xs text-white font-bold">{nextScan ? new Date(nextScan).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : "TBD"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-white/5">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">ECOG Status</p>
                        <p className="text-xs text-white font-bold">{ecog || "Unknown"} (Baseline)</p>
                    </div>
                </div>
            </div>
            
            {loading && (
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center rounded-[36px] z-20">
                  <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            )}
        </GlassCard>
    </div>
  );
}
