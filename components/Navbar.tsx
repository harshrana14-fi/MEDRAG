"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const Navbar = () => {
    return (
        <nav className="absolute top-0 left-0 right-0 h-24 z-50 flex items-center justify-between px-6 md:px-20">
            <div className="flex items-center gap-12">
                <Link href="/" className="font-display font-bold text-2xl tracking-tighter flex items-center gap-2 text-slate-900">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white text-lg">M</div>
                    MEDOC<span className="text-teal-500">.</span>
                </Link>

                <div className="hidden lg:flex items-center gap-8">
                    <NavLink href="/" label="Home" />
                    <NavLink href="#" label="How it Works" />
                    <NavLink href="#" label="Privacy" />
                    <NavLink href="#" label="Security" />
                </div>
            </div>

            <Link href="/assistant">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-[var(--color-primary)] px-8 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-slate-50 transition-all uppercase tracking-widest"
                >
                    Start Analysis
                </motion.button>
            </Link>
        </nav>
    );
};

const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
        href={href}
        className="text-sm font-medium text-white/90 hover:text-white transition-colors relative group"
    >
        {label}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full" />
    </Link>
);
