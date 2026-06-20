"use client";
import { motion } from "framer-motion";
import { Briefcase, MapPin, DollarSign, TrendingUp, Search, SlidersHorizontal, ExternalLink } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const JOBS = [
  { id: 1, title: "SDE-1 (Full Stack)", company: "Razorpay", location: "Bangalore", salary: "₹20-28 LPA", match: 91, type: "Full-time", tags: ["React", "Node.js", "PostgreSQL"], color: "#6C63FF", posted: "2d ago", applicants: 342 },
  { id: 2, title: "Backend Engineer", company: "Swiggy", location: "Bangalore", salary: "₹18-24 LPA", match: 87, type: "Full-time", tags: ["Go", "Microservices", "Kafka"], color: "#FC8019", posted: "1d ago", applicants: 210 },
  { id: 3, title: "Full Stack Developer", company: "Zepto", location: "Mumbai", salary: "₹15-22 LPA", match: 84, type: "Full-time", tags: ["React", "Node.js", "MongoDB"], color: "#00D4FF", posted: "3d ago", applicants: 180 },
  { id: 4, title: "Software Engineer II", company: "CRED", location: "Bangalore", salary: "₹22-35 LPA", match: 79, type: "Full-time", tags: ["Java", "Spring Boot", "AWS"], color: "#7CFFB2", posted: "5d ago", applicants: 420 },
  { id: 5, title: "Frontend Engineer", company: "Dunzo", location: "Bangalore", salary: "₹12-18 LPA", match: 88, type: "Full-time", tags: ["React", "TypeScript", "Redux"], color: "#F59E0B", posted: "1d ago", applicants: 95 },
  { id: 6, title: "Associate SDE", company: "Meesho", location: "Bangalore", salary: "₹14-20 LPA", match: 82, type: "Full-time", tags: ["Python", "Django", "MySQL"], color: "#EF4444", posted: "4d ago", applicants: 560 },
];

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState<number[]>([]);

  return (
    <div className="min-h-screen p-6" style={{ background: "#050816" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-[#94A3B8] text-sm hover:text-white">← Dashboard</Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">AI Job Matcher</h1>
          <p className="text-[#94A3B8]">Jobs matched to your profile. Updated daily from 10,000+ listings.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[{ l: "Total Matches", v: "1,247" }, { l: "Applied", v: "8" }, { l: "Interviews", v: "3" }, { l: "Avg Match", v: "84%" }].map(s => (
            <div key={s.l} className="glass-card rounded-2xl p-4 text-center">
              <div className="text-2xl font-black gradient-text-primary">{s.v}</div>
              <div className="text-xs text-[#94A3B8] mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs..." className="w-full pl-12 pr-4 py-3 glass-card rounded-2xl text-sm text-white placeholder-[#94A3B8] bg-transparent border border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-[rgba(108,99,255,0.5)] transition-all" />
          </div>
          <button className="px-4 py-3 glass-card rounded-2xl flex items-center gap-2 text-sm text-[#94A3B8] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(108,99,255,0.4)] transition-all">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {/* Jobs */}
        <div className="space-y-3">
          {JOBS.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())).map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0" style={{ background: `${job.color}20`, color: job.color, border: `1px solid ${job.color}30` }}>{job.company[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-[#94A3B8] mt-1">
                        <span>{job.company}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                        <span className="flex items-center gap-1"><DollarSign size={12} />{job.salary}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-black" style={{ color: job.match > 88 ? "#7CFFB2" : "#F59E0B" }}>{job.match}%</div>
                      <div className="text-xs text-[#94A3B8]">match</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {job.tags.map(t => <span key={t} className="px-2 py-0.5 text-xs rounded-lg bg-[rgba(255,255,255,0.05)] text-[#94A3B8]">{t}</span>)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#94A3B8]">{job.posted}</span>
                      <button
                        onClick={() => setApplied(prev => applied.includes(job.id) ? prev : [...prev, job.id])}
                        className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${ applied.includes(job.id) ? "bg-[rgba(124,255,178,0.2)] text-[#7CFFB2] border border-[rgba(124,255,178,0.3)]" : "bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] text-white" }`}
                      >
                        {applied.includes(job.id) ? "✓ Applied" : "Apply Now"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
