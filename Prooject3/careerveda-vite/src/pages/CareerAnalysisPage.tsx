import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, ArrowLeft, Check, Sparkles, TrendingUp, AlertCircle, Target, DollarSign, Building2, HelpCircle } from 'lucide-react';

const DNA_RESULTS = [
  { icon: TrendingUp, label: "Career Strengths", value: "Problem Solving, System Design, Communication", color: "text-emerald-600 bg-emerald-50 border-emerald-100", score: 88 },
  { icon: AlertCircle, label: "Skill Gaps", value: "Cloud Infrastructure, LLM Fine-tuning", color: "text-amber-600 bg-amber-50 border-amber-100", score: 62 },
  { icon: Target, label: "Hidden Opportunities", value: "AI Product Manager, ML Infrastructure Lead", color: "text-sky-600 bg-sky-50 border-sky-100", score: 91 },
  { icon: DollarSign, label: "Salary Potential", value: "₹18–32 LPA (Top 15% in your domain)", color: "text-indigo-600 bg-indigo-50 border-indigo-100", score: 75 },
  { icon: Building2, label: "Top Company Match", value: "Razorpay 91% · Zepto 87% · Swiggy 85%", color: "text-rose-600 bg-rose-50 border-rose-100", score: 91 },
];

export default function CareerAnalysisPage() {
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-20 grid-bg-light">
      
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={14} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Brain size={16} />
            </div>
            <span className="font-bold text-xs text-slate-800">Free Career Analysis</span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 text-xs font-bold rounded-xl bg-white transition-all"
        >
          My Dashboard
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-8">
        
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Decode Your Career Genome
          </h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Input your current skills and target role, and our AI will calculate your readiness scores and top company matches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Form */}
          <div className="md:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Career Metrics Input</h3>
            
            <form onSubmit={handleAnalysis} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Target Role</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. AI Engineer, Product Manager"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Current Skills</label>
                <textarea 
                  rows={4}
                  placeholder="e.g. Python, SQL, JavaScript, Excel, Product Roadmaps"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-xs resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? 'Analyzing Career DNA...' : <><Sparkles size={14} /> Analyze My Career DNA</>}
              </button>
            </form>
          </div>

          {/* Right Results */}
          <div className="md:col-span-7 space-y-4">
            
            {loading && (
              <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm space-y-4">
                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-slate-500 text-xs font-semibold">Reading your career genome, matching opening pipelines...</p>
              </div>
            )}

            {!loading && !analyzed && (
              <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
                  <HelpCircle size={32} />
                </div>
                <p className="text-slate-500 text-xs font-semibold">Please complete the form on the left to see your Career DNA score card.</p>
              </div>
            )}

            {!loading && analyzed && (
              <div className="space-y-3">
                {DNA_RESULTS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={i}
                      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 ${item.color}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                            <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{item.score}%</span>
                          </div>
                          <p className="text-xs font-bold text-slate-700">{item.value}</p>
                        </div>
                      </div>
                      
                      {/* Custom progress bar */}
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  );
                })}

                <div className="pt-4 flex justify-between gap-4">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                  <button 
                    onClick={() => navigate('/resume-analyzer')}
                    className="flex-grow py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    Analyze ATS Resume <Sparkles size={14} />
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
