import { auth } from "@/lib/auth";
import { 
  MessageSquare, 
  Search, 
  PlusCircle, 
  AlertCircle, 
  ChevronRight, 
  Send, 
  Paperclip, 
  ShieldCheck,
  UserCircle2,
  Clock,
  Info
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Caregiver Secure Messaging - Screen 4 (Section C6).
 * Standard messaging UI with clinical access gates (VIEW_ONLY vs VIEW_AND_LOG).
 * Features triage selectors and mandatory "Patient awareness" banners. (C6).
 */
export default async function CaregiverMessagesPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.CAREGIVER) redirect("/login");

  // Mock patient context for Jane Doe
  const patient = {
    preferredName: "Jane Doe",
    accessLevel: "VIEW_AND_LOG" as const, // C6 access gate
  };

  const mockThreads = [
    { id: 1, sender: "Nurse Maya", role: "Nurse Navigator", lastMsg: "Hi, how is Jane feeling today?", time: "2h ago", unread: true },
    { id: 2, sender: "Oncobuddy Platform", role: "System", lastMsg: "Appointment confirmation...", time: "3d ago", unread: false },
  ];

  const MsgBubble = ({ sender, text, time, self }: any) => (
    <div className={`max-w-[85%] md:max-w-[70%] space-y-1.5 ${self ? 'self-end' : 'self-start'}`}>
       <p className={`text-[9px] font-black uppercase text-slate-400 tracking-widest px-1 ${self ? 'text-right' : 'text-left'}`}>{sender}</p>
       <div className={`p-5 rounded-[28px] text-sm font-medium leading-relaxed ${self ? 'bg-teal-600 text-white rounded-br-none shadow-xl shadow-teal-100' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-sm'}`}>
          {text}
       </div>
       <p className={`text-[9px] font-bold text-slate-300 uppercase ${self ? 'text-right' : 'text-left'}`}>{time}</p>
    </div>
  );

  return (
    <div className="h-[calc(100vh-14rem)] flex flex-col md:flex-row gap-8 selection:bg-teal-100 selection:text-teal-900 pb-12 animate-in fade-in duration-500">
      
      {/* Thread List - Split Pane (Section C6) */}
      <div className="w-full md:w-80 flex flex-col gap-6 h-full">
         <div className="flex items-center justify-between border-b-2 border-teal-50 pb-4">
            <h1 className="text-2xl font-bold font-outfit text-slate-900 italic italic">Support Chats</h1>
            <button className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"><PlusCircle className="w-5 h-5 shadow-sm" /></button>
         </div>
         
         <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
            <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100/50 rounded-2xl text-sm focus:bg-white focus:ring-1 focus:ring-teal-100 transition-all font-medium placeholder:italic" />
         </div>

         <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-24 md:pb-0">
            {mockThreads.map(t => (
               <div key={t.id} className={`p-5 rounded-[28px] border transition-all cursor-pointer group active:scale-[0.98] ${t.unread ? 'bg-teal-50/30 border-teal-100 shadow-lg shadow-teal-50/20' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                  <div className="flex justify-between items-start mb-2">
                     <p className="text-sm font-black text-slate-900 leading-none group-hover:text-teal-600">{t.sender}</p>
                     <span className="text-[10px] font-bold text-slate-300 uppercase">{t.time}</span>
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] mb-2 leading-none italic italic">{t.role}</p>
                  <p className="text-xs text-slate-500 line-clamp-1 font-medium italic">{t.lastMsg}</p>
                  {t.unread && <div className="absolute top-4 right-4 w-2 h-2 bg-teal-500 rounded-full border-2 border-white" />}
               </div>
            ))}
         </div>
      </div>

      {/* Thread Content (Section C6) */}
      <GlassCard className="flex-1 !p-0 border-slate-100 shadow-2xl relative flex flex-col h-full bg-white md:bg-white/70 overflow-hidden">
         {/* Active Thread Header */}
         <div className="p-6 border-b border-slate-50 flex flex-col bg-white/95 backdrop-blur-sm relative z-20">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 ring-4 ring-slate-50">NM</div>
                  <div>
                     <p className="text-base font-bold text-slate-900 leading-none">Nurse Maya</p>
                     <p className="text-[9px] font-black text-teal-600 uppercase tracking-widest mt-2 leading-none">{patient.preferredName}'s Coordinator</p>
                  </div>
               </div>
               <button className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-teal-600 transition-colors"><ShieldCheck className="w-6 h-6" /></button>
            </div>
            
            <div className="px-5 py-2.5 bg-teal-50/50 rounded-2xl border border-teal-100/50 flex items-center gap-3">
               <Info className="w-3.5 h-3.5 text-teal-600" />
               <p className="text-[9px] font-bold text-teal-800/60 uppercase tracking-widest leading-none">Messages you send here are also visible to {patient.preferredName} and the care team.</p>
            </div>
         </div>

         {/* Chat Area */}
         <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-10 no-scrollbar relative">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500 via-transparent to-transparent" />
            
            <MsgBubble sender="Nurse Maya" text={`Hi there, I saw your proxy log for ${patient.preferredName.split(' ')[0]} yesterday. Is she doing better this morning?`} time="10:30am" />
            <MsgBubble sender="You" text="She's still a bit nauseous, but the meditation seemed to help. We're about to head to the lab for blood work." time="11:15am" self />
            <MsgBubble sender="Nurse Maya" text="Great, the lab techs are expecting you. Let me know if the nausea increases after the blood draw." time="11:45am" />
         </div>

         {/* Reply Area (Section C6) */}
         <div className="p-8 bg-white border-t border-slate-100 relative z-20">
            {patient.accessLevel === 'VIEW_AND_LOG' ? (
               <div className="space-y-6">
                  {/* Triage Selector */}
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                     {['General', 'Symptom Concern', 'Appointment', 'Emotional Support', 'Urgent'].map(type => (
                        <button key={type} className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${type === 'Urgent' ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100 hover:scale-105' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-teal-200 hover:text-teal-600'}`}>
                           {type === 'Urgent' && <AlertCircle className="w-3.5 h-3.5 inline mr-1 transition-transform animate-pulse" />}
                           {type}
                        </button>
                     ))}
                  </div>

                  <div className="relative group">
                     <textarea 
                       placeholder={`Type your message to Nurse Maya... (Max 500 characters)`} 
                       className="w-full h-32 p-7 bg-slate-50 border-2 border-slate-50 rounded-[40px] text-sm focus:bg-white focus:border-teal-100/50 transition-all font-medium resize-none placeholder:text-slate-300 no-scrollbar focus:ring-0 placeholder:italic italic" 
                     />
                     <div className="absolute bottom-6 right-6 flex items-center gap-4">
                        <button className="p-3 text-slate-300 hover:text-teal-600 transition-colors"><Paperclip className="w-5 h-5" /></button>
                        <button className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-teal-100 hover:bg-slate-950 transition-all active:scale-95"><Send className="w-5 h-5 ml-0.5" /></button>
                     </div>
                  </div>
                  
                  <div className="flex items-center justify-between px-2">
                     <p className="text-[10px] font-medium text-rose-500/80 italic italic max-w-[70%]">Emergency? Do not use this chat. Call emergency services or the clinic line: 022-2222-2222</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 font-mono">0 / 500</p>
                  </div>
               </div>
            ) : (
               <div className="p-8 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 text-center space-y-4">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-400 italic leading-relaxed px-6">
                     You currently have view-only access. To send messages to the care team, ask {patient.preferredName} to update your access level in their profile settings.
                  </p>
               </div>
            )}
         </div>
      </GlassCard>
    </div>
  );
}
