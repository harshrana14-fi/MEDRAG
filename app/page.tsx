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
  Lock
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[700px] w-full overflow-hidden hero-curve flex flex-col items-center justify-center text-center text-white pb-32">
        {/* Background Overlay with Re-adjusted Curve */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000"
            alt="Medical Research"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-teal-900/70" />
        </div>

        <div className="relative z-10 px-6 space-y-6 max-w-3xl mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold leading-tight"
          >
            MEDOC<br /> Health Intelligence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-white/80 max-w-xl mx-auto"
          >
            MEDOC translates complex medical documentation, lab results, and clinical notes into simple, medically-grounded explanations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/assistant">
              <Button className="bg-white/20 hover:bg-white/30 text-white rounded-full px-12 py-5 border border-white/40 h-auto font-bold uppercase tracking-widest backdrop-blur-md">
                Start Neural Scan
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Overlapping Interface Area */}
      <div className="relative -mt-60 z-20 flex flex-col items-center px-6">
        {/* Doctors popping out from behind the card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative z-10 flex justify-center w-full"
        >
          <img
            src="/doctors.png"
            alt="Medical Team"
            className="w-full h-auto max-w-5xl max-h-[500px] object-contain select-none pointer-events-none -mb-16"
          />
        </motion.div>

        {/* Query Bar - Sitting on top of the doctors' bottom edge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-20 w-full max-w-6xl bg-white rounded-full shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] p-4 md:p-6 mb-20 flex flex-col md:flex-row items-center gap-6 border border-teal-50"
        >
          <AppointmentField label="Type of Document" value="Lab Results" />
          <div className="h-10 w-[1px] bg-slate-100 hidden md:block" />
          <AppointmentField label="Analysis Focus" value="General Summary" />
          <div className="h-10 w-[1px] bg-slate-100 hidden md:block" />
          <AppointmentField label="Security Protocol" value="256-Bit Encrypted" />

          <Link href="/assistant" className="w-full md:w-auto">
            <button className="w-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-8 py-3 rounded-full font-bold text-sm hover:bg-teal-50 transition-all uppercase tracking-widest">
              Analyze Now
            </button>
          </Link>
        </motion.div>
      </div>

      {/* We are offering section */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <p className="text-slate-500 font-medium text-sm mb-2">Department of medical HQ health care</p>
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-5xl font-display font-bold text-slate-800 tracking-tight">We are offering best for you!</h2>
            <div className="flex gap-4">
              <button className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 hover:bg-teal-100 transition-all">
                <ChevronDown className="rotate-90" size={24} />
              </button>
              <button className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 hover:bg-teal-200 transition-all">
                <ChevronDown className="-rotate-90" size={24} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative pb-20">
            <OfferingCard
              image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
              title="Lab Analysis"
              description="We are give you best quality health care services & facilities of latest technology so patient records easy & secure"
            />
            <OfferingCard
              image="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800"
              title="Neural Scanning"
            />
            <OfferingCard
              image="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"
              title="Patient Care"
            />

            {/* Carousel Indicator Line */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 w-32">
              <div className="h-1 bg-teal-500 flex-1 rounded-full" />
              <div className="h-1 bg-teal-100 flex-1 rounded-full" />
              <div className="h-1 bg-teal-100 flex-1 rounded-full" />
            </div>
          </div>


        </div>
      </section>

      {/* Why HealthQuery AI Section */}
      <section className="py-32 px-6 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <p className="text-teal-500 font-bold tracking-widest uppercase text-sm">Empowering Patients</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-800 leading-tight">Why Choose <br /> HealthQuery AI?</h2>
              <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
                We bridge the gap between complex clinical terminology and patient understanding. Our platform uses state-of-the-art neural networks trained on medical taxonomies to ensure you're never left in the dark about your health.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-teal-600">99.8%</div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accuracy Rate</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-teal-600">1.2M+</div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Papers Scanned</p>
              </div>
            </div>

            <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-10 py-6 h-auto font-bold uppercase tracking-widest shadow-xl shadow-teal-100">
              Learn More About Us
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-teal-200/20 rounded-full blur-3xl animate-pulse" />
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000"
              alt="AI Analysis"
              className="relative z-10 w-full h-auto rounded-[3rem] shadow-2xl"
            />
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl z-20 flex items-center gap-6 border border-slate-100">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white">
                <ShieldCheck size={32} />
              </div>
              <div>
                <p className="font-bold text-slate-800">HIPAA Compliant</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Secure Data Handling</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How to Use It Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center space-y-20">
          <div className="space-y-4">
            <p className="text-teal-500 font-bold tracking-widest uppercase text-sm">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-800">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 hidden md:block z-0" />

            {[
              { icon: <Upload size={32} />, title: "Upload Records", desc: "Securely upload your PDFs, scans, or lab reports to our encrypted cloud." },
              { icon: <Cpu size={32} />, title: "Neural Scan", desc: "Our AI analyzes the document against billions of medical data points." },
              { icon: <FileText size={32} />, title: "Get Insights", desc: "Receive a clear, actionable summary that explains everything in plain English." }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center gap-6 group"
              >
                <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-teal-600 transition-all group-hover:bg-teal-500 group-hover:text-white group-hover:shadow-xl group-hover:shadow-teal-100 group-hover:-translate-y-2 shadow-sm">
                  {step.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">0{i + 1}. {step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-[250px] mx-auto">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-teal-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" />
        </div>

        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4 text-left">
              <p className="text-teal-400 font-bold tracking-widest uppercase text-sm">Core Capabilities</p>
              <h2 className="text-4xl md:text-6xl font-display font-bold">Cutting-edge Features <br /> for Modern Health</h2>
            </div>
            <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-10 py-6 h-auto font-bold uppercase tracking-widest backdrop-blur-md">
              View All Capabilities
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Lab Marker Clarity", icon: <Activity />, desc: "Understand every marker in your bloodwork with precision context." },
              { title: "Insurance Sync", icon: <ShieldCheck />, desc: "Compare billing codes and insurance clauses in seconds." },
              { title: "Side Effect Scan", icon: <Zap />, desc: "Instantly identify potential side effects across all prescriptions." },
              { title: "Encrypted Vault", icon: <Lock />, desc: "Your data is protected by military-grade 256-bit encryption." }
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md hover:bg-white/10 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-teal-400/20 flex items-center justify-center text-teal-400 mb-8 border border-teal-400/20 group-hover:scale-110 transition-transform">
                  {React.cloneElement(feat.icon as React.ReactElement<any>, { size: 28 })}
                </div>
                <h3 className="text-xl font-bold mb-4">{feat.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero-style Footer Section */}
      <footer className="bg-[#1A2E2C] text-white pt-24 pb-12 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Newsletter / Upper Part */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div className="text-4xl font-display font-bold">
              HealthQuery<span className="text-teal-400">.</span>
            </div>
            <div className="w-full max-w-2xl bg-slate-900/40 rounded-full p-1 pl-8 flex items-center border border-white/5 backdrop-blur-sm">
              <input
                type="text"
                placeholder="Subscribe to our newsletter!!"
                className="bg-transparent border-none outline-none flex-1 text-sm text-white/50 placeholder:text-white/30"
              />
              <button className="bg-[#00D0B1] text-teal-950 px-10 py-4 rounded-full font-bold text-sm hover:bg-teal-300 transition-all uppercase tracking-widest">
                Subscribe
              </button>
            </div>
          </div>

          <div className="h-[1px] bg-white/5 mb-16" />

          {/* Bottom Grid with Doctors Illustration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-center">
            {/* Opening Hours */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold uppercase tracking-widest text-white/40">Opening Hours</h4>
              <div className="space-y-6">
                <ScheduleRow day="Mon - Tues" time="08:00 Am - 05:00 Pm" />
                <ScheduleRow day="Wed - Thur" time="08:00 Am - 05:00 Pm" />
                <ScheduleRow day="Fri - Sat" time="08:00 Am - 05:00 Pm" />
                <ScheduleRow day="Sunday" time="Closed" />
              </div>
            </div>

            {/* Doctors in Circle - Exact Match */}
            <div className="relative flex justify-center items-end h-80">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-20">
                <div className="absolute inset-0 rounded-full border-[30px] border-teal-500" />
                <div className="absolute inset-6 rounded-full border-[2px] border-teal-500/50" />
                <div className="absolute inset-12 rounded-full border-[40px] border-teal-500" />
              </div>
              <img src="/doctors.png" className="w-[450px] max-w-none h-auto relative z-10 mb-[-48px]" alt="Team" />
            </div>

            {/* Address */}
            <div className="space-y-8 text-right flex flex-col items-end">
              <div className="space-y-2">
                <h4 className="text-xl font-bold">Dr. Hospital Care</h4>
                <div className="space-y-1 text-white/50 text-sm">
                  <p>406 Glenwood Avenue</p>
                  <p>Lockport, New York, 14094</p>
                </div>
              </div>

              <div className="space-y-1 text-white/50 text-sm">
                <p>Info@drsupport.com</p>
                <p className="text-white font-bold">+1(088) 456 888</p>
              </div>

              <div className="flex gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-teal-400 hover:bg-teal-400 hover:text-teal-950 transition-all cursor-pointer">
                    <Heart size={16} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

const AppointmentField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex-1 space-y-1 w-full text-center md:text-left">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</label>
    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-900 font-bold group cursor-pointer text-sm">
      {value}
      <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform text-[var(--color-primary)]" />
    </div>
  </div>
);

const ServiceItem = ({ label, active = false }: { label: string; active?: boolean }) => (
  <div className={cn(
    "flex items-center justify-between group cursor-pointer border-b border-slate-100 pb-3 transition-colors",
    active ? "text-[var(--color-primary)] border-b-2 border-b-[var(--color-primary)]" : "text-slate-400 hover:text-slate-700"
  )}>
    <span className="font-bold text-sm tracking-wide uppercase">{label}</span>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />}
  </div>
);

const StatCircle = ({ value, label, color }: { value: string, label: string, color: string }) => (
  <div className="flex flex-col items-center gap-6 text-center">
    <div className={cn(
      "w-36 h-36 rounded-full border-2 border-slate-200 flex flex-col items-center justify-center bg-white shadow-2xl transition-all hover:scale-105",
      color
    )}>
      <span className="text-3xl font-display font-extrabold">{value}</span>
    </div>
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</span>
  </div>
);

const OfferingCard = ({ image, title, description, active = false }: { image: string, title: string, description?: string, active?: boolean }) => (
  <div className="relative rounded-[2.5rem] overflow-hidden group h-[400px]">
    <img src={image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 to-transparent" />
    <div className="absolute bottom-10 left-10 text-white">
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
    {description && (
      <div className="absolute top-[30%] left-10 right-10 bg-white p-6 rounded-3xl shadow-2xl z-20">
        <div className="absolute -top-3 left-6 w-6 h-6 bg-white rotate-45" />
        <p className="text-teal-600 text-sm font-semibold leading-relaxed">
          {description}
        </p>
      </div>
    )}
  </div>
);

const ScheduleRow = ({ day, time }: { day: string, time: string }) => (
  <div className="flex flex-col border-b border-white/5 pb-2">
    <span className="text-white font-bold text-sm tracking-wide">{day}</span>
    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{time}</span>
  </div>
);

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(" ");
