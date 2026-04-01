'use client';

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, GlassCard } from "@/components/ui/core";
import { ShieldCheck, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

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
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
    } else {
      router.push("/dashboard"); // Default, will be handled by layout guards
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4 shadow-lg">
            <ShieldCheck className="text-white w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold font-outfit">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-1">Access your oncology care hub</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-600 text-sm border border-rose-100 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <a href="#" className="text-xs text-secondary hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full py-3 mt-2" 
            variant="secondary" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : "Sign In"}
          </Button>

          <p className="text-center text-sm text-slate-500 pt-4">
            New to Oncobuddy? <a href="/register" className="text-secondary font-semibold hover:underline">Register now</a>
          </p>
        </form>
      </GlassCard>
    </motion.div>
  );
}
