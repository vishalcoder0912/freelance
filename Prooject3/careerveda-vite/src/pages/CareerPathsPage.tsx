import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Sparkles, Map, Target, DollarSign } from 'lucide-react';

const PATHS = [
  {
    id: 'ai',
    title: 'AI Engineer Pathway',
    salary: '₹14–35 LPA',
    duration: '6-12 Months Prep',
    desc: 'Transition from general development into core deep learning, LLM fine-tuning, and multi-agent system orchestration.',
    milestones: ['Python & Math (Linear Algebra, Calc, Stats)', 'Classical Machine Learning (Scikit-Learn)', 'Neural Networks & Deep Learning Core (PyTorch)', 'Natural Language Processing & LLMs (RAG, Transformers)', 'Multi-Agent Orchestration & MLOps deployment']
  },
  {
    id: 'data',
    title: 'Data Scientist Pathway',
    salary: '₹12–28 LPA',
    duration: '6-9 Months Prep',
    desc: 'Harness data to derive actionable statistical insights, build forecasting models, and implement big data pipelines.',
    milestones: ['Data Analysis Foundations (Pandas, SQL)', 'Descriptive & Inferential Statistics', 'Supervised & Unsupervised ML Algorithms', 'Big Data Engineering (Spark & Hadoop)', 'A/B Testing & Pipeline Deployment']
  },
  {
    id: 'dev',
    title: 'Full Stack Pathway',
    salary: '₹10–24 LPA',
    duration: '6 Months Prep',
    desc: 'Build highly scalable web systems end-to-end, utilizing modern web frameworks, ORMs, caching, and CI/CD pipelines.',
    milestones: ['HTML, Tailwind & Modern CSS design systems', 'TypeScript & Advanced State management', 'React 19 & Next.js Server Components', 'Node.js, Postgres & Prisma ORM', 'System Design, Caching (Redis) & Docker deployment']
  },
  {
    id: 'pm',
    title: 'Product Manager Pathway',
    salary: '₹15–30 LPA',
    duration: '6 Months Prep',
    desc: 'Develop the strategic vision, customer empathy, roadmapping skills, and cohort metrics to steer product lifecycles.',
    milestones: ['Product Mindset & Core Competency metrics', 'User Research, Journey Maps & PRD writing', 'Prioritization frameworks & Agile methods', 'Cohort Analytics & Product Growth', 'Product Strategy Pitch & VC advisory']
  }
];

export default function CareerPathsPage() {
  const [activeTab, setActiveTab] = useState('ai');
  const navigate = useNavigate();

  const selectedPath = PATHS.find(p => p.id === activeTab) || PATHS[0];

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-12 text-left bg-[#FAFAFC] grid-bg-light">
      
      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
          Career Maps
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-none">
          Career Pathways
        </h1>
        <p className="text-slate-500 text-sm max-w-xl">
          Interact with our verified career roadmap structures to benchmark your milestones and salary potential.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left tabs */}
        <div className="lg:col-span-4 grid gap-3">
          {PATHS.map((path) => (
            <button
              key={path.id}
              onClick={() => setActiveTab(path.id)}
              className={`w-full p-4 rounded-2xl border text-left font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${
                activeTab === path.id
                  ? 'bg-white border-indigo-200 shadow-md text-indigo-600 scale-[1.02]'
                  : 'bg-white/50 border-slate-100 text-slate-600 hover:border-slate-200'
              }`}
            >
              {path.title}
              <ChevronRight size={14} />
            </button>
          ))}
        </div>

        {/* Right Details */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap justify-between items-baseline gap-4 border-b border-slate-50 pb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">{selectedPath.title}</h3>
              <p className="text-[10px] text-slate-400 mt-1">{selectedPath.duration}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl inline-block">
                {selectedPath.salary} Average
              </span>
            </div>
          </div>

          <p className="text-slate-500 text-xs leading-relaxed">{selectedPath.desc}</p>

          <div className="space-y-4 pt-4 border-t border-slate-50">
            {selectedPath.milestones.map((milestone, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-indigo-600 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">{milestone}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-50 flex gap-4">
            <button 
              onClick={() => navigate('/career-analysis')}
              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              Analyze Your Match Score <Sparkles size={14} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
