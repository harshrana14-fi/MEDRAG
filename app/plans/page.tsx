"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Shield,
    ChevronRight,
    ArrowRight,
    Building2,
    Globe2,
    Filter,
    FileText,
    CheckCircle2,
    Activity,
    Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface Policy {
    id: string;
    filename: string;
    upload_date: string;
    category: string;
    company: string;
}

export default function PlansPage() {
    const [documents, setDocuments] = useState<Policy[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchDocuments();
    }, []);

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

    const categories = Array.from(new Set(documents.map(d => d.category)));

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? doc.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const groupedDocs = filteredDocs.reduce((acc, doc) => {
        if (!acc[doc.category]) acc[doc.category] = {};
        if (!acc[doc.category][doc.company]) acc[doc.category][doc.company] = [];
        acc[doc.category][doc.company].push(doc);
        return acc;
    }, {} as Record<string, Record<string, Policy[]>>);

    const handleSelectPlan = (filename: string) => {
        router.push(`/assistant?policy=${encodeURIComponent(filename)}`);
    };

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
            <Navbar />

            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold uppercase tracking-widest transition-colors">
                        <Shield size={14} /> Health Policy Intelligence
                    </div>
                    <h1 className="text-5xl font-display font-bold text-slate-900 leading-tight">
                        Select Your <span className="text-teal-500">Health Plan</span> For Deep Analysis
                    </h1>
                    <p className="text-lg text-slate-500 leading-relaxed">
                        Browse through top private insurance policies and government health schemes. Choose a document to unlock personalized AI-driven health intelligence.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by company, policy name or scheme..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-transparent rounded-2xl pl-14 pr-6 py-4 text-slate-900 focus:outline-none focus:bg-white focus:border-teal-500 transition-all shadow-inner"
                        />
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                        <FilterButton
                            active={selectedCategory === null}
                            onClick={() => setSelectedCategory(null)}
                            label="All Schemes"
                        />
                        {categories.map(cat => (
                            <FilterButton
                                key={cat}
                                active={selectedCategory === cat}
                                onClick={() => setSelectedCategory(cat)}
                                label={cat}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-16">
                    {Object.entries(groupedDocs).map(([category, companies]) => (
                        <div key={category} className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-teal-500 rounded-2xl text-white shadow-lg shadow-teal-100">
                                    {category.includes('Government') ? <Globe2 size={24} /> : <Building2 size={24} />}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-display font-bold text-slate-900">{category}</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                        {Object.keys(companies).length} Leading Providers
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {Object.entries(companies).map(([company, doctors]) => (
                                    <CompanyCard
                                        key={company}
                                        name={company}
                                        docs={doctors}
                                        onSelect={handleSelectPlan}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

const FilterButton = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
    <button
        onClick={onClick}
        className={cn(
            "px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
            active
                ? "bg-teal-500 text-white shadow-lg shadow-teal-100"
                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
        )}
    >
        {label}
    </button>
);

const CompanyCard = ({ name, docs, onSelect }: { name: string; docs: Policy[]; onSelect: (id: string) => void }) => (
    <div
        className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col h-full border-b-[6px] border-b-teal-500/10 hover:border-b-teal-500/30 transition-all group"
    >
        <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-teal-600 font-display font-bold text-xl uppercase tracking-tighter transition-colors">
                {name[0]}
            </div>
            <div>
                <h3 className="font-display font-bold text-slate-900 text-xl">{name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{docs.length} Documentation Files</p>
            </div>
        </div>

        <div className="space-y-3 flex-1">
            {docs.map(doc => (
                <div
                    key={doc.id}
                    className="group-inner flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-teal-50 border border-slate-100 hover:border-teal-100 transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-3 flex-1" onClick={() => onSelect(doc.filename)}>
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-inner-hover:text-teal-600 shadow-sm transition-colors">
                            <FileText size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-inner-hover:text-teal-900 line-clamp-1 transition-colors">
                            {doc.filename.replace('.pdf', '').replace('.txt', '').replace(/_/g, ' ')}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <a 
                            href={`http://localhost:8000/policies/${doc.filename}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-teal-100 text-slate-600 hover:text-teal-600 transition-all"
                            title="View Original Document"
                        >
                            <Eye size={16} />
                        </a>
                        <ChevronRight size={16} className="text-slate-600 group-inner-hover:text-teal-600 transition-all" />
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-2 text-[10px] font-bold text-teal-600 uppercase tracking-widest transition-colors">
                <CheckCircle2 size={12} /> Verified Data
            </div>
            <ArrowRight size={18} className="text-slate-600 group-hover:text-teal-500 transition-colors" />
        </div>
    </div>
);
