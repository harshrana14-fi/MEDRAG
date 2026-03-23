"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import {
    Send,
    FileText,
    Activity,
    ShieldCheck,
    User,
    ArrowLeft,
    Download,
    CheckCircle2,
    Zap,
    MessageSquare,
    AlertCircle,
    Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function AssistantContent() {
    const searchParams = useSearchParams();
    const initialPolicy = searchParams.get("policy");

    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<string | null>(initialPolicy);
    const [isAnalyzed, setIsAnalyzed] = useState(!!initialPolicy);

    const [questionnaire, setQuestionnaire] = useState({
        policyYears: 0,
        age: 0,
        claimType: "Hospitalization",
        diseaseName: "",
        location: "",
        previousClaims: false
    });

    const [isUploading, setIsUploading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialPolicy) {
            setSelectedPolicy(initialPolicy);
            setIsAnalyzed(true);
            setMessages([
                {
                    role: "assistant",
                    content: `Hi there! I've analyzed the **${initialPolicy.replace('.pdf', '').replace('.txt', '').replace(/_/g, ' ').toUpperCase()}** policy for you.\n\nTo give you precise advice on waiting periods and sub-limits, could you tell me your **age** and **how long you've had this policy**?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } else {
            setMessages([
                {
                    role: "assistant",
                    content: "Welcome! To start, please **upload a policy PDF** or select one from our Insurance Hub to begin the analysis.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }
    }, [initialPolicy]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const suggestedQuestions = [
        "What is my waiting period for cataract?",
        "Is robotic surgery covered in this plan?",
        "What are the network hospitals in my city?",
        "Calculation for room rent limit?",
        "Post-hospitalization benefit details"
    ];

    const handleSubmit = async (e: React.FormEvent | string) => {
        if (typeof e !== 'string') e.preventDefault();
        const finalQuery = typeof e === 'string' ? e : query;
        if (!finalQuery.trim() || !isAnalyzed) return;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMessage = { role: "user", content: finalQuery, timestamp: time };
        setMessages((prev) => [...prev, userMessage]);
        setQuery("");
        setIsTyping(true);

        try {
            const res = await fetch("/api/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: finalQuery,
                    questionnaire,
                    selectedPolicy
                }),
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
                throw new Error("Backend connection issue");
            }
        } catch (error: any) {
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: "I'm having trouble connecting to the intelligence engine. Please check your internet or retry.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.name.endsWith('.pdf')) {
            alert('Please upload a PDF file.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setSelectedPolicy(file.name);
                setIsAnalyzed(true);
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: `Successfully uploaded and analyzed **${file.name.toUpperCase()}**. I've indexed the document with MEDRAG intelligence. You can now ask questions about its coverage, waiting periods, and T&Cs.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Upload failed');
            }
        } catch (err: any) {
            console.error(err);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: `Sorry, I couldn't process this document. ${err.message}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 pt-28 pb-10 px-4 md:px-8">
            <Navbar />

            <div className="max-w-5xl mx-auto flex flex-col gap-6">
                <header className="flex items-center justify-between bg-white border border-slate-100 px-6 py-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link href="/plans">
                            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-teal-600 border border-slate-100 cursor-pointer transition-colors">
                                <ArrowLeft size={16} />
                            </div>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shrink-0">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="overflow-hidden">
                                <h1 className="text-base md:text-lg font-display font-bold text-slate-900 leading-none truncate max-w-xs md:max-w-md">
                                    {selectedPolicy ? selectedPolicy.replace('.pdf', '').replace('.txt', '').replace(/_/g, ' ').toUpperCase() : "CUSTOM POLICY ANALYSIS"}
                                </h1>
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                                    {selectedPolicy ? `Policy ID: MEDRAG-${selectedPolicy.substring(0, 4).toUpperCase()}` : "Ready for Upload"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="hidden md:flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 border border-slate-200 transition-all">
                            <Download size={14} /> Report
                        </button>
                        <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 min-h-[75vh] flex flex-col relative bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar" ref={scrollRef}>
                            {messages.map((m, i) => (
                                <div key={i} className={cn("flex items-start gap-3", m.role === "user" ? "flex-row-reverse" : "")}>
                                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                                        m.role === "user" ? "bg-slate-900 text-white" : "bg-teal-500 text-white"
                                    )}>
                                        {m.role === "user" ? <User size={16} /> : <Activity size={16} />}
                                    </div>

                                    <div className={cn("flex flex-col space-y-1 max-w-[85%]", m.role === "user" ? "items-end" : "items-start")}>
                                        <div className={cn("p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border",
                                            m.role === "user" ? "bg-white border-slate-100 text-slate-800" : "bg-teal-50/50 border-teal-100 text-slate-900"
                                        )}>
                                            <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{m.content}</p>
                                            {m.sources && (
                                                <div className="mt-4 pt-3 border-t border-teal-200/20 flex flex-wrap gap-2">
                                                    {m.sources.map((s: string, j: number) => (
                                                        <span key={j} className="text-[8px] bg-white text-teal-600 px-2 py-0.5 rounded-md border border-teal-100 font-bold uppercase tracking-widest">
                                                            <FileText size={8} className="inline mr-1" /> {s.replace('.txt', '').replace('.pdf', '')}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[8px] uppercase tracking-widest font-black text-slate-300 px-1">{m.timestamp}</span>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-teal-500 text-white flex items-center justify-center shrink-0">
                                        <Activity size={16} />
                                    </div>
                                    <div className="bg-teal-50/50 px-4 py-2 rounded-xl flex gap-1">
                                        {[0, 1, 2].map((i) => (
                                            <div key={i} className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={cn("p-6 border-t border-slate-50 bg-white", isAnalyzed ? "opacity-100" : "opacity-30 pointer-events-none")}>
                            <form onSubmit={handleSubmit} className="flex gap-3">
                                <input
                                    type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Type your question about coverage..."
                                    className="flex-1 bg-slate-50 border border-transparent focus:border-teal-500 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400 text-slate-900"
                                />
                                <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6">
                                    <Send size={18} />
                                </Button>
                            </form>
                        </div>
                    </div>

                    <aside className="w-full lg:w-72 space-y-6">
                        <input type="file" ref={fileInputRef} onChange={onFileSelect} accept=".pdf" className="hidden" />

                        <section className="bg-slate-100 text-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-teal-400 mb-4 flex items-center gap-2">
                                <Upload size={12} /> Custom Document
                            </h4>
                            <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
                                Want to analyze your own policy PDF? Upload it here for instant medical intelligence.
                            </p>
                            <Button onClick={handleUploadClick} disabled={isUploading} className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold text-[11px] py-3 rounded-xl border-none shadow-lg shadow-teal-500/20 transition-colors">
                                {isUploading ? "Processing..." : "SELECT FILE"}
                            </Button>
                        </section>

                        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                            <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-2">
                                <CheckCircle2 size={12} className="text-teal-500" /> Patient Profile
                            </h4>
                            <div className="space-y-3">
                                <ProfileItem label="Current Age" value={`${questionnaire.age} Years`} />
                                <ProfileItem label="Policy Age" value={`${questionnaire.policyYears} Years`} />
                                <ProfileItem label="Coverage" value={questionnaire.claimType} />
                                <ProfileItem label="Location" value={questionnaire.location || "N/A"} />
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                            <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-2">
                                <Zap size={12} className="text-amber-500" /> Quick Queries
                            </h4>
                            <div className="space-y-2">
                                {suggestedQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSubmit(q)}
                                        className="w-full text-left p-3 rounded-xl border border-slate-50 hover:border-teal-100 hover:bg-teal-50/30 text-[11px] font-medium text-slate-600 transition-all flex items-start gap-2 group"
                                    >
                                        <MessageSquare size={12} className="shrink-0 mt-0.5 text-slate-400 group-hover:text-teal-500" />
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl shadow-slate-200 transition-colors">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle size={14} className="text-teal-400" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">AI Insight</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-slate-300 font-medium italic">
                                "The waiting period for cataracts is usually 24 months. Based on your 1-year duration, you might have another 12 months left."
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

const ProfileItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
        <span className="text-[11px] font-black text-slate-900">{value}</span>
    </div>
);

export default function AssistantPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-teal-400 font-black tracking-widest">BOOTING_ASSISTANT...</div>}>
            <AssistantContent />
        </Suspense>
    );
}
