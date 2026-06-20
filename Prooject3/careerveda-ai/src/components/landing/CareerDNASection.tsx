"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Zap, TrendingUp, AlertCircle, Target, DollarSign, Building2 } from "lucide-react";

const GithubIcon = ({ size = 18, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const DNA_RESULTS = [
  { icon: TrendingUp, label: "Career Strengths", value: "Problem Solving, System Design, Communication", color: "#7CFFB2", score: 88 },
  { icon: AlertCircle, label: "Skill Gaps", value: "Cloud Infrastructure, LLM Fine-tuning", color: "#F59E0B", score: 62 },
  { icon: Target, label: "Hidden Opportunities", value: "AI Product Manager, ML Infrastructure Lead", color: "#00D4FF", score: 91 },
  { icon: DollarSign, label: "Salary Potential", value: "₹18–32 LPA (Top 15% in your domain)", color: "#6C63FF", score: 75 },
  { icon: Building2, label: "Top Company Match", value: "Razorpay 91% · Zepto 87% · Swiggy 85%", color: "#7CFFB2", score: 91 },
];

function DNAHelix() {
  return (
    <div className="relative w-32 h-64 mx-auto">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-full flex justify-between items-center"
          style={{ top: `${i * 10}%` }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        >
          <motion.div
            className="w-4 h-4 rounded-full"
            style={{ background: i % 2 === 0 ? "#6C63FF" : "#00D4FF", boxShadow: `0 0 8px ${i % 2 === 0 ? "#6C63FF" : "#00D4FF"}` }}
            animate={{ x: [0, 48, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
          />
          <motion.div
            className="w-full h-px mx-1"
            style={{ background: `linear-gradient(90deg, ${i % 2 === 0 ? "#6C63FF" : "#00D4FF"}, transparent)` }}
          />
          <motion.div
            className="w-4 h-4 rounded-full"
            style={{ background: i % 2 === 0 ? "#7CFFB2" : "#F59E0B", boxShadow: `0 0 8px ${i % 2 === 0 ? "#7CFFB2" : "#F59E0B"}` }}
            animate={{ x: [0, -48, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function CareerDNASection() {
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const triggerAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 2500);
  };

  return (
    <section className="section" id="dna">
      <div className="container-cv">
        <div className="text-center mb-16">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[#00D4FF] font-semibold mb-3 tracking-widest text-sm uppercase">
            Career DNA Analyzer
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-4">
            Decode Your{" "}
            <span className="gradient-text-accent">Career DNA</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            Upload your resume, LinkedIn, or GitHub. Our AI decodes your unique career genome.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Upload */}
          <div className="space-y-4">
            {/* Resume upload */}
            <div
              className={`glass-card rounded-3xl p-8 border-2 border-dashed transition-all cursor-pointer ${
                dragOver ? "border-[#6C63FF] bg-[rgba(108,99,255,0.1)]" : "border-[rgba(255,255,255,0.1)]"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); triggerAnalysis(); }}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" className="hidden" onChange={triggerAnalysis} />
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload size={24} className="text-white" />
                </div>
                <h3 className="font-semibold mb-2">Drop your Resume</h3>
                <p className="text-[#94A3B8] text-sm">PDF, DOCX supported</p>
              </div>
            </div>

            {/* Other inputs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: LinkedinIcon, label: "LinkedIn Profile", color: "#00D4FF" },
                { icon: GithubIcon, label: "GitHub Profile", color: "#7CFFB2" },
              ].map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  onClick={triggerAnalysis}
                  className="glass-card rounded-2xl p-4 flex items-center gap-3 hover:border-[rgba(108,99,255,0.4)] border border-transparent transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>

            {/* Demo button */}
            <button
              onClick={triggerAnalysis}
              disabled={analyzing}
              className="w-full py-4 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded-2xl font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {analyzing ? (
                <><FileText size={18} className="animate-pulse" /> Analyzing Career DNA...</>
              ) : (
                <><Zap size={18} /> Analyze My Career DNA</>  
              )}
            </button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {analyzing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <DNAHelix />
                <p className="text-[#94A3B8] mt-6 text-sm">Reading your career genome...</p>
              </motion.div>
            )}

            {!analyzing && !analyzed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <DNAHelix />
                <p className="text-[#94A3B8] mt-6 text-sm">Upload your profile to see your Career DNA</p>
              </motion.div>
            )}

            {analyzed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {DNA_RESULTS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card rounded-2xl p-4"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}20` }}>
                          <Icon size={16} style={{ color: item.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-[#94A3B8]">{item.label}</p>
                            <span className="text-xs font-semibold" style={{ color: item.color }}>{item.score}%</span>
                          </div>
                          <p className="text-sm text-white truncate">{item.value}</p>
                        </div>
                      </div>
                      <div className="h-1 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: item.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
