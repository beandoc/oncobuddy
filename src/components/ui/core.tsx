import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassCard = ({ children, className, ...props }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "glass-card p-6 overflow-hidden relative group",
        className
      )}
      {...props}
    >
      {/* Subtle hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90",
      secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/20",
      outline: "border-2 border-secondary text-secondary hover:bg-secondary/10",
      ghost: "text-primary hover:bg-primary/5",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3.5 text-lg font-bold",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-full font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50 inline-flex items-center justify-center",
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
