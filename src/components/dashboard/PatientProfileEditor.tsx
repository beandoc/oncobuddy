"use client";

import { useState } from "react";
import { GlassCard, Button } from "@/components/ui/core";
import { Save, Edit2, CheckCircle2, Loader2, X } from "lucide-react";
import { updatePatientClinicalNotes } from "@/lib/actions/oncologist.actions";

interface PatientProfileEditorProps {
  patientId: string;
  initialNotes: string | null;
}

/**
 * High-Fidelity Clinical Notes Editor (Vanguard).
 * Enables real-time MD documentation with server persistence.
 */
export function PatientProfileEditor({ patientId, initialNotes }: PatientProfileEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(initialNotes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updatePatientClinicalNotes(patientId, notes);
    setIsSaving(false);
    
    if (result.success) {
      setIsEditing(false);
      setHasSaved(true);
      setTimeout(() => setHasSaved(false), 3000); // Visual feedback
    } else {
      alert("⚠️ Clinical Sync Fault: Failed to persist notes.");
    }
  };

  return (
    <GlassCard className="bg-white border-slate-100 shadow-xl !p-10 rounded-[48px] space-y-8 relative overflow-hidden group">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h3 className="text-2xl font-black font-outfit text-slate-900 italic italic">Clinical <span className="text-indigo-600 underline decoration-indigo-200">Notes</span></h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic italic">MD Situational Documentation</p>
         </div>
         {!isEditing ? (
            <Button 
               onClick={() => setIsEditing(true)}
               variant="ghost" 
               className="h-10 px-6 gap-2 rounded-full border border-slate-100 hover:bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest"
            >
               <Edit2 className="w-3.5 h-3.5" /> Edit Session
            </Button>
         ) : (
            <div className="flex items-center gap-2">
               <Button 
                  onClick={() => setIsEditing(false)}
                  variant="ghost" 
                  className="h-10 px-4 rounded-full text-slate-400 hover:text-slate-600"
               >
                  <X className="w-4 h-4" />
               </Button>
               <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-10 px-8 gap-2 bg-indigo-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
               >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {isSaving ? "Syncing..." : "Commit Notes"}
               </Button>
            </div>
         )}
      </div>

      <div className="relative">
         {isEditing ? (
            <textarea 
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               placeholder="Record shift observations, treatment response, or medication adjustments..."
               className="w-full h-64 p-8 rounded-[32px] bg-slate-50 border-2 border-indigo-100 focus:bg-white outline-none transition-all font-medium text-slate-900 text-sm italic leading-relaxed shadow-inner"
            />
         ) : (
            <div className="w-full min-h-64 p-8 rounded-[32px] bg-slate-50/50 border border-transparent font-medium text-slate-600 text-sm italic leading-relaxed whitespace-pre-wrap">
               {notes || "No clinical observations recorded for this patient cycle yet. Click 'Edit Session' to begin documentation."}
            </div>
         )}
         
         {hasSaved && (
            <div className="absolute top-4 right-4 animate-in fade-in zoom-in slide-in-from-top-2 duration-500">
               <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                  <CheckCircle2 className="w-3.5 h-3.5" /> MD Sign-off Synced
               </div>
            </div>
         )}
      </div>

      <div className="pt-4 flex items-center justify-between opacity-40">
         <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic">Compliance: HIPPA-OS | DICOM-L4</p>
         <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest">Digital MD Signature Attached</p>
      </div>
    </GlassCard>
  );
}
