'use client';

import React, { useState } from "react";
import { 
  Activity, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Plus, 
  Smile, 
  Frown, 
  Info,
  Loader2,
  Trash2
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const COMMON_SYMPTOMS = [
  { id: "PRO_CTCAE_1", name: "Fatigue", description: "Feeling tired or having no energy" },
  { id: "PRO_CTCAE_2", name: "Nausea", description: "Feeling like you might throw up" },
  { id: "PRO_CTCAE_3", name: "Pain", description: "Any physical pain or discomfort" },
  { id: "PRO_CTCAE_4", name: "Neuropathy", description: "Numbness or tingling in hands/feet" },
  { id: "PRO_CTCAE_5", name: "Diarrhea", description: "Frequent or loose bowel movements" },
];

export default function DailyLogForm() {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["PRO_CTCAE_1"]);
  const [ratings, setRatings] = useState<Record<string, any>>({});
  const [wellbeing, setWellbeing] = useState(5);
  const [narrative, setNarrative] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const updateRating = (id: string, field: string, value: any) => {
    setRatings(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const currentSymptomId = selectedSymptoms[step - 2];
  const currentSymptom = COMMON_SYMPTOMS.find(s => s.id === currentSymptomId);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Mock submit
    setTimeout(() => {
      setIsLoading(false);
      setStep(selectedSymptoms.length + 3);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-4">
          <Activity className="w-3.5 h-3.5" />
          NCI PRO-CTCAE Validated
        </div>
        <h1 className="text-3xl font-bold font-outfit">How are you today?</h1>
        <p className="text-slate-500 mt-2">Your daily log helps your care team track your progress.</p>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {/* Step 1: Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-bold font-outfit flex items-center gap-2">
                1. Select Symptoms to Report
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {COMMON_SYMPTOMS.map((s) => (
                  <GlassCard 
                    key={s.id}
                    onClick={() => toggleSymptom(s.id)}
                    className={cn(
                      "cursor-pointer transition-all border-2",
                      selectedSymptoms.includes(s.id) ? "border-secondary bg-secondary/5" : "border-transparent"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          selectedSymptoms.includes(s.id) ? "bg-secondary text-white" : "bg-slate-100 text-slate-400"
                        )}>
                          {selectedSymptoms.includes(s.id) ? <CheckCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold">{s.name}</p>
                          <p className="text-xs text-slate-500">{s.description}</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full" 
                disabled={selectedSymptoms.length === 0}
                onClick={() => setStep(2)}
              >
                Continue to Assessment ({selectedSymptoms.length})
              </Button>
            </motion.div>
          )}

          {/* Steps 2+ : Ratings for each symptom */}
          {step > 1 && step <= selectedSymptoms.length + 1 && (
             <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-bold font-outfit">
                    Report Symptom: <span className="text-secondary">{currentSymptom?.name}</span>
                 </h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {step - 1} OF {selectedSymptoms.length}
                 </p>
              </div>

              <div className="space-y-10 py-4">
                 {/* Severity Slider (CTCAE 0-4) */}
                 <div className="space-y-4">
                    <label className="text-sm font-bold flex items-center gap-2">
                       Severity
                       <Info className="w-3.5 h-3.5 text-slate-300" />
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                        {[0, 1, 2, 3, 4].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => updateRating(currentSymptomId, "severity", g)}
                            className={cn(
                              "h-14 rounded-xl font-bold flex flex-col items-center justify-center border-2 transition-all",
                              ratings[currentSymptomId]?.severity === g 
                                ? "bg-secondary border-secondary text-white shadow-lg shadow-secondary/20" 
                                : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400"
                            )}
                          >
                             <span className="text-lg">{g}</span>
                             <span className="text-[8px] uppercase tracking-tighter">
                                {g === 0 ? "None" : g === 1 ? "Mild" : g === 2 ? "Mod" : g === 3 ? "Sev" : "Life"}
                             </span>
                          </button>
                        ))}
                    </div>
                 </div>

                 {/* Frequency Toggle */}
                 <div className="space-y-4">
                    <label className="text-sm font-bold">Frequency</label>
                    <div className="flex flex-wrap gap-2">
                      {["NEVER", "RARELY", "OCCASIONALLY", "FREQUENTLY", "CONSTANTLY"].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => updateRating(currentSymptomId, "frequency", f)}
                          className={cn(
                             "px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all",
                             ratings[currentSymptomId]?.frequency === f
                              ? "bg-primary border-primary text-white"
                              : "border-slate-100 dark:border-slate-800 text-slate-500"
                          )}
                        >
                           {f}
                        </button>
                      ))}
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 pt-8">
                 <Button variant="ghost" onClick={() => setStep(step - 1)}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                 </Button>
                 <Button variant="secondary" className="flex-1" onClick={() => setStep(step + 1)}>
                    {step === selectedSymptoms.length + 1 ? "Summary" : "Next Symptom"}
                    <ChevronRight className="ml-2 w-4 h-4" />
                 </Button>
              </div>
            </motion.div>
          )}

          {/* Final Step: Wellbeing & Summary */}
          {step === selectedSymptoms.length + 2 && (
             <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
               <div className="space-y-6">
                  <h3 className="text-lg font-bold font-outfit">Final Check-in</h3>
                  
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950/20 dark:to-emerald-950/20 border border-indigo-100 dark:border-indigo-900/30">
                    <div className="flex items-center justify-between mb-6">
                       <label className="text-sm font-bold">Global Wellbeing (0-10)</label>
                       <span className="text-2xl font-black text-indigo-600">{wellbeing}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <Frown className="w-6 h-6 text-slate-400" />
                       <input 
                         type="range" min="0" max="10" step="1"
                         value={wellbeing}
                         onChange={(e) => setWellbeing(Number(e.target.value))}
                         className="flex-1 accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                       />
                       <Smile className="w-6 h-6 text-emerald-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-bold flex items-center justify-between">
                       Daily Notes
                       <span className="text-[10px] text-slate-400">OPTIONAL</span>
                     </label>
                     <textarea 
                        value={narrative}
                        onChange={(e) => setNarrative(e.target.value)}
                        className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 min-h-[150px] outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Anything else you or your doctor should know about today?"
                     />
                  </div>
               </div>

               <div className="flex gap-4">
                 <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
                 <Button variant="secondary" className="flex-1" size="lg" disabled={isLoading} onClick={handleSubmit}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Daily Log"}
                 </Button>
               </div>
            </motion.div>
          )}

          {/* Success screen */}
          {step > selectedSymptoms.length + 2 && (
             <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 space-y-6"
            >
               <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
               </div>
               <h2 className="text-3xl font-bold font-outfit">Log Submitted</h2>
               <p className="text-slate-500 max-w-sm mx-auto">
                 Thank you for reporting. Your care team has been notified of your current status.
               </p>
               <div className="pt-8">
                  <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>Return to Dashboard</Button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
