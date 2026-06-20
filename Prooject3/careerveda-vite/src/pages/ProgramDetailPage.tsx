import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Sparkles, Calendar, BookOpen, Clock, Award, ShieldCheck, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { PROGRAMS_DATA } from '@/lib/programsData';

export default function ProgramDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const program = slug ? PROGRAMS_DATA[slug] : null;

  const handleEnroll = () => {
    if (!program) return;
    setIsPurchasing(true);
    
    // Simulate premium animated Stripe-like checkout
    setTimeout(() => {
      setIsPurchasing(false);
      setPurchaseSuccess(true);
      
      // Save purchased program details in localStorage
      localStorage.setItem('purchased_program', program.slug);
      localStorage.removeItem('pending_purchase'); // Clear any pending state
      
      setTimeout(() => {
        // Navigate directly to the personalized dashboard!
        navigate('/dashboard');
      }, 2000);
    }, 2000);
  };

  if (!program) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center bg-[#FAFAFC] grid-bg-light">
        <h2 className="text-xl font-bold text-slate-800">Program Not Found</h2>
        <button 
          onClick={() => navigate('/programs')}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow"
        >
          View All Programs
        </button>
      </div>
    );
  }

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-12 text-left bg-[#FAFAFC] grid-bg-light relative">
      
      {/* Checkout overlay modal */}
      {isPurchasing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
              <Loader2 size={32} className="animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-800">Processing Enrollment</h3>
              <p className="text-slate-500 text-xs">Securing your seat in the program and generating your custom AI career roadmap...</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-left">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Selected Pathway</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{program.title}</p>
              </div>
              <span className="text-xs font-bold text-emerald-600">{program.price}</span>
            </div>
          </div>
        </div>
      )}

      {purchaseSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 size={32} className="animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-800">Enrollment Complete!</h3>
              <p className="text-slate-500 text-xs">Welcome to CareerVeda AI OS. Redirecting you to your personalized program dashboard...</p>
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
      <button 
        onClick={() => navigate('/programs')}
        className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm"
      >
        <ArrowLeft size={14} /> Back to Programs
      </button>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#0B091B] to-[#120E2C] border border-[#5B3DF5]/15 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#5B3DF5]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="space-y-4 max-w-2xl relative z-10">
          <span className="px-3 py-1 rounded-full bg-[#5B3DF5]/10 border border-[#5B3DF5]/25 text-[9px] font-extrabold text-[#00C2FF] uppercase tracking-widest">
            Executive Program
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">{program.title}</h1>
          <p className="text-slate-400 text-xs leading-relaxed">{program.desc}</p>
        </div>

        <div className="p-6 bg-[#0B091B]/60 border border-[#5B3DF5]/20 backdrop-blur-sm rounded-2xl w-full md:w-64 relative z-10 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5"><Clock size={14} className="text-[#5B3DF5]" /> Duration</span>
            <span className="font-bold text-slate-100">{program.duration}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5"><Award size={14} className="text-[#5B3DF5]" /> Fee</span>
            <span className="font-bold text-emerald-400">{program.price}</span>
          </div>
          <button 
            onClick={handleEnroll}
            className="w-full py-3 bg-[#5B3DF5] hover:bg-[#7C6CFD] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#5B3DF5]/20 active:scale-95 transition-all cursor-pointer"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Curriculum & Detail grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Curriculum Modules */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-600" /> Program Curriculum
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Syllabus structure and modules</p>
          </div>

          <div className="space-y-3">
            {program.modules.map((mod, idx) => (
              <div key={idx} className="flex gap-4 items-start p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-indigo-600 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{mod}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                    Hands-on exercises, assignments, and case studies targeting real-world application.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Outcomes & Support */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Career outcomes */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Career Outcomes</h4>
            <div className="space-y-3">
              {[
                { title: '1-on-1 Mentorship', desc: 'Unlimited access to experienced industry mentors for projects and mock interviews.' },
                { title: 'Resume Review', desc: 'ATS optimized resume review to pass automated recruiter pipelines.' },
                { title: 'Hiring Drives', desc: 'Direct connection to openings at our 900+ recruitment partners.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <ShieldCheck size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-[11px] text-slate-700">{item.title}</h5>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation CTA */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-3xl p-6 shadow-md shadow-indigo-600/10 space-y-4 text-center">
            <Sparkles size={24} className="text-white mx-auto animate-pulse" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider">Talk to a Career Advisor</h4>
              <p className="text-[10px] text-indigo-100 mt-1">Get custom analysis, learning roadmap advisory, and syllabus deep-dives.</p>
            </div>
            <button 
              onClick={() => alert('Consultation Calendar Triggered!')}
              className="w-full py-2.5 bg-white text-indigo-600 rounded-xl text-xs font-bold shadow"
            >
              Book Career Call
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
