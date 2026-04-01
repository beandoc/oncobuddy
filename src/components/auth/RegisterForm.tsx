'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, GlassCard } from "@/components/ui/core";
import { ShieldCheck, User, Mail, Lock, Phone, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { registerPatient } from "@/app/actions/auth";

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    primaryPhone: "",
    password: "",
    confirmPassword: "",
    consentGiven: false,
  });
  const router = useRouter();

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.primaryPhone) {
        setError("Please fill in all required demographic fields.");
        return;
      }
      setError(null);
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!formData.consentGiven) {
      setError("You must provide clinical consent to use the platform.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const submitFormData = new FormData();
    submitFormData.append("firstName", formData.firstName);
    submitFormData.append("lastName", formData.lastName);
    submitFormData.append("email", formData.email);
    submitFormData.append("primaryPhone", formData.primaryPhone);
    submitFormData.append("password", formData.password);
    submitFormData.append("consentGiven", String(formData.consentGiven));

    const result = await registerPatient({}, submitFormData);

    if (result.error) {
      const errorMsg = Object.values(result.error).flat().join(". ");
      setError(errorMsg || "Registration failed. Please try again.");
      setIsLoading(false);
    } else {
      setIsLoading(false);
      router.push("/login?registered=true");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="w-full max-w-xl mx-auto overflow-hidden relative">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
          <motion.div 
            className="h-full bg-gradient-to-r from-secondary to-accent" 
            initial={{ width: "33%" }} 
            animate={{ width: step === 1 ? "33%" : "100%" }} 
          />
        </div>

        <div className="flex flex-col items-center mb-8 pt-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4 shadow-lg">
            <ShieldCheck className="text-white w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold font-outfit">Create Patient Account</h2>
          <p className="text-slate-500 text-sm mt-1">Step {step} of 2: {step === 1 ? "Demographics" : "Security & Consent"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-600 text-sm border border-rose-100 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                      placeholder="John"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                      placeholder="you@hospital.com"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Primary Phone (E.164)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="tel"
                      required
                      value={formData.primaryPhone}
                      onChange={(e) => setFormData({...formData, primaryPhone: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <Button 
                  type="button" 
                  className="md:col-span-2 py-3 mt-4" 
                  variant="secondary" 
                  onClick={handleNextStep}
                >
                  Continue to Security
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-secondary" />
                    Clinical Consent (v2.1)
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-height-32 overflow-y-auto pr-2">
                    I hereby consent to the processing of 
                    my PHI (Personal Health Information) by Oncobuddy for the purpose of symptom management, clinical education, and treatment coordination. I understand that my data is protected under HIPAA/DPDPA standards and will only be shared with my explicitly authorized clinical team and caregivers.
                  </p>
                  <label className="flex items-center gap-3 mt-4 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      required
                      checked={formData.consentGiven}
                      onChange={(e) => setFormData({...formData, consentGiven: e.target.checked})}
                      className="w-5 h-5 rounded-md border-slate-300 text-secondary focus:ring-secondary cursor-pointer transition-all"
                    />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-secondary transition-colors">
                      I agree to the clinical consent and platform terms.
                    </span>
                  </label>
                </div>

                <div className="flex gap-4 pt-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="flex-1" 
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    variant="secondary" 
                    className="flex-2" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Registration
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-slate-500 pt-2">
            Already have an account? <a href="/login" className="text-secondary font-semibold hover:underline">Log in</a>
          </p>
        </form>
      </GlassCard>
    </motion.div>
  );
}
