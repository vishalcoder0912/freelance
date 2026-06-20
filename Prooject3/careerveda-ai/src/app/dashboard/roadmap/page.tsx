"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock, Play, Clock, Star } from "lucide-react";
import Link from "next/link";

const MODULES = [
  { title: "HTML & CSS Mastery", lessons: 12, duration: "8h", status: "done", xp: 200 },
  { title: "JavaScript Deep Dive", lessons: 18, duration: "14h", status: "done", xp: 350 },
  { title: "React & Next.js", lessons: 22, duration: "18h", status: "done", xp: 450 },
  { title: "Node.js & Express", lessons: 15, duration: "12h", status: "current", xp: 300 },
  { title: "PostgreSQL & Prisma", lessons: 10, duration: "8h", status: "locked", xp: 250 },
  { title: "System Design", lessons: 14, duration: "12h", status: "locked", xp: 400 },
  { title: "DSA & Problem Solving", lessons: 30, duration: "24h", status: "locked", xp: 600 },
  { title: "Portfolio & Projects", lessons: 8, duration: "6h", status: "locked", xp: 200 },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen p-6" style={{ background: "#050816" }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-[#94A3B8] text-sm hover:text-white transition-colors">← Dashboard</Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">My Roadmap</h1>
          <p className="text-[#94A3B8]">Full Stack Developer · Month 3 of 6 · 65% complete</p>
          <div className="mt-4 h-2 bg-[rgba(255,255,255,0.06)] rounded-full max-w-md">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF]" initial={{ width: 0 }} animate={{ width: "65%" }} transition={{ duration: 1.5 }} />
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#6C63FF] via-[rgba(108,99,255,0.3)] to-transparent" />
          <div className="space-y-4 pl-16">
            {MODULES.map((mod, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className={`glass-card rounded-2xl p-5 relative ${ mod.status === "current" ? "border border-[rgba(108,99,255,0.4)]" : mod.status === "locked" ? "opacity-60" : "" }`}>
                <div className="absolute -left-[2.65rem] top-1/2 -translate-y-1/2">
                  {mod.status === "done" && <CheckCircle2 size={20} className="text-[#7CFFB2]" />}
                  {mod.status === "current" && <div className="w-5 h-5 rounded-full border-2 border-[#6C63FF] flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-[#6C63FF]" /></div>}
                  {mod.status === "locked" && <Lock size={20} className="text-[#94A3B8]" />}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-semibold text-lg mb-1 ${ mod.status === "current" ? "text-white" : "" }`}>{mod.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#94A3B8]">
                      <span className="flex items-center gap-1"><Play size={12} /> {mod.lessons} lessons</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {mod.duration}</span>
                      <span className="flex items-center gap-1"><Star size={12} className="text-[#F59E0B]" /> {mod.xp} XP</span>
                    </div>
                  </div>
                  {mod.status === "current" && (
                    <button className="px-4 py-2 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded-xl text-sm font-semibold text-white">Continue</button>
                  )}
                  {mod.status === "done" && <span className="text-xs text-[#7CFFB2] font-semibold">Completed ✓</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
