import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassCard = ({ children, className, ...props }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "glass-card p-10 overflow-hidden relative group transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:scale-[1.01]",
        className
      )}
      {...props}
    >
      {/* Dynamic Aura Glow (Premium Detail) */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000 ease-out" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000 ease-out" />
      
      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg" | "xl";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-slate-950 text-white hover:bg-black shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:shadow-inner",
      secondary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_20px_40px_rgba(79,70,229,0.2)] active:shadow-inner",
      outline: "border-2 border-slate-100 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 shadow-sm",
      ghost: "text-slate-500 hover:text-slate-950 hover:bg-slate-50 font-black uppercase text-[10px] tracking-widest",
      glass: "glass-surface text-slate-900 font-black shadow-xl border-white/50 hover:bg-white/80 active:scale-95"
    };

    const sizes = {
      sm: "px-4 py-2 text-[10px] font-black uppercase tracking-widest",
      md: "px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em]",
      lg: "px-10 py-5 text-sm font-black uppercase tracking-[0.3em] font-outfit",
      xl: "px-14 py-8 text-base font-black uppercase tracking-[0.4em] font-outfit leading-none",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-[28px] font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform active:scale-95 disabled:opacity-50 inline-flex items-center justify-center gap-3",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
