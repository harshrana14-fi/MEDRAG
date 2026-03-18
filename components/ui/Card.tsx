"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
}

export const Card = ({ children, className, title, subtitle, icon }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
                "glass-panel relative p-6 overflow-hidden group",
                "border-l-2 border-l-[var(--color-border)] hover:border-l-[var(--color-primary)] transition-colors duration-300",
                className
            )}
        >
            {/* Corner accents */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--color-border)] group-hover:border-[var(--color-primary)] transition-colors" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--color-border)] group-hover:border-[var(--color-primary)] transition-colors" />

            {title && (
                <div className="flex items-center gap-3 mb-4">
                    {icon && <div className="text-[var(--color-primary)]">{icon}</div>}
                    <div>
                        <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-text-primary)]">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-mono mt-0.5">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            )}
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};
