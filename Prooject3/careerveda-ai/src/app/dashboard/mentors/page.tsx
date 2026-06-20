"use client";
import { motion } from "framer-motion";
import { Star, MapPin, Briefcase, Calendar, Users, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const MENTORS = [
  { name: "Aditya Kumar", role: "Senior SDE", company: "Google", exp: "7 years", rating: 4.9, sessions: 340, tags: ["DSA", "System Design", "Go"], price: "Free", avatar: "A", color: "#6C63FF" },
  { name: "Priya Ramesh", role: "ML Engineer", company: "Meta", exp: "5 years", rating: 4.8, sessions: 210, tags: ["PyTorch", "LLMs", "MLOps"], price: "Free", avatar: "P", color: "#00D4FF" },
  { name: "Rohan Joshi", role: "Product Manager", company: "Razorpay", exp: "6 years", rating: 4.9, sessions: 180, tags: ["Product", "Analytics", "Strategy"], price: "Free", avatar: "R", color: "#7CFFB2" },
  { name: "Sneha Agarwal", role: "Frontend Lead", company: "CRED", exp: "4 years", rating: 4.7, sessions: 150, tags: ["React", "TypeScript", "Performance"], price: "Free", avatar: "S", color: "#F59E0B" },
  { name: "Vikram Bhat", role: "DevOps Lead", company: "Amazon", exp: "8 years", rating: 4.9, sessions: 290, tags: ["AWS", "Kubernetes", "Terraform"], price: "Free", avatar: "V", color: "#EF4444" },
  { name: "Nisha Patel", role: "Data Scientist", company: "Flipkart", exp: "5 years", rating: 4.8, sessions: 175, tags: ["Python", "ML", "SQL"], price: "Free", avatar: "N", color: "#A78BFA" },
];

export default function MentorsPage() {
  const [search, setSearch] = useState("");
  const filtered = MENTORS.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.company.toLowerCase().includes(search.toLowerCase()) || m.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="min-h-screen p-6" style={{ background: "#050816" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-[#94A3B8] text-sm hover:text-white">← Dashboard</Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">Mentor Marketplace</h1>
          <p className="text-[#94A3B8]">Learn from engineers, PMs, and leaders at top companies. All sessions are free.</p>
        </div>

        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company, or skill..."
            className="w-full pl-12 pr-4 py-3 glass-card rounded-2xl text-sm text-white placeholder-[#94A3B8] bg-transparent border border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-[rgba(108,99,255,0.5)] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((mentor, i) => (
            <motion.div key={mentor.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4 }} className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0" style={{ background: `${mentor.color}20`, color: mentor.color, border: `1px solid ${mentor.color}40` }}>{mentor.avatar}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold">{mentor.name}</h3>
                  <p className="text-sm text-[#94A3B8]">{mentor.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Briefcase size={12} className="text-[#94A3B8]" />
                    <span className="text-xs text-[#94A3B8]">{mentor.company}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {mentor.tags.map(tag => <span key={tag} className="px-2 py-0.5 rounded-lg text-xs" style={{ background: `${mentor.color}15`, color: mentor.color }}>{tag}</span>)}
              </div>
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Star size={13} fill="#F59E0B" className="text-[#F59E0B]" />
                  <span className="font-semibold">{mentor.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-[#94A3B8]">
                  <Users size={13} />
                  <span>{mentor.sessions} sessions</span>
                </div>
                <div className="flex items-center gap-1 text-[#94A3B8]">
                  <Briefcase size={13} />
                  <span>{mentor.exp}</span>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[rgba(108,99,255,0.3)] to-[rgba(0,212,255,0.3)] border border-[rgba(108,99,255,0.3)] hover:from-[rgba(108,99,255,0.5)] hover:to-[rgba(0,212,255,0.5)] transition-all flex items-center justify-center gap-2">
                <Calendar size={14} /> Book Free Session
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
