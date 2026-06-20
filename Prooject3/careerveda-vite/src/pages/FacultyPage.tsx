import { Award, Briefcase, GraduationCap } from 'lucide-react';

const FACULTY = [
  {
    name: 'Dr. Arindam Sen',
    role: 'Head of AI & Data Science Studies',
    former: 'Former Lead AI Scientist at Microsoft Research',
    credentials: 'PhD in Computer Science from IIT Kharagpur',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    bio: 'Over 15 years of research experience in classical NLP, transformers, and agentic AI architectures.'
  },
  {
    name: 'Megha Gupta',
    role: 'Lead Product Management Faculty',
    former: 'Former Principal PM Lead at Google Maps',
    credentials: 'MBA from ISB Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    bio: 'Guided the deployment and optimization of mobile maps used by 1B+ users. Expert in product metrics and PRD frameworks.'
  },
  {
    name: 'Rajesh Malhotra',
    role: 'Lead Investment Banking Instructor',
    former: 'Former Managing Director at Goldman Sachs M&A',
    credentials: 'Chartered Accountant & MBA from IIM Ahmedabad',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    bio: 'Advised on M&A transactions valued over $12B. Deep expertise in valuation, equity research, and capital modeling.'
  },
  {
    name: 'Sneha Rao',
    role: 'Head of Full Stack & System Design Studies',
    former: 'Former Principal Architect at Amazon Web Services',
    credentials: 'M.Tech from IISc Bangalore',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    bio: 'Designed and deployed cloud infrastructure scaling to 50M users. Passionate about serverless architectures and caching logic.'
  }
];

export default function FacultyPage() {
  return (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-12 text-left bg-[#FAFAFC] grid-bg-light">
      
      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
          Academics
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-none">
          Our Faculty
        </h1>
        <p className="text-slate-500 text-sm max-w-xl">
          Learn from industry leaders, PhD researchers, and former principal executives with proven track records of building scaling systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {FACULTY.map((fac, i) => (
          <div 
            key={i} 
            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow duration-300"
          >
            <img 
              src={fac.avatar} 
              className="w-24 h-24 rounded-2xl object-cover border border-slate-150 flex-shrink-0" 
              alt={fac.name} 
            />
            
            <div className="space-y-3 flex-grow">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">{fac.name}</h3>
                <span className="text-[10px] text-indigo-600 font-semibold">{fac.role}</span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-50">
                <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                  <Briefcase size={12} className="text-slate-400" /> {fac.former}
                </p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                  <GraduationCap size={12} className="text-slate-400" /> {fac.credentials}
                </p>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                {fac.bio}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
