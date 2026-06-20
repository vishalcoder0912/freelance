"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Play, RotateCcw, Star, ChevronRight } from "lucide-react";
import Link from "next/link";

const QUESTIONS = [
  { q: "Tell me about yourself and your background.", type: "Behavioral", difficulty: "Easy" },
  { q: "Design a URL shortener like bit.ly. Walk me through the system architecture.", type: "System Design", difficulty: "Hard" },
  { q: "What is the difference between useEffect and useLayoutEffect in React?", type: "Technical", difficulty: "Medium" },
  { q: "Tell me about a time you had a conflict with a teammate. How did you resolve it?", type: "Behavioral", difficulty: "Medium" },
  { q: "Implement a function to find the LCA of two nodes in a Binary Tree.", type: "DSA", difficulty: "Hard" },
];

const DIFF_COLOR: Record<string, string> = { Easy: "#7CFFB2", Medium: "#F59E0B", Hard: "#EF4444" };
const TYPE_COLOR: Record<string, string> = { Behavioral: "#6C63FF", "System Design": "#00D4FF", Technical: "#7CFFB2", DSA: "#F59E0B" };

export default function InterviewPage() {
  const [recording, setRecording] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answered, setAnswered] = useState<number[]>([]);

  const markAnswered = () => {
    setAnswered(prev => [...prev, currentQ]);
    setRecording(false);
    if (currentQ < QUESTIONS.length - 1) setTimeout(() => setCurrentQ(prev => prev + 1), 500);
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#050816" }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-[#94A3B8] text-sm hover:text-white">← Dashboard</Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">AI Interview Coach</h1>
          <p className="text-[#94A3B8]">Practice with real FAANG questions. Get AI feedback on your answers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card-strong rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#94A3B8]">Question {currentQ + 1} of {QUESTIONS.length}</span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: `${TYPE_COLOR[QUESTIONS[currentQ].type]}20`, color: TYPE_COLOR[QUESTIONS[currentQ].type] }}>{QUESTIONS[currentQ].type}</span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: `${DIFF_COLOR[QUESTIONS[currentQ].difficulty]}20`, color: DIFF_COLOR[QUESTIONS[currentQ].difficulty] }}>{QUESTIONS[currentQ].difficulty}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold leading-relaxed mb-6">{QUESTIONS[currentQ].q}</h3>

              {/* Record */}
              <div className="text-center py-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRecording(!recording)}
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${ recording ? "bg-[#EF4444] shadow-lg shadow-[rgba(239,68,68,0.5)]" : "bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] shadow-lg shadow-[rgba(108,99,255,0.4)]" }`}
                >
                  {recording ? <MicOff size={28} className="text-white" /> : <Mic size={28} className="text-white" />}
                </motion.button>
                {recording && (
                  <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="mt-3 text-[#EF4444] text-sm font-semibold">● Recording...</motion.div>
                )}
                {!recording && <p className="mt-3 text-sm text-[#94A3B8]">Click to start recording your answer</p>}
              </div>

              <div className="flex gap-3 justify-center mt-4">
                {recording && (
                  <button onClick={markAnswered} className="px-6 py-2.5 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded-xl text-sm font-semibold text-white">
                    Submit Answer
                  </button>
                )}
                <button onClick={() => setCurrentQ((prev) => (prev + 1) % QUESTIONS.length)} className="px-6 py-2.5 glass-card rounded-xl text-sm text-[#94A3B8] hover:text-white border border-[rgba(255,255,255,0.1)] flex items-center gap-2">
                  <ChevronRight size={16} /> Skip
                </button>
              </div>
            </div>

            {/* AI Feedback (shown for answered) */}
            {answered.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold mb-4 text-[#7CFFB2]">AI Feedback</h3>
                <div className="space-y-3 text-sm text-[#94A3B8]">
                  <p>✓ Good structure — you used the STAR method effectively.</p>
                  <p>✓ Clear communication with good pacing.</p>
                  <p>⚠ Consider adding more specific metrics (e.g., "reduced load time by 30%").</p>
                  <p>⚠ Avoid filler words like "um" and "uh" — 3 instances detected.</p>
                </div>
                <div className="mt-4 flex gap-4">
                  <div className="glass-card rounded-xl p-3 text-center flex-1">
                    <div className="text-xl font-black text-[#7CFFB2]">78%</div>
                    <div className="text-xs text-[#94A3B8]">Answer Quality</div>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-center flex-1">
                    <div className="text-xl font-black text-[#00D4FF]">85%</div>
                    <div className="text-xs text-[#94A3B8]">Confidence</div>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-center flex-1">
                    <div className="text-xl font-black text-[#F59E0B]">3</div>
                    <div className="text-xs text-[#94A3B8]">Filler Words</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Questions list */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-[#94A3B8]">Question Bank</h3>
            {QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => setCurrentQ(i)} className={`w-full text-left p-4 rounded-2xl glass-card transition-all ${ i === currentQ ? "border border-[rgba(108,99,255,0.4)]" : answered.includes(i) ? "opacity-60" : "hover:bg-[rgba(255,255,255,0.03)]" }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs" style={{ color: DIFF_COLOR[q.difficulty] }}>{q.difficulty}</span>
                  <span className="text-xs" style={{ color: TYPE_COLOR[q.type] }}>{q.type}</span>
                  {answered.includes(i) && <span className="ml-auto text-[#7CFFB2] text-xs">✓ Done</span>}
                </div>
                <p className="text-xs text-[#94A3B8] line-clamp-2">{q.q}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
