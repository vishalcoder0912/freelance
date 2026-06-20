"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, ChevronRight, Loader2 } from "lucide-react";

const ROLES = ["AI Engineer", "Product Manager", "Data Scientist", "DevOps Engineer", "UI/UX Designer"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const ROADMAP_STEPS: Record<string, { month: string; topic: string; color: string }[]> = {
  "AI Engineer": [
    { month: "Month 1", topic: "Python & Math Foundations", color: "#6C63FF" },
    { month: "Month 2", topic: "Machine Learning Core", color: "#00D4FF" },
    { month: "Month 3", topic: "Deep Learning & NLP", color: "#7CFFB2" },
    { month: "Month 4", topic: "LLMs & Prompt Engineering", color: "#F59E0B" },
    { month: "Month 5", topic: "Agentic AI Systems", color: "#6C63FF" },
    { month: "Month 6", topic: "Portfolio & Placement", color: "#00D4FF" },
  ],
  "Product Manager": [
    { month: "Month 1", topic: "PM Fundamentals & Frameworks", color: "#6C63FF" },
    { month: "Month 2", topic: "User Research & Analytics", color: "#00D4FF" },
    { month: "Month 3", topic: "Roadmapping & Prioritization", color: "#7CFFB2" },
    { month: "Month 4", topic: "Agile & Stakeholder Management", color: "#F59E0B" },
    { month: "Month 5", topic: "Product Strategy & Vision", color: "#6C63FF" },
    { month: "Month 6", topic: "Case Studies & Interviews", color: "#00D4FF" },
  ],
  "Data Scientist": [
    { month: "Month 1", topic: "Python & Statistics", color: "#6C63FF" },
    { month: "Month 2", topic: "EDA & Data Wrangling", color: "#00D4FF" },
    { month: "Month 3", topic: "Machine Learning Algorithms", color: "#7CFFB2" },
    { month: "Month 4", topic: "Deep Learning & Computer Vision", color: "#F59E0B" },
    { month: "Month 5", topic: "MLOps & Deployment", color: "#6C63FF" },
    { month: "Month 6", topic: "Kaggle & Portfolio", color: "#00D4FF" },
  ],
  "DevOps Engineer": [
    { month: "Month 1", topic: "Linux & Shell Scripting", color: "#6C63FF" },
    { month: "Month 2", topic: "Docker & Kubernetes", color: "#00D4FF" },
    { month: "Month 3", topic: "CI/CD & GitHub Actions", color: "#7CFFB2" },
    { month: "Month 4", topic: "AWS/GCP Cloud Infrastructure", color: "#F59E0B" },
    { month: "Month 5", topic: "Monitoring & Observability", color: "#6C63FF" },
    { month: "Month 6", topic: "Security & SRE Practices", color: "#00D4FF" },
  ],
  "UI/UX Designer": [
    { month: "Month 1", topic: "Design Fundamentals & Figma", color: "#6C63FF" },
    { month: "Month 2", topic: "User Research & Personas", color: "#00D4FF" },
    { month: "Month 3", topic: "Wireframing & Prototyping", color: "#7CFFB2" },
    { month: "Month 4", topic: "Design Systems & UI Patterns", color: "#F59E0B" },
    { month: "Month 5", topic: "Motion Design & Animation", color: "#6C63FF" },
    { month: "Month 6", topic: "Portfolio & Case Studies", color: "#00D4FF" },
  ],
};

export default function AICopilotSection() {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmapVisible, setRoadmapVisible] = useState(false);
  const [step, setStep] = useState(0); // 0=role, 1=level, 2=roadmap

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setStep(1);
  };

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    setLoading(true);
    setStep(2);
    setTimeout(() => { setLoading(false); setRoadmapVisible(true); }, 2000);
  };

  const resetAll = () => {
    setSelectedRole(""); setSelectedLevel("");
    setLoading(false); setRoadmapVisible(false); setStep(0);
  };

  const roadmap = ROADMAP_STEPS[selectedRole] || [];

  return (
    <section className="section" id="copilot">
      <div className="container-cv">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#6C63FF] font-semibold mb-3 tracking-widest text-sm uppercase"
          >
            AI Career Copilot
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Your Personal{" "}
            <span className="gradient-text-primary">Career AI</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#94A3B8] text-lg max-w-xl mx-auto"
          >
            Like ChatGPT, but laser-focused on your career. Get a personalized roadmap in 30 seconds.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="glass-card-strong rounded-3xl overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[rgba(255,255,255,0.06)]">
              <div className="w-9 h-9 bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] rounded-xl flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">CareerVeda AI Copilot</p>
                <p className="text-xs text-[#7CFFB2] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7CFFB2] inline-block" />
                  Online — Powered by DeepSeek
                </p>
              </div>
              {step > 0 && (
                <button onClick={resetAll} className="ml-auto text-xs text-[#94A3B8] hover:text-white transition-colors">
                  Start over
                </button>
              )}
            </div>

            {/* Chat Body */}
            <div className="p-6 space-y-6 min-h-[400px]">
              {/* AI Greeting */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
                  <p className="text-sm">Hi! I&apos;m your AI Career Copilot. 👋</p>
                  <p className="text-sm text-[#94A3B8] mt-1">What career role are you aiming for?</p>
                </div>
              </div>

              {/* Role Selection */}
              {step >= 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 pl-11"
                >
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      disabled={step > 0}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        selectedRole === role
                          ? "bg-[#6C63FF] border-[#6C63FF] text-white"
                          : "glass-card border-[rgba(255,255,255,0.1)] text-[#94A3B8] hover:border-[#6C63FF] hover:text-white disabled:opacity-40"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* User selected role */}
              {step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-end"
                >
                  <div className="bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-4 py-2 rounded-2xl rounded-tr-sm text-sm font-medium">
                    {selectedRole}
                  </div>
                </motion.div>
              )}

              {/* Level Question */}
              {step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-sm">Great choice! What&apos;s your current experience level?</p>
                  </div>
                </motion.div>
              )}

              {step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 pl-11"
                >
                  {LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => handleLevelSelect(lvl)}
                      disabled={step > 1}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        selectedLevel === lvl
                          ? "bg-[#00D4FF] border-[#00D4FF] text-[#050816]"
                          : "glass-card border-[rgba(255,255,255,0.1)] text-[#94A3B8] hover:border-[#00D4FF] hover:text-white disabled:opacity-40"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Loading */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center flex-shrink-0">
                    <Loader2 size={14} className="text-white animate-spin" />
                  </div>
                  <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-sm text-[#94A3B8]">Generating your personalized 6-month roadmap...</p>
                    <div className="flex gap-1 mt-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#6C63FF]"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Roadmap */}
              <AnimatePresence>
                {roadmapVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles size={14} className="text-white" />
                      </div>
                      <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3">
                        <p className="text-sm">✨ Your personalized roadmap for <strong>{selectedRole}</strong> ({selectedLevel}):</p>
                      </div>
                    </div>
                    <div className="pl-11 grid gap-2">
                      {roadmap.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3 glass-card rounded-xl px-4 py-3"
                        >
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: step.color }} />
                          <span className="text-xs text-[#94A3B8] w-16">{step.month}</span>
                          <ChevronRight size={12} className="text-[#94A3B8]" />
                          <span className="text-sm font-medium">{step.topic}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
