"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export const AnimatedNumber = ({ value }: { value: number }) => {
    const spring = useSpring(0, { stiffness: 50, damping: 20 });
    const display = useTransform(spring, (current) => Math.floor(current).toLocaleString());

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{display}</motion.span>;
};

export const TerminalStats = ({ label, value, trend, suffix = "" }: { label: string; value: number; trend?: number, suffix?: string }) => {
    return (
        <div className="flex flex-col gap-1 border-r border-[var(--color-border)] last:border-r-0 pr-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
                {label}
            </span>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-bold text-[var(--color-text-primary)]">
                    <AnimatedNumber value={value} />
                    {suffix}
                </span>
                {trend !== undefined && (
                    <span className={cn(
                        "text-[10px] font-mono",
                        trend > 0 ? "text-[var(--color-success)]" : "text-[var(--color-warning)]"
                    )}>
                        {trend > 0 ? "+" : ""}{trend}%
                    </span>
                )}
            </div>
        </div>
    );
};
