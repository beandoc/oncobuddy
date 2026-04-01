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
  Clock
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Patient Secure Messaging - Screen 6 (Section B8).
 * Standard messaging UI optimized for desktop and mobile patterns (Split pane vs Single pane).
 * Features clinical triage selectors (Symptom, Medication) and urgent escalators.
 * Messages automatically route to the assigned Nurse Navigator. (Section B8).
 */
export default async function PatientMessagesPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.PATIENT) redirect("/login");

  const mockThreads = [
    { id: 1, sender: "Nurse Maya", role: "Nurse Navigator", lastMsg: "Hi there, I reviewed your logs...", time: "2h ago", unread: true },
    { id: 2, sender: "Dr. Sharma", role: "Primary Oncologist", lastMsg: "The scan results look promising...", time: "Yesterday", unread: false },
    { id: 3, sender: "Oncobuddy Platfom", role: "System", lastMsg: "Your appointment is confirmed...", time: "3d ago", unread: false },
  ];

  const MsgBubble = ({ sender, text, time, self }: any) => (
    <div className={`max-w-[85%] md:max-w-[70%] space-y-1.5 ${self ? 'self-end' : 'self-start'}`}>
       <p className={`text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 ${self ? 'text-right' : 'text-left'}`}>{sender}</p>
       <div className={`p-5 rounded-[28px] text-sm font-medium leading-relaxed ${self ? 'bg-indigo-600 text-white rounded-br-none shadow-xl shadow-indigo-100' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-sm'}`}>
          {text}
       </div>
       <p className={`text-[10px] font-bold text-slate-300 uppercase ${self ? 'text-right' : 'text-left'}`}>{time}</p>
    </div>
  );

  return (
    <div className="h-[calc(100vh-14rem)] flex flex-col md:flex-row gap-8 selection:bg-indigo-100 selection:text-indigo-900 pb-12 animate-in fade-in duration-500">
      
      {/* Thread List - Split Pane (Section B8) */}
      <div className="w-full md:w-80 flex flex-col gap-6 h-full">
         <div className="flex items-center justify-between border-b-2 border-slate-50 pb-4">
            <h1 className="text-2xl font-bold font-outfit text-slate-900">Messages</h1>
            <button className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"><PlusCircle className="w-5 h-5 shadow-sm" /></button>
         </div>
         
         <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
            <input type="text" placeholder="Search threads..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100/50 rounded-2xl text-sm focus:bg-white focus:ring-1 focus:ring-indigo-100 transition-all font-medium" />
         </div>

         <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-24 md:pb-0">
            {mockThreads.map(t => (
               <div key={t.id} className={`p-5 rounded-[28px] border transition-all cursor-pointer group active:scale-[0.98] ${t.unread ? 'bg-indigo-50/30 border-indigo-100 shadow-lg shadow-indigo-50/20' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                  <div className="flex justify-between items-start mb-2">
                     <p className="text-sm font-black text-slate-900 leading-none group-hover:text-indigo-600">{t.sender}</p>
                     <span className="text-[10px] font-bold text-slate-300 uppercase">{t.time}</span>
                  </div>
                  <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-2 italic italic">{t.role}</p>
                  <p className="text-xs text-slate-500 line-clamp-1 font-medium">{t.lastMsg}</p>
                  {t.unread && <div className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />}
               </div>
            ))}
         </div>
      </div>

      {/* Thread Content (Section B8) */}
      <GlassCard className="flex-1 !p-0 border-slate-100 shadow-2xl relative flex flex-col h-full bg-white md:bg-white/70 overflow-hidden">
         {/* Active Thread Header */}
         <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/95 backdrop-blur-sm relative z-20">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">NM</div>
               <div>
                  <p className="text-base font-bold text-slate-900 leading-none">Nurse Maya</p>
                  <div className="flex items-center gap-2 mt-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Active Navigator • Reply expected in 2h</p>
                  </div>
               </div>
            </div>
            <button className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-colors"><ShieldCheck className="w-6 h-6" /></button>
         </div>

         {/* Chat Area */}
         <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-10 no-scrollbar relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent" />
            <div className="self-center py-2 px-6 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Monday, 10 March</div>
            
            <MsgBubble sender="Nurse Maya" text="Hi there! I saw you reported some mild nausea this morning. Have you tried the breathing exercise from learning module 2?" time="10:30am" />
            <MsgBubble sender="You" text="Yes, I did. It helped a little, but I'm feeling a bit more tired than usual today." time="11:15am" self />
            <MsgBubble sender="Nurse Maya" text="That's perfectly normal during this cycle. Rest is your priority today. I'll flag this to Dr. Sharma for our afternoon huddle just in case." time="11:45am" />
            
            <div className="py-1 px-4 self-end flex items-center gap-2">
               <p className="text-[10px] font-bold text-slate-300 uppercase italic">Read at 11:50am</p>
            </div>
         </div>

         {/* Reply Area (Section B8) */}
         <div className="p-8 bg-white border-t border-slate-100 relative z-20">
            <div className="space-y-6">
               {/* Triage Selector */}
               <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                  {['General', 'Symptom', 'Medication', 'Appointment', 'Urgent'].map(type => (
                     <button key={type} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${type === 'Urgent' ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600'}`}>
                        {type === 'Urgent' && <AlertCircle className="w-3.5 h-3.5 inline mr-1 transition-transform animate-pulse" />}
                        {type}
                     </button>
                  ))}
               </div>

               <div className="relative group">
                  <textarea 
                    placeholder="Type your message to Nurse Maya... (Max 500 chars)" 
                    className="w-full h-32 p-6 bg-slate-50 border-2 border-slate-50 rounded-[40px] text-sm focus:bg-white focus:border-indigo-100/50 transition-all font-medium resize-none placeholder:text-slate-300 no-scrollbar focus:ring-0" 
                  />
                  <div className="absolute bottom-6 right-6 flex items-center gap-4">
                     <button className="p-3 text-slate-300 hover:text-indigo-600 transition-colors"><Paperclip className="w-5 h-5" /></button>
                     <button className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-100 hover:bg-slate-950 transition-all active:scale-95"><Send className="w-5 h-5 ml-0.5" /></button>
                  </div>
               </div>
               
               <div className="flex items-center justify-between px-2">
                  <p className="text-[11px] font-medium text-slate-300 italic italic">This message will be shared with your clinical care team.</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">0 / 500</p>
               </div>
            </div>
         </div>
      </GlassCard>
    </div>
  );
}
