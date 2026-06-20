import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, Send, Sparkles, Building2, UserCheck, ShieldCheck } from 'lucide-react';

export default function EmployersPage() {
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-12 text-left bg-[#FAFAFC] grid-bg-light">
      
      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
          Recruiting
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-none">
          Hire Top Talent
        </h1>
        <p className="text-slate-500 text-sm max-w-xl">
          Connect directly with verified, pre-screened alumni from our advanced career programs. Cut down hiring cycles by up to 50%.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Recruiter Inquiry</h3>
          
          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-bold text-sm text-slate-800">Inquiry Received</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Our partnerships team will reach out with candidate resumes within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Company Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Razorpay, Swiggy"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Corporate Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="hiring@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Roles You Are Hiring For</label>
                <textarea 
                  rows={4}
                  placeholder="e.g. Senior AI Engineer, Data Science Associate"
                  value={roles}
                  onChange={(e) => setRoles(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-xs resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10"
              >
                Request Candidate Access <Send size={12} />
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Key Details */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Hiring Partner Benefits</h4>
            
            <div className="space-y-4">
              {[
                { icon: UserCheck, title: 'Verified Competencies', desc: 'Every achiever is audited on live system designs, coding tests, and projects before recommendations.' },
                { icon: Building2, title: 'Tailored Matchmaking', desc: 'Our AI screens profiles based on your technical stacks and core requirements.' },
                { icon: Sparkles, title: 'Zero Ingestion Cost', desc: 'Access pre-screened cohorts without expensive sourcing or screening operations.' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-700">{item.title}</h5>
                      <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl text-center space-y-4">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
            <h4 className="font-bold text-xs uppercase tracking-wider">Book a Corporate Consultation</h4>
            <p className="text-[10px] text-slate-300 leading-relaxed max-w-sm mx-auto">Discuss custom cohort training and long-term talent acquisition plans with our executive relationships team.</p>
            <button 
              onClick={() => alert('Corporate booking calendar triggered!')}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow hover:bg-indigo-700"
            >
              Book Recruiter Call
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
