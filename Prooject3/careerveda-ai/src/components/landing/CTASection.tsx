"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, Star } from "lucide-react";

const STATS = [
  { value: "50K+", label: "Students Trained" },
  { value: "12K+", label: "Placements" },
  { value: "94%", label: "Avg ATS Score" },
  { value: "4.9★", label: "User Rating" },
];

export default function CTASection() {
  return (
    <section className="section">
      <div className="container-cv">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-black gradient-text-primary mb-1">{s.value}</div>
              <div className="text-[#94A3B8] text-sm">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden text-center p-16"
        >
          {/* Gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(108,99,255,0.2)] via-[rgba(0,212,255,0.1)] to-[rgba(124,255,178,0.1)]" />
          <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px" }} />

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${10 + i * 7}%`,
                top: `${20 + (i % 3) * 25}%`,
                background: ["#6C63FF", "#00D4FF", "#7CFFB2"][i % 3],
              }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity }}
            />
          ))}

          <div className="relative">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#F59E0B" className="text-[#F59E0B]" />
              ))}
              <span className="ml-2 text-sm text-[#94A3B8]">Trusted by 50,000+ ambitious professionals</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              The Future Doesn&apos;t Hire Resumes.<br />
              <span className="gradient-text-primary">It Hires Potential.</span>
            </h2>
            <p className="text-[#94A3B8] text-lg mb-10 max-w-xl mx-auto">
              Start your free career analysis today. No credit card. No commitment. Just results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded-2xl text-white font-bold hover:opacity-90 transition-all shadow-2xl shadow-[rgba(108,99,255,0.5)] hover:-translate-y-1"
              >
                <Sparkles size={20} />
                Start Free Career Analysis
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#copilot"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl glass-card border border-[rgba(255,255,255,0.1)] text-white font-semibold hover:border-[rgba(108,99,255,0.4)] transition-all"
              >
                Try AI Copilot Free →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
