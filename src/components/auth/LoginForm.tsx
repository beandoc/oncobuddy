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
    <div className="w-full max-w-sm space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-bold font-outfit text-slate-900 tracking-tight leading-none">Credentials Required</h2>
           <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">TLS ENCRYPTED</span>
           </div>
        </div>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">
           Enter your professional MRN or institutional email. Security protocols are active.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AnimatePresence>
          {error && (
            <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider ml-1">Institutional ID</label>
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 w-4 h-4 transition-colors" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-12 pr-6 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-bold placeholder:text-slate-300 focus:border-indigo-600 outline-none transition-all shadow-sm"
              placeholder="vmeta@oncobuddy.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between ml-1">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Clinical Key</label>
            <a href="#" className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide hover:text-slate-950 transition-colors">Forgot?</a>
          </div>
          <div className="relative group">
            <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 w-4 h-4 transition-colors" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-12 pr-6 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-bold placeholder:text-slate-200 focus:border-indigo-600 outline-none transition-all shadow-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg hover:bg-slate-950 transition-all flex items-center justify-center gap-3" 
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>LOG IN <Fingerprint className="w-5 h-5" /></>
          )}
        </Button>

        <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-2">
          New Stakeholder? <a href="/register" className="text-indigo-600 font-bold hover:underline underline-offset-4 ml-1">Request Token</a>
        </p>
      </form>
    </div>
  );
}
