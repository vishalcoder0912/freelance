import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// Firebase imports commented out – using localStorage auth instead.
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Calendar, Clock, Award, ShieldCheck, ArrowRight, ArrowLeft, Loader2,
  CheckCircle2, BookOpen, Brain, Users, GraduationCap, Star, ChevronRight,
  BarChart3, Code2, Building2, Play, X, Map, MessageSquare, Briefcase,
  Target, Upload, Palette, Cloud
} from 'lucide-react';
import { PROGRAMS_DATA, PROGRAM_DETAILS, ALL_HIGHLIGHTS, COMPANIES, REVIEWS, DIFFERENTIATORS, CAREER_SUPPORT } from '@/lib/programsData';

const RATING_PLATFORMS = [
  { name: 'Google', rating: '4.97', color: 'text-blue-600' },
  { name: 'AmbitionBox', rating: '4.92', color: 'text-amber-600' },
  { name: 'Glassdoor', rating: '4.94', color: 'text-green-600' },
  { name: 'Trustpilot', rating: '4.85', color: 'text-emerald-600' }
];

export default function ProgramDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    // Read user from localStorage instead of Firebase onAuthStateChanged
    const raw = localStorage.getItem('careerveda_user');
    if (raw) {
      try { setCurrentUser(JSON.parse(raw)); } catch { setCurrentUser(null); }
    }
  }, []);

  const base = slug ? (PROGRAMS_DATA[slug] || PROGRAM_DETAILS[slug]) : null;
  const details = slug ? PROGRAM_DETAILS[slug] : null;
  const program = base ? { ...base, ...details } : null;

  const enrichedWhatYouGain = program?.whatYouGain?.length
    ? program.whatYouGain
    : Object.entries(ALL_HIGHLIGHTS).slice(0, 12).map(([title]) => title);

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleEnroll = () => {
    if (!program) return;
    setIsPurchasing(true);
    setTimeout(() => {
      setIsPurchasing(false);
      setPurchaseSuccess(true);
      localStorage.setItem('purchased_program', program.slug);
      setTimeout(() => navigate('/dashboard'), 2000);
    }, 2000);
  };

  if (!program) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center bg-[#FAFAFC]">
        <h2 className="text-xl font-bold text-slate-800">Program Not Found</h2>
        <button onClick={() => navigate('/programs')} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow">
          View All Programs
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFC]">
      {/* Purchase & Success Modals */}
      <AnimatePresence>
        {isPurchasing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl text-center space-y-6">
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
          </motion.div>
        )}
        {purchaseSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 size={32} className="animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-slate-800">Enrollment Complete!</h3>
                <p className="text-slate-500 text-xs">Welcome to CareerVeda AI OS. Redirecting you to your personalized dashboard...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

        <button onClick={() => navigate('/programs')} className="mb-6 p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm w-fit">
          <ArrowLeft size={14} /> Back to Programs
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600">Industry-Aligned</span>
              <span className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-600">Enrolling Now</span>
              <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600">100% Placement Assurance</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
              {program.title}
            </h1>

            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">{program.desc}</p>

            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock size={16} className="text-indigo-500" /> <span className="font-semibold text-slate-700">{program.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Play size={16} className="text-indigo-500" /> <span className="font-semibold text-slate-700">{program.mode || 'Live Online'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users size={16} className="text-indigo-500" /> <span className="font-semibold text-slate-700">{program.students || '10,000+'} Students</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button onClick={handleEnroll} className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer">
                Enroll Now - {program.price} <ArrowRight size={16} />
              </button>
              <button className="flex items-center gap-2 px-8 py-4 border border-slate-200 bg-white text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer">
                <Award size={16} className="text-indigo-500" /> Download Brochure
              </button>
            </div>
          </div>

          {/* Right - Pricing Card */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="text-center pb-4 border-b border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Program Investment</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{program.price}</p>
                <p className="text-[10px] text-slate-400">Including GST</p>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 size={14} /> <span className="font-semibold text-slate-700">EMI Options Available</span>
                </div>
                <p className="text-[10px] text-slate-400 pl-6">3, 6, 9 & 12 months (No Cost EMIs)</p>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Next Batch Starts</span>
                  <span className="font-bold text-slate-800">June 21, 2026</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Limited Seats</span>
                  <span className="font-bold text-amber-600">Few seats left</span>
                </div>
              </div>
              <button onClick={handleEnroll} className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/10 active:scale-95 transition-all cursor-pointer">
                Reserve Your Seat
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck size={12} className="text-emerald-500" /> 7-Day Money Back Guarantee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROGRAM HIGHLIGHTS ===== */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(program.highlights || [
            { label: 'Next Batch', value: 'June 21, 2026' },
            { label: 'Duration', value: `${program.duration} . ${program.mode || 'Live Online'}` },
            { label: 'Industry Projects', value: '20+' },
            { label: 'Eligibility', value: 'Freshers, Graduates, Experienced' }
          ]).map((h, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 text-center hover:shadow-md hover:border-indigo-100 transition-all">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{h.label}</p>
              <p className="text-sm font-extrabold text-slate-800">{h.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHAT YOU'LL GAIN ===== */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              What You&apos;ll Gain from This Program?
            </h2>
            <p className="text-sm text-slate-500">
              This {program.title} equips you with comprehensive skills through real-world projects and expert guidance.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {enrichedWhatYouGain.map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 text-center hover:shadow-md hover:border-indigo-100 transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-3 text-indigo-600">
                  {[Brain, Award, Users, GraduationCap, BarChart3, Code2, Building2, Target, MessageSquare, Briefcase, Cloud, Palette, Map, Upload, Star, ShieldCheck, BookOpen, Sparkles, CheckCircle2][i % 19] && <Star size={18} />}
                </div>
                <p className="text-[11px] font-bold text-slate-700 leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CURRICULUM ===== */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left - Modules + Internship/Soft Skills */}
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {program.title} Curriculum
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                {program.curriculumNote || 'A carefully crafted curriculum designed by industry experts to make you job-ready.'}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-indigo-600 flex items-center gap-2">
                <BookOpen size={14} /> {program.modules.length} Modules
              </p>
              <div className="grid gap-3">
                {program.modules.map((mod: string, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-4 items-start p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 hover:shadow-md transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-xs font-bold text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800">{mod}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Hands-on exercises, assignments, and case studies targeting real-world application.</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0 mt-1" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Internship + Soft Skills Cards */}
          <div className="w-full lg:w-96 shrink-0 space-y-6">
            {[
              {
                title: 'Internship Program',
                icon: Briefcase,
                items: ['Real-world Project Implementation', 'Industry Mentorship Program', 'Professional Development Skills', 'Cross-functional Team Collaboration', 'Business Process Optimization', 'Data-driven Decision Making']
              },
              {
                title: 'Soft Skills Program',
                icon: Users,
                items: ['Communication & Presentation Skills', 'Leadership & Team Management', 'Problem Solving & Critical Thinking', 'Time Management & Productivity', 'Emotional Intelligence & Adaptability', 'Professional Ethics & Workplace Culture']
              }
            ].map((block, bi) => (
              <div key={bi} className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-3xl p-6 shadow-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                    <block.icon size={20} />
                  </div>
                  <h3 className="font-bold text-sm">{block.title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {block.items.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-2.5 text-[12px] text-indigo-100">
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white space-y-3">
              <h3 className="text-2xl md:text-3xl font-extrabold">{program.title}</h3>
              <p className="text-indigo-200 text-sm">{program.duration} · {program.mode || 'Live Online'}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-3xl font-extrabold text-emerald-400">{program.price}</span>
                <span className="text-indigo-200 line-through">(incl. GST)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-indigo-200">
                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-400" /> 1:1 Doubt Clearing Session</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-400" /> 100+ Hours of Self Paced Learning</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-400" /> Lifetime Career Assistance</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-400" /> EMI Option Available</li>
              </ul>
            </div>
            <div className="shrink-0 w-full md:w-64">
              <button onClick={handleEnroll} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT MAKES CAREERVEDA DIFFERENT ===== */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            What Makes CareerVeda Different?
          </h2>
          <p className="text-sm text-slate-500">Transform your career with India's leading professional training platform</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DIFFERENTIATORS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl hover:border-indigo-100 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center mb-4 text-indigo-600 group-hover:scale-110 transition-transform">
                {[Award, Users, Code2, ShieldCheck, BarChart3, GraduationCap, Building2, Clock, Brain][i] && <Award size={22} />}
              </div>
              <h3 className="font-bold text-sm text-slate-800 mb-2">{item.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{item.desc}</p>
              <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[10px]">
                <span className="font-extrabold text-indigo-600">{item.stat}</span>
                <span className="text-slate-400">{item.proof}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CAREER SUPPORT ===== */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              CareerVeda Learning & Career Support
            </h2>
            <p className="text-sm text-slate-500">Get expert guidance and personalized support at every step of your learning journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CAREER_SUPPORT.map((block, bi) => (
              <div key={bi} className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-lg hover:border-indigo-100 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center mb-4 text-indigo-600">
                  {[Award, BookOpen, Users][bi] && <Award size={22} />}
                </div>
                <h3 className="font-bold text-sm text-slate-800 mb-4">{block.title}</h3>
                <ul className="space-y-3">
                  {block.items.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-2.5 text-[11px] text-slate-500">
                      <CheckCircle2 size={12} className="shrink-0 mt-0.5 text-emerald-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPANIES THAT HIRE ===== */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Companies That Hire Our Talent
          </h2>
          <p className="text-sm text-slate-500">Trusted by 900+ leading organizations across India</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-6 animate-scroll-slow py-4" style={{ animation: 'scroll 30s linear infinite' }}>
            {[...COMPANIES, ...COMPANIES].map((name, i) => (
              <div key={i} className="shrink-0 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
                <p className="text-sm font-bold text-slate-600 whitespace-nowrap">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-indigo-50/20">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Learner Reviews & Ratings
            </h2>
            <p className="text-sm text-slate-500">Hear from our successful learners who transformed their careers with CareerVeda</p>
          </div>

          {/* Rating platforms */}
          <div className="flex flex-wrap justify-center gap-6">
            {RATING_PLATFORMS.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-sm">
                <span className={`text-2xl font-extrabold ${p.color}`}>{p.rating}</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, si) => <Star key={si} size={12} className="fill-amber-400 text-amber-400" />)}
                </div>
                <span className="text-[10px] font-bold text-slate-400">{p.name}</span>
              </div>
            ))}
          </div>

          {/* Review cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.slice(0, 6).map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl hover:border-indigo-100 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(review.name)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{review.name}</p>
                    <p className="text-[10px] text-slate-400">{review.role}{review.company ? ` at ${review.company}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(review.rating)].map((_, si) => <Star key={si} size={12} className="fill-amber-400 text-amber-400" />)}
                  {[...Array(5 - review.rating)].map((_, si) => <Star key={si + review.rating} size={12} className="text-slate-200" />)}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-4">{review.text}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 text-[10px]">
                  <span className="font-semibold text-indigo-600">{review.program}</span>
                  <span className="text-slate-400">{review.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Ready to Transform Your Career?
            </h2>
            <p className="text-indigo-100 text-sm">Join thousands of successful learners who have accelerated their careers with CareerVeda</p>
            <button onClick={handleEnroll} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 text-sm font-bold rounded-xl hover:shadow-xl active:scale-95 transition-all cursor-pointer">
              Enroll Now - {program.price} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
