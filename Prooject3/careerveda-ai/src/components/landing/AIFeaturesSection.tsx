"use client";
import { motion } from "framer-motion";
import { FileText, Mic, Target, Briefcase, Users, Map, ArrowUpRight } from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "AI Resume Builder",
    desc: "ATS-optimized resumes tailored to each role. AI rewrites, keyword optimization, and 50+ premium templates.",
    color: "#6C63FF",
    tags: ["ATS Score", "AI Rewrite", "50+ Templates"],
    stat: "94% avg ATS score",
  },
  {
    icon: Mic,
    title: "AI Interview Coach",
    desc: "Practice with an AI interviewer trained on real FAANG questions. Get voice analysis and confidence scoring.",
    color: "#00D4FF",
    tags: ["Voice AI", "FAANG Questions", "Confidence Score"],
    stat: "3x interview success",
  },
  {
    icon: Target,
    title: "Skill Gap Detector",
    desc: "Map your current skills against target roles. Get a precision plan to close every gap with curated resources.",
    color: "#7CFFB2",
    tags: ["Gap Analysis", "Learning Plan", "Role Match"],
    stat: "127 skills mapped",
  },
  {
    icon: Briefcase,
    title: "AI Job Matcher",
    desc: "Our matching algorithm analyzes 10,000+ job postings and scores your compatibility with each role in real-time.",
    color: "#F59E0B",
    tags: ["10K+ Jobs", "Compatibility Score", "Auto Apply"],
    stat: "89% match accuracy",
  },
  {
    icon: Users,
    title: "Mentor Marketplace",
    desc: "Book 1-on-1 sessions with engineers from Google, Microsoft, Amazon. Get guidance from people who've been there.",
    color: "#EF4444",
    tags: ["FAANG Mentors", "1-on-1 Sessions", "Live Feedback"],
    stat: "500+ active mentors",
  },
  {
    icon: Map,
    title: "AI Career Planner",
    desc: "Your 6-24 month career roadmap built by AI, updated weekly based on your progress and market trends.",
    color: "#6C63FF",
    tags: ["Dynamic Roadmap", "Weekly Updates", "Market Trends"],
    stat: "2.4x faster growth",
  },
];

export default function AIFeaturesSection() {
  return (
    <section className="section" id="features">
      <div className="container-cv">
        <div className="text-center mb-16">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[#6C63FF] font-semibold mb-3 tracking-widest text-sm uppercase">
            AI-Powered Features
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-4">
            Every Tool You Need to{" "}
            <span className="gradient-text-primary">Win</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            Six AI-powered modules working in harmony to accelerate your career from student to top 1%.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-card rounded-3xl p-6 group cursor-pointer relative overflow-hidden"
              >
                {/* Glow bg */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${f.color}15, transparent 70%)` }}
                />

                <div className="relative">
                  {/* Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: `${f.color}20`, border: `1px solid ${f.color}40` }}
                    >
                      <Icon size={22} style={{ color: f.color }} />
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="text-[#94A3B8] group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg mb-2 group-hover:text-white transition-colors">{f.title}</h3>
                  <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">{f.desc}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {f.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}25` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stat */}
                  <div className="pt-4 border-t border-[rgba(255,255,255,0.06)]">
                    <span className="text-xs font-semibold" style={{ color: f.color }}>✓ {f.stat}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
