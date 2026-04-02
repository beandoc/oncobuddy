"use client";

import { DayCareShift, DayCareStatus } from "@prisma/client";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Clock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  Calendar,
  ChevronRight,
  MoreVertical,
  XCircle,
  Stethoscope
} from "lucide-react";
import { useState, useTransition } from "react";
import { updateDayCareStatus, deferDayCareSession } from "@/lib/actions/daycare.actions";

interface DayCareHubProps {
  sessions: any[];
  currentUserRole: 'ONCOLOGIST' | 'NURSE';
}

/**
 * High-Performance Day Care Unit (DCU) Management Terminal.
 * Orchestrates shift-based chemotherapy monitoring and session lifecycle.
 */
export function DayCareUnitHub({ sessions, currentUserRole }: DayCareHubProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'next'>('current');
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = async (sessionId: string, status: DayCareStatus) => {
    startTransition(async () => {
      await updateDayCareStatus(sessionId, status);
    });
  };

  const handleDefer = async (sessionId: string) => {
    const reason = window.prompt("Reason for deferral:");
    if (reason) {
      startTransition(async () => {
        await deferDayCareSession(sessionId, reason);
      });
    }
  };

  const currentSessions = sessions.filter(s => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionDate = new Date(s.date);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  });

  const nextSessions = sessions.filter(s => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Skip Sunday implicitly by check
    if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const sessionDate = new Date(s.date);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === tomorrow.getTime();
  });

  const displaySessions = activeTab === 'current' ? currentSessions : nextSessions;

  const morningShifts = displaySessions.filter(s => s.shift === DayCareShift.MORNING);
  const afternoonShifts = displaySessions.filter(s => s.shift === DayCareShift.AFTERNOON);

  const ShiftGroup = ({ title, shift, data }: { title: string, shift: DayCareShift, data: any[] }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Clock className="w-5 h-5 shadow-sm" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-outfit text-slate-900">{title}</h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider leading-none">Shift Capacity: {data.length} / 12</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {data.length > 0 ? (
          data.map((session, i) => (
            <GlassCard key={session.id} className={`!p-0 border-0 group transition-all hover:translate-x-2 relative overflow-hidden bg-white hover:shadow-xl hover:shadow-indigo-50/50 ${session.status === DayCareStatus.RUNNING ? 'ring-2 ring-indigo-500 shadow-2xl' : ''}`}>
              {session.status === DayCareStatus.RUNNING && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 animate-pulse" />}
              <div className="flex items-stretch">
                <div className="w-16 p-6 flex flex-col items-center justify-center border-r border-slate-50 bg-slate-50/10 text-center">
                   <p className="text-xl font-bold text-slate-900 leading-none">{i + 1}</p>
                   <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mt-2">Chair</p>
                </div>
                <div className="flex-1 p-6 flex flex-col xl:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-5 min-w-[300px]">
                     <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-lg border-2 border-white shadow-xl transition-all group-hover:rotate-3 group-hover:scale-110">
                        {session.patient.preferredName?.charAt(0) || "P"}
                     </div>
                     <div className="space-y-1">
                        <p className="text-base font-black text-slate-800 leading-none italic italic underline decoration-transparent group-hover:decoration-indigo-200 decoration-2 underline-offset-4 transition-all">
                           {session.patient.preferredName || `${session.patient.firstName} ${session.patient.lastName}`}
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                           <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none italic">MRN: {session.patient.mrn}</span>
                           <div className="w-1 h-1 rounded-full bg-slate-200" />
                           <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest italic leading-none">Cycle 4 (Day 1)</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-4">
                     <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] leading-none border shadow-sm transition-all ${
                        session.status === DayCareStatus.RUNNING ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse' :
                        session.status === DayCareStatus.COMPLETED ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                        session.status === DayCareStatus.DEFERRED ? 'bg-amber-50 border-amber-100 text-amber-600' :
                        'bg-slate-50 border-slate-100 text-slate-400'
                     }`}>
                        {session.status}
                     </div>

                     <div className="flex items-center gap-2">
                        {session.status === DayCareStatus.SCHEDULED && (
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="h-10 px-6 gap-2 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 shadow-xl transition-all active:scale-95"
                            onClick={() => handleStatusChange(session.id, DayCareStatus.RUNNING)}
                            disabled={isPending}
                          >
                             <Activity className="w-3.5 h-3.5" /> Start
                          </Button>
                        )}
                        {session.status === DayCareStatus.RUNNING && (
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="h-10 px-6 gap-2 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 shadow-xl transition-all"
                            onClick={() => handleStatusChange(session.id, DayCareStatus.COMPLETED)}
                            disabled={isPending}
                          >
                             <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                          </Button>
                        )}
                        {currentUserRole === 'ONCOLOGIST' && session.status !== DayCareStatus.COMPLETED && (
                           <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-10 px-6 gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-600 transition-all border border-transparent hover:border-amber-100 italic"
                              onClick={() => handleDefer(session.id)}
                              disabled={isPending}
                            >
                              <Calendar className="w-3.5 h-3.5" /> Defer
                           </Button>
                        )}
                     </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        ) : (
          <div className="py-20 text-center space-y-4 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
             <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto border border-slate-100 shadow-sm opacity-50">
                <Clock className="w-6 h-6 text-slate-300" />
             </div>
             <p className="text-sm font-bold text-slate-400 italic">No chemotherapy sessions recorded for this shift.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      
      {/* 1. Header & Day-Selector (Section 3, 12) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-10">
         <div className="space-y-3">
            <h1 className="text-5xl font-black font-outfit tracking-tight text-slate-950 italic italic leading-none underline decoration-indigo-200 decoration-8 underline-offset-[12px]">Day Care <span className="text-indigo-600">Unit</span></h1>
            <p className="text-slate-500 font-medium italic italic pt-4">Toxicity management and high-throughput chemotherapy shift oversight.</p>
         </div>
         <div className="flex bg-slate-100 p-1.5 rounded-[22px] shadow-inner shadow-slate-200 scale-105 origin-bottom-right">
            <button 
              onClick={() => setActiveTab('current')}
              className={`px-8 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'current' ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-100 ring-1 ring-indigo-50/50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Today's Panel
            </button>
            <button 
              onClick={() => setActiveTab('next')}
              className={`px-8 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'next' ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-100 ring-1 ring-indigo-50/50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Next Day Roster
            </button>
         </div>
      </div>

      {/* 2. Institutional Awareness Ribbon (Section 4) */}
      <div className="flex flex-wrap gap-4 pt-2">
         {[
           { label: 'Morning Pool', val: morningShifts.length, max: 12, color: 'text-indigo-600' },
           { label: 'Afternoon Pool', val: afternoonShifts.length, max: 12, color: 'text-indigo-600' },
           { label: 'In-Cycle (Running)', val: displaySessions.filter(s => s.status === DayCareStatus.RUNNING).length, color: 'text-rose-600' }
         ].map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-slate-100 shadow-lg shadow-slate-100/50 hover:translate-y-[-2px] transition-all cursor-default">
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">{stat.label}:</span>
               <span className={`text-sm font-black italic italic ${stat.color}`}>{stat.val}{stat.max ? ` / ${stat.max}` : ''}</span>
            </div>
         ))}
      </div>

      {/* 3. High-Throughput Shift Views (Section 12) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ShiftGroup title="Morning Shift (09:00 - 13:00)" shift={DayCareShift.MORNING} data={morningShifts} />
        <ShiftGroup title="Afternoon Shift (14:00 - 18:00)" shift={DayCareShift.AFTERNOON} data={afternoonShifts} />
      </div>

      {/* 4. Professional Stewardship Clause (Section 4) */}
      <div className="pt-10 flex flex-col md:flex-row items-center gap-6 opacity-60">
         <div className="p-3.5 rounded-2xl bg-slate-900 text-white"><Stethoscope className="w-5 h-5 shadow-2xl" /></div>
         <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic italic max-w-2xl">
            You are overseeing the Day Care Unit at <span className="text-slate-900 font-black">Main Campus (Level 4)</span>. Any deferrals made will trigger an automatic notification to the Patient Envoy and Pharmacy reconciliation terminal.
         </p>
      </div>
    </div>
  );
}
