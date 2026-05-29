"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Search, Upload, Cpu, Database, ShieldCheck, Zap } from "lucide-react";

const steps = [
    {
        icon: <Database className="w-8 h-8 text-teal-500" />,
        title: "Policy Intelligence",
        description: "We ingest thousands of pages of complex insurance policy documents, parsing them into structured intelligence segments using advanced OCR and layout analysis.",
        accent: "bg-teal-50"
    },
    {
        icon: <Upload className="w-8 h-8 text-blue-500" />,
        title: "Your Custom Files",
        description: "Login to upload your own private policy documents. These are securely processed and added to your personal knowledge base, invisible to others.",
        accent: "bg-blue-50"
    },
    {
        icon: <Cpu className="w-8 h-8 text-purple-500" />,
        title: "Vector Embedding",
        description: "Every sentence is converted into high-dimensional mathematical vectors. This allows us to understand 'meaning' rather than just matching keywords.",
        accent: "bg-purple-50"
    },
    {
        icon: <Search className="w-8 h-8 text-orange-500" />,
        title: "Semantic Retrieval",
        description: "When you ask a question, we instantly scan millions of vector points to find the exact paragraphs that contain your answer.",
        accent: "bg-orange-50"
    },
    {
        icon: <Zap className="w-8 h-8 text-yellow-500" />,
        title: "LLM Reasoning",
        description: "The retrieved context is fed into a powerful Large Language Model (Groq/Gemini) that synthesizes a clear, human response based only on the facts.",
        accent: "bg-yellow-50"
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
        title: "Verified Answers",
        description: "Every answer comes with specific citations. You can click on sources to see the exact PDF page where the information was found.",
        accent: "bg-emerald-50"
    }
];

export default function HowItWorks() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 bg-teal-500/10 text-teal-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6"
                    >
                        The Intelligence Engine
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 leading-[1.1]"
                    >
                        Turning complex policies into <span className="text-teal-500 italic">instant answers.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-500 max-w-2xl mx-auto"
                    >
                        MEDRAG uses a state-of-the-art Retrieval Augmented Generation (RAG) architecture to solve the problem of dense, unreadable insurance documents.
                    </motion.p>
                </div>
            </section>

            {/* Steps Grid */}
            <section className="pb-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group"
                        >
                            <div className={`${step.accent} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="text-slate-200 text-3xl font-black">0{index + 1}</span>
                                {step.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Interactive Visualizer Section */}
            <section className="py-20 bg-slate-900 text-white rounded-[4rem] mx-6 mb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent)]" />
                <div className="max-w-5xl mx-auto px-10 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-10">Zero Hallucinations. <br/><span className="text-teal-400">Pure Data.</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                        <div className="space-y-4">
                            <div className="text-4xl font-black text-teal-400">99%</div>
                            <div className="text-xs uppercase tracking-widest font-bold text-slate-400">Accuracy in Retrieval</div>
                        </div>
                        <div className="space-y-4">
                            <div className="text-4xl font-black text-teal-400">&lt;2s</div>
                            <div className="text-xs uppercase tracking-widest font-bold text-slate-400">Response Time</div>
                        </div>
                        <div className="space-y-4">
                            <div className="text-4xl font-black text-teal-400">100%</div>
                            <div className="text-xs uppercase tracking-widest font-bold text-slate-400">Source Verifiability</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer-ish CTA */}
            <section className="pb-40 text-center">
                <h3 className="text-2xl font-bold mb-8">Ready to clear your doubts?</h3>
                <motion.a
                    href="/"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block bg-teal-500 text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-teal-500/20 hover:bg-teal-600 transition-all"
                >
                    Start Chatting Now
                </motion.a>
            </section>
        </main>
    );
}
