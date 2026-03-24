"use client";

import React from "react";
import {
  Heart,
  ArrowRight,
  ChevronDown,
  Activity,
  User,
  History,
  ClipboardCheck,
  Stethoscope,
  FileText,
  Search,
  ShieldCheck,
  Zap,
  Upload,
  Cpu,
  Shield,
  Clock,
  Lock,
  CheckCircle2,
  Building2,
  Scale,
  Gem
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[800px] w-full overflow-hidden hero-curve flex flex-col items-center justify-center text-center text-white pb-32">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000"
            alt="Insurance Analysis"
            className="w-full h-full object-cover scale-110 blur-[2px]"
          />
        </div>

        <div className="relative z-30 px-6 space-y-10 max-w-4xl mb-12 pt-32">
          <h1 className="text-5xl md:text-8xl font-display font-bold leading-[0.9] tracking-tighter">
            MEDRAG<br />
            <span className="text-teal-400">ARIA</span>
          </h1>

          <p className="text-base md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
            Decode complex health insurance policies, government schemes, and claim T&Cs in seconds using medically-grounded AI intelligence.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/plans">
              <Button className="bg-teal-500 hover:bg-teal-400 text-white rounded-2xl px-12 py-7 border-none h-auto font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-teal-500/20 transition-all active:scale-95">
                Explore All Plans
              </Button>
            </Link>
            <Link href="/assistant">
              <Button className="bg-white/10 hover:bg-white/20 text-white rounded-2xl px-12 py-7 border border-white/20 h-auto font-black uppercase tracking-[0.2em] text-sm backdrop-blur-md transition-all">
                Launch Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Overlapping Interface Area */}
      <div className="relative -mt-60 z-20 flex flex-col items-center px-6">
        <div className="relative z-10 flex justify-center w-full">
          <div className="relative">
            <img
              src="/doctors.png"
              alt="Medical Team"
              className="w-full h-auto max-w-5xl max-h-[550px] object-contain select-none pointer-events-none -mb-20"
            />
          </div>
        </div>

        <div className="relative z-20 w-full max-w-6xl bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] p-6 md:p-8 mb-24 flex flex-col md:flex-row items-center gap-8 border border-slate-100">
          <AppointmentField label="Coverage Type" value="Family Health" />
          <div className="h-12 w-[1px] bg-slate-100 hidden md:block" />
          <AppointmentField label="Provider Focus" value="Top Private Companies" />
          <div className="h-12 w-[1px] bg-slate-100 hidden md:block" />
          <AppointmentField label="AI Mode" value="Context-Aware (Live)" />

          <Link href="/plans" className="w-full md:w-auto">
            <button className="w-full bg-slate-900 text-white px-10 py-5 rounded-[1.5rem] font-black text-[10px] hover:bg-teal-600 transition-all uppercase tracking-[0.3em] shadow-xl shadow-slate-200">
              Start Analysis
            </button>
          </Link>
        </div>
      </div>

      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
            <div className="space-y-4">
              <p className="text-teal-600 font-black tracking-[0.4em] uppercase text-[10px]">What we provide</p>
              <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-950 tracking-tighter leading-none">Complete Policy <br />Intelligence.</h2>
            </div>
            <div className="flex gap-4">
              <NavCircle direction="left" />
              <NavCircle direction="right" active />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative pb-20">
            <OfferingCard
              image="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"
              title="Claim Eligibility"
              description="Instantly verify if your specific treatment is covered under your policy duration and age group."
            />
            <OfferingCard
              image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800"
              title="T&C Decoder"
              description="Translate dense legal terminology into simple, actionable bullet points that anyone can understand."
            />
            <OfferingCard
              image="https://images.unsplash.com/photo-1626262334863-44026362d294?auto=format&fit=crop&q=80&w=800"
              title="Waiting Periods"
              description="Get precise timelines for pre-existing disease coverage so you can plan your procedures effectively."
            />

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-4 w-40">
              <div className="h-1 bg-teal-500 flex-1 rounded-full" />
              <div className="h-1 bg-slate-100 flex-1 rounded-full" />
              <div className="h-1 bg-slate-100 flex-1 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-40 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <p className="text-teal-600 font-black tracking-[0.4em] uppercase text-[10px]">Standard of excellence</p>
              <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-950 leading-[0.9] tracking-tighter">Why Choose <br /> MEDRAG?</h2>
              <p className="text-slate-500 text-lg leading-relaxed max-w-lg font-medium">
                Insurance providers use complex language. We use intelligence. We bridge the gap between 40-page policy brochures and the answers you need for your family's health.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-3">
                <div className="text-5xl font-display font-bold text-teal-600">99.9%</div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Query Precision</p>
              </div>
              <div className="space-y-3">
                <div className="text-5xl font-display font-bold text-teal-600">10ms</div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Analysis Speed</p>
              </div>
            </div>

            <Button className="bg-slate-950 text-white rounded-2xl px-12 py-7 h-auto font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-slate-200 transition-all">
              Discover Our Method
            </Button>
          </div>

          <div className="relative">
            <div className="absolute -inset-20 bg-teal-500/10 rounded-full blur-[120px]" />
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200"
              alt="Policy Hub"
              className="relative z-10 w-full h-[600px] object-cover rounded-[4rem] shadow-2xl"
            />
            <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[3rem] shadow-xl z-20 flex items-center gap-8 border border-slate-50">
              <div className="w-20 h-20 bg-teal-500 rounded-3xl flex items-center justify-center text-white">
                <ShieldCheck size={40} />
              </div>
              <div>
                <p className="text-xl font-display font-bold text-slate-950">Bank-Grade</p>
                <p className="text-[10px] text-teal-600 font-black uppercase tracking-[0.2em]">Privacy Protocol</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-40 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto text-center space-y-24">
          <div className="space-y-6">
            <p className="text-teal-600 font-black tracking-[0.4em] uppercase text-[10px]">Streamlined Experience</p>
            <h2 className="text-5xl md:text-8xl font-display font-bold text-slate-950 tracking-tighter leading-none">How It Works.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 relative px-10">
            <div className="absolute top-[30%] left-0 w-full h-[1px] bg-slate-100 hidden md:block z-0" />

            <ProcessStep
              number="01" icon={<Search size={36} />}
              title="Select Policy"
              desc="Browse through Top Private Insurers or Govt Schemes in our curated hub."
            />
            <ProcessStep
              number="02" icon={<Activity size={36} />}
              title="Tailor Context"
              desc="Provide basic details like age and policy duration for personalized results."
            />
            <ProcessStep
              number="03" icon={<Zap size={36} />}
              title="Instant Insights"
              desc="Ask any deep question and get precise, document-backed medical answers."
            />
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 text-slate-950 pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px] -mr-40 -mt-40" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24">
            <div className="text-5xl font-display font-bold tracking-tighter">
              MEDRAG<span className="text-teal-500">.</span>
            </div>
            <div className="w-full max-w-2xl bg-slate-200/50 rounded-[2rem] p-2 pl-10 flex items-center border border-slate-200">
              <input
                type="text"
                placeholder="Join our policy intelligence list..."
                className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900 placeholder:text-slate-400 font-medium"
              />
              <button className="bg-teal-500 text-white px-12 py-5 rounded-[1.5rem] font-black text-[10px] hover:bg-teal-400 transition-all uppercase tracking-[0.3em]">
                Join Now
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
            <div className="md:col-span-2 space-y-10">
              <h3 className="text-4xl font-display font-bold leading-none tracking-tighter text-slate-900">Revolutionizing how families understand health.</h3>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-teal-600 hover:bg-teal-500 hover:text-white transition-all cursor-pointer">
                    <Activity size={20} />
                  </div>
                ))}
              </div>
            </div>

            <FooterList
              title="Navigation"
              items={["Home", "Insurance Plans", "AI Assistant", "Privacy Policy"]}
            />
            <FooterList
              title="Support"
              items={["Help Center", "Technical Docs", "API Access", "Contact Support"]}
            />
          </div>

          <div className="h-[1px] bg-slate-200/50 mb-12" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            <p>© 2026 MEDRAG ARIA. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-10">
              <button className="hover:text-teal-400 transition-colors">Terms of Service</button>
              <button className="hover:text-teal-400 transition-colors">Privacy protocol</button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

