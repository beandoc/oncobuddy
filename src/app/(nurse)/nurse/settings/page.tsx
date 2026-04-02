import { User, Bell, Shield, Lock, CreditCard, ChevronRight, Check, AlertCircle } from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Nurse Clinical Settings - Vanguard Terminal.
 * Profile, notification orchestration, and security management.
 */
export default async function NurseSettingsPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.NURSE) redirect("/login");

  const sections = [
    { id: 'profile', icon: User, title: 'Identity & Profile', desc: 'Manage your clinical credentials and public profile.' },
    { id: 'alerts', icon: Bell, title: 'Notification Channels', desc: 'Configure SMS, Email, and Push alert escalation.' },
    { id: 'security', icon: Lock, title: 'Security & Access', desc: 'Manage passwords, MFA, and active sessions.' },
    { id: 'compliance', icon: Shield, title: 'Clinical Compliance', desc: 'License verification and protocol certifications.' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
         <h1 className="text-5xl font-bold font-outfit text-slate-900 tracking-tight">Clinical <span className="text-indigo-600 underline underline-offset-4 decoration-indigo-200">Terminal</span></h1>
         <p className="text-base font-bold text-slate-600">Configuration for {session.user.name} • Oncobuddy Clinical Navigator v2.4</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
         
         {/* Navigation Sidebar */}
         <div className="space-y-4">
            {sections.map((s) => (
                <button key={s.id} className={`w-full text-left p-6 rounded-[28px] border-2 transition-all group flex items-start gap-4 ${s.id === 'profile' ? "bg-white border-indigo-100 shadow-sm shadow-indigo-100/50" : "bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-100"}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${s.id === 'profile' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50"}`}>
                        <s.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className={`text-sm font-bold ${s.id === 'profile' ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"}`}>{s.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{s.desc}</p>
                    </div>
                    {s.id === 'profile' && <Check className="w-4 h-4 text-indigo-600 mt-1" />}
                </button>
            ))}
         </div>

         {/* Settings Content Area */}
         <div className="lg:col-span-2 space-y-10">
            
            {/* Profile Section */}
            <GlassCard className="!p-10 border-slate-100 space-y-10 rounded-xl shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                    <h3 className="text-2xl font-bold font-outfit text-slate-900">Identity <span className="text-slate-400">& Credentials</span></h3>
                    <Button variant="ghost" className="h-10 px-6 font-bold text-[10px] uppercase tracking-wider text-indigo-600 hover:bg-indigo-50">Edit Profile</Button>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center gap-8">
                        <div className="w-24 h-24 rounded-xl bg-slate-100 border-4 border-white shadow-sm relative overflow-hidden flex items-center justify-center">
                            {session.user.image ? <img src={session.user.image} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-slate-300" />}
                        </div>
                        <div className="space-y-1">
                            <p className="text-xl font-bold text-slate-900">{session.user.name}</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-none">Registered Nurse (RN) • ID-44920</p>
                            <label className="inline-flex items-center gap-2 mt-4 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                                <Check className="w-3 h-3" /> Bio-Verify Active
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Professional Email</label>
                            <div className="h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center text-sm font-bold text-slate-900">
                                {session.user.email}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Clinical Extension</label>
                            <div className="h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center text-sm font-bold text-slate-900">
                                +1 (555) 092-1182
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Notification Logic */}
            <GlassCard className="!p-10 border-slate-100 space-y-10 rounded-xl shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                    <h3 className="text-2xl font-bold font-outfit text-slate-900">Alert <span className="text-indigo-600">Escalation</span></h3>
                    <div className="bg-amber-50 text-amber-700 px-4 py-1.5 rounded-2xl flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Urgent Only</span>
                    </div>
                </div>

                <div className="space-y-6">
                    {[
                        { label: 'Critical Symptom SMS', value: true, desc: 'Real-time mobile delivery for G3/G4 alert vectors.' },
                        { label: 'Weekly Summary Report', value: false, desc: 'Compiled longitudinal analysis of patient compliance.' },
                        { label: 'Care Team Chat Sync', value: true, desc: 'Desktop and push notifications for oncologist messages.' }
                    ].map((pref, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white transition-all group">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{pref.label}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-none">{pref.desc}</p>
                            </div>
                            <div className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${pref.value ? "bg-indigo-600" : "bg-slate-200"}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${pref.value ? "left-7" : "left-1"}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>

         </div>
      </div>

    </div>
  );
}
