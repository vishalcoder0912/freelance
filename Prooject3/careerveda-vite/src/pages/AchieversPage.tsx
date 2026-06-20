import { Sparkles, TrendingUp, DollarSign, Building2 } from 'lucide-react';

const ACHIEVERS = [
  {
    name: 'Siddharth Mehta',
    from: 'Software Developer',
    to: 'AI Engineer at Razorpay',
    hike: '140% Hike',
    salary: '₹26 LPA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    story: 'CareerVeda AI built a custom deep learning roadmap that matched my software skills. Working on actual PyTorch pipelines got me through Razorpay\'s system design reviews.'
  },
  {
    name: 'Ananya Roy',
    from: 'Business Analyst',
    to: 'Product Manager at Swiggy',
    hike: '95% Hike',
    salary: '₹21 LPA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    story: 'Transitioning from analytics to product management felt daunting. Building a capstone product and structuring PRDs under faculty supervision made all the difference.'
  },
  {
    name: 'Rohan Sharma',
    from: 'Data Analyst',
    to: 'Data Scientist at Zepto',
    hike: '110% Hike',
    salary: '₹18 LPA',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    story: 'Decoding my Career DNA revealed gaps in predictive modeling. I targeted those gaps directly on the roadmap, got matching interviews and signed with Zepto.'
  },
  {
    name: 'Karan Malhotra',
    from: 'QA Engineer',
    to: 'DevOps Engineer at Swiggy',
    hike: '120% Hike',
    salary: '₹16 LPA',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    story: 'I spent months trying to learn Kubernetes on my own. CareerVedas hands-on labs on GCP Cloud and Docker got me comfortable with automation pipelines.'
  }
];

export default function AchieversPage() {
  return (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-12 text-left bg-[#FAFAFC] grid-bg-light">
      
      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
          Alumni
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-none">
          Our Achievers
        </h1>
        <p className="text-slate-500 text-sm max-w-xl">
          See how our learners transition from general tech and operational backgrounds into category-defining roles at global giants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ACHIEVERS.map((ach, i) => (
          <div 
            key={i} 
            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow duration-300"
          >
            <img 
              src={ach.avatar} 
              className="w-24 h-24 rounded-2xl object-cover border border-slate-150 flex-shrink-0" 
              alt={ach.name} 
            />
            
            <div className="space-y-3 flex-grow">
              <div className="flex justify-between items-baseline gap-2 flex-wrap">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">{ach.name}</h3>
                  <span className="text-[10px] text-slate-400 font-medium">{ach.from}</span>
                </div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {ach.hike}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-50">
                <span className="flex items-center gap-1"><Building2 size={12} className="text-indigo-500" /> {ach.to}</span>
                <span className="flex items-center gap-1"><DollarSign size={12} className="text-emerald-500" /> {ach.salary}</span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                "{ach.story}"
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
