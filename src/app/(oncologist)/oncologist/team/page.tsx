import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { Users2, UserPlus, PhoneCall, MessageSquare, Mail, Activity, ShieldCheck, ChevronRight } from "lucide-react";
import { Role } from "@prisma/client";
import Image from "next/image";

export default async function TeamPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  const clinician = await prisma.clinician.findUnique({
    where: { userId: session.user.id },
    include: { institution: true }
  });

  if (!clinician) return null;

  const team = await prisma.clinician.findMany({
    where: { institutionId: clinician.institutionId },
    include: {
      user: true,
      _count: { select: { patients: { where: { endedAt: null } } } }
    },
    take: 12
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
         <div className="space-y-2">
            <h1 className="text-4xl font-bold font-outfit tracking-tight text-slate-900 leading-tight">
              Clinical <span className="text-indigo-600">Care Team</span>
            </h1>
            <p className="text-slate-500 font-medium pt-1 text-base">Institutional roster for {clinician.institution.institutionName}.</p>
         </div>
         <div className="flex items-center gap-4">
            <Button className="h-12 px-8 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-wide shadow-lg hover:bg-indigo-600 transition-all flex items-center gap-3">
               <UserPlus className="w-4 h-4" /> Add Member
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {team.map((member, i) => (
            <GlassCard key={member.id} className="group hover:bg-white border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all cursor-pointer !p-6 rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 blur-3xl rounded-full translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform" />
               <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-2xl text-slate-400 border-2 border-white shadow-md transition-transform group-hover:scale-105 overflow-hidden relative">
                     {member.user.image ? (
                        <Image src={member.user.image} alt={`${member.user.firstName} ${member.user.lastName}`} fill className="object-cover" />
                     ) : (
                        member.user.firstName?.charAt(0)
                     )}
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="text-lg font-bold font-outfit text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{member.user.firstName} {member.user.lastName}</h3>
                     <p className="text-[11px] font-bold uppercase text-indigo-400 tracking-wider leading-none mt-1">{member.specialization.replace(/_/g, ' ')}</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 border-b border-indigo-100 pb-1">Panel Size</p>
                     <p className="text-lg font-bold text-slate-800">{member._count.patients} Cases</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 border-b border-indigo-100 pb-1">Duty Status</p>
                     <div className="flex items-center gap-2 pt-0.5">
                        <div className={`w-2 h-2 rounded-full bg-emerald-500 shadow-sm`} />
                        <span className="text-[11px] font-bold uppercase text-slate-500 tracking-tight">On Call</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-2 pt-6 border-t border-slate-50">
                  <Button variant="ghost" className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 !p-0 transition-transform hover:-translate-y-0.5 shadow-sm"><PhoneCall className="w-4 h-4" /></Button>
                  <Button variant="ghost" className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 !p-0 transition-transform hover:-translate-y-0.5 shadow-sm"><Mail className="w-4 h-4" /></Button>
                  <Button variant="ghost" className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 !p-0 transition-transform hover:-translate-y-0.5 shadow-sm"><MessageSquare className="w-4 h-4" /></Button>
                  <div className="flex-1 flex justify-end">
                     <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">Member Profile <ChevronRight className="w-3.5 h-3.5" /></p>
                  </div>
               </div>
            </GlassCard>
         ))}
      </div>
    </div>
  );
}
