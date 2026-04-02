import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GlassCard, Button } from "@/components/ui/core";
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Send, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  User, 
  Users, 
  Bell, 
  CheckCircle2, 
  Clock,
  Inbox,
  Star,
  Trash2,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { Role } from "@prisma/client";

/**
 * Oncologist Secure Messages - Screen 5.
 * Professional three-pane message center for medical-grade clinical triage.
 * Features clinical triage flags (URGENT), patient context sidebar, and folder-based sorting. (Section 4).
 */
export default async function OncologistMessages() {
  const session = await auth();
  if (!session || session.user.role !== Role.ONCOLOGIST) redirect("/login");

  return (
    <div className="flex h-[calc(100vh-180px)] gap-6 animate-in fade-in duration-700">
      
      {/* Left Pane: Folders & Filters (Section 4) */}
      <div className="w-64 space-y-8 flex flex-col h-full bg-slate-50/30 p-4 rounded-3xl border border-slate-100/50">
         <div className="space-y-1 px-2">
            <h1 className="text-2xl font-bold font-outfit text-slate-900 border-b-2 border-indigo-600 pb-2">Clinical <span className="text-indigo-600">Comms</span></h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2">Internal Secure Triage</p>
         </div>

         <div className="flex-1 space-y-2">
            <button className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-100 transition-all ">
               <div className="flex items-center gap-3">
                  <Inbox className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider leading-none">Inbox</span>
               </div>
               <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded-full">12</span>
            </button>
            <button className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
               <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider leading-none">Urgent Breaks</span>
               </div>
               <span className="text-[9px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">3</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 transition-all">
               <Users className="w-4 h-4" />
               <span className="text-[11px] font-bold uppercase tracking-wider leading-none">Nurse Teams</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 transition-all">
               <Star className="w-4 h-4" />
               <span className="text-[11px] font-bold uppercase tracking-wider leading-none">Starred</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 transition-all">
               <Trash2 className="w-4 h-4" />
               <span className="text-[11px] font-bold uppercase tracking-wider leading-none">Archive</span>
            </button>
         </div>

         <div className="pt-8 space-y-4">
            <GlassCard className="!p-4 bg-indigo-50/50 border-indigo-100 shadow-none text-center">
               <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-3">Shift Continuity</p>
               <Button className="w-full h-10 bg-indigo-600 text-white font-bold text-[9px] uppercase tracking-wider shadow-sm shadow-indigo-100">Hand-off Report</Button>
            </GlassCard>
         </div>
      </div>

      {/* Middle Pane: Message Threads (Section 4) */}
      <div className="w-80 border border-slate-100 rounded-3xl bg-white flex flex-col h-full shadow-inner shadow-slate-50">
         <div className="p-6 border-b border-slate-50 space-y-4">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-3.5 h-3.5" />
               <input type="text" placeholder="Search comms..." className="w-full h-10 pl-10 pr-4 bg-slate-50/50 border border-transparent focus:border-indigo-100 focus:bg-white rounded-xl text-xs font-bold transition-all outline-none" />
            </div>
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-bold uppercase text-slate-300 tracking-wider">Sorted: Recent</span>
               <Filter className="w-3.5 h-3.5 text-slate-300" />
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto no-scrollbar py-2">
            {[
               { name: 'Nurse Maya J.', text: 'Regarding labs for J. Doe', time: '12:45 PM', unread: true, urgent: true, p: 'John Doe' },
               { name: 'Dr. Sarah Smith', text: 'Accepted: Registry Share', time: '11:20 AM', unread: false, urgent: false, p: 'Research' },
               { name: 'Nurse David T.', text: 'Toxicity check screen 14', time: 'Yesterday', unread: true, urgent: false, p: 'Sadie Adler' },
               { name: 'Nurse Maya J.', text: 'Shift Handoff Checklist', time: 'Monday', unread: false, urgent: false, p: 'System' }
            ].map((msg, idx) => (
               <div key={idx} className={`p-4 mx-3 rounded-2xl transition-all cursor-pointer group flex items-start gap-3 mt-1 ${msg.unread ? 'bg-indigo-50/30' : 'hover:bg-slate-50'}`}>
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center font-bold text-slate-400 text-sm group-hover:scale-105 transition-all shadow-sm">
                     {msg.name.charAt(msg.name.indexOf('.') + 1) || msg.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                     <div className="flex items-center justify-between">
                        <p className="text-[11px] font-bold text-slate-900 leading-none">{msg.name}</p>
                        <span className="text-[8px] font-bold text-slate-400 whitespace-nowrap">{msg.time}</span>
                     </div>
                     <p className="text-[10px] font-bold text-indigo-600 truncate">Patient: {msg.p}</p>
                     <p className={`text-[10px] leading-tight truncate ${msg.unread ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>{msg.text}</p>
                  </div>
                  {msg.urgent && <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-sm shadow-rose-100 mt-1" />}
               </div>
            ))}
         </div>
      </div>

      {/* Right Pane: Message View & Context (Section 4) */}
      <div className="flex-1 flex flex-col h-full bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
         {/* Conversation Header */}
         <div className="p-6 border-b border-slate-100/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-100">M</div>
               <div>
                  <h3 className="text-base font-bold font-outfit text-slate-900 italic leading-none">Nurse Maya J.</h3>
                  <div className="flex items-center gap-2 mt-1.5 leading-none">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                     <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">On-Shift Active</span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <Button variant="ghost" size="sm" className="h-10 w-10 p-0 border border-slate-50 hover:bg-slate-50"><Bell className="w-4 h-4" /></Button>
               <Button variant="ghost" size="sm" className="h-10 w-10 p-0 border border-slate-50 hover:bg-slate-50"><Star className="w-4 h-4 text-amber-400" /></Button>
               <Button variant="ghost" size="sm" className="h-10 w-10 p-0 border border-slate-50 hover:bg-slate-50"><MoreVertical className="w-4 h-4" /></Button>
            </div>
         </div>

         {/* Messages Area - Visual Representation */}
         <div className="flex-1 overflow-y-auto p-10 space-y-10 scroll-smooth no-scrollbar">
            {/* System Status Tip - Section 4 */}
            <div className="flex justify-center flex-col items-center gap-3">
               <div className="h-px w-32 bg-slate-100" />
               <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em] font-serif">Today, October 12th</p>
            </div>

            <div className="flex items-start gap-4 max-w-[80%]">
               <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-300">M</div>
               <div className="space-y-2">
                  <div className="p-5 rounded-[28px] rounded-tl-none bg-indigo-50 text-[13px] text-slate-700 leading-relaxed font-outfit shadow-sm hover:translate-x-1 transition-all">
                     Hi Dr. {session.user.name?.split(' ').pop()}, patient John Doe is reporting increasing nausea since last night. I've marked as Grade 3 in the proxy dashboard. Do you want to adjust the hydration protocol before his appt?
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider pl-2">Maya J. • 12:45 PM</p>
               </div>
            </div>

            <div className="flex items-start gap-4 max-w-[80%] ml-auto flex-row-reverse">
               <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-white shadow-lg">Dr</div>
               <div className="space-y-2 text-right">
                  <div className="p-5 rounded-[28px] rounded-tr-none bg-slate-900 text-[13px] text-white leading-relaxed font-outfit shadow-sm">
                     Copy that Maya. Let's start the IV fluid protocol 30 mins early. I'll review his labs now and sign-off the adjustment during my 10am rounds.
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider pr-2">You • 12:50 PM</p>
               </div>
            </div>

            {/* Contextual Patient Notification Card - Section 4 */}
            <div className="mx-auto w-full max-w-sm">
               <GlassCard className="!p-4 bg-amber-50/50 border-amber-200/50 shadow-none flex items-center gap-4">
                  <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-600"><AlertTriangle className="w-4 h-4" /></div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-amber-800 uppercase tracking-[0.2em]">Breach Awareness</p>
                     <p className="text-[11px] text-amber-700 font-medium">John Doe has a pending lab breach since 9:14am.</p>
                  </div>
               </GlassCard>
            </div>
         </div>

         {/* Quick Actions & Input Area */}
         <div className="p-6 pt-0 space-y-6">
            <div className="flex items-center gap-3">
               <Button variant="outline" className="h-9 px-6 rounded-full border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-50 shadow-sm transition-all focus:ring-4 ring-indigo-50">Hydration Adj</Button>
               <Button variant="outline" className="h-9 px-6 rounded-full border-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 shadow-sm transition-all">Sign Labs</Button>
               <Button variant="outline" className="h-9 px-6 rounded-full border-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 shadow-sm transition-all">Notify Floor</Button>
            </div>
            
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100/50 flex items-center gap-4 focus-within:bg-white focus-within:border-indigo-200 transition-all shadow-inner group">
               <button className="p-3.5 rounded-2xl hover:bg-white text-slate-400 transition-all hover:scale-110 active:scale-95"><Paperclip className="w-5 h-5" /></button>
               <input type="text" placeholder="Consult with care team..." className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] font-medium font-outfit placeholder:text-slate-300 outline-none" />
               <Button className="h-12 w-12 p-0 bg-indigo-600 hover:bg-slate-950 text-white rounded-[20px] shadow-sm shadow-indigo-100 transition-all active:scale-90 flex items-center justify-center">
                  <Send className="w-5 h-5" />
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
