import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Sparkles, CheckCircle, XCircle, AlertTriangle, Briefcase, Building2, TrendingUp, Download } from 'lucide-react';

const ASSESSMENT_RESULTS = {
  matchScore: 84,
  strengths: [
    "Full-stack architecture & system design",
    "RESTful API & microservices patterns",
    "React + TypeScript production experience",
    "Database modeling (SQL & NoSQL)"
  ],
  skillGaps: [
    "Cloud-native deployment (K8s, Docker)",
    "CI/CD pipeline automation",
    "Performance optimization at scale"
  ],
  recommendedRoles: [
    "Senior Full Stack Engineer",
    "Tech Lead / Engineering Manager",
    "Solutions Architect"
  ],
  topCompanies: [
    { name: "Razorpay", match: 92 },
    { name: "Zepto", match: 87 },
    { name: "Swiggy", match: 85 },
    { name: "CureFit", match: 81 }
  ]
};

export default function AnalysisConsolePage() {
  const [role, setRole] = useState('full stack');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf' || ext === 'docx') {
      setResumeFile(file);
      setResumeName(file.name);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-20 grid-bg-light">
      <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={14} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <span className="font-bold text-xs text-slate-800">Analysis Console</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 text-xs font-bold rounded-xl bg-white transition-all"
        >
          My Dashboard
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-12 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Assess My <span className="gradient-text-primary">Candidate DNA</span>
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Enter your target job details and upload your resume to trigger a simulated AI assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Input Console</h3>

            <form onSubmit={handleAssessment} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Target Job / Role</label>
                <div className="relative">
                  <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. full stack, AI Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Upload Resume (Mock)</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    dragOver
                      ? 'border-indigo-500 bg-indigo-50'
                      : resumeFile
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-slate-200 hover:border-indigo-300 bg-slate-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                  />
                  {resumeFile ? (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto">
                        <FileText size={18} className="text-emerald-600" />
                      </div>
                      <p className="text-xs font-semibold text-emerald-700 truncate max-w-full">{resumeName}</p>
                      <p className="text-[10px] text-slate-400">Tap to change file</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto">
                        <Upload size={18} className="text-slate-400" />
                      </div>
                      <p className="text-xs font-semibold text-slate-500">Drop your resume here</p>
                      <p className="text-[10px] text-slate-400">Supports PDF, DOCX</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-bold hover:from-indigo-700 hover:to-violet-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10"
              >
                {loading ? (
                  <>Analyzing Candidate DNA...</>
                ) : (
                  <><Sparkles size={14} /> Assess My Candidate DNA</>
                )}
              </button>
            </form>
          </div>

          <div className="md:col-span-7 space-y-4">
            {loading && (
              <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <Sparkles size={20} className="absolute inset-0 m-auto text-indigo-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-700 text-xs font-bold">Scanning your Candidate DNA...</p>
                  <p className="text-slate-400 text-[10px]">Matching skills against market intelligence, benchmarking against top companies</p>
                </div>
                <div className="flex justify-center gap-1.5">
                  {['Profile', 'Skills', 'Market', 'DNA'].map((step, i) => (
                    <div key={step} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50">
                      <div className={`w-1.5 h-1.5 rounded-full ${i <= 1 ? 'bg-indigo-600 animate-pulse' : 'bg-slate-200'}`} />
                      <span className={`text-[9px] font-semibold ${i <= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && !analyzed && (
              <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
                  <AlertTriangle size={32} />
                </div>
                <p className="text-slate-500 text-xs font-semibold">Enter your target role and upload a resume, then hit <span className="text-indigo-600">Assess My Candidate DNA</span> to see your results.</p>
              </div>
            )}

            {!loading && analyzed && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-600/10 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Overall DNA Match</p>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black">{ASSESSMENT_RESULTS.matchScore}%</span>
                    <span className="text-indigo-200 text-sm font-semibold mb-1">for {role}</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: `${ASSESSMENT_RESULTS.matchScore}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <CheckCircle size={14} className="text-emerald-600" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Strengths</span>
                    </div>
                    <ul className="space-y-1.5">
                      {ASSESSMENT_RESULTS.strengths.map((s, i) => (
                        <li key={i} className="text-[11px] font-medium text-slate-700 flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                        <XCircle size={14} className="text-amber-600" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skill Gaps</span>
                    </div>
                    <ul className="space-y-1.5">
                      {ASSESSMENT_RESULTS.skillGaps.map((s, i) => (
                        <li key={i} className="text-[11px] font-medium text-slate-700 flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center">
                      <TrendingUp size={14} className="text-sky-600" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recommended Roles</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ASSESSMENT_RESULTS.recommendedRoles.map((r, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 text-[11px] font-semibold">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
                      <Building2 size={14} className="text-rose-600" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Company Matches</span>
                  </div>
                  <div className="space-y-2">
                    {ASSESSMENT_RESULTS.topCompanies.map((c, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-700 w-24">{c.name}</span>
                        <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: `${c.match}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 w-8 text-right">{c.match}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setAnalyzed(false); setResumeFile(null); setResumeName(''); }}
                    className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    Run New Assessment
                  </button>
                  <button className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1">
                    <Download size={14} /> Download Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
