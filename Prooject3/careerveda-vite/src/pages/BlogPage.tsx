import { Calendar, User, ArrowRight } from 'lucide-react';

const POSTS = [
  {
    title: 'How to Pivot into AI Engineering in 2026: A Step-by-Step Guide',
    desc: 'The demand for AI Engineers has skyrocketed. Here is a comprehensive 6-month roadmap detailing math foundations, deep learning frameworks, and how to build a portfolio that passes recruiter reviews.',
    author: 'Dr. Arindam Sen',
    date: 'June 18, 2026',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300'
  },
  {
    title: 'Demystifying ATS: How Recruiters Use AI to Filter Resumes',
    desc: 'Most resumes are rejected by applicant tracking algorithms before a human ever sees them. Learn the common keyword formatting mistakes and how to structure your projects to score >80% on ATS systems.',
    author: 'Megha Gupta',
    date: 'June 12, 2026',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300'
  },
  {
    title: 'Top 5 Interview Questions for MLOps Engineers at Tier-1 Giants',
    desc: 'We analyzed mock interview responses from Goldman Sachs, Razorpay, and Swiggy recruiters to identify the exact system design and scalability questions candidates face.',
    author: 'Sneha Rao',
    date: 'June 05, 2026',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300'
  }
];

export default function BlogPage() {
  return (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-12 text-left bg-[#FAFAFC] grid-bg-light">
      
      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
          Insights
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-none">
          Our Blog
        </h1>
        <p className="text-slate-500 text-sm max-w-xl">
          Get weekly career guides, roadmap advice, resume optimization tips, and engineering guidelines directly from our expert faculty.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {POSTS.map((post, i) => (
          <div 
            key={i} 
            className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
          >
            <div>
              <img 
                src={post.image} 
                className="w-full h-44 object-cover" 
                alt={post.title} 
              />
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-800 leading-snug hover:text-indigo-600 cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">{post.desc}</p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button 
                onClick={() => alert(`Reading article: ${post.title}`)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Read Article <ArrowRight size={14} />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
