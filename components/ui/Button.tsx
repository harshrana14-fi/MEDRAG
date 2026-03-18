"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    glow?: boolean;
    children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", glow = true, children, ...props }, ref) => {
        const variants = {
            primary: "bg-[var(--color-primary)] text-[var(--color-background)] hover:bg-[var(--color-primary-dark)] shadow-[0_0_15px_rgba(0,212,255,0.3)]",
            secondary: "bg-[var(--color-secondary)] text-white hover:opacity-90",
            outline: "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-surface)] text-[var(--color-text-primary)]",
            ghost: "bg-transparent hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
        };

        return (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                ref={ref}
                className={cn(
                    "relative px-8 py-3 rounded-full font-display font-bold uppercase tracking-widest text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
                    variants[variant],
                    glow && variant === "primary" && "hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]",
                    className
                )}
                {...props}
            >
                {/* Animated border effect */}
                {variant === "primary" && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                    >
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-white opacity-20" />
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white opacity-20" />
                    </motion.div>
                )}
                <span className="relative z-10">{children}</span>
            </motion.button>
        );
    }
);

Button.displayName = "Button";
