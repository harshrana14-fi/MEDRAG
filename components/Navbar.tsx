"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const Navbar = () => {
    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl h-20 z-50 flex items-center justify-between px-10 bg-white/90 backdrop-blur-xl border border-slate-100 shadow-xl shadow-teal-500/5 rounded-[2.5rem] transition-colors duration-300">
            <div className="flex items-center gap-12">
                <Link href="/" className="font-display font-bold text-2xl tracking-tighter flex items-center gap-2 text-slate-900">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white text-lg">M</div>
                    MEDRAG<span className="text-teal-500">.</span>
                </Link>

                <div className="hidden lg:flex items-center gap-8">
                    <NavLink href="/" label="Home" />
                    <NavLink href="/plans" label="Insurance Plans" />
                    <NavLink href="#" label="How it Works" />
                    <NavLink href="#" label="Privacy" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/plans">
                    <button
                        className="bg-slate-900 text-white px-8 py-2.5 rounded-full font-bold text-xs shadow-lg hover:bg-slate-800 transition-all uppercase tracking-widest"
                    >
                        View All Plans
                    </button>
                </Link>
            </div>
        </nav>
    );
};

const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
        href={href}
        className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 hover:text-teal-600 transition-all relative group"
    >
        {label}
        <motion.span
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            className="absolute -bottom-2 left-0 h-0.5 bg-teal-500 transition-all duration-300"
        />
    </Link>
);
