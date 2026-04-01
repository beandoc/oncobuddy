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
  AlertCircle,
  FileText,
  Clock,
  Smartphone
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Caregiver Settings & Profile - Screen 6 (Section C8).
 * Central hub for caregiver identity and patient connection management.
 * Features clinical access transparency statements and caregiver logout/removal requests.
 */
export default async function CaregiverSettingsPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.CAREGIVER) redirect("/login");

  const caregiver = await prisma.caregiver.findUnique({
    where: { userId: session.user.id },
    include: {
      patients: {
        include: { patient: { include: { user: true } } }
      }
    }
  });

  if (!caregiver) return null;

  const NavItem = ({ label, icon: Icon, active }: any) => (
    <button className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border ${active ? 'bg-teal-600 border-teal-500 text-white shadow-xl shadow-teal-100' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}>
       <div className="flex items-center gap-4">
          <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
          <span className="text-sm font-bold uppercase tracking-widest leading-none">{label}</span>
       </div>
       <ChevronRight className={`w-4 h-4 ${active ? 'text-teal-200' : 'text-slate-200'}`} />
    </button>
  );

  return (
    <div className="space-y-12 selection:bg-teal-100 selection:text-teal-900 pb-20">
      
      {/* Page Header (Section C8) */}
      <div className="space-y-2">
         <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900 italic italic">My <span className="text-teal-600">Preferences</span></h1>
         <p className="text-sm text-slate-500 font-medium italic italic">Manage your profile information and active patient connections.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
         
         {/* Settings Menu Sub-Nav */}
         <div className="space-y-3">
            <NavItem label="Caregiver Info" icon={User} active />
            <NavItem label="Patient Connections" icon={Users} />
            <NavItem label="Notifications" icon={Bell} />
            <NavItem label="Security & MFA" icon={Shield} />
            <NavItem label="Privacy & Data" icon={Eye} />
            
            <div className="pt-8 space-y-4">
               <button className="w-full h-14 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center gap-3 text-rose-600 text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-all shadow-sm active:scale-95">
                  <LogOut className="w-4 h-4" /> Log Out
               </button>
            </div>
         </div>

         {/* Content Area - Caregiver Management (Section C8) */}
         <div className="lg:col-span-2 space-y-12 h-full">
            
            {/* Identity & Contact Info */}
            <div className="space-y-8 h-full pb-8 border-b border-slate-100/50">
               <div className="flex items-center gap-8 relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-300 text-5xl relative overflow-hidden group">
                     {session.user.image ? <img src={session.user.image} alt="" className="object-cover w-full h-full" /> : session.user.name?.charAt(0)}
                     <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                        <Camera className="w-8 h-8 text-white" />
                     </div>
                  </div>
                  <div className="space-y-4 flex-1">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Your Display Name</p>
                        <p className="text-2xl font-bold font-outfit text-slate-900 border-b-2 border-slate-50 pb-2 flex items-center justify-between">
                           {session.user.name}
                           <button className="text-[10px] font-black uppercase text-teal-600 tracking-widest hover:text-slate-950 transition-colors">Edit</button>
                        </p>
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Contact Phone</p>
                           <p className="text-sm font-bold text-slate-700 mt-1 italic italic underline decoration-slate-100 group-hover:decoration-teal-200 transition-all underline-offset-4">+91 98888 88888</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Email Address</p>
                           <p className="text-sm font-bold text-slate-700 mt-1 italic italic underline decoration-slate-100 group-hover:decoration-teal-200 transition-all underline-offset-4 opacity-70 cursor-not-allowed">{session.user.email}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Patient Connections Section (Section C8) */}
            <div className="space-y-8 pt-4">
               <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-bold font-outfit text-slate-900 italic italic leading-none underline decoration-slate-100 underline-offset-8">Patient Connections</h3>
                   <div className="p-1 px-4 bg-teal-50 rounded-full border border-teal-100">
                      <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest animate-pulse leading-none italic italic">Verification Synchronized</p>
                   </div>
               </div>
               
               <div className="space-y-4">
                  {caregiver.patients.map((connection: any) => (
                     <GlassCard key={connection.id} className="!p-8 group hover:border-teal-100 transition-all shadow-md bg-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 shadow-sm transition-all group-hover:scale-110 group-hover:bg-white group-hover:border-teal-100">
                                 {connection.patient.preferredName?.charAt(0) || connection.patient.user.firstName?.charAt(0)}
                              </div>
                              <div className="space-y-2">
                                 <p className="text-lg font-bold text-slate-900 leading-none">{connection.patient.preferredName || `${connection.patient.user.firstName} ${connection.patient.user.lastName}`}</p>
                                 <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black uppercase text-teal-600 tracking-widest italic font-serif leading-none">{connection.relationship}</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                    <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${connection.accessLevel === 'VIEW_AND_LOG' ? 'text-teal-600' : 'text-slate-400'}`}>
                                       {connection.accessLevel === 'VIEW_AND_LOG' ? 'Edit Access' : 'View Only'}
                                    </span>
                                 </div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Access granted: {new Date(connection.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3 self-end md:self-center">
                              <Button variant="ghost" size="sm" className="h-11 w-11 p-0 border border-slate-100 hover:text-teal-600 hover:bg-teal-50 shadow-sm"><Settings2 className="w-4.5 h-4.5" /></Button>
                              <Button variant="ghost" size="sm" className="h-11 w-11 p-0 border border-slate-100 hover:text-teal-600 hover:bg-teal-50 shadow-sm"><Eye className="w-4.5 h-4.5" /></Button>
                              <div className="w-px h-8 bg-slate-100 mx-2" />
                              <Button variant="ghost" size="sm" className="h-11 w-11 p-0 border border-rose-100 hover:text-rose-600 hover:bg-rose-50 shadow-sm transition-colors"><Trash2 className="w-4.5 h-4.5" /></Button>
                           </div>
                        </div>
                     </GlassCard>
                  ))}

                  {caregiver.patients.length === 0 && (
                     <div className="p-16 border-2 border-dashed border-slate-100 rounded-[48px] text-center opacity-30 select-none">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-sm font-bold text-slate-400 font-outfit uppercase tracking-[0.2em] italic">No active patient connections found</p>
                     </div>
                  )}
               </div>
            </div>

            {/* Access & Privacy Transparency Statement (Section C8) */}
            <GlassCard className="!p-10 border-slate-100 shadow-xl bg-slate-50/50 space-y-6 relative overflow-hidden group">
               <div className="absolute right-0 top-0 bottom-0 w-32 bg-indigo-500/5 group-hover:scale-125 transition-transform duration-1000" />
               <div className="flex items-center gap-4 relative z-10">
                  <Shield className="w-6 h-6 text-teal-600" />
                  <h4 className="text-xl font-bold font-outfit text-slate-900 border-b border-teal-100 pb-2">Transparency & Privacy</h4>
               </div>
               <div className="space-y-4 relative z-10">
                  <p className="text-xs font-bold text-slate-700 italic italic leading-relaxed">
                     Your access is limited to coordination data. You can see Jane's appointments and simplified health summaries, but her private text logs and clinical review notes are reserved for her and the oncologist team. 
                  </p>
                  <p className="text-xs font-bold text-slate-700 italic italic leading-relaxed">
                     This balance ensures Jane feels safe sharing her full experience with the clinical team while empowering you with the logistical info you need to support her effectively.
                  </p>
               </div>
               <div className="pt-8 space-y-3 relative z-10">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Account Deletion</p>
                  <button className="text-[10px] font-black uppercase text-rose-500 tracking-widest hover:underline decoration-rose-300 underline-offset-4 decoration-2 decoration-solid decoration-skip-ink-none italic italic">Request account anonymization and removal</button>
               </div>
            </GlassCard>
         </div>
      </div>
    </div>
  );
}