const AppointmentField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex-1 space-y-2 w-full text-center md:text-left">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{label}</label>
    <div className="flex items-center justify-center md:justify-start gap-3 text-slate-900 font-bold group cursor-pointer text-sm md:text-lg tracking-tight">
      {value}
      <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform text-teal-500" />
    </div>
  </div>
);

const NavCircle = ({ direction, active = false }: { direction: 'left' | 'right', active?: boolean }) => (
  <button className={cn(
    "w-16 h-16 rounded-full flex items-center justify-center transition-all border",
    active ? "bg-teal-500 text-white border-teal-400 shadow-xl shadow-teal-100" : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50"
  )}>
    <ChevronDown className={direction === 'left' ? "rotate-90" : "-rotate-90"} size={24} />
  </button>
);

const OfferingCard = ({ image, title, description }: { image: string, title: string, description: string }) => (
  <div className="relative rounded-[3rem] overflow-hidden group h-[500px] border border-slate-100 shadow-2xl shadow-slate-200/20">
    <img src={image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80" />
    <div className="absolute bottom-12 left-12 right-12 text-white space-y-4">
      <h3 className="text-3xl font-display font-bold leading-tight">{title}</h3>
      <p className="text-sm text-white/60 leading-relaxed font-medium transition-opacity">
        {description}
      </p>
      <div className="pt-4 overflow-hidden">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 transition-transform duration-500">
          Learn More <ArrowRight size={12} />
        </div>
      </div>
    </div>
  </div>
);

const ProcessStep = ({ number, icon, title, desc }: { number: string, icon: any, title: string, desc: string }) => (
  <div className="relative z-10 flex flex-col items-center gap-8 group">
    <div className="w-32 h-32 rounded-[2.5rem] bg-white border border-slate-100 flex items-center justify-center text-teal-600 transition-all duration-500 group-hover:bg-slate-950 group-hover:text-white shadow-sm relative">
      <div className="absolute -top-4 -right-4 w-10 h-10 bg-teal-500 text-white rounded-2xl flex items-center justify-center text-xs font-black shadow-lg">
        {number}
      </div>
      {icon}
    </div>
    <div className="space-y-4">
      <h3 className="text-2xl font-display font-bold text-slate-950">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto font-medium">{desc}</p>
    </div>
  </div>
);

const FooterList = ({ title, items }: { title: string, items: string[] }) => (
  <div className="space-y-8">
    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-500">{title}</h4>
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li key={i}>
          <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">{item}</button>
        </li>
      ))}
    </ul>
  </div>
);

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(" ");
