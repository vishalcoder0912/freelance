"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain, Home, BookOpen, Code2, Users, Briefcase,
  Trophy, BarChart3, Settings, LogOut, Bell, Flame,
  TrendingUp, Target, Zap, Star, Calendar, ArrowUpRight,
  FileText, Mic, ChevronRight, Map, Award
} from "lucide-react";

const SIDEBAR_LINKS = [
  { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Map, label: "My Roadmap", href: "/dashboard/roadmap" },
  { icon: BookOpen, label: "Courses", href: "/dashboard/courses" },
  { icon: Code2, label: "Assessments", href: "/dashboard/assessments" },
  { icon: FileText, label: "Resume AI", href: "/dashboard/resume" },
  { icon: Mic, label: "Interview Coach", href: "/dashboard/interview" },
  { icon: Users, label: "Mentors", href: "/dashboard/mentors" },
  { icon: Briefcase, label: "Job Matcher", href: "/dashboard/jobs" },
  { icon: Trophy, label: "Battle Pass", href: "/dashboard/battlepass" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
];

const AI_SUGGESTIONS = [
  { text: "Build a MERN Stack project to strengthen your portfolio", priority: "high", icon: "🚀" },
  { text: "Practice System Design — Razorpay asks this in round 2", priority: "medium", icon: "🏗️" },
  { text: "Complete the DSA module on Binary Trees", priority: "low", icon: "🌳" },
];

const RECENT_ACTIVITY = [
  { action: "Completed", item: "React Hooks Deep Dive", time: "2h ago", xp: "+25 XP", color: "#7CFFB2" },
  { action: "Scored", item: "Mock Interview — System Design", time: "Yesterday", xp: "+80 XP", color: "#00D4FF" },
  { action: "Applied to", item: "SDE-1 at Razorpay", time: "2 days ago", xp: "+15 XP", color: "#F59E0B" },
  { action: "Updated", item: "Resume — ATS Score: 91/100", time: "3 days ago", xp: "+40 XP", color: "#6C63FF" },
];

const JOBS = [
  { company: "Razorpay", role: "SDE-1", match: 91, salary: "₹20–28 LPA", color: "#6C63FF" },
  { company: "Swiggy", role: "Backend Engineer", match: 87, salary: "₹18–24 LPA", color: "#FC8019" },
  { company: "Zepto", role: "Full Stack Dev", match: 84, salary: "₹15–22 LPA", color: "#00D4FF" },
];

function MetricCard({ label, value, subtext, color, icon: Icon }: {
  label: string; value: string; subtext: string; color: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5 rounded-2xl" style={{ background: `radial-gradient(circle at 100% 0%, ${color}, transparent)` }} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <ArrowUpRight size={16} className="text-[#94A3B8]" />
      </div>
      <div className="text-2xl font-black mb-0.5" style={{ color }}>{value}</div>
      <div className="text-sm font-medium text-white mb-1">{label}</div>
      <div className="text-xs text-[#94A3B8]">{subtext}</div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex" style={{ background: "#050816" }}>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 flex flex-col ${
        sidebarOpen ? "w-64" : "w-16"
      } bg-[rgba(5,8,22,0.95)] border-r border-[rgba(255,255,255,0.06)]`}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-[rgba(255,255,255,0.06)]">
          <div className="w-9 h-9 bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] rounded-xl flex items-center justify-center flex-shrink-0">
            <Brain size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <span className="font-bold text-sm">Career<span className="gradient-text-primary">Veda</span></span>
              <span className="block text-[10px] text-[#94A3B8]">AI OS</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  link.active
                    ? "bg-gradient-to-r from-[rgba(108,99,255,0.2)] to-[rgba(0,212,255,0.1)] text-white border border-[rgba(108,99,255,0.3)]"
                    : "text-[#94A3B8] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-[rgba(255,255,255,0.06)] space-y-1">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all">
            <Settings size={18} />
            {sidebarOpen && <span className="text-sm">Settings</span>}
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all">
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm">Exit to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[rgba(5,8,22,0.9)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-9 h-9 glass-card rounded-xl flex items-center justify-center">
            <ChevronRight size={16} className={`transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
          </button>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 glass-card rounded-xl flex items-center justify-center relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 glass-card rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center text-xs font-black">V</div>
              <span className="text-sm font-medium">Vishal</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 max-w-7xl mx-auto">
          {/* Greeting */}
          <div className="mb-8">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-1">
              Good Evening, <span className="gradient-text-primary">Vishal</span> 👋
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-[#94A3B8]">
              You&apos;re on a 14-day streak. Keep the momentum going!
            </motion.p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <MetricCard label="Career Readiness" value="87%" subtext="↑ 3% this week" color="#6C63FF" icon={Target} />
            <MetricCard label="Placement Probability" value="81%" subtext="Based on your profile" color="#7CFFB2" icon={TrendingUp} />
            <MetricCard label="Interview Readiness" value="73%" subtext="3 mocks completed" color="#00D4FF" icon={Mic} />
            <MetricCard label="Streak" value="14 days" subtext="+50 XP/day bonus" color="#F59E0B" icon={Flame} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Roadmap Progress */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-lg">Roadmap Progress</h2>
                <Link href="/dashboard/roadmap" className="text-[#6C63FF] text-sm hover:underline">View All →</Link>
              </div>
              <p className="text-[#94A3B8] text-sm mb-3">Full Stack Developer · Month 3 of 6</p>
              <div className="h-2 bg-[rgba(255,255,255,0.06)] rounded-full mb-5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF]"
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <div className="space-y-3">
                {[
                  { label: "HTML/CSS/JS Fundamentals", done: true },
                  { label: "React & Next.js", done: true },
                  { label: "Node.js & Express", done: false, current: true },
                  { label: "PostgreSQL & Prisma", done: false },
                  { label: "System Design", done: false },
                  { label: "DSA & Problem Solving", done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${
                      item.done ? "bg-[#7CFFB2]" : item.current ? "border-2 border-[#6C63FF] bg-[rgba(108,99,255,0.2)]" : "border border-[rgba(255,255,255,0.1)] bg-transparent"
                    }`}>
                      {item.done && <span className="text-[#050816] text-[10px] font-black">✓</span>}
                      {item.current && <span className="w-2 h-2 rounded-full bg-[#6C63FF]" />}
                    </div>
                    <span className={`text-sm ${
                      item.done ? "text-[#94A3B8] line-through" : item.current ? "text-white font-semibold" : "text-[#94A3B8]"
                    }`}>
                      {item.label}
                    </span>
                    {item.current && <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[rgba(108,99,255,0.2)] text-[#6C63FF]">In Progress</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Zap size={18} className="text-[#F59E0B]" />
                <h2 className="font-bold text-lg">AI Suggestions</h2>
              </div>
              <div className="space-y-4">
                {AI_SUGGESTIONS.map((s, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${
                    s.priority === "high" ? "border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.05)]" :
                    s.priority === "medium" ? "border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.05)]" :
                    "border-[rgba(255,255,255,0.06)] bg-transparent"
                  }`}>
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{s.icon}</span>
                      <p className="text-sm text-[#94A3B8] leading-relaxed">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">XP Progress</span>
                  <span className="text-xs text-[#94A3B8]">2,840 / 5,000</span>
                </div>
                <div className="h-2 bg-[rgba(255,255,255,0.06)] rounded-full">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-[#00D4FF]"
                    initial={{ width: 0 }}
                    animate={{ width: "56.8%" }}
                    transition={{ duration: 1.5 }}
                  />
                </div>
                <p className="text-xs text-[#94A3B8] mt-2">Level 14 Builder · 2,160 XP to Level 15</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-5">Recent Activity</h2>
              <div className="space-y-3">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[rgba(255,255,255,0.03)] transition-colors">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="text-[#94A3B8]">{a.action} </span>
                        <span className="font-medium">{a.item}</span>
                      </p>
                      <p className="text-xs text-[#94A3B8]">{a.time}</p>
                    </div>
                    <span className="text-xs font-semibold flex-shrink-0" style={{ color: a.color }}>{a.xp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Jobs */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-lg">Top Job Matches</h2>
                <Link href="/dashboard/jobs" className="text-[#6C63FF] text-sm hover:underline">View All →</Link>
              </div>
              <div className="space-y-3">
                {JOBS.map((job, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 glass-card rounded-xl hover:-translate-y-0.5 transition-transform cursor-pointer">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0" style={{ background: `${job.color}20`, color: job.color }}>
                      {job.company[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{job.role}</p>
                      <p className="text-xs text-[#94A3B8]">{job.company} · {job.salary}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold" style={{ color: job.match > 88 ? "#7CFFB2" : "#F59E0B" }}>{job.match}%</div>
                      <div className="text-[10px] text-[#94A3B8]">match</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold text-[#6C63FF] border border-[rgba(108,99,255,0.3)] hover:bg-[rgba(108,99,255,0.1)] transition-colors">
                Browse All 1,200+ Jobs
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
