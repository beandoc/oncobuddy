import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  User, 
  Users, 
  Bell, 
  Shield, 
  Accessibility, 
  Download, 
  ChevronRight, 
  LogOut, 
  Camera, 
  UserPlus, 
  Eye, 
  Settings2,
  Trash2,
  AlertCircle
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Patient Settings & Profile - Screen 7 (Section B9).
 * Central hub for identity management, caregiver access controls, and accessibility.
 * Features DPDPA/GDPR data export and caregiver lifecycle management.
 */
export default async function PatientSettingsPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.PATIENT) redirect("/login");

  const patient = await prisma.patient.findUnique({
    where: { userId: session.user.id },
    include: {
      caregiverAccess: {
        include: { caregiver: { include: { user: true } } }
      }
    }
  });

  if (!patient) return null;

  const NavItem = ({ label, icon: Icon, active }: any) => (
    <button className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border ${active ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}>
       <div className="flex items-center gap-4">
          <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
          <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
       </div>
       <ChevronRight className={`w-4 h-4 ${active ? 'text-indigo-200' : 'text-slate-200'}`} />
    </button>
  );

  return (
    <div className="space-y-12 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      
      {/* Page Header (Section B9) */}
      <div className="space-y-2">
         <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900 italic italic">My <span className="text-indigo-600">Preferences</span></h1>
         <p className="text-sm text-slate-500 font-medium italic italic">Manage your profile, care team access, and accessibility settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
         
         {/* Settings Menu Sub-Nav */}
         <div className="space-y-3">
            <NavItem label="Personal Info" icon={User} active />
            <NavItem label="Caregiver Access" icon={Users} />
            <NavItem label="Notifications" icon={Bell} />
            <NavItem label="Accessibility" icon={Accessibility} />
            <NavItem label="Security & MFA" icon={Shield} />
            
            <div className="pt-8 space-y-4">
               <GlassCard className="!p-6 bg-slate-50 border-slate-100 shadow-none text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">DPDPA Compliance</p>
                  <Button variant="ghost" className="w-full h-11 border-slate-200 text-slate-600 font-bold hover:bg-white text-xs gap-3">
                     <Download className="w-4 h-4" /> Download My Data
                  </Button>
               </GlassCard>
            </div>
         </div>

         {/* Content Area - Personal Info & Caregiver (Section B9) */}
         <div className="lg:col-span-2 space-y-12 h-full">
            
            {/* Identity Block */}
            <div className="space-y-8 h-full">
               <div className="flex items-center gap-8 relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-300 text-5xl relative overflow-hidden group">
                     {session.user.image ? <img src={session.user.image} alt="" className="object-cover w-full h-full" /> : session.user.name?.charAt(0)}
                     <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                        <Camera className="w-8 h-8 text-white" />
                     </div>
                  </div>
                  <div className="space-y-4 flex-1">
                     <div className="space-y-1">
                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Preferred Name</p>
                        <p className="text-2xl font-bold font-outfit text-slate-900 border-b-2 border-slate-50 pb-2 flex items-center justify-between">
                           {patient.preferredName || session.user.name}
                           <button className="text-xs font-black uppercase text-indigo-600 tracking-widest hover:text-slate-950 transition-colors">Edit</button>
                        </p>
                     </div>
                     <p className="text-[10px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full w-fit">
                        <Settings2 className="w-3.5 h-3.5" /> High Precision Data Mode Active
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-1.5 opacity-60">
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Legal Name (Read-Only)</p>
                     <p className="text-sm font-bold text-slate-700 p-4 bg-slate-50 border border-slate-100 rounded-2xl">{session.user.name}</p>
                  </div>
                  <div className="space-y-1.5 opacity-60">
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Medical Record Number (MRN)</p>
                     <p className="text-sm font-bold text-slate-700 p-4 bg-slate-50 border border-slate-100 rounded-2xl">{patient.mrn}</p>
                  </div>
               </div>

               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-4 text-amber-800">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-xs font-medium italic italic leading-tight">Your legal identity and MRN can only be updated by the hospital administrative team to prevent clinical data errors.</p>
               </div>
            </div>

            {/* Caregiver Access Section (Section B9) */}
            <div className="space-y-8 pt-8">
               <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-bold font-outfit text-slate-900 leading-none">Caregiver Access</h3>
                   <Button variant="ghost" className="h-10 px-6 rounded-full border border-slate-100 shadow-sm text-indigo-600 font-bold hover:bg-slate-50 gap-3">
                      <UserPlus className="w-4 h-4" /> Invite New Carer
                   </Button>
               </div>
               
               <div className="space-y-4">
                  {patient.caregiverAccess.map((access: any) => (
                     <GlassCard key={access.id} className="!p-8 group hover:border-indigo-100 transition-all shadow-md bg-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 shadow-sm">
                                 {access.caregiver.user.firstName?.charAt(0)}
                              </div>
                              <div className="space-y-2">
                                 <p className="text-lg font-bold text-slate-900 leading-none">{access.caregiver.user.firstName} {access.caregiver.user.lastName}</p>
                                 <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest italic font-serif leading-none">{access.relationship}</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">{access.accessLevel?.replace(/_/g, ' ')} Access</span>
                                 </div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Last online: Today, 12:45pm</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3 self-end md:self-center">
                              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 border border-slate-100 hover:text-indigo-600"><Settings2 className="w-4 h-4 shadow-sm" /></Button>
                              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 border border-slate-100 hover:text-indigo-600"><Eye className="w-4 h-4 shadow-sm" /></Button>
                              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 border border-rose-100 hover:text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4 shadow-sm" /></Button>
                           </div>
                        </div>
                     </GlassCard>
                  ))}

                  {patient.caregiverAccess.length === 0 && (
                     <div className="p-16 border-2 border-dashed border-slate-100 rounded-[48px] text-center opacity-30 select-none">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-sm font-bold text-slate-400 font-outfit uppercase tracking-[0.2em] italic">No active caregivers on your team yet</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
