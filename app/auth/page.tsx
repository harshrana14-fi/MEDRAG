"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Mail, Lock, User as UserIcon, Activity } from "lucide-react";

function AuthContent() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const { login: saveAuth } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const endpoint = isLogin ? "/auth/login" : "/auth/signup";
            const body = isLogin 
                ? new URLSearchParams({ username: email, password }) 
                : JSON.stringify({ email, password, full_name: fullName });
            
            const response = await fetch(`http://localhost:8000${endpoint}`, {
                method: "POST",
                headers: isLogin ? {
                    "Content-Type": "application/x-www-form-urlencoded",
                } : {
                    "Content-Type": "application/json",
                },
                body: body,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Something went wrong");
            }

            if (isLogin) {
                saveAuth(data.access_token, { email });
                router.push(redirectTo);
            } else {
                setIsLogin(true);
                setError("Account created! Please log in.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Abstract Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px] -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -ml-40 -mb-40" />

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden relative z-10 border border-slate-100">
                
                {/* Left Side: Branding/Visual */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.15),transparent)]" />
                    
                    <Link href="/" className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-xl font-black">M</div>
                        <span className="font-display font-bold text-2xl tracking-tighter">MEDRAG<span className="text-teal-500">.</span></span>
                    </Link>

                    <div className="relative z-10">
                        <h1 className="text-5xl font-display font-bold leading-tight mb-6">
                            Intelligence for your <span className="text-teal-400">Health.</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                            Join thousands of users who decode complex insurance policies with AI.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="flex -space-x-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                                    <UserIcon size={16} className="text-slate-400" />
                                </div>
                            ))}
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Trusted by 10k+ families
                        </p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-10 lg:p-20 relative">
                    <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-teal-600 transition-colors mb-12">
                        <ArrowLeft size={14} /> Back to Home
                    </Link>

                    <div className="mb-10">
                        <h2 className="text-4xl font-display font-bold text-slate-950 mb-3 tracking-tight">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">
                            {isLogin 
                                ? "Enter your credentials to access your hub." 
                                : "Sign up to start analyzing your custom documents."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-medium"
                                        placeholder="e.g. John Doe"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-medium"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-rose-50 text-rose-600 text-[11px] font-bold rounded-2xl border border-rose-100 text-center uppercase tracking-widest"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-teal-600 transition-all disabled:opacity-50 mt-4 active:scale-95"
                        >
                            {loading ? "PROCESSING..." : (isLogin ? "SIGN IN" : "CREATE ACCOUNT")}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-teal-600 hover:text-teal-500 transition-colors ml-1"
                            >
                                {isLogin ? "SIGN UP" : "SIGN IN"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-teal-500 font-black tracking-widest uppercase">Initializing...</div>}>
            <AuthContent />
        </Suspense>
    );
}
