import { auth } from "@/lib/auth";
import { 
  MessageCircle, 
  Search, 
  Send, 
  Paperclip, 
  ChevronRight, 
  ShieldCheck, 
  AlertCircle, 
  PlusCircle, 
  Bell,
  Activity,
  Heart
} from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";

/**
 * Patient Health Broadcast - Screen 6 (Section B8).
 * High-fidelity secure messaging hub for clinical sync.
 * Optimized for high-contrast (slate-950) readability and simplified navigation.
 */
export default async function PatientMessagesPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.PATIENT) redirect("/login");

  const mockThreads = [
    { id: 1, sender: "Nurse Maya", role: "Care Navigator", lastMsg: "Hi! How are you feeling after...", time: "11:45 AM", unread: true },
    { id: 2, sender: "Dr. Sharma", role: "Primary Oncologist", lastMsg: "The scan results look promising...", time: "Yesterday", unread: false },
    { id: 3, sender: "Oncobuddy Platform", role: "Institutional System", lastMsg: "Your appointment is confirmed...", time: "3d ago", unread: false },
  ];

  const MsgBubble = ({ sender, text, time, self }: any) => (
    <div className={`max-w-[85%] md:max-w-[70%] space-y-2 ${self ? 'self-end' : 'self-start'}`}>
       <div className={`flex items-center gap-3 px-2 ${self ? 'flex-row-reverse' : 'flex-row'}`}>
          <p className="text-[10px] font-bold uppercase text-slate-950 tracking-[0.2em]">{sender}</p>
          <div className="w-1 h-1 rounded-full bg-slate-200" />
          <p className="text-[10px] font-bold text-slate-400 uppercase">{time}</p>
       </div>
       <div className={`p-6 rounded-xl text-base font-bold leading-relaxed italic shadow-sm ${self ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-100' : 'bg-white border-2 border-slate-50 text-slate-900 rounded-bl-none shadow-slate-100'}`}>
          {text}
       </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-16rem)] flex flex-col lg:flex-row gap-10 selection:bg-indigo-100 selection:text-indigo-900 animate-in fade-in duration-700">
      
      {/* Thread List - High Fidelity (Section B8) */}
      <div className="w-full lg:w-96 flex flex-col gap-8 h-full">
         <div className="flex items-center justify-between border-b-4 border-slate-100 pb-6 px-2">
            <h1 className="text-3xl font-bold font-outfit text-slate-950">Broadcast</h1>
            <button className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-sm hover:bg-indigo-600 transition-all active:scale-95"><PlusCircle className="w-6 h-6" /></button>
         </div>
         
         <div className="relative group px-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
            <input 
               type="text" 
               placeholder="Search clinical threads..." 
               className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[24px] text-sm font-bold tracking-tight transition-all placeholder:text-slate-400 focus:ring-0" 
            />
         </div>

         <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-24 lg:pb-0 px-1">
            {mockThreads.map(t => (
               <div key={t.id} className={`p-6 rounded-[36px] border-2 transition-all cursor-pointer group relative active:scale-[0.98] ${t.unread ? 'bg-indigo-50/20 border-indigo-100 shadow-sm shadow-indigo-50/30' : 'bg-white border-slate-50 hover:border-slate-100'}`}>
                  <div className="flex justify-between items-start mb-3">
                     <p className="text-base font-bold text-slate-950 leading-none group-hover:text-indigo-600 transition-colors">{t.sender}</p>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.time}</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase text-indigo-600 tracking-[0.3em] mb-3">{t.role}</p>
                  <p className="text-sm text-slate-600 line-clamp-1 font-bold">{t.lastMsg}</p>
                  {t.unread && <div className="absolute top-6 right-6 w-3 h-3 bg-rose-600 rounded-full border-2 border-white shadow-sm" />}
               </div>
            ))}
         </div>
      </div>

      {/* Active Conversation Terminal (Section B8) */}
      <GlassCard className="flex-1 !p-0 border-2 border-slate-100 shadow-[0_45px_90px_rgba(0,0,0,0.06)] relative flex flex-col h-full bg-white rounded-[48px] overflow-hidden">
         {/* Active Triage Header */}
         <div className="p-8 border-b-2 border-slate-50 flex items-center justify-between bg-white/95 backdrop-blur-xl relative z-20">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-[22px] bg-slate-950 flex items-center justify-center font-bold text-white text-2xl shadow-sm transition-transform hover:rotate-3">NM</div>
               <div className="space-y-2">
                  <p className="text-xl font-bold text-slate-950 leading-none">Nurse Maya</p>
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">Primary Navigator • Responsive</p>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full border-2 border-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors shadow-sm"><Activity className="w-6 h-6" /></div>
               <div className="w-12 h-12 rounded-full border-2 border-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors shadow-sm"><ShieldCheck className="w-6 h-6" /></div>
            </div>
         </div>

         {/* Secure Chat Sequence */}
         <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-12 no-scrollbar relative bg-slate-50/30">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-600 via-transparent to-transparent" />
            
            <div className="self-center py-2.5 px-8 bg-white border-2 border-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-6 shadow-sm">Monday, 10 March</div>
            
            <MsgBubble sender="Nurse Maya" text="Hi there! I detected a slight increase in your reported nausea scores this morning. Have you taken the Ondansetron we discussed?" time="10:30 AM" />
            <MsgBubble sender="You" text="Yes, Nurse. I took it about 30 minutes ago. Still feeling a bit 'muzzy' and tired, but the sharpness has gone away." time="11:15 AM" self />
            <MsgBubble sender="Nurse Maya" text="Excellent. That's standard for Day 12 of this cycle. Hydration is key now—try small sips of ginger tea. I'll flag this to the afternoon oncology cluster." time="11:45 AM" />
            
            <div className="py-2 px-6 self-end flex items-center gap-3">
               <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Broadcast Delivered • Read 11:51 AM</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
            </div>
         </div>

         {/* High-Fidelity Response Hub (Section B8) */}
         <div className="p-10 bg-white border-t-2 border-slate-100 relative z-20">
            <div className="space-y-8">
               {/* Triage Categorization Tape */}
               <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                  {['General Inquiry', 'Symptom Triage', 'Medication Help', 'Visit Change', 'Emergency Spike'].map(type => (
                     <button key={type} className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider border-2 transition-all whitespace-nowrap active:scale-95 ${type === 'Emergency Spike' ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white' : 'bg-slate-50 border-slate-50 text-slate-600 hover:border-indigo-100 hover:text-indigo-600'}`}>
                        {type === 'Emergency Spike' && <AlertCircle className="w-4 h-4 inline mr-2 animate-pulse" />}
                        {type}
                     </button>
                  ))}
               </div>

               <div className="relative group">
                  <textarea 
                    placeholder="Initialize clinical response... (Max 500 characters)" 
                    className="w-full h-40 p-8 bg-slate-100/50 border-2 border-transparent focus:border-indigo-100/50 focus:bg-white rounded-xl text-base font-bold tracking-tight transition-all resize-none placeholder:text-slate-400 placeholder:font-bold focus:ring-0 shadow-inner" 
                  />
                  <div className="absolute bottom-8 right-8 flex items-center gap-6">
                     <button className="p-4 text-slate-400 hover:text-indigo-600 transition-transform active:rotate-[-10deg]"><Paperclip className="w-7 h-7" /></button>
                     <button className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-sm hover:bg-indigo-600 transition-all hover:rotate-3 active:scale-90"><Send className="w-7 h-7 ml-1" /></button>
                  </div>
               </div>
               
               <div className="flex items-center justify-between px-4">
                  <p className="text-[11px] font-bold text-slate-400 italic tracking-tight">Your care team monitors this broadcast 24/7 during active treatment.</p>
                  <p className="text-[10px] font-bold text-slate-950 uppercase tracking-wider bg-slate-100 px-4 py-1.5 rounded-full">0 / 500 Safe Units</p>
               </div>
            </div>
         </div>
      </GlassCard>
    </div>
  );
}
