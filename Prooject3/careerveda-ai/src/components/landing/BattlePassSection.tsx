"use client";
import { motion } from "framer-motion";
import { Star, Shield, Zap, Crown, Trophy, Flame, Lock } from "lucide-react";

const RANKS = [
  { level: 1, title: "Student", icon: Star, color: "#94A3B8", xp: 0, perks: ["AI Roadmap Access", "5 Resume Credits", "Community Access"] },
  { level: 10, title: "Builder", icon: Shield, color: "#22C55E", xp: 1000, perks: ["Unlimited Roadmaps", "Mock Interviews", "Project Reviews"] },
  { level: 25, title: "Specialist", icon: Zap, color: "#00D4FF", xp: 5000, perks: ["1-on-1 Mentorship", "ATS Resume AI", "Priority Placement"] },
  { level: 50, title: "Expert", icon: Crown, color: "#6C63FF", xp: 15000, perks: ["Direct Recruiter Access", "Salary Negotiation AI", "Company Referrals"] },
  { level: 100, title: "Legend", icon: Trophy, color: "#F59E0B", xp: 50000, perks: ["Lifetime Premium", "Alumni Network", "Founding Member Badge"] },
];

const ACHIEVEMENTS = [
  { name: "First Step", desc: "Complete profile setup", icon: "🚀", earned: true },
  { name: "Code Warrior", desc: "Solve 10 DSA problems", icon: "⚔️", earned: true },
  { name: "Resume Master", desc: "Get ATS score 90+", icon: "📄", earned: true },
  { name: "Interview Pro", desc: "Complete 5 mock interviews", icon: "🎯", earned: false },
  { name: "Streak King", desc: "30-day learning streak", icon: "🔥", earned: false },
  { name: "Placement Hero", desc: "Land your first offer", icon: "🏆", earned: false },
];

export default function BattlePassSection() {
  const currentXP = 2840;
  const currentLevel = 14;
  const nextLevelXP = 5000;
  const progressPct = (currentXP / nextLevelXP) * 100;

  return (
    <section className="section" id="battlepass">
      <div className="container-cv">
        <div className="text-center mb-16">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[#F59E0B] font-semibold mb-3 tracking-widest text-sm uppercase">
            Career Battle Pass
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-4">
            Level Up Your{" "}
            <span style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Career
            </span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            Gamified career progression. Earn XP, unlock ranks, and compete on the global leaderboard.
          </motion.p>
        </div>

        {/* Current Progress Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="glass-card-strong rounded-3xl p-8 mb-12 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[#94A3B8] text-sm mb-1">Current Rank</p>
              <h3 className="text-2xl font-bold text-[#22C55E]">Builder · Level {currentLevel}</h3>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
              <Shield size={28} className="text-[#22C55E]" />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#94A3B8]">XP Progress</span>
              <span className="font-semibold">{currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP</span>
            </div>
            <div className="h-3 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #22C55E, #00D4FF)" }}
                initial={{ width: 0 }}
                whileInView={{ width: `${progressPct}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
            <Flame size={14} className="text-[#F59E0B]" />
            <span>14 day streak · +50 XP bonus active</span>
          </div>
        </motion.div>

        {/* Ranks */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          {RANKS.map((rank, i) => {
            const Icon = rank.icon;
            const isUnlocked = currentLevel >= rank.level;
            return (
              <motion.div
                key={rank.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card rounded-2xl p-5 text-center relative overflow-hidden transition-all hover:-translate-y-1 ${
                  isUnlocked ? "" : "opacity-60"
                }`}
                style={isUnlocked ? { borderColor: `${rank.color}40`, boxShadow: `0 0 20px ${rank.color}15` } : {}}
              >
                {!isUnlocked && (
                  <div className="absolute top-2 right-2">
                    <Lock size={12} className="text-[#94A3B8]" />
                  </div>
                )}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${rank.color}20`, border: `1px solid ${rank.color}40` }}
                >
                  <Icon size={22} style={{ color: rank.color }} />
                </div>
                <div className="text-xs text-[#94A3B8] mb-1">Level {rank.level}</div>
                <div className="font-bold text-sm mb-3" style={{ color: rank.color }}>{rank.title}</div>
                <ul className="space-y-1.5">
                  {rank.perks.map((p) => (
                    <li key={p} className="text-xs text-[#94A3B8] flex items-start gap-1">
                      <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: rank.color }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          <h3 className="text-xl font-bold mb-6 text-center">Recent Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ACHIEVEMENTS.map((ach, i) => (
              <motion.div
                key={ach.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card rounded-2xl p-4 text-center transition-all hover:-translate-y-1 ${
                  ach.earned ? "" : "opacity-40 grayscale"
                }`}
              >
                <div className="text-3xl mb-2">{ach.icon}</div>
                <div className="font-semibold text-xs mb-1">{ach.name}</div>
                <div className="text-[10px] text-[#94A3B8]">{ach.desc}</div>
                {ach.earned && (
                  <div className="mt-2 text-[10px] text-[#7CFFB2] font-semibold">✓ Earned</div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
