"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Code2, Trophy, DollarSign, CalendarDays, Rocket } from "lucide-react";

const COMPANIES = [
  { name: "Google", logo: "G", color: "#4285F4", bg: "#4285F420" },
  { name: "Microsoft", logo: "M", color: "#00A4EF", bg: "#00A4EF20" },
  { name: "Amazon", logo: "A", color: "#FF9900", bg: "#FF990020" },
  { name: "Meta", logo: "f", color: "#0866FF", bg: "#0866FF20" },
  { name: "OpenAI", logo: "O", color: "#7CFFB2", bg: "#7CFFB220" },
  { name: "Razorpay", logo: "R", color: "#6C63FF", bg: "#6C63FF20" },
  { name: "Zepto", logo: "Z", color: "#00D4FF", bg: "#00D4FF20" },
  { name: "Swiggy", logo: "S", color: "#FC8019", bg: "#FC801920" },
];

const COMPANY_DATA: Record<string, { skills: string[]; difficulty: string; projects: string[]; salary: string; timeline: string; probability: number }> = {
  Google: { skills: ["System Design", "DSA", "Distributed Systems", "Go/Java"], difficulty: "Very High", projects: ["Distributed Cache", "Search Engine", "Real-time Pipeline"], salary: "₹40-80 LPA", timeline: "6-9 months prep", probability: 68 },
  Microsoft: { skills: ["DSA", "OOP", "Azure Cloud", "C#/.NET"], difficulty: "High", projects: ["Cloud Storage System", "REST API Platform", "CI/CD Pipeline"], salary: "₹30-60 LPA", timeline: "4-6 months prep", probability: 74 },
  Amazon: { skills: ["Leadership Principles", "DSA", "AWS", "System Design"], difficulty: "High", projects: ["E-commerce Backend", "Recommendation Engine", "Queue System"], salary: "₹28-55 LPA", timeline: "3-5 months prep", probability: 71 },
  Meta: { skills: ["React/React Native", "GraphQL", "DSA", "ML Basics"], difficulty: "Very High", projects: ["Social Graph", "Real-time Chat", "Feed Algorithm"], salary: "₹35-70 LPA", timeline: "5-8 months prep", probability: 65 },
  OpenAI: { skills: ["LLMs", "Python", "ML Research", "PyTorch"], difficulty: "Elite", projects: ["Fine-tuned LLM", "AI Agent System", "RAG Pipeline"], salary: "₹50-100 LPA", timeline: "8-12 months prep", probability: 42 },
  Razorpay: { skills: ["Node.js", "PostgreSQL", "Payments API", "System Design"], difficulty: "Medium-High", projects: ["Payment Gateway", "Webhook System", "Dashboard"], salary: "₹20-40 LPA", timeline: "3-4 months prep", probability: 81 },
  Zepto: { skills: ["React", "Node.js", "Redis", "MongoDB"], difficulty: "Medium", projects: ["Inventory System", "Delivery Tracker", "Admin Dashboard"], salary: "₹15-30 LPA", timeline: "2-3 months prep", probability: 86 },
  Swiggy: { skills: ["React", "Python", "Microservices", "Kafka"], difficulty: "Medium-High", projects: ["Order Management", "Real-time Tracking", "Recommendation API"], salary: "₹18-35 LPA", timeline: "2-4 months prep", probability: 83 },
};

const DIFFICULTY_COLOR: Record<string, string> = {
  "Very High": "#EF4444",
  High: "#F59E0B",
  "Medium-High": "#00D4FF",
  Medium: "#7CFFB2",
  Elite: "#6C63FF",
};

export default function DreamJobSection() {
  const [selected, setSelected] = useState("Google");
  const data = COMPANY_DATA[selected];

  return (
    <section className="section" id="simulator">
      <div className="container-cv">
        <div className="text-center mb-16">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[#7CFFB2] font-semibold mb-3 tracking-widest text-sm uppercase">
            Dream Job Simulator
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-4">
            Your Mission:{" "}
            <span className="gradient-text-accent">Land Your Dream Job</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            Select a company and get an exact blueprint — skills, projects, timeline, and your hiring probability.
          </motion.p>
        </div>

        {/* Company Selector */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {COMPANIES.map((co) => (
            <button
              key={co.name}
              onClick={() => setSelected(co.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border font-semibold text-sm transition-all ${
                selected === co.name
                  ? "border-transparent text-white shadow-lg"
                  : "glass-card border-[rgba(255,255,255,0.1)] text-[#94A3B8] hover:border-[rgba(255,255,255,0.2)]"
              }`}
              style={selected === co.name ? { background: co.bg, borderColor: co.color, color: co.color, boxShadow: `0 0 20px ${co.color}40` } : {}}
            >
              <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black" style={{ background: co.bg, color: co.color }}>
                {co.logo}
              </span>
              {co.name}
            </button>
          ))}
        </div>

        {/* Mission Dashboard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card-strong rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold">{selected} Mission Brief</h3>
                <p className="text-[#94A3B8] text-sm mt-1">Your personalized hiring blueprint</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black" style={{ color: data.probability > 75 ? "#7CFFB2" : data.probability > 55 ? "#F59E0B" : "#EF4444" }}>
                  {data.probability}%
                </div>
                <p className="text-xs text-[#94A3B8]">Hiring Probability</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Skills */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 size={18} className="text-[#6C63FF]" />
                  <h4 className="font-semibold text-sm">Required Skills</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[rgba(108,99,255,0.15)] text-[#6C63FF] border border-[rgba(108,99,255,0.2)]">{s}</span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Rocket size={18} className="text-[#00D4FF]" />
                  <h4 className="font-semibold text-sm">Projects to Build</h4>
                </div>
                <ul className="space-y-2">
                  {data.projects.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className="glass-card rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy size={18} style={{ color: DIFFICULTY_COLOR[data.difficulty] }} />
                  <span className="text-sm text-[#94A3B8]">Difficulty</span>
                  <span className="ml-auto text-sm font-semibold" style={{ color: DIFFICULTY_COLOR[data.difficulty] }}>{data.difficulty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={18} className="text-[#7CFFB2]" />
                  <span className="text-sm text-[#94A3B8]">Salary Range</span>
                  <span className="ml-auto text-sm font-semibold text-[#7CFFB2]">{data.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-[#F59E0B]" />
                  <span className="text-sm text-[#94A3B8]">Prep Timeline</span>
                  <span className="ml-auto text-sm font-semibold text-[#F59E0B]">{data.timeline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-[#6C63FF]" />
                  <span className="text-sm text-[#94A3B8]">Hire Probability</span>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full">
                      <div className="h-full rounded-full" style={{ width: `${data.probability}%`, background: data.probability > 75 ? "#7CFFB2" : "#F59E0B" }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: data.probability > 75 ? "#7CFFB2" : "#F59E0B" }}>{data.probability}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
