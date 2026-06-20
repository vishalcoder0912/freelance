"use client";
import { motion } from "framer-motion";
import { Trophy, Flame, Star, Shield, Crown, Lock, Zap } from "lucide-react";
import Link from "next/link";

const LEADERBOARD = [
  { rank: 1, name: "Arjun S.", xp: 48900, level: 98, avatar: "A", color: "#F59E0B" },
  { rank: 2, name: "Priya N.", xp: 45200, level: 92, avatar: "P", color: "#94A3B8" },
  { rank: 3, name: "Rahul V.", xp: 41800, level: 88, avatar: "R", color: "#F59E0B" },
  { rank: 4, name: "You (Vishal)", xp: 2840, level: 14, avatar: "V", color: "#6C63FF", isMe: true },
  { rank: 5, name: "Ananya S.", xp: 2710, level: 13, avatar: "A", color: "#7CFFB2" },
];

const DAILY_QUESTS = [
  { label: "Complete 1 lesson", xp: 25, done: true },
  { label: "Solve 2 DSA problems", xp: 40, done: true },
  { label: "Take a mock interview", xp: 80, done: false },
  { label: "Update your resume", xp: 30, done: false },
];

export default function BattlePassPage() {
  return (
    <div className="min-h-screen p-6" style={{ background: "#050816" }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-[#94A3B8] text-sm hover:text-white">← Dashboard</Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">Career Battle Pass</h1>
          <p className="text-[#94A3B8]">Earn XP, unlock achievements, and climb the global leaderboard.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card-strong rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
                  <Shield size={28} className="text-[#22C55E]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Builder · Level 14</h3>
                  <p className="text-[#94A3B8] text-sm">Next: Level 15 · 2,160 XP to go</p>
                  <div className="flex items-center gap-1 mt-1 text-[#F59E0B] text-sm">
                    <Flame size={14} />
                    <span>14-day streak · +50 XP/day active</span>
                  </div>
                </div>
              </div>
              <div className="h-3 bg-[rgba(255,255,255,0.06)] rounded-full mb-2">
                <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #22C55E, #00D4FF)" }} initial={{ width: 0 }} animate={{ width: "56.8%" }} transition={{ duration: 1.5 }} />
              </div>
              <p className="text-xs text-[#94A3B8] text-right">2,840 / 5,000 XP</p>
            </div>

            {/* Daily Quests */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-[#F59E0B]" />
                <h3 className="font-bold">Daily Quests</h3>
                <span className="ml-auto text-xs text-[#94A3B8]">Resets in 9h 42m</span>
              </div>
              <div className="space-y-3">
                {DAILY_QUESTS.map((q, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${ q.done ? "bg-[rgba(124,255,178,0.05)] border border-[rgba(124,255,178,0.15)]" : "bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]" }`}>
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${ q.done ? "bg-[#7CFFB2]" : "border border-[rgba(255,255,255,0.2)]" }`}>
                      {q.done && <span className="text-[#050816] text-[10px] font-black">✓</span>}
                    </div>
                    <span className={`flex-1 text-sm ${ q.done ? "line-through text-[#94A3B8]" : "" }`}>{q.label}</span>
                    <span className="text-xs font-semibold text-[#F59E0B]">+{q.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Trophy size={18} className="text-[#F59E0B]" />
              <h3 className="font-bold">Global Leaderboard</h3>
            </div>
            <div className="space-y-3">
              {LEADERBOARD.map((entry) => (
                <div key={entry.rank} className={`flex items-center gap-3 p-3 rounded-xl ${ entry.isMe ? "border border-[rgba(108,99,255,0.4)] bg-[rgba(108,99,255,0.1)]" : "" }`}>
                  <span className="text-sm font-bold text-[#94A3B8] w-5 text-center">#{entry.rank}</span>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: `${entry.color}20`, color: entry.color }}>{entry.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.name}</p>
                    <p className="text-xs text-[#94A3B8]">Lv.{entry.level}</p>
                  </div>
                  <div className="text-xs font-semibold text-[#94A3B8] text-right">
                    <div style={{ color: entry.color }}>{(entry.xp / 1000).toFixed(1)}K</div>
                    <div>XP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
