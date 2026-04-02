import { MessageSquare, Search, Filter, Send, User, ChevronRight, CheckCircle2, Clock, MoreHorizontal, Phone, Video } from "lucide-react";
import { GlassCard, Button } from "@/components/ui/core";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Nurse Clinical Communication Terminal.
 * High-fidelity messaging architecture for patient and oncologist sync.
 */
export default async function NurseMessagesPage() {
  const session = await auth();
  if (!session || session.user.role !== Role.NURSE) redirect("/login");

  const threads = [
    { id: 1, name: "John Doe", lastMsg: "The nausea hasn't subsided after the new meds.", time: "12m ago", unread: 2, status: "Patient", priority: "High" },
    { id: 2, name: "Dr. Smith (Onco)", lastMsg: "Please review the biopsy for MRN-992.", time: "1h ago", unread: 0, status: "Oncologist", priority: "Routine" },
    { id: 3, name: "Sarah Williams", lastMsg: "Appointment confirmed for next Tuesday.", time: "3h ago", unread: 1, status: "Patient", priority: "Routine" },
    { id: 4, name: "Care Team (Breast Unit)", lastMsg: "Emergency breach for Sarah Smith resolved.", time: "5h ago", unread: 0, status: "Team", priority: "Emergency" },
  ];

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-180px)] flex flex-col gap-8 animate-in fade-in duration-700 pb-10">
      
      {/* Header Architecture */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 flex-shrink-0">
         <div className="space-y-1">
            <h1 className="text-5xl font-black font-outfit tracking-tight text-slate-900 italic italic">Clinical <span className="text-indigo-600 underline underline-offset-8 decoration-indigo-100">Sync</span></h1>
            <p className="text-base font-bold text-slate-600 italic mt-2">Managing {threads.reduce((acc, t) => acc + t.unread, 0)} unread clinical threads for {session.user.name}.</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <input type="text" placeholder="Search threads or patients..." className="h-12 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] uppercase font-black tracking-widest focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all outline-none w-64" />
            </div>
            <Button className="h-12 px-8 bg-slate-950 text-white font-black text-[11px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
               <MessageSquare className="w-5 h-5 mr-2" /> New Broadcast
            </Button>
         </div>
      </div>

      {/* Main Communication Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-12 overflow-hidden">
         
         {/* Threads Sidebar */}
         <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic italic">Active Channels</h3>
               <Filter className="w-4 h-4 text-slate-300" />
            </div>
            <div className="space-y-3">
               {threads.map((thread) => (
                  <button key={thread.id} className={`w-full text-left p-6 rounded-[32px] border-2 transition-all flex items-start gap-4 group ${thread.unread > 0 ? "bg-white border-indigo-100 shadow-xl shadow-indigo-100/50" : "bg-slate-50/20 border-transparent hover:bg-white hover:border-slate-100"}`}>
                     <div className="relative flex-shrink-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all ${thread.unread > 0 ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200" : "bg-slate-100 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600"}`}>
                           {thread.name.charAt(0)}
                        </div>
                        {thread.unread > 0 && <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-600 text-white text-[9px] font-black italic rounded-full border-2 border-white flex items-center justify-center shadow-lg animate-bounce">{thread.unread}</div>}
                     </div>
                     <div className="flex-1 space-y-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                           <p className={`text-sm font-black italic transition-colors leading-none uppercase ${thread.unread > 0 ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"}`}>{thread.name}</p>
                           <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">{thread.time}</p>
                        </div>
                        <p className={`text-[10px] font-bold truncate transition-colors italic ${thread.unread > 0 ? "text-slate-600" : "text-slate-400 group-hover:text-slate-500"}`}>{thread.lastMsg}</p>
                        <div className="flex items-center gap-2 pt-2">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${thread.status === 'Oncologist' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>{thread.status}</span>
                            {thread.priority === 'High' && <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest">Urgent</span>}
                        </div>
                     </div>
                  </button>
               ))}
            </div>
         </div>

         {/* Active Chat Window Architecture */}
         <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
            <GlassCard className="flex-1 !p-0 border-slate-100 flex flex-col overflow-hidden rounded-[40px] shadow-sm">
               {/* Chat Header */}
               <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-xl">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-2xl shadow-indigo-100 relative">
                        J
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full shadow-lg" />
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-xl font-black font-outfit text-slate-900 italic uppercase">John Doe</h4>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Patient Active Now</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional MRN: 982312</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <Button variant="ghost" className="w-12 h-12 !p-0 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all border border-slate-100"><Phone className="w-5 h-5" /></Button>
                     <Button variant="ghost" className="w-12 h-12 !p-0 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all border border-slate-100"><Video className="w-5 h-5" /></Button>
                     <Button variant="ghost" className="w-12 h-12 !p-0 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all border border-slate-100"><MoreHorizontal className="w-5 h-5" /></Button>
                  </div>
               </div>

               {/* Chat Body */}
               <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-50/20 custom-scrollbar">
                  <div className="max-w-[80%] space-y-2">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">John Doe • 12:45 PM</p>
                     <div className="p-6 bg-white border border-slate-100 rounded-[28px] rounded-tl-none shadow-sm">
                        <p className="text-xs font-bold text-slate-700 italic leading-relaxed">
                           Hi Nurse, it is been about 4 hours since I took the anti-emetic, but the nausea is still quite severe. Should I take another dose or wait?
                        </p>
                     </div>
                  </div>

                  <div className="max-w-[80%] ml-auto space-y-2 flex flex-col items-end">
                     <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mr-1 leading-none">You • 12:48 PM</p>
                     <div className="p-6 bg-indigo-600 text-white rounded-[28px] rounded-tr-none shadow-2xl shadow-indigo-100/50">
                        <p className="text-xs font-black italic leading-relaxed">
                           Hello John. I am reviewing your recent symptom logs now. Please wait while I consult with Dr. Smith regarding a dosage override. 
                        </p>
                     </div>
                  </div>
               </div>

               {/* Chat Input Interface */}
               <div className="p-8 bg-white border-t border-slate-100 flex items-center gap-6">
                  <div className="flex-1 relative flex items-center">
                     <input type="text" placeholder="Type clinical response or use blueprint..." className="w-full h-16 pl-8 pr-20 bg-slate-50 border border-slate-100 rounded-[24px] text-[11px] font-black uppercase tracking-widest focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all outline-none" />
                     <button className="absolute right-4 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-950 transition-colors">
                        <Send className="w-4 h-4" />
                     </button>
                  </div>
                  <Button variant="outline" className="h-16 px-8 rounded-[24px] border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50">Templates</Button>
               </div>
            </GlassCard>
         </div>

      </div>
    </div>
  );
}
