"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Database, Shield, Cpu, BarChart3, Palette, Cloud, Settings2, X } from "lucide-react";

const TRACKS = [
  {
    id: "ai", label: "AI Engineering", icon: Cpu, color: "#6C63FF",
    skills: ["Python", "PyTorch", "LLMs", "MLOps", "Vector DBs"],
    salary: "₹25–60 LPA", companies: ["OpenAI", "Google", "Meta", "Mistral"],
    projects: ["Build a RAG chatbot", "Fine-tune an LLM", "Deploy AI API"],
    duration: "6 months", roadmapSteps: 18,
    desc: "Build the AI systems that power the next decade of technology."
  },
  {
    id: "swe", label: "Software Engineering", icon: Code2, color: "#00D4FF",
    skills: ["DSA", "System Design", "Node.js", "Go", "PostgreSQL"],
    salary: "₹15–45 LPA", companies: ["Google", "Amazon", "Flipkart", "Razorpay"],
    projects: ["URL Shortener", "Chat App", "E-commerce Backend"],
    duration: "5 months", roadmapSteps: 22,
    desc: "Engineer the backbone of every product used by billions."
  },
  {
    id: "data", label: "Data Science", icon: BarChart3, color: "#7CFFB2",
    skills: ["Python", "Pandas", "ML", "SQL", "Tableau"],
    salary: "₹12–35 LPA", companies: ["Swiggy", "Zepto", "Meesho", "MuSigma"],
    projects: ["Customer Churn Model", "Sales Forecasting", "Fraud Detection"],
    duration: "5 months", roadmapSteps: 16,
    desc: "Extract insights from data that drive billion-dollar decisions."
  },
  {
    id: "cyber", label: "Cyber Security", icon: Shield, color: "#EF4444",
    skills: ["Networking", "Ethical Hacking", "SIEM", "Cryptography", "Cloud Security"],
    salary: "₹10–30 LPA", companies: ["Palo Alto", "CrowdStrike", "CERT-In", "TCS SOC"],
    projects: ["Penetration Test", "SIEM Dashboard", "Firewall Config"],
    duration: "6 months", roadmapSteps: 20,
    desc: "Defend digital infrastructure against the world's most sophisticated threats."
  },
  {
    id: "devops", label: "DevOps", icon: Settings2, color: "#F59E0B",
    skills: ["Docker", "Kubernetes", "CI/CD", "Terraform", "AWS"],
    salary: "₹12–40 LPA", companies: ["Amazon", "Atlassian", "HashiCorp", "CRED"],
    projects: ["K8s Cluster Setup", "CI/CD Pipeline", "IaC with Terraform"],
    duration: "4 months", roadmapSteps: 15,
    desc: "Build the infrastructure that keeps modern software alive 24/7."
  },
  {
    id: "uiux", label: "UI/UX Design", icon: Palette, color: "#EC4899",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Motion"],
    salary: "₹10–28 LPA", companies: ["Zomato", "PhonePe", "CRED", "Dunzo"],
    projects: ["Design System", "Mobile App Redesign", "UX Case Study"],
    duration: "4 months", roadmapSteps: 14,
    desc: "Craft interfaces that make technology feel magical and human."
  },
  {
    id: "cloud", label: "Cloud Engineering", icon: Cloud, color: "#00D4FF",
    skills: ["AWS", "GCP", "Azure", "Serverless", "Networking"],
    salary: "₹14–42 LPA", companies: ["AWS", "Google Cloud", "Microsoft Azure", "Infosys"],
    projects: ["Multi-region Deployment", "Serverless API", "Cost Optimization"],
    duration: "5 months", roadmapSteps: 18,
    desc: "Architect the cloud infrastructure powering every modern application."
  },
  {
    id: "pm", label: "Product Management", icon: Database, color: "#A78BFA",
    skills: ["Product Thinking", "Analytics", "Roadmapping", "Agile", "SQL"],
    salary: "₹15–45 LPA", companies: ["Razorpay", "Meesho", "Urban Company", "ShareChat"],
    projects: ["PRD Writing", "User Research Report", "Product Strategy Doc"],
    duration: "5 months", roadmapSteps: 16,
    desc: "Define what gets built and why — the most strategic role in tech."
  },
];

export default function CareerUniverseSection() {
  const [selected, setSelected] = useState<typeof TRACKS[0] | null>(null);

  return (
    <section className="section" id="roadmaps">
      <div className="container-cv">
        <div className="text-center mb-16">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[#00D4FF] font-semibold mb-3 tracking-widest text-sm uppercase">
            Career Universe
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-4">
            Explore Every{" "}
            <span className="gradient-text-primary">Career Track</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            8 career galaxies. Each with roadmaps, salaries, top companies, and projects. Click any to explore.
          </motion.p>
        </div>

        {/* Grid of tracks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {TRACKS.map((track, i) => {
            const Icon = track.icon;
            return (
              <motion.button
                key={track.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelected(track)}
                className="glass-card rounded-2xl p-5 text-left group relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" style={{ background: `radial-gradient(circle at 50% 50%, ${track.color}10, transparent)` }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 relative" style={{ background: `${track.color}20`, border: `1px solid ${track.color}30` }}>
                  <Icon size={20} style={{ color: track.color }} />
                </div>
                <h3 className="font-semibold text-sm mb-1">{track.label}</h3>
                <p className="text-xs text-[#94A3B8] mb-3">{track.salary}</p>
                <div className="text-xs font-medium" style={{ color: track.color }}>{track.roadmapSteps} modules →</div>
              </motion.button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card-strong rounded-3xl p-8" style={{ borderColor: `${selected.color}30` }}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${selected.color}20`, border: `1px solid ${selected.color}40` }}>
                      <selected.icon size={28} style={{ color: selected.color }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{selected.label}</h3>
                      <p className="text-[#94A3B8] text-sm mt-0.5">{selected.desc}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl glass-card flex items-center justify-center">
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-card rounded-2xl p-4">
                    <h4 className="font-semibold text-sm mb-3" style={{ color: selected.color }}>Core Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.skills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-lg text-xs" style={{ background: `${selected.color}15`, color: selected.color }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card rounded-2xl p-4">
                    <h4 className="font-semibold text-sm mb-3 text-[#F59E0B]">Top Companies</h4>
                    <ul className="space-y-1.5">
                      {selected.companies.map(c => (
                        <li key={c} className="text-sm text-[#94A3B8] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass-card rounded-2xl p-4">
                    <h4 className="font-semibold text-sm mb-3 text-[#7CFFB2]">Capstone Projects</h4>
                    <ul className="space-y-1.5">
                      {selected.projects.map(p => (
                        <li key={p} className="text-sm text-[#94A3B8] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7CFFB2]" />{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
                    <div>
                      <p className="text-xs text-[#94A3B8] mb-1">Salary Range</p>
                      <p className="font-bold" style={{ color: selected.color }}>{selected.salary}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8] mb-1">Duration</p>
                      <p className="font-semibold text-white">{selected.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8] mb-1">Roadmap Modules</p>
                      <p className="font-semibold text-white">{selected.roadmapSteps} modules</p>
                    </div>
                    <button className="mt-auto py-2 rounded-xl text-sm font-semibold text-white" style={{ background: `linear-gradient(135deg, ${selected.color}, ${selected.color}99)` }}>
                      Start Roadmap →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
