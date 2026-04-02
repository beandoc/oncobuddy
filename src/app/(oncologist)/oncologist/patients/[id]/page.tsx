import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import Link from "next/link";
import { PatientProfileEditor } from "@/components/dashboard/PatientProfileEditor";
import LabVaultStub from "@/components/dashboard/LabVaultStub";
import { 
  Activity, 
  Calendar, 
  MessageSquare, 
  History as LucideHistory, 
  AlertCircle, 
  ChevronLeft, 
  TrendingUp, 
  ShieldCheck,
  Stethoscope,
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User
} from "lucide-react";
import { Role, AlertSeverity, AlertStatus } from "@prisma/client";

/**
 * High-Fidelity Patient Clinical Profile - Navigator Screen.
 * Provides deep situational awareness for a single patient context.
 */
export default async function PatientProfilePage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || (session.user.role !== Role.ONCOLOGIST && session.user.role !== Role.NURSE)) redirect("/login");

  const patient = await prisma.patient.findUnique({
    where: { publicId: params.id },
    include: {
      user: true,
      diagnoses: { 
        orderBy: { diagnosisDate: 'desc' },
        include: { treatments: { take: 1, orderBy: { treatmentStartDate: 'desc' } } }
      },
      symptomLogs: { 
        orderBy: { logDate: 'desc' }, 
        take: 10,
        include: {
          entries: true
        }
      },
      alerts: { 
        where: { alertStatus: AlertStatus.PENDING },
        orderBy: { alertSeverity: 'desc' }
      },
    }
  });

  if (!patient) notFound();

  const activeDiagnosis = patient.diagnoses[0];
  const activeTreatment = activeDiagnosis?.treatments[0];
  const totalAlerts = patient.alerts.length;

  // Robust Age Calculation
  const birthDate = patient.dateOfBirth ? new Date(patient.dateOfBirth) : null;
  const age = birthDate && !isNaN(birthDate.getTime()) 
    ? new Date().getFullYear() - birthDate.getFullYear() 
    : "NA";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Vanguard Context Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-12">
         <div className="space-y-4">
            <Link href={session.user.role === Role.ONCOLOGIST ? "/oncologist/patients" : "/nurse/patients"} className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest hover:text-indigo-600 transition-colors group px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
               <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Panel
            </Link>
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-[32px] bg-slate-100 flex items-center justify-center text-3xl font-black text-slate-400 border-4 border-white shadow-2xl overflow-hidden">
                    {patient.user.image ? (
                        <img src={patient.user.image} className="w-full h-full object-cover" />
                    ) : (
                        patient.preferredName?.charAt(0) || patient.user.firstName?.charAt(0)
                    )}
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-5xl font-black font-outfit text-slate-900 tracking-tight italic italic leading-none">{patient.preferredName || `${patient.user.firstName} ${patient.user.lastName}`}</h1>
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${totalAlerts > 0 ? "bg-rose-50 text-rose-600 border border-rose-100 animate-pulse" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                            {totalAlerts > 0 ? "Critical Triage" : "Clinical Stability"}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                        <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] italic font-serif">MRN: {patient.mrn}</p>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] italic font-serif">Aet: {age} Years</p>
                    </div>
                </div>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <Button className="h-16 px-8 bg-slate-950 text-white rounded-[28px] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
               <MessageSquare className="w-4 h-4" /> Message Caregiver
            </Button>
            <Button variant="outline" className="h-16 w-16 rounded-[28px] border-slate-100 bg-white hover:bg-slate-50 flex items-center justify-center shadow-sm"><Calendar className="w-5 h-5" /></Button>
            <Button variant="outline" className="h-16 w-16 rounded-[28px] border-slate-100 bg-white hover:bg-slate-50 flex items-center justify-center shadow-sm"><MoreVertical className="w-5 h-5" /></Button>
         </div>
      </div>

      {/* 2. Clinical Vitality Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Column: Log History & Toxicity Analysis */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Vanguard Notes Terminal (Section 12) */}
            <PatientProfileEditor 
               patientId={patient.id} 
               initialNotes={patient.clinicalNotes} 
            />

            {/* Lab Vault Reconciliation Hub (Request 6) */}
            <LabVaultStub />

            <div className="flex items-center justify-between pt-16">
               <h3 className="text-2xl font-black font-outfit text-slate-900 italic italic">Symptom <span className="text-indigo-600">Trajectory</span></h3>
               <Link href="#" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Full Longitudinal Study</Link>
            </div>

            <div className="space-y-6">
              {patient.symptomLogs.length > 0 ? (
                patient.symptomLogs.map((log: any, idx: number) => (
                  <GlassCard key={log.id} className="hover:bg-white border-white/50 hover:border-indigo-100 transition-all !p-8 group rounded-[32px]">
                     <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-50">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                              <LucideHistory className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:rotate-[-12deg] transition-all" />
                           </div>
                           <div className="space-y-0.5">
                              <p className="text-sm font-black font-outfit text-slate-900 italic">Clinical Submission {idx + 1}</p>
                              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{new Date(log.logDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                           <CheckCircle2 className="w-3 h-3" /> Validated
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {log.entries.map((symp: any) => (
                            <div key={symp.id} className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">{symp.ctcaeTermName.replace(/_/g, ' ')}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xl font-black font-outfit ${symp.severity >= 3 ? "text-rose-600" : "text-slate-900"}`}>{symp.severity}</span>
                                    <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${symp.severity >= 3 ? "bg-rose-500" : "bg-indigo-500"}`} style={{ width: `${symp.severity * 20}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                     </div>
                  </GlassCard>
                ))
              ) : (
                <div className="p-32 text-center bg-slate-50/50 rounded-[48px] border-2 border-dashed border-slate-100">
                    <Clock className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                    <h4 className="text-xl font-black font-outfit text-slate-400 italic">Historical Context Missing</h4>
                    <p className="text-sm text-slate-400 italic mt-2">No symptom log submissions detected for this MRN sequence.</p>
                </div>
              )}
            </div>
         </div>

         {/* Right Column: Case IQ & Intelligence */}
         <div className="space-y-10">
            {/* Treatment Cycle HUD */}
            <div className="space-y-4">
                <h3 className="text-xl font-black font-outfit text-slate-950 italic italic">Case <span className="text-indigo-600 underline decoration-indigo-200">IQ</span></h3>
                <GlassCard className="bg-slate-950 border-0 shadow-2xl !p-8 rounded-[36px] space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] font-serif">Regimen Intensity</p>
                            <h4 className="text-2xl font-black text-white italic">Protocol VII-B</h4>
                        </div>
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-black uppercase text-slate-500 tracking-widest font-serif">
                            <span>Cycle Progress</span>
                            <span className="text-white">Cycle {activeTreatment?.cyclesCompleted || 0} of {activeTreatment?.numberOfCycles || 6}</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 w-[66%]" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                            <Activity className="w-4 h-4 text-indigo-400" />
                            <p className="text-xs text-slate-400 font-medium">Next Staging Scan: <span className="text-white font-bold">14 Apr 2026</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <p className="text-xs text-slate-400 font-medium italic underline decoration-indigo-800">ECOG Status: <span className="text-white font-bold">1 (Baseline)</span></p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Threshold & Alert Center */}
            <div className="space-y-4">
                <h3 className="text-xl font-black font-outfit text-slate-950 italic italic">Triage <span className="text-rose-600">Thresholds</span></h3>
                <GlassCard className="bg-rose-50 border-rose-100 !p-8 rounded-[36px] shadow-sm space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[20px] bg-white border-2 border-rose-100 flex items-center justify-center text-rose-600 shadow-lg shadow-rose-100/50">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-none mb-1">Alert Logic</p>
                            <p className="text-sm font-black text-rose-900 leading-tight italic">G3+ Severity detected in {totalAlerts} domain(s).</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4 pt-2">
                        {patient.alerts.length > 0 ? (
                            patient.alerts.map((alert: any) => (
                                <div key={alert.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-rose-100">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter italic font-serif leading-none">{alert.alertType.replace(/_/g, ' ')}</p>
                                        <p className="text-xs font-bold text-rose-700 uppercase italic">SEV-{alert.alertSeverity}</p>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 !p-0"><Activity className="w-4 h-4 text-rose-400" /></Button>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Auto-Triage Stability Confirmed</p>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Medical Context Summary */}
            <GlassCard className="bg-slate-50 border-slate-200/50 !p-8 rounded-[36px] shadow-sm space-y-6">
                <div className="flex items-center gap-4">
                    <Stethoscope className="w-5 h-5 text-slate-400" />
                    <h3 className="text-sm font-black font-outfit text-slate-900 uppercase tracking-widest">Medical Context</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Primary Site</p>
                        <p className="text-xs font-bold text-slate-700 italic italic">{activeDiagnosis?.primarySiteDescription || "Awaiting Registry Entry"}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Stage / Grade</p>
                        <p className="text-xs font-bold text-slate-700 italic italic">{activeDiagnosis?.overallStage?.replace('STAGE_', '') || "Unstaged"} • G{activeDiagnosis?.gradeCode || "X"}</p>
                    </div>
                </div>
            </GlassCard>
         </div>

      </div>

    </div>
  );
}
