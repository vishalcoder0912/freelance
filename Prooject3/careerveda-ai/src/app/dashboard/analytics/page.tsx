"use client";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import Link from "next/link";

const xpData = [
  { day: "Mon", xp: 120 }, { day: "Tue", xp: 280 }, { day: "Wed", xp: 190 },
  { day: "Thu", xp: 340 }, { day: "Fri", xp: 410 }, { day: "Sat", xp: 220 }, { day: "Sun", xp: 390 },
];

const skillData = [
  { skill: "React", score: 78 }, { skill: "Node.js", score: 62 }, { skill: "DSA", score: 55 },
  { skill: "System Design", score: 48 }, { skill: "SQL", score: 71 }, { skill: "AWS", score: 35 },
];

const radarData = [
  { subject: "Frontend", A: 85 }, { subject: "Backend", A: 62 }, { subject: "DSA", A: 55 },
  { subject: "System Design", A: 48 }, { subject: "Cloud", A: 35 }, { subject: "Soft Skills", A: 80 },
];

const STAT_CARDS = [
  { label: "Total XP Earned", value: "2,840", delta: "+340 this week", color: "#6C63FF" },
  { label: "Lessons Completed", value: "34", delta: "+7 this week", color: "#7CFFB2" },
  { label: "Mock Interviews", value: "8", delta: "+2 this week", color: "#00D4FF" },
  { label: "Resume Score", value: "91%", delta: "+6% improved", color: "#F59E0B" },
];

const customTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-xl p-3 text-xs">
        <p className="font-semibold text-white">{label}</p>
        <p className="text-[#6C63FF]">{payload[0].value} XP</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen p-6" style={{ background: "#050816" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-[#94A3B8] text-sm hover:text-white">← Dashboard</Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">Analytics</h1>
          <p className="text-[#94A3B8]">Track your learning progress, skill growth, and career readiness.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card rounded-2xl p-5">
              <div className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="font-medium text-sm mb-1">{s.label}</div>
              <div className="text-xs text-[#94A3B8]">{s.delta}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* XP over time */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold mb-5">Daily XP This Week</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={xpData}>
                <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={customTooltip} />
                <Line type="monotone" dataKey="xp" stroke="#6C63FF" strokeWidth={2} dot={{ fill: "#6C63FF", r: 4 }} activeDot={{ r: 6, fill: "#00D4FF" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Scores */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold mb-5">Skill Assessment Scores</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={skillData} barSize={20}>
                <XAxis dataKey="skill" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "rgba(5,8,22,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", fontSize: 12 }} />
                <Bar dataKey="score" fill="#6C63FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold mb-5">Career Readiness Radar</h3>
          <div className="flex justify-center">
            <ResponsiveContainer width={"100%"} height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <Radar name="Skills" dataKey="A" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
