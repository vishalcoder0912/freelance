import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, Send, Sparkles, User, Loader2, Play, Volume2, Mic } from 'lucide-react';

const QUESTIONS = [
  { role: 'AI Engineer', q: 'How would you deploy a deep learning model to serve real-time predictions with low latency?' },
  { role: 'Product Manager', q: 'Tell me about a time you had to make a product decision without having complete user metrics.' },
  { role: 'Data Scientist', q: 'Can you describe the difference between boosting and bagging algorithms?' },
  { role: 'Full Stack Developer', q: 'Explain how Next.js Server Components differ from Client Components in terms of data fetching.' }
];

export default function InterviewCoachPage() {
  const [selectedRole, setSelectedRole] = useState('AI Engineer');
  const [question, setQuestion] = useState(QUESTIONS[0].q);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  
  const navigate = useNavigate();

  const handleRoleSelect = (roleName: string) => {
    setSelectedRole(roleName);
    const found = QUESTIONS.find(q => q.role === roleName);
    if (found) setQuestion(found.q);
    setAnswer('');
    setFeedback(null);
  };

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || loading) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFeedback({
        score: 82,
        strengths: ['Clear explanation of MLOps pipelines', 'Mentioned Redis caching & horizontal scaling'],
        gaps: ['Missed model quantization techniques', 'Did not reference Batch size tradeoffs'],
        idealResponse: 'An ideal response would highlight loading models in ONNX format, configuring auto-scaling clusters on Kubernetes, utilizing Redis to cache repetitive inference payloads, and quantifying hardware latency metrics.'
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-20 grid-bg-light">
      
      {/* Header */}
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
            <span className="font-bold text-xs text-slate-800">AI Interview Coach</span>
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
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">AI Interview Coach</h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Choose your target career path to mock-interview. Speak or type your answer, and receive real-time scoring.
          </p>
        </div>

        {/* Roles Selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {QUESTIONS.map((qItem) => (
            <button
              key={qItem.role}
              onClick={() => handleRoleSelect(qItem.role)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedRole === qItem.role
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {qItem.role}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Question & Input */}
          <div className="md:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Active Question</span>
              <p className="text-xs font-bold text-slate-800 leading-relaxed">{question}</p>
            </div>

            <form onSubmit={handleEvaluate} className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Your Response</label>
                  <button 
                    type="button"
                    onClick={() => alert('Speech synthesis requires microphone authorization!')}
                    className="text-[9px] font-semibold text-indigo-600 flex items-center gap-1 hover:underline"
                  >
                    <Mic size={10} /> Record Speech
                  </button>
                </div>
                <textarea
                  rows={6}
                  required
                  placeholder="Type your detailed architectural or procedural answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-xs resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={loading || !answer.trim()}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? 'Evaluating...' : <><Sparkles size={14} /> Submit Response</>}
              </button>
            </form>
          </div>

          {/* Right Column: AI Score Feedback */}
          <div className="md:col-span-6">
            {loading && (
              <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm space-y-4">
                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-slate-500 text-xs font-semibold">Generating state metrics, reviewing state logic...</p>
              </div>
            )}

            {!loading && !feedback && (
              <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
                  <Volume2 size={32} />
                </div>
                <p className="text-slate-500 text-xs font-semibold">Answer the question on the left to see detailed score breakdowns.</p>
              </div>
            )}

            {!loading && feedback && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                
                {/* Score */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">Interview Evaluation</h3>
                    <p className="text-[9px] text-slate-400">STAR method grading</p>
                  </div>
                  <div className="w-14 h-14 rounded-full border-4 border-indigo-600 flex items-center justify-center font-black text-xs text-indigo-600 bg-indigo-50">
                    {feedback.score}%
                  </div>
                </div>

                {/* Score detail lists */}
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Strengths</p>
                    <ul className="space-y-1.5">
                      {feedback.strengths.map((st: string, idx: number) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider mb-2">Improvement Gaps</p>
                    <ul className="space-y-1.5">
                      {feedback.gaps.map((gp: string, idx: number) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                          <span className="text-amber-500 mt-0.5">•</span>
                          <span>{gp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-indigo-50/50 border border-indigo-100/30 rounded-2xl">
                    <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Ideal Model Answer</p>
                    <p className="text-[10px] text-slate-600 leading-relaxed">{feedback.idealResponse}</p>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
