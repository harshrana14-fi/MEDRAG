"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Send,
    Paperclip,
    FileText,
    Activity,
    ShieldCheck,
    Plus,
    ChevronRight,
    Info,
    User,
    Heart,
    Stethoscope,
    History as LucideHistory,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";

export default function AssistantPage() {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [documents, setDocuments] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchDocuments = async () => {
        try {
            const res = await fetch("http://localhost:8000/documents");
            if (res.ok) {
                const data = await res.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                await fetchDocuments();
                alert(`Successfully uploaded ${file.name}`);
            } else {
                const error = await res.json();
                alert(`Upload failed: ${error.error}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed. Make sure backend is running.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMessage = { role: "user", content: query, timestamp: time };
        setMessages((prev) => [...prev, userMessage]);
        setQuery("");
        setIsTyping(true);

        try {
            const res = await fetch("/api/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            if (res.ok) {
                const data = await res.json();
                const aiMessage = {
                    role: "assistant",
                    content: data.answer,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sources: data.sources
                };
                setMessages((prev) => [...prev, aiMessage]);
            } else {
                const error = await res.json();
                throw new Error(error.error);
            }
        } catch (error: any) {
            const errorMessage = {
                role: "assistant",
                content: `Error: ${error.message || "Failed to reach medoc intelligence engine. Ensure backend is online."}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-10 px-6">
            <Navbar />

            <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
                {/* Header Branding for Assistant */}
                <div className="flex items-center justify-between mb-8 bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-100">
                            <Activity size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">MEDOC <span className="text-teal-500 font-medium">Assistant</span></h2>
                            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Neural Health Intelligence Active</p>
                        </div>
                    </div>
                    <div className="hidden md:flex gap-12 items-center">
                        <div className="flex flex-col items-end">
                            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-1">Session Protocol</p>
                            <p className="font-mono text-sm font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">MD-8832-SEC</p>
                        </div>
                        <div className="h-10 w-[1px] bg-slate-100" />
                        <div className="flex flex-col items-end text-sm">
                            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-1">Security</p>
                            <div className="flex items-center gap-2 text-green-600 font-bold">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                256-BIT AES
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">

                    {/* Left: Enhanced Document Manager */}
                    <aside className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-display font-bold text-slate-900 flex items-center gap-3 text-xl">
                                    <div className="p-2 bg-teal-50 rounded-xl">
                                        <FileText size={20} className="text-teal-600" />
                                    </div>
                                    Analytic Records
                                </h3>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="w-10 h-10 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-100 flex items-center justify-center disabled:opacity-50"
                                >
                                    <Plus size={22} className={isUploading ? "animate-spin" : ""} />
                                </button>
                            </div>

                            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                                {documents.length > 0 ? (
                                    documents.map((doc, idx) => (
                                        <DocCard key={idx} name={doc.filename} date={new Date(doc.upload_date).toLocaleDateString()} size="PDF" />
                                    ))
                                ) : (
                                    <div className="text-center py-20 text-slate-400 grayscale opacity-40">
                                        <LucideHistory size={48} className="mx-auto mb-4" />
                                        <p className="text-xs font-bold uppercase tracking-widest">No records analyzed</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Storage Used</span>
                                    <span className="text-teal-600">{Math.min(documents.length * 10, 100)}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(documents.length * 10, 100)}%` }} />
                                </div>
                                <div className="p-4 bg-teal-50/50 rounded-2xl flex items-start gap-3 border border-teal-100/50">
                                    <ShieldCheck size={18} className="text-teal-600 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-teal-800 leading-relaxed font-bold uppercase tracking-wide">
                                        End-to-end encrypted session. Your data is never used for training.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right: Premium AI Assistant */}
                    <section className="lg:col-span-8 flex flex-col h-full">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar" ref={scrollRef}>
                                <AnimatePresence>
                                    {messages.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-teal-100 rounded-full blur-2xl opacity-50 scale-150 animate-pulse" />
                                                <div className="relative w-24 h-24 rounded-[2rem] bg-teal-500 flex items-center justify-center text-white shadow-2xl shadow-teal-200">
                                                    <Stethoscope size={40} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h2 className="text-3xl font-display font-bold text-slate-900">Medical Intelligence</h2>
                                                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                                                    Upload your records on the left or type a question to begin a professional health analysis.
                                                </p>
                                            </div>
                                            <div className="flex gap-3 pt-4">
                                                <BannerBadge label="HIPAA COMPLIANT" />
                                                <BannerBadge label="AI DIAGNOSTIC SUPPORT" />
                                            </div>
                                        </div>
                                    )}

                                    {messages.map((m, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "flex items-start gap-5",
                                                m.role === "user" ? "flex-row-reverse" : ""
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform hover:scale-105",
                                                m.role === "user" ? "bg-slate-900 text-white" : "bg-teal-500 text-white"
                                            )}>
                                                {m.role === "user" ? <User size={22} /> : <Activity size={22} />}
                                            </div>

                                            <div className="flex flex-col space-y-2 max-w-[80%]">
                                                <div className={cn(
                                                    "p-6 rounded-[2rem] shadow-sm relative",
                                                    m.role === "user"
                                                        ? "bg-white border border-slate-100 text-slate-800 rounded-tr-none"
                                                        : "bg-teal-50 text-slate-900 rounded-tl-none border border-teal-100"
                                                )}>
                                                    <p className="text-sm md:text-base leading-relaxed font-medium">{m.content}</p>
                                                    {m.sources && (
                                                        <div className="mt-5 pt-4 border-t border-teal-100/50 flex flex-wrap gap-2">
                                                            {m.sources.map((s: string, j: number) => (
                                                                <span key={j} className="text-[10px] bg-white text-teal-600 px-4 py-1.5 rounded-full border border-teal-200 font-bold flex items-center gap-2 shadow-sm uppercase tracking-widest">
                                                                    <FileText size={10} /> {s}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] uppercase tracking-widest font-bold text-slate-400 px-2",
                                                    m.role === "user" ? "text-right" : "text-left"
                                                )}>{m.timestamp}</span>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isTyping && (
                                        <motion.div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-teal-100">
                                                <Activity size={22} />
                                            </div>
                                            <div className="bg-teal-50 px-6 py-4 rounded-3xl border border-teal-100 flex gap-1.5">
                                                {[0, 1, 2].map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                                                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                                        className="w-2 h-2 bg-teal-500 rounded-full"
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Advanced Input Bar */}
                            <div className="p-8 bg-white border-t border-slate-50">
                                <form onSubmit={handleSubmit} className="flex gap-4">
                                    <div className="relative flex-1 group">
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Ask MEDOC analyzer about your reports..."
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-5 text-sm md:text-base focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-inner placeholder:text-slate-400"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                            <button type="button" className="p-2 text-slate-400 hover:text-teal-600 transition-colors">
                                                <Paperclip size={22} />
                                            </button>
                                        </div>
                                    </div>
                                    <Button type="submit" className="rounded-[1.5rem] px-12 h-auto bg-teal-500 hover:bg-teal-600 text-white shadow-xl shadow-teal-100 transition-all hover:scale-[1.02]">
                                        <Send size={22} />
                                    </Button>
                                </form>
                                <p className="text-center mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                                    MEDOC can make mistakes. Check important clinical info.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

const BannerBadge = ({ label }: { label: string }) => (
    <div className="px-4 py-1.5 rounded-full border border-teal-200 bg-teal-50 text-[9px] font-bold text-teal-700 tracking-[0.2em] uppercase">
        {label}
    </div>
);

const DocCard = ({ name, date, size }: { name: string; date: string; size: string }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-white hover:border-teal-200 border border-transparent transition-all shadow-sm">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[var(--color-primary)] transition-colors">
                <FileText size={20} />
            </div>
            <div>
                <p className="text-sm font-bold text-slate-900 leading-none mb-1">{name}</p>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{date} • {size}</p>
            </div>
        </div>
        <ChevronRight size={16} className="text-slate-300 group-hover:text-[var(--color-primary)]" />
    </div>
);
