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
            <h1 className="text-5xl font-black font-outfit tracking-tight text-slate-950 italic italic leading-none">
              Clinical <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Care Team</span>
            </h1>
            <p className="text-slate-500 font-medium italic italic opacity-80 pt-2">Institutional roster for {clinician.institution.institutionName}.</p>
         </div>
         <div className="flex items-center gap-4">
            <Button className="h-14 px-8 bg-slate-950 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
               <UserPlus className="w-4 h-4" /> Add Member
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {team.map((member, i) => (
            <GlassCard key={member.id} className="group hover:bg-white border-white/50 hover:border-indigo-100 hover:shadow-xl transition-all cursor-pointer !p-10 rounded-[40px] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 blur-3xl rounded-full translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform" />
               <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 rounded-[24px] bg-slate-100 flex items-center justify-center font-black text-2xl text-slate-400 border-4 border-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all overflow-hidden relative">
                     {member.user.image ? (
                        <Image src={member.user.image} alt={`${member.user.firstName} ${member.user.lastName}`} fill className="object-cover" />
                     ) : (
                        member.user.firstName?.charAt(0)
                     )}
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-xl font-black font-outfit text-slate-900 group-hover:text-indigo-600 transition-colors italic leading-none">{member.user.firstName} {member.user.lastName}</h3>
                     <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest leading-none mt-2 font-serif">{member.specialization.replace(/_/g, ' ')}</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic italic underline decoration-indigo-200">Panel Size</p>
                     <p className="text-lg font-black text-slate-700 italic italic">{member._count.patients} Cases</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic italic underline decoration-indigo-200">Duty Status</p>
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]`} />
                        <span className="text-[10px] font-black uppercase text-slate-500">On Call</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-2 pt-6 border-t border-slate-50">
                  <Button variant="ghost" className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-indigo-50 text-indigo-600 !p-0 transition-transform hover:-translate-y-1 shadow-sm"><PhoneCall className="w-4 h-4" /></Button>
                  <Button variant="ghost" className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-indigo-50 text-indigo-600 !p-0 transition-transform hover:-translate-y-1 shadow-sm"><Mail className="w-4 h-4" /></Button>
                  <Button variant="ghost" className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-indigo-50 text-indigo-600 !p-0 transition-transform hover:-translate-y-1 shadow-sm"><MessageSquare className="w-4 h-4" /></Button>
                  <div className="flex-1 flex justify-end">
                     <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Member Details <ChevronRight className="w-4 h-4" /></p>
                  </div>
               </div>
            </GlassCard>
         ))}
      </div>
    </div>
  );
}
