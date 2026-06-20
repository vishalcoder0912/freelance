"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Clock, Star, Play, CheckCircle2, Trophy } from "lucide-react";
import Link from "next/link";

const ASSESSMENTS = [
  { id: 1, title: "DSA Fundamentals", questions: 20, time: "45 min", difficulty: "Medium", xp: 200, completed: true, score: 82 },
  { id: 2, title: "React & Next.js", questions: 15, time: "30 min", difficulty: "Medium", xp: 150, completed: true, score: 91 },
  { id: 3, title: "System Design Basics", questions: 10, time: "60 min", difficulty: "Hard", xp: 300, completed: false },
  { id: 4, title: "Node.js & Express", questions: 18, time: "40 min", difficulty: "Medium", xp: 180, completed: false },
  { id: 5, title: "SQL & Databases", questions: 25, time: "35 min", difficulty: "Easy", xp: 120, completed: false },
  { id: 6, title: "AI/ML Fundamentals", questions: 20, time: "50 min", difficulty: "Hard", xp: 250, completed: false },
];

const DIFF_COLOR: Record<string, string> = { Easy: "#7CFFB2", Medium: "#F59E0B", Hard: "#EF4444" };

export default function AssessmentsPage() {
  const [activeTest, setActiveTest] = useState<number | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const DEMO_QUESTIONS = [
    { q: "What is the time complexity of binary search?", opts: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1 },
    { q: "Which data structure uses LIFO order?", opts: ["Queue", "Array", "Stack", "LinkedList"], correct: 2 },
    { q: "What does SQL JOIN do?", opts: ["Creates a new table", "Deletes rows", "Combines rows from multiple tables", "Sorts data"], correct: 2 },
  ];

  const handleAnswer = (idx: number) => {
    setAnswers([...answers, idx]);
    if (qIndex < DEMO_QUESTIONS.length - 1) setQIndex(qIndex + 1);
    else setDone(true);
  };

  if (activeTest && !done) {
    const q = DEMO_QUESTIONS[qIndex];
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ background: "#050816" }}>
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-8">
            <span className="text-[#94A3B8] text-sm">Question {qIndex + 1} / {DEMO_QUESTIONS.length}</span>
            <button onClick={() => { setActiveTest(null); setQIndex(0); setAnswers([]); }} className="text-xs text-[#94A3B8] hover:text-white">Exit Test</button>
          </div>
          <div className="h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full mb-8">
            <div className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF]" style={{ width: `${((qIndex) / DEMO_QUESTIONS.length) * 100}%`, transition: "width 0.5s" }} />
          </div>
          <div className="glass-card-strong rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-8">{q.q}</h2>
            <div className="space-y-3">
              {q.opts.map((opt, i) => (
                <motion.button key={i} whileHover={{ x: 4 }} onClick={() => handleAnswer(i)} className="w-full text-left p-4 rounded-2xl glass-card border border-[rgba(255,255,255,0.08)] hover:border-[rgba(108,99,255,0.5)] hover:bg-[rgba(108,99,255,0.1)] transition-all font-medium">
                  <span className="text-[#6C63FF] font-bold mr-3">{String.fromCharCode(65 + i)}.</span>{opt}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    const score = Math.round((answers.filter((a, i) => a === DEMO_QUESTIONS[i].correct).length / DEMO_QUESTIONS.length) * 100);
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ background: "#050816" }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card-strong rounded-3xl p-12 text-center max-w-md">
          <Trophy size={64} className="mx-auto mb-4 text-[#F59E0B]" />
          <h2 className="text-3xl font-black mb-2">Assessment Complete!</h2>
          <div className="text-6xl font-black gradient-text-primary my-6">{score}%</div>
          <p className="text-[#94A3B8] mb-8">You answered {answers.filter((a, i) => a === DEMO_QUESTIONS[i].correct).length} out of {DEMO_QUESTIONS.length} correctly</p>
          <button onClick={() => { setActiveTest(null); setDone(false); setQIndex(0); setAnswers([]); }} className="px-8 py-3 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded-2xl font-semibold text-white">Back to Assessments</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: "#050816" }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-[#94A3B8] text-sm hover:text-white">← Dashboard</Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">Assessments</h1>
          <p className="text-[#94A3B8]">Test your knowledge, earn XP, and identify skill gaps.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ASSESSMENTS.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className={`glass-card rounded-2xl p-5 ${ a.completed ? "" : "" }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center">
                  <Code2 size={18} className="text-white" />
                </div>
                {a.completed && <CheckCircle2 size={18} className="text-[#7CFFB2]" />}
              </div>
              <h3 className="font-semibold mb-2">{a.title}</h3>
              <div className="flex items-center gap-4 text-xs text-[#94A3B8] mb-3">
                <span className="flex items-center gap-1"><Clock size={11} />{a.time}</span>
                <span>{a.questions} questions</span>
                <span className="flex items-center gap-1"><Star size={11} className="text-[#F59E0B]" />{a.xp} XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium px-2 py-0.5 rounded-lg" style={{ background: `${DIFF_COLOR[a.difficulty]}15`, color: DIFF_COLOR[a.difficulty] }}>{a.difficulty}</span>
                {a.completed ? (
                  <span className="text-sm font-semibold text-[#7CFFB2]">{a.score}% Score</span>
                ) : (
                  <button onClick={() => setActiveTest(a.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded-xl text-xs font-semibold text-white">
                    <Play size={11} /> Start
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
