'use client';

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/core";
import { ShieldCheck, Mail, Lock, Loader2, AlertCircle, Fingerprint, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Vanguard Clinical Authentication Form.
 * Professional-grade input vectors for stakeholder identification.
 * Features high-contrast typography and reactive focus states. (Section 12, 20).
 */
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Authorization failed. Ensure your institutional credentials are correct.");
      setIsLoading(false);
    } else {
      router.push("/"); // Will trigger the dynamic redirect in the root middleware/landing
    }
  };

  return (
    <div className="w-full max-w-sm space-y-10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="text-3xl font-black font-outfit text-slate-950 tracking-tight leading-none italic">Credentials Required</h2>
           <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">TLS ENCRYPTED</span>
           </div>
        </div>
        <p className="text-sm text-slate-500 font-medium italic leading-relaxed">
           Enter your professional MRN or institutional email. Unauthorised access is prohibited. (Section 12).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence>
          {error && (
            <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100 italic"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Institutional ID</label>
          <div className="relative group">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 w-4 h-4 transition-colors" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-16 pl-14 pr-6 rounded-2xl border-2 border-slate-50 bg-slate-50/50 text-slate-900 text-sm font-bold placeholder:text-slate-200 focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-sm"
              placeholder="vmeta@oncobuddy.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Clinical Key</label>
            <a href="#" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-slate-950 transition-colors">Forgot PIN?</a>
          </div>
          <div className="relative group">
            <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 w-4 h-4 transition-colors" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-16 pl-14 pr-6 rounded-2xl border-2 border-slate-50 bg-slate-50/50 text-slate-900 text-sm font-bold placeholder:text-slate-200 focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-16 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3" 
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>AUTHORIZE ENTRY <Fingerprint className="w-5 h-5" /></>
          )}
        </Button>

        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pt-4">
          New Stakeholder? <a href="/register" className="text-indigo-600 font-black hover:underline underline-offset-4 ml-1">Request Token</a>
        </p>
      </form>
    </div>
  );
}
