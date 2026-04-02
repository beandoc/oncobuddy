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
  User,
  Scissors,
  Zap,
  ClipboardList
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
        include: { 
          treatments: { 
            orderBy: { treatmentStartDate: 'desc' } 
          } 
        }
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
  const treatments = activeDiagnosis?.treatments || [];
  const activeTreatment = treatments.find((t: any) => t.treatmentStatus === "ONGOING") || treatments[0];
  const surgeryTreatments = treatments.filter((t: any) => t.treatmentType === "SURGERY");
  const radiationTreatments = treatments.filter((t: any) => t.treatmentType === "RADIATION");
  
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
            <Link href={session.user.role === Role.ONCOLOGIST ? "/oncologist/patients" : "/nurse/patients"} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase text-slate-500 tracking-wider hover:text-indigo-600 transition-colors group px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
               <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Panel
            </Link>
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 border-4 border-white shadow-sm overflow-hidden">
                    {patient.user.image ? (
                        <img src={patient.user.image} className="w-full h-full object-cover" />
                    ) : (
                        patient.preferredName?.charAt(0) || patient.user.firstName?.charAt(0)
                    )}
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-5xl font-bold font-outfit text-slate-900 tracking-tight italic leading-none">{patient.preferredName || `${patient.user.firstName} ${patient.user.lastName}`}</h1>
                        <span className={`px-4 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${totalAlerts > 0 ? "bg-rose-50 text-rose-600 border border-rose-100 animate-pulse" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                            {totalAlerts > 0 ? "Critical Triage" : "Clinical Stability"}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                        <p className="text-[11px] font-bold uppercase text-slate-400 tracking-[0.2em] font-serif">MRN: {patient.mrn}</p>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <p className="text-[11px] font-bold uppercase text-slate-400 tracking-[0.2em] font-serif">Aet: {age} Years</p>
                    </div>
                </div>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <Button className="h-16 px-8 bg-slate-950 text-white rounded-[28px] font-bold text-xs uppercase tracking-wider shadow-sm hover:scale-105 transition-all flex items-center gap-3">
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
               <h3 className="text-2xl font-bold font-outfit text-slate-900">Symptom <span className="text-indigo-600">Trajectory</span></h3>
               <Link href="#" className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider hover:underline">Full Longitudinal Study</Link>
            </div>

            <div className="space-y-6">
              {patient.symptomLogs.length > 0 ? (
                patient.symptomLogs.map((log: any, idx: number) => (
                  <GlassCard key={log.id} className="hover:bg-white border-white/50 hover:border-indigo-100 transition-all !p-8 group rounded-xl">
                     <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-50">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                              <LucideHistory className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:rotate-[-12deg] transition-all" />
                           </div>
                           <div className="space-y-0.5">
                              <p className="text-sm font-bold font-outfit text-slate-900">Clinical Submission {idx + 1}</p>
                              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{new Date(log.logDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                           <CheckCircle2 className="w-3 h-3" /> Validated
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {log.entries.map((symp: any) => (
                            <div key={symp.id} className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{symp.ctcaeTermName.replace(/_/g, ' ')}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xl font-bold font-outfit ${symp.severity >= 3 ? "text-rose-600" : "text-slate-900"}`}>{symp.severity}</span>
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
                    <h4 className="text-xl font-bold font-outfit text-slate-400">Historical Context Missing</h4>
                    <p className="text-sm text-slate-400 mt-2">No symptom log submissions detected for this MRN sequence.</p>
                </div>
              )}
            </div>
         </div>

         {/* Right Column: Case IQ & Intelligence */}
         <div className="space-y-10">
            {/* Treatment Cycle HUD */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold font-outfit text-slate-950">Case <span className="text-indigo-600 underline decoration-indigo-200">IQ</span></h3>
                <GlassCard className="bg-slate-950 border-0 shadow-sm !p-8 rounded-[36px] space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] font-serif">Regimen Intensity</p>
                            <h4 className="text-2xl font-bold text-white">Protocol VII-B</h4>
                        </div>
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold uppercase text-slate-500 tracking-wider font-serif">
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
                            <p className="text-xs text-slate-400 font-medium underline decoration-indigo-800">ECOG Status: <span className="text-white font-bold">1 (Baseline)</span></p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Threshold & Alert Center */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold font-outfit text-slate-950">Triage <span className="text-rose-600">Thresholds</span></h3>
                <GlassCard className="bg-rose-50 border-rose-100 !p-8 rounded-[36px] shadow-sm space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[20px] bg-white border-2 border-rose-100 flex items-center justify-center text-rose-600 shadow-lg shadow-rose-100/50">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider leading-none mb-1">Alert Logic</p>
                            <p className="text-sm font-bold text-rose-900 leading-tight">G3+ Severity detected in {totalAlerts} domain(s).</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4 pt-2">
                        {patient.alerts.length > 0 ? (
                            patient.alerts.map((alert: any) => (
                                <div key={alert.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-rose-100">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter font-serif leading-none">{alert.alertType.replace(/_/g, ' ')}</p>
                                        <p className="text-xs font-bold text-rose-700 uppercase">SEV-{alert.alertSeverity}</p>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 !p-0"><Activity className="w-4 h-4 text-rose-400" /></Button>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Auto-Triage Stability Confirmed</p>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Multidisciplinary: Surgery HUD (Section 734) */}
            {surgeryTreatments.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold font-outfit text-slate-950">Surgical <span className="text-emerald-600 underline decoration-emerald-200">Context</span></h3>
                    {surgeryTreatments.map((surg: any) => (
                        <GlassCard key={surg.id} className="bg-emerald-50 border-emerald-100 !p-8 rounded-[36px] shadow-sm space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-[20px] bg-white border-2 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-100/50">
                                    <Scissors className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider leading-none mb-1">Post-Op Record</p>
                                    <p className="text-sm font-bold text-emerald-950 leading-tight">{surg.surgeryName}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4 border-t border-emerald-100/50 pt-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider">Surgeon</p>
                                    <p className="text-[11px] font-bold text-slate-700">{surg.surgeonName || "Awaiting Data"}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider">Post-Op Instructions</p>
                                    <p className="text-xs text-slate-600 leading-relaxed font-outfit">{surg.postOpInstructions || "Follow standard G2 recovery protocol."}</p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-emerald-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-emerald-400" />
                                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">Follow-up Visit</span>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600">{surg.postOpFollowupDate ? new Date(surg.postOpFollowupDate).toLocaleDateString() : "TBD"}</span>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}

            {/* Multidisciplinary: Radiotherapy HUD (Section 734) */}
            {radiationTreatments.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold font-outfit text-slate-950">Radiation <span className="text-amber-600 underline decoration-amber-200">Status</span></h3>
                    {radiationTreatments.map((rad: any) => (
                        <GlassCard key={rad.id} className="bg-amber-50/50 border-amber-100 !p-8 rounded-[36px] shadow-sm space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-[20px] bg-white border-2 border-amber-100 flex items-center justify-center text-amber-600 shadow-lg shadow-amber-100/50">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider leading-none mb-1">Session Tracking</p>
                                    <p className="text-sm font-bold text-amber-950 leading-tight">{rad.radiationSequence || "Active Radiation"}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-bold uppercase text-amber-800 tracking-wider">
                                    <span>Fraction Progress</span>
                                    <span>{rad.fractionsDelivered || 0} / {rad.totalFractionsPlanned || 25}</span>
                                </div>
                                <div className="h-1.5 w-full bg-amber-100/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500" style={{ width: `${((rad.fractionsDelivered || 0) / (rad.totalFractionsPlanned || 1)) * 100}%` }} />
                                </div>
                                {rad.isConcurrentWithChemo && (
                                    <p className="text-[9px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" /> Concurrent with Chemotherapy
                                    </p>
                                )}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}

            {/* Medical Context Summary */}
            <GlassCard className="bg-slate-50 border-slate-200/50 !p-8 rounded-[36px] shadow-sm space-y-6">
                <div className="flex items-center gap-4">
                    <Stethoscope className="w-5 h-5 text-slate-400" />
                    <h3 className="text-sm font-bold font-outfit text-slate-900 uppercase tracking-wider">Medical Context</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Primary Site</p>
                        <p className="text-xs font-bold text-slate-700">{activeDiagnosis?.primarySiteDescription || "Awaiting Registry Entry"}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Stage / Grade</p>
                        <p className="text-xs font-bold text-slate-700">{activeDiagnosis?.overallStage?.replace('STAGE_', '') || "Unstaged"} • G{activeDiagnosis?.gradeCode || "X"}</p>
                    </div>
                </div>
            </GlassCard>
         </div>

      </div>

    </div>
  );
}
