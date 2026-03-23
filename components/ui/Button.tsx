"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  glow?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", glow = true, children, ...props }, ref) => {
    const variants = {
      primary: "bg-teal-600 text-white hover:bg-teal-500 shadow-[0_0_15px_rgba(0,212,255,0.3)]",
      secondary: "bg-teal-400 text-slate-900 hover:opacity-90",
      outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative px-8 py-3 rounded-full font-display font-bold uppercase tracking-widest text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden active:scale-95",
          variants[variant],
          glow && variant === "primary" && "hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]",
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
