import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const PROGRAMS = [
  {
    title: 'PG Program in Business Analytics with GEN AI',
    duration: '6 Months',
    bullets: ['Excel, SQL, Python & visualization', 'Real business case studies', 'Placement assistance'],
    tag: 'Gen AI & Business',
    color: 'from-blue-500 to-indigo-600',
    slug: 'business-analytics-with-gen-ai',
    desc: 'Master descriptive, predictive, and prescriptive analytics integrated with cutting edge Generative AI workflows.'
  },
  {
    title: 'PG Program in Product Management',
    duration: '6 Months',
    bullets: ['Product strategy & roadmap', 'User research & agile methods', 'Launch products with support'],
    tag: 'Product',
    color: 'from-violet-500 to-purple-600',
    slug: 'product-management',
    desc: 'Transition into product leadership by building a robust capstone product and presenting to top industry coaches.'
  },
  {
    title: 'PG Program in Data Science with GEN AI',
    duration: '12 Months',
    bullets: ['Deep learning, NLP, CV', 'AI integration & capstone projects', 'Career guidance & support'],
    tag: 'Data Science',
    color: 'from-pink-500 to-rose-600',
    slug: 'data-science-with-gen-ai',
    desc: 'The ultimate data science bootcamp teaching classical machine learning, PyTorch neural networks, and modern LLMs.'
  },
  {
    title: 'PG Program in Data Analytics with GEN AI',
    duration: '6 Months',
    bullets: ['Python & R programming', 'Statistical modeling', 'Job placement guarantee'],
    tag: 'Data Analytics',
    color: 'from-cyan-500 to-blue-600',
    slug: 'data-analytics-with-gen-ai',
    desc: 'Learn to extract actionable business insights from massive datasets using Python, SQL, and data pipelines.'
  },
  {
    title: 'PG Program in Investment Banking',
    duration: '6 Months',
    bullets: ['Financial modeling & valuation', 'M&A, IPO & corporate finance', 'Wall Street placement support'],
    tag: 'Finance',
    color: 'from-amber-500 to-orange-600',
    slug: 'investment-banking',
    desc: 'Equip yourself for investment banking, asset management, and equity research roles with certified financial mentors.'
  },
  {
    title: 'PG Program in Cloud Engineering',
    duration: '6 Months',
    bullets: ['AWS & Azure cloud mastery', 'DevOps & containerization', 'Real-world cloud projects'],
    tag: 'Cloud',
    color: 'from-green-500 to-teal-600',
    slug: 'cloud-engineering',
    desc: 'Master cloud infrastructure, DevOps practices, and enterprise-grade cloud solutions with hands-on experience.'
  },
  {
    title: 'PG Program in Cyber Security',
    duration: '12 Months',
    bullets: ['Network security & ethical hacking', 'Cloud security & compliance', 'Incident response & forensics'],
    tag: 'Security',
    color: 'from-red-500 to-rose-600',
    slug: 'cyber-security',
    desc: 'Comprehensive cybersecurity program covering threat analysis, vulnerability assessment, and security architecture.'
  }
];

export default function ProgramsPage() {
  const navigate = useNavigate();

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-12 text-left bg-[#FAFAFC] grid-bg-light">
      
      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
          Academics
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-none">
          All Programs
        </h1>
        <p className="text-slate-500 text-sm max-w-xl">
          Browse our structured executive PG paths designed in partnership with leading global institutions and verified recruiters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROGRAMS.map((prog, i) => (
          <div key={i} className="glass-card rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group hover:border-indigo-200 transition-all duration-300 min-h-[420px] bg-white shadow-sm">
            <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${prog.color}`} />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600">{prog.duration}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{prog.tag}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">{prog.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{prog.desc}</p>
              <ul className="space-y-2 pt-4 border-t border-slate-50">
                {prog.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-500">
                    <Check size={12} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6">
              <button onClick={() => navigate(`/program/${prog.slug}`)} className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 group-hover:bg-indigo-600 text-slate-700 group-hover:text-white rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer">
                View Syllabus & Enroll <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}