"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Zap, CheckCircle2, AlertCircle, TrendingUp, Target } from "lucide-react";
import Link from "next/link";

const TEMPLATES = [
  { name: "Modern Pro", color: "#6C63FF", tags: ["ATS Friendly", "Tech"] },
  { name: "Executive", color: "#00D4FF", tags: ["Premium", "Management"] },
  { name: "Minimal", color: "#7CFFB2", tags: ["Clean", "Startup"] },
  { name: "Creative", color: "#F59E0B", tags: ["Design", "Creative"] },
];

const ATS_BREAKDOWN = [
  { label: "Keyword Match", score: 91, color: "#7CFFB2" },
  { label: "Formatting", score: 95, color: "#6C63FF" },
  { label: "Action Verbs", score: 88, color: "#00D4FF" },
  { label: "Quantified Results", score: 72, color: "#F59E0B" },
  { label: "Role Relevance", score: 94, color: "#7CFFB2" },
];

export default function ResumePage() {
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setAnalyzed(true); setUploaded(true); }, 2500);
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#050816" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-[#94A3B8] text-sm hover:text-white">← Dashboard</Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">AI Resume Builder</h1>
          <p className="text-[#94A3B8]">ATS-optimized resumes tailored to each role. Get your score instantly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload & Templates */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 border-2 border-dashed border-[rgba(255,255,255,0.1)] cursor-pointer hover:border-[rgba(108,99,255,0.4)] transition-all" onClick={() => { fileRef.current?.click(); handleUpload(); }}>
              <input ref={fileRef} type="file" className="hidden" />
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Upload size={20} className="text-white" />
                </div>
                <h3 className="font-semibold mb-1">{analyzing ? "Analyzing..." : uploaded ? "Resume Uploaded" : "Upload Resume"}</h3>
                <p className="text-[#94A3B8] text-sm">PDF or DOCX</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold mb-4">Resume Templates</h3>
              <div className="space-y-2">
                {TEMPLATES.map((t) => (
                  <div key={t.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[rgba(255,255,255,0.04)] cursor-pointer transition-all">
                    <div className="w-10 h-12 rounded-lg flex-shrink-0" style={{ background: `${t.color}30`, border: `1px solid ${t.color}40` }} />
                    <div>
                      <p className="font-medium text-sm">{t.name}</p>
                      <div className="flex gap-1 mt-1">{t.tags.map(tag => <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[#94A3B8]">{tag}</span>)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ATS Score */}
          <div className="lg:col-span-2 space-y-6">
            {analyzed ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                      <motion.circle cx="40" cy="40" r="32" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 32}`} initial={{ strokeDashoffset: 2 * Math.PI * 32 }} animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - 0.91) }} transition={{ duration: 1.5 }} />
                      <defs><linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6C63FF" /><stop offset="100%" stopColor="#00D4FF" /></linearGradient></defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black text-white">91</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#7CFFB2]">Excellent ATS Score!</h3>
                    <p className="text-[#94A3B8] text-sm">Your resume will pass 95% of ATS filters</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {ATS_BREAKDOWN.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[#94A3B8]">{item.label}</span>
                        <span className="font-semibold" style={{ color: item.color }}>{item.score}%</span>
                      </div>
                      <div className="h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full">
                        <motion.div className="h-full rounded-full" style={{ background: item.color }} initial={{ width: 0 }} animate={{ width: `${item.score}%` }} transition={{ duration: 1 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)]">
                  <p className="text-sm font-semibold text-[#F59E0B] mb-1">⚠ AI Suggestion</p>
                  <p className="text-sm text-[#94A3B8]">Add 2-3 quantified achievements to your experience section. Example: "Improved API response time by 40%"</p>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card rounded-2xl p-12 text-center">
                <FileText size={48} className="mx-auto mb-4 text-[#94A3B8] opacity-50" />
                <h3 className="font-semibold mb-2">Upload your resume to get started</h3>
                <p className="text-[#94A3B8] text-sm">Our AI will analyze it and give you an ATS score instantly</p>
              </div>
            )}

            {/* AI Tips */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Zap size={16} className="text-[#F59E0B]" /> AI Improvement Tips</h3>
              <div className="space-y-3">
                {[
                  { tip: "Use strong action verbs: Led, Built, Optimized, Delivered", type: "good" },
                  { tip: "Add your GitHub URL and LinkedIn in the header", type: "good" },
                  { tip: "Skills section is missing: Docker, AWS, PostgreSQL", type: "warn" },
                  { tip: "Education section needs CGPA/percentage", type: "warn" },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    {t.type === "good" ? <CheckCircle2 size={16} className="text-[#7CFFB2] flex-shrink-0 mt-0.5" /> : <AlertCircle size={16} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />}
                    <span className="text-[#94A3B8]">{t.tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
