import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Activity, 
  Calendar, 
  MessageSquare, 
  ChevronRight, 
  ShieldCheck, 
  Award,
  MoreVertical,
  History,
  ClipboardList,
  GraduationCap,
  Heart,
  Users2,
  FileSearch,
  AlertTriangle,
  Mail,
  Smartphone,
  Info,
  Clock
} from "lucide-react";
import { Role } from "@prisma/client";
import Image from "next/image";

/**
 * Full Patient Profile - Screen 3.
 * Complete clinical picture including registry, symptoms, education, and team.
 */
export default async function PatientProfilePage({ params }: { params: { patientId: string } }) {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  const patient = await prisma.patient.findUnique({
    where: { id: params.patientId },
    include: {
      diagnoses: {
        include: {
           treatments: { orderBy: { treatmentStartDate: 'desc' } }
        },
        orderBy: { diagnosisDate: 'desc' },
        take: 1
      },
      symptomLogs: {
        include: { entries: true },
        orderBy: { logDate: 'desc' },
        take: 10
      },
      appointments: {
        orderBy: { scheduledDate: 'desc' },
        take: 10
      },
      caregiverAccess: {
        include: { caregiver: { include: { user: true } } }
      },
      clinicalTeam: {
        include: { clinician: { include: { user: true } } }
      }
    }
  });

  if (!patient) redirect("/oncologist/patients");

  const latestDiagnosis = patient.diagnoses[0];
  const activeTreatment = latestDiagnosis?.treatments.find(t => t.treatmentStatus === "ONGOING");

  const TabButton = ({ label, icon: Icon, active, badge }: any) => (
    <button className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${active ? "border-indigo-600 text-indigo-600 bg-indigo-50/10" : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}>
       <Icon className="w-4 h-4" />
       {label}
       {badge && <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-[9px] text-slate-500 ml-1">{badge}</span>}
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Patient Top Status Strip (Section 5) */}
      <div className="sticky top-16 -mx-8 px-8 py-3 bg-white/90 backdrop-blur-md border-b border-slate-100 z-20 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
               <span className="text-sm font-bold">{patient.preferredName || "Anonymous Patient"}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest">
               ICD-10: {latestDiagnosis?.icd10Code || "--"}
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
               Stage {latestDiagnosis?.overallStage.replace('STAGE_', '') || "TBD"}
            </div>
         </div>
         <div className="flex items-center gap-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Navigator: <span className="text-slate-900">Nurse Team Active</span></p>
            <div className="w-[1px] h-4 bg-slate-200" />
            <Button variant="ghost" size="sm" className="h-8 !px-3 text-indigo-600 hover:bg-indigo-50 font-bold">Quick Triage</Button>
         </div>
      </div>

      {/* Patient Header Card (Section 5) */}
      <GlassCard className="!p-8 overflow-hidden relative border-slate-100 shadow-md">
         <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-48 h-48 text-indigo-600" />
         </div>
         <div className="flex flex-col xl:flex-row gap-12 relative z-10">
            <div className="flex items-center gap-8 min-w-[340px]">
               <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center font-bold text-3xl text-slate-400 ring-4 ring-white shadow-xl overflow-hidden relative">
                  {patient.profilePhotoUrl ? (
                    <Image src={patient.profilePhotoUrl} alt="" fill className="object-cover" />
                  ) : (
                    <span>{patient.preferredName?.charAt(0) || "P"}</span>
                  )}
               </div>
               <div className="space-y-1">
                  <h2 className="text-3xl font-bold font-outfit tracking-tight">{patient.preferredName || "Patient"}</h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     MRN {patient.mrn} • ABHA {patient.uhid || "NOT-LINKED"}
                  </p>
                  <p className="text-sm font-medium text-slate-500">
                     {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years • {patient.gender} • {patient.bloodGroup}
                  </p>
               </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 border-l border-slate-100 pl-4 xl:pl-12">
               <div className="space-y-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Primary Oncology Data</p>
                  <div className="space-y-1">
                     <p className="text-lg font-bold text-indigo-900 leading-tight">{latestDiagnosis?.icd10Description || "Registry entry pending..."}</p>
                     <p className="text-xs text-slate-500 font-medium italic">{latestDiagnosis?.morphologyDescription}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400 pt-2">
                     <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Dx: {latestDiagnosis ? new Date(latestDiagnosis.diagnosisDate).toLocaleDateString() : "--"}</span>
                     <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-400" /> HER2 Positive</span>
                  </div>
               </div>
               <div className="space-y-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Care Pathway</p>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-white">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">On-Treatment Progress</span>
                        <span className="text-xs font-bold text-indigo-600">Cycle 4 of 6</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[66%]" />
                     </div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Next Cycle: Apr 14, 2026</p>
                  </div>
               </div>
            </div>
         </div>
      </GlassCard>

      {/* Tab Navigation (Section 5) */}
      <div className="border-b border-slate-100 flex items-center overflow-x-auto no-scrollbar">
         <TabButton label="Clinical Summary" icon={ClipboardList} active />
         <TabButton label="Symptom Logs" icon={Activity} badge={patient.symptomLogs.length} />
         <TabButton label="Education" icon={GraduationCap} />
         <TabButton label="Rehabilitation" icon={Heart} />
         <TabButton label="Appointments" icon={Calendar} />
         <TabButton label="Registry & FHIR" icon={FileSearch} />
         <TabButton label="Care Team" icon={Users2} />
      </div>

      {/* Tab Content Placeholder in Phase 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2 space-y-8">
            <GlassCard className="!p-0 overflow-hidden border-slate-100">
               <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                     <ClipboardList className="w-5 h-5 text-indigo-600" />
                     Clinical Staging & Registry
                  </h3>
                  <Button variant="ghost" size="sm" className="h-8 !px-3 font-bold text-[10px] uppercase">Edit Staging</Button>
               </div>
               <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="text-center md:border-r border-slate-50 last:border-0 pl-1">
                     <p className="text-4xl font-black font-outfit text-indigo-600 mb-1">{latestDiagnosis?.clinicalT || "T2"}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tumor Size (cT)</p>
                  </div>
                  <div className="text-center md:border-r border-slate-50 last:border-0">
                     <p className="text-4xl font-black font-outfit text-indigo-600 mb-1">{latestDiagnosis?.clinicalN || "N1"}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lymph Nodes (cN)</p>
                  </div>
                  <div className="text-center md:border-r border-slate-50 last:border-0">
                     <p className="text-4xl font-black font-outfit text-indigo-600 mb-1">{latestDiagnosis?.clinicalM || "M0"}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metastasis (cM)</p>
                  </div>
               </div>
            </GlassCard>

            <GlassCard className="!p-0 border-slate-100">
               <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold flex items-center gap-2">
                     <History className="w-5 h-5 text-indigo-600" />
                     Clinical History & Notes
                  </h3>
               </div>
               <div className="p-0">
                  <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                     <div className="flex gap-4">
                        <textarea className="flex-1 min-h-[80px] p-4 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:ring-1 focus:ring-indigo-100" placeholder="Add clinical note (not visible to patient)..." />
                        <div className="flex flex-col gap-2">
                           <Button variant="secondary" className="bg-indigo-600 h-9 font-bold text-xs">Save Note</Button>
                           <Button variant="outline" className="h-9 font-bold text-xs border-slate-200">Patient-Visible</Button>
                        </div>
                     </div>
                  </div>
                  <div className="divide-y divide-slate-50">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="p-6 hover:bg-slate-50/50 transition-colors">
                           <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                 <span className="text-xs font-bold text-slate-900 leading-none">Clinical Review Node</span>
                                 <span className="text-[9px] font-bold text-slate-300 uppercase leading-none">Dr. Oncologist Team</span>
                              </div>
                              <span className="text-[10px] text-slate-300 font-bold uppercase">Yesterday, 14:12</span>
                           </div>
                           <p className="text-sm text-slate-600 leading-relaxed">
                              Patient tolerated Cycle 4 well. Minimal infusion-related symptoms reported. Monitoring HER2 markers for next review.
                           </p>
                        </div>
                     ))}
                  </div>
               </div>
            </GlassCard>
         </div>

         <div className="space-y-8">
            <GlassCard className="!p-0 border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-sm">Quick Contacts</h3>
                </div>
                <div className="p-4 space-y-3">
                   <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100"><Smartphone className="w-4 h-4 text-indigo-600" /></div>
                         <p className="text-xs font-bold">Primary Phone</p>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{patient.primaryPhone}</span>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100"><Mail className="w-4 h-4 text-indigo-600" /></div>
                         <p className="text-xs font-bold">Health ID (ABHA)</p>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{patient.uhid || "Not Linked"}</span>
                   </div>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-slate-900 border-t border-indigo-100 dark:border-slate-800">
                   <Button variant="secondary" className="w-full bg-indigo-600 hover:bg-slate-950 font-bold text-xs h-10 gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Send Private MSG
                   </Button>
                </div>
            </GlassCard>

            <GlassCard className="bg-rose-50 border-rose-100 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center gap-3 text-rose-900 dark:text-rose-400 mb-4">
                   <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                   <h3 className="font-bold text-sm">Emergency Alert Policy</h3>
                </div>
                <p className="text-[11px] text-rose-800/70 dark:text-rose-400/50 leading-relaxed font-medium">
                   This patient has elected for <span className="font-bold">URGENT</span> escalation triggers. Any symptom Grade 3+ will notify the on-call Nurse Navigator and your Clinical Portal immediately.
                </p>
                <div className="mt-4 pt-4 border-t border-rose-100 flex items-center justify-between">
                   <span className="text-[9px] font-bold text-rose-600 uppercase tracking-widest leading-none">Status: Standard</span>
                   <Button variant="ghost" size="sm" className="h-7 text-[9px] font-bold uppercase text-rose-600 hover:bg-white leading-none">Modify Policy</Button>
                </div>
            </GlassCard>
         </div>
      </div>
    </div>
  );
}
