import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Play, ArrowRight, Target, Shield, BarChart3, Briefcase, 
  CheckCircle2, ChevronRight, Check, Brain, Users, GraduationCap, Code2,
  Upload, X, Send, Award, LayoutDashboard, Map, MessageSquare, Settings, UserCheck,
  Cloud, Palette
} from 'lucide-react';
import { PROGRAMS_LIST } from '@/lib/programsData';

// Program outcomes details for insights
const PROGRAM_SALARY_SCALES: Record<string, { base: number; multiplier: number; highest: string; rate: string; partners: number }> = {
  'ai-engineering': { base: 1000000, multiplier: 1.45, highest: '₹40 LPA', rate: '95%', partners: 140 },
  'product-management': { base: 800000, multiplier: 1.4, highest: '₹35 LPA', rate: '90%', partners: 150 },
  'data-science-with-gen-ai': { base: 700000, multiplier: 1.42, highest: '₹40 LPA', rate: '92%', partners: 200 },
  'data-analytics-with-gen-ai': { base: 550000, multiplier: 1.3, highest: '₹18 LPA', rate: '85%', partners: 110 },
  'investment-banking': { base: 900000, multiplier: 1.35, highest: '₹38 LPA', rate: '93%', partners: 95 }
};

interface OrbitRole {
  label: string;
  color: string;
  icon: any;
  angleOffset: number;
  radius: number;
  salary: string;
  openings: string;
  growth: string;
  duration: string;
  skills: string[];
  match: number;
  projects: string[];
  companies: string[];
}

export default function LandingPage() {
  const navigate = useNavigate();
  
  // Interactive Orbit Universe States
  const [time, setTime] = useState(0);
  const [mouseContainerPos, setMouseContainerPos] = useState({ x: 0, y: 0 });
  const [hoveredRole, setHoveredRole] = useState<OrbitRole | null>(null);
  const [selectedRole, setSelectedRole] = useState<OrbitRole | null>(null);
  const [mobileRoleIndex, setMobileRoleIndex] = useState(0);
  
  const orbitRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Time loop for orbit rotation
  useEffect(() => {
    let animId: number;
    const update = () => {
      setTime(prev => prev + 0.002);
      animId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Parallax / Container movement based on mouse
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!orbitRef.current) return;
    const rect = orbitRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMouseContainerPos({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseContainerPos({ x: 0, y: 0 });
  };

  const orbitRoles: OrbitRole[] = useMemo(() => [
    { 
      label: 'AI Engineer', 
      color: 'text-[#5B3DF5] border-[#5B3DF5]/20 bg-white/95 hover:border-[#5B3DF5]/40', 
      icon: Brain, 
      angleOffset: 3 * Math.PI / 2, 
      radius: 185,
      salary: '₹24 LPA',
      openings: '12,450+',
      growth: '32%',
      duration: '12 Months',
      skills: ['Python', 'Machine Learning', 'Deep Learning', 'LLMs', 'MLOps'],
      match: 92,
      projects: ['Resume AI', 'Chatbot', 'Agent System', 'Recommendation Engine'],
      companies: ['Google', 'Microsoft', 'Amazon', 'Adobe']
    },
    { 
      label: 'Product Manager', 
      color: 'text-emerald-600 border-emerald-250 bg-white/95 hover:border-emerald-350', 
      icon: Briefcase, 
      angleOffset: 11 * Math.PI / 6, 
      radius: 145,
      salary: '₹26 LPA',
      openings: '8,120+',
      growth: '25%',
      duration: '6 Months',
      skills: ['Product Strategy', 'Roadmapping', 'User Research', 'A/B Testing', 'Agile'],
      match: 88,
      projects: ['Fintech PRD Spec', 'Zepto Funnel Optimizer', 'Cohort Analytics'],
      companies: ['Razorpay', 'Swiggy', 'Zepto']
    },
    { 
      label: 'Cloud Engineer', 
      color: 'text-sky-600 border-sky-250 bg-white/95 hover:border-sky-350', 
      icon: Cloud, 
      angleOffset: Math.PI / 6, 
      radius: 185,
      salary: '₹18 LPA',
      openings: '15,300+',
      growth: '20%',
      duration: '6 Months',
      skills: ['AWS', 'Terraform', 'Docker', 'CI/CD', 'Kubernetes'],
      match: 85,
      projects: ['Multi-Region Gateway', 'IaC Pipeline', 'Autoscale Cluster'],
      companies: ['IBM', 'Cognizant', 'Deloitte']
    },
    { 
      label: 'Designer', 
      color: 'text-fuchsia-600 border-fuchsia-250 bg-white/95 hover:border-fuchsia-350', 
      icon: Palette, 
      angleOffset: Math.PI / 3, 
      radius: 100,
      salary: '₹14 LPA',
      openings: '9,800+',
      growth: '18%',
      duration: '6 Months',
      skills: ['Figma', 'Design Systems', 'User Journeys', 'Wireframing', 'Prototyping'],
      match: 80,
      projects: ['EdTech UI System', 'SaaS Dashboard Layout', 'Gamified UX Flow'],
      companies: ['Razorpay', 'Adobe', 'Swiggy']
    },
    { 
      label: 'Cyber Security', 
      color: 'text-amber-600 border-amber-250 bg-white/95 hover:border-amber-350', 
      icon: Shield, 
      angleOffset: Math.PI / 2, 
      radius: 185,
      salary: '₹22 LPA',
      openings: '6,450+',
      growth: '28%',
      duration: '12 Months',
      skills: ['Network Security', 'Cryptography', 'Penetration Testing', 'SIEM', 'Compliance'],
      match: 86,
      projects: ['Zero-Trust Auth', 'IDS Log Parser', 'Vulnerability Scanner'],
      companies: ['Deloitte', 'TCS', 'Accenture']
    },
    { 
      label: 'Full Stack Developer', 
      color: 'text-teal-600 border-teal-250 bg-white/95 hover:border-teal-350', 
      icon: Code2, 
      angleOffset: 5 * Math.PI / 6, 
      radius: 100,
      salary: '₹16 LPA',
      openings: '28,900+',
      growth: '15%',
      duration: '6 Months',
      skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'TailwindCSS'],
      match: 90,
      projects: ['SaaS Dashboard', 'Chat Engine', 'E-Commerce Serverless'],
      companies: ['Infosys', 'Cognizant', 'Razorpay']
    },
    { 
      label: 'Data Scientist', 
      color: 'text-blue-600 border-blue-250 bg-white/95 hover:border-blue-350', 
      icon: BarChart3, 
      angleOffset: 7 * Math.PI / 6, 
      radius: 145,
      salary: '₹20 LPA',
      openings: '11,200+',
      growth: '26%',
      duration: '12 Months',
      skills: ['Python', 'Statistics', 'Machine Learning', 'Deep Learning', 'MLOps'],
      match: 89,
      projects: ['Churn Predictor', 'Pricing Engine', 'Attribution Modeler'],
      companies: ['Amazon', 'Microsoft', 'Google']
    }
  ], []);

  // Compute calculated node positions with magnetic pull & parallax offsets
  const computedNodes = useMemo(() => {
    return orbitRoles.map((role) => {
      const angle = time + role.angleOffset;
      let nx = Math.cos(angle) * role.radius;
      let ny = Math.sin(angle) * role.radius;

      // Magnetic hover pull calculation
      const dx = mouseContainerPos.x - nx;
      const dy = mouseContainerPos.y - ny;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 70) {
        const pull = ((70 - distance) / 70) * 20; 
        nx += (dx / distance) * pull;
        ny += (dy / distance) * pull;
      }

      return {
        role,
        x: nx,
        y: ny,
      };
    });
  }, [time, mouseContainerPos, orbitRoles]);

  // Particle System Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 400;
    let height = 400;
    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: 30 }, () => {
      const orbitRadii = [100, 145, 185];
      const r = orbitRadii[Math.floor(Math.random() * orbitRadii.length)];
      return {
        radius: r,
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 1.5 + 0.8,
        opacity: Math.random() * 0.4 + 0.1
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2;

      particles.forEach((p) => {
        p.angle += p.speed;
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(91, 61, 245, ${p.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // Career Snapshot Metric Detail Tooltips
  const [activeMetricHover, setActiveMetricHover] = useState<string | null>(null);

  // Program Card Expands
  const [expandedProgramSlug, setExpandedProgramSlug] = useState<string | null>(null);

  // Copilot Mockup Dashboard state
  const [activeDashboardTab, setActiveDashboardTab] = useState('Dashboard');
  const [selectedDashboardMetric, setSelectedDashboardMetric] = useState<string | null>(null);
  const [hoveredRoadmapNode, setHoveredRoadmapNode] = useState<string | null>(null);
  const [selectedRoadmapNode, setSelectedRoadmapNode] = useState<string | null>(null);

  // Chat messages simulation
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: "Hi Rohan! I'm your AI Career Copilot. Ask me anything about your roadmap, skill gaps, or target roles!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    
    setTimeout(() => {
      let aiResponse = "I can analyze that for you. Try completing the current assessment module to unlock tailored recommendations!";
      const textLower = userText.toLowerCase();
      if (textLower.includes('roadmap') || textLower.includes('schedule')) {
        aiResponse = "Your active AI roadmap is set to 12 Months. Completing 'Deep Learning' next will trigger interview slots with Razorpay.";
      } else if (textLower.includes('resume') || textLower.includes('ats')) {
        aiResponse = "Your resume currently scored 84%. Adding verified GCP deployments and LLM APIs will push it past the 90% threshold for top recruiters.";
      } else if (textLower.includes('interview') || textLower.includes('dsa')) {
        aiResponse = "I recommend focusing on system design patterns like distributed caching (Redis) and mock DSA drills to boost your Interview Score.";
      } else if (textLower.includes('salary') || textLower.includes('package')) {
        aiResponse = "AI Engineers on our platform see an average starting package of ₹24.7 LPA. Gaining MLOps expertise yields the highest salary progression.";
      } else if (textLower.includes('project')) {
        aiResponse = "Building a multi-agent recommendation chatbot or resume evaluation engine will showcase hands-on capability to our hiring partners.";
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Partner Logo Custom Details
  const [hoveredPartner, setHoveredPartner] = useState<string | null>(null);
  const partnerDetails: Record<string, { roles: number; salary: string; skills: string[]; topProgram: string }> = {
    Google: { roles: 420, salary: '₹28 LPA', skills: ['Deep Learning', 'PyTorch', 'System Architecture'], topProgram: 'Data Science with Gen AI' },
    Microsoft: { roles: 310, salary: '₹26 LPA', skills: ['TypeScript', 'Azure', 'C#', 'SQL'], topProgram: 'Data Science with Gen AI' },
    Amazon: { roles: 580, salary: '₹25 LPA', skills: ['Java', 'Distributed Systems', 'AWS'], topProgram: 'Data Analytics with Gen AI' },
    Adobe: { roles: 150, salary: '₹24 LPA', skills: ['C++', 'React', 'Figma', 'UX Research'], topProgram: 'Product Management' },
    TCS: { roles: 1450, salary: '₹8 LPA', skills: ['Java', 'Cloud Foundations', 'SQL'], topProgram: 'AI Engineering' },
    Infosys: { roles: 1200, salary: '₹9 LPA', skills: ['JavaScript', 'Python Core', 'AWS'], topProgram: 'Data Analytics' },
    Deloitte: { roles: 840, salary: '₹14 LPA', skills: ['Cyber Security', 'Risk Audit', 'PowerBI'], topProgram: 'Investment Banking' },
    Flipkart: { roles: 210, salary: '₹20 LPA', skills: ['React', 'Node.js', 'Redis', 'Algorithms'], topProgram: 'AI Engineering' }
  };

  // Benefits Card Stretches
  const [hoveredBenefitIdx, setHoveredBenefitIdx] = useState<number | null>(null);
  const benefitMetrics = [
    { title: 'Industry Curriculum', desc: 'Designed with top tech leads to teach what industry demands today.', stat: '98% Syllabus Relevance', proof: 'Co-created with 40+ Tech leads', story: 'Alumni pass interviews in average 2 rounds.' },
    { title: 'Expert Mentorship', desc: 'Learn from 200+ advisors from Google, Microsoft, and Amazon.', stat: '1-on-1 Access Weekly', proof: '200+ FAANG/Industry coaches', story: 'Weekly mock reviews build extreme confidence.' },
    { title: 'Hands-On Learning', desc: '15+ real-world capstone projects hosted on actual cloud instances.', stat: '15+ Live Deployments', proof: 'GCP & AWS container setups', story: 'Repositories are directly shareable with verified partners.' },
    { title: 'Placement Support', desc: '900+ hiring channels and active placement pipelines.', stat: '94% Hiring Success', proof: '900+ recruitment channels', story: 'Benchmark clearances unlock fast-track interview schedules.' },
    { title: 'High Salary Growth', desc: 'Transition into high-paying, irreplaceable technology roles.', stat: '67% Avg Hike', proof: 'Verified hike parameters', story: 'Highest achieved package reaches up to ₹40L+.' },
    { title: 'Global Certifications', desc: 'Verify your knowledge with industry-recognized certificate validations.', stat: 'ISO & Partner Audited', proof: 'Secure blockchain verified credentials', story: 'Certificates can be shared directly with LinkedIn recruiter engines.' },
    { title: 'Lifetime Career Support', desc: 'Unlock access to alum boards, exclusive job alerts, and resume checks.', stat: '24/7 Portal Access', proof: 'Active community channels', story: 'Get advice even 3 years after program completion.' },
    { title: 'Flexible Learning', desc: 'Pre-recorded theory modules paired with live weekend drills.', stat: 'Self-Paced Core', proof: '20+ hours theory archives', story: 'Perfect for working professionals balancing jobs.' }
  ];

  // Trust Showcase state
  const [placedFilter, setPlacedFilter] = useState('All');
  const studentProjects = [
    { title: 'Automated ATS Resume Grader', category: 'AI', tags: ['Python', 'DeepSeek', 'Vite'], views: 420, creator: 'Rohan' },
    { title: 'Real-time Distributed Chat Gateway', category: 'Web Development', tags: ['React', 'Node.js', 'Redis'], views: 350, creator: 'Kunal' },
    { title: 'Market Basket Affinity Predictor', category: 'Data Science', tags: ['Python', 'Tableau', 'Scikit-Learn'], views: 290, creator: 'Priya' },
    { title: 'Zepto Checkout Funnel PRD Spec', category: 'Product Management', tags: ['Figma', 'Amplitude', 'Notion'], views: 510, creator: 'Neha' },
    { title: 'Agentic SQL Query Constructor', category: 'AI', tags: ['PyTorch', 'LangChain', 'FastAPI'], views: 610, creator: 'Aditya' },
    { title: 'Serverless Video Streaming pipeline', category: 'Web Development', tags: ['AWS Lambda', 'S3', 'CloudFront'], views: 480, creator: 'Rohit' }
  ];

  // Simulated live placement ticker
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickerEvents = [
    { name: 'Rohan', company: 'Infosys', package: '₹8 LPA', time: '2 hours ago' },
    { name: 'Priya', company: 'TCS', package: '₹10 LPA', time: '5 hours ago' },
    { name: 'Neha Gupta', company: 'Razorpay', package: '₹18 LPA', time: '14 mins ago' },
    { name: 'Karan Malhotra', company: 'Swiggy', package: '₹22 LPA', time: '1 hour ago' },
    { name: 'Aditya Sen', company: 'Adobe', package: '₹32 LPA', time: '3 hours ago' }
  ];
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickerEvents.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [tickerEvents.length]);

  // AI Resume Analyzer Demo State
  const [analyzerInput, setAnalyzerInput] = useState('');
  const [analyzingFile, setAnalyzingFile] = useState(false);
  const [analyzerReport, setAnalyzerReport] = useState<any>(null);

  const handleMockAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analyzerInput.trim()) return;
    setAnalyzingFile(true);
    setTimeout(() => {
      setAnalyzingFile(false);
      setAnalyzerReport({
        score: 84,
        gaps: ['Cloud Architecture (AWS/GCP)', 'Distributed Caching (Redis)', 'LLM Orchestration'],
        match: 91,
        salary: '₹14–22 LPA',
        roadmap: ['Linux & Shell fundamentals', 'Docker containers', 'Kubernetes & AWS Deployments', 'LLM Wrappers & Prompt API integration']
      });
    }, 2000);
  };

  return (
    <div className="w-full relative overflow-hidden bg-white grid-bg-light text-slate-800">
      
      {/* Background radial overlays */}
      <div className="absolute top-10 left-[10%] w-[600px] h-[600px] bg-[#5B3DF5]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] right-[5%] w-[550px] h-[550px] bg-[#7C6CFD]/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* ---------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="relative pt-28 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 min-h-[85vh]">
        
        {/* Left Column: Brand Pitch (45%) */}
        <div className="lg:w-[45%] w-full space-y-6 text-left relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B3DF5]/5 border border-[#5B3DF5]/10">
            <Sparkles size={13} className="text-[#5B3DF5] animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-[#5B3DF5] uppercase font-sans">AI Powered Career Ecosystem</span>
          </div>

          <h1 className="text-5xl md:text-[96px] font-[800] tracking-tight text-slate-900 leading-[0.95] font-display">
            Become <br />
            <span className="gradient-text-primary">Irreplaceable.</span>
          </h1>

          <h2 className="text-xl font-[700] text-slate-800">Your AI Career Operating System</h2>

          <p className="text-slate-505 text-sm leading-relaxed font-medium max-w-lg">
            We analyze your skills, build your roadmap, prepare you for interviews and match you with life-changing opportunities.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button 
              onClick={() => navigate('/career-analysis')} 
              className="group relative overflow-hidden flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#5B3DF5] to-[#7C6CFD] text-white font-[700] text-xs rounded-xl shadow-lg shadow-[#5B3DF5]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              Start Free Career Analysis <ArrowRight size={14} />
            </button>
            <button 
              onClick={() => {
                const copilotSection = document.getElementById('copilot');
                copilotSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-350 text-slate-700 font-[700] text-xs transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-[#5B3DF5]/5 flex items-center justify-center text-[#5B3DF5]"><Play size={8} fill="currentColor" /></div>
              Watch Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-6 border-t border-slate-105">
            <div className="flex -space-x-2.5">
              {['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'].map((url, i) => (
                <img key={i} src={url} className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" alt="Learner" />
              ))}
            </div>
            <p className="text-[11px] text-slate-500 font-[700]">
              4.9/5 ⭐ <span className="text-slate-400 font-[500]">Trusted by 12,000+ learners</span>
            </p>
          </div>
        </div>

        {/* Center Column: Interactive Orbit Space (35%) */}
        <div className="lg:w-[35%] w-full relative flex flex-col items-center justify-center min-h-[440px] z-10">
          
          <div 
            ref={orbitRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="flex relative w-[400px] h-[400px] items-center justify-center scale-[0.65] min-[375px]:scale-[0.75] min-[414px]:scale-[0.82] sm:scale-90 md:scale-95 lg:scale-[0.85] xl:scale-100 transition-transform duration-300 origin-center select-none"
          >
            {/* Background Canvas Particles */}
            <canvas ref={canvasRef} width={400} height={400} className="absolute inset-0 pointer-events-none z-0 w-full h-full" />

            {/* SVG Orbit Ring Lines */}
            <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full pointer-events-none">
              <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(91, 61, 245, 0.08)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="200" cy="200" r="145" fill="none" stroke="rgba(91, 61, 245, 0.08)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="200" cy="200" r="185" fill="none" stroke="rgba(91, 61, 245, 0.08)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>

            {/* Orbit Center: YOU */}
            <div 
              className="absolute w-[110px] h-[110px] rounded-full bg-gradient-to-br from-[#5B3DF5] to-[#7C6CFD] flex flex-col items-center justify-center text-white shadow-xl shadow-[#5B3DF5]/30 z-20 hover:scale-105 transition-transform duration-300 cursor-pointer"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 35px rgba(91, 61, 245, 0.35)'
              }}
              onClick={() => setSelectedRole(null)}
            >
              <span className="text-[10px] font-[800] tracking-[0.2em] text-[#00C2FF] uppercase leading-none mb-1.5 font-display">YOU</span>
              <Users size={22} className="stroke-[1.5]" />
              <div className="absolute inset-0 bg-[#5B3DF5] rounded-full animate-ping opacity-10 pointer-events-none" />
            </div>

            {/* Orbiting Career Nodes */}
            {computedNodes.map((n, idx) => {
              const Icon = n.role.icon;
              const isHovered = hoveredRole?.label === n.role.label;
              const isSelected = selectedRole?.label === n.role.label;

              return (
                <div 
                  key={idx}
                  className={`absolute px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-[10px] font-bold shadow-sm backdrop-blur-md cursor-pointer transition-all duration-100 ${
                    isSelected 
                      ? 'border-[#5B3DF5] bg-indigo-50 shadow-indigo-100 text-[#5B3DF5]' 
                      : isHovered 
                        ? 'border-[#5B3DF5]/40 bg-indigo-50/50 shadow-indigo-50 text-[#5B3DF5]' 
                        : n.role.color
                  }`}
                  style={{ 
                    left: '50%',
                    top: '50%',
                    transform: `translate3d(calc(-50% + ${n.x}px), calc(-50% + ${n.y}px), 0) scale(${isHovered || isSelected ? 1.08 : 1})`,
                    boxShadow: isHovered || isSelected ? '0 10px 20px -5px rgba(91, 61, 245, 0.15)' : 'none'
                  }}
                  onMouseEnter={() => setHoveredRole(n.role)}
                  onMouseLeave={() => setHoveredRole(null)}
                  onClick={() => setSelectedRole(n.role)}
                >
                  <Icon size={12} className="flex-shrink-0 opacity-90" />
                  <span>{n.role.label}</span>
                </div>
              );
            })}

            {/* Floating Intelligence Card on hover (follows node offset) */}
            <AnimatePresence>
              {hoveredRole && (() => {
                const nodePos = computedNodes.find(n => n.role.label === hoveredRole.label);
                if (!nodePos) return null;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 15 }}
                    className="absolute bg-slate-900 text-white rounded-2xl p-4 w-[240px] shadow-2xl border border-slate-800 z-40 text-left space-y-3 pointer-events-none"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate3d(calc(-50% + ${nodePos.x}px), calc(-50% + ${nodePos.y - 120}px), 0)`
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-xs text-white">{hoveredRole.label}</h4>
                        <p className="text-[7px] text-indigo-300 uppercase tracking-widest font-bold mt-0.5">Career Intelligence</p>
                      </div>
                      <span className="text-[9px] font-bold text-[#00C2FF] bg-[#5B3DF5]/20 px-1.5 py-0.5 rounded">
                        {hoveredRole.match}% Match
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 border-t border-slate-800 pt-2 text-[9px]">
                      <div>
                        <p className="text-slate-400">Avg Salary</p>
                        <p className="font-bold text-white mt-0.5">{hoveredRole.salary}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Demand Growth</p>
                        <p className="font-bold text-emerald-400 mt-0.5">+{hoveredRole.growth}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Open Positions</p>
                        <p className="font-bold text-white mt-0.5">{hoveredRole.openings}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Roadmap Duration</p>
                        <p className="font-bold text-[#7C6CFD] mt-0.5">{hoveredRole.duration}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">Skills Required</p>
                      <div className="flex flex-wrap gap-1">
                        {hoveredRole.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="px-1.5 py-0.5 bg-slate-800 text-slate-350 rounded text-[7px] font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

          </div>

          {/* Mobile Fallback: Swipeable / Carousel Career Cards */}
          <div className="block lg:hidden w-full max-w-sm px-4 py-6 relative z-10">
            <div className="bg-white border border-slate-105 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5B3DF5] animate-pulse" />
                  <h4 className="font-bold text-sm text-slate-800">{orbitRoles[mobileRoleIndex].label}</h4>
                </div>
                <span className="text-xs font-black text-[#5B3DF5] bg-indigo-50 px-2 py-0.5 rounded">
                  {orbitRoles[mobileRoleIndex].match}% Match
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-50">
                <div>
                  <p className="text-slate-400 font-semibold text-[10px]">Average Salary</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">{orbitRoles[mobileRoleIndex].salary}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold text-[10px]">Open Positions</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">{orbitRoles[mobileRoleIndex].openings}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold text-[10px]">Demand Growth</p>
                  <p className="font-extrabold text-emerald-500 mt-0.5">+{orbitRoles[mobileRoleIndex].growth}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold text-[10px]">Roadmap Duration</p>
                  <p className="font-extrabold text-[#5B3DF5] mt-0.5">{orbitRoles[mobileRoleIndex].duration}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Skills Required</p>
                <div className="flex flex-wrap gap-1">
                  {orbitRoles[mobileRoleIndex].skills.map((s, idx) => (
                    <span key={idx} className="px-2 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded text-[9px] font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-1">
                  {orbitRoles.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setMobileRoleIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${mobileRoleIndex === idx ? 'bg-[#5B3DF5] w-4' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => setSelectedRole(orbitRoles[mobileRoleIndex])}
                  className="px-3 py-1.5 bg-[#5B3DF5] text-white rounded-xl text-[10px] font-bold shadow-md shadow-[#5B3DF5]/10 cursor-pointer"
                >
                  Explore Details
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Snapshot Card (20%) */}
        <div className="lg:w-[20%] w-full flex items-center justify-center relative z-20">
          <div className="w-[280px] bg-white border border-slate-100 rounded-3xl p-5 shadow-xl text-left">
            <div className="border-b border-slate-50 pb-3 mb-4">
              <p className="text-xs font-[700] text-slate-800 uppercase tracking-wider leading-none">Your Career Snapshot</p>
            </div>
            
            <div className="space-y-4">
              {[
                { 
                  id: 'readiness', 
                  label: 'Career Readiness', 
                  val: '87%', 
                  color: 'text-[#5B3DF5]', 
                  subtext: '↑ 12% this month',
                  subColor: 'text-emerald-500',
                  subMetrics: [
                    { name: 'Communication', score: 70 },
                    { name: 'Technical', score: 90 },
                    { name: 'Projects', score: 80 },
                    { name: 'Portfolio', score: 85 }
                  ]
                },
                { 
                  id: 'interview', 
                  label: 'Interview Ready', 
                  val: '74%', 
                  color: 'text-emerald-600', 
                  subtext: '↑ 9% this month',
                  subColor: 'text-emerald-500',
                  subMetrics: [
                    { name: 'DSA', score: 82 },
                    { name: 'System Design', score: 65 },
                    { name: 'Behavioral', score: 88 }
                  ]
                },
                { 
                  id: 'match', 
                  label: 'AI Match Score', 
                  val: '92%', 
                  color: 'text-[#00C2FF]', 
                  subtext: 'Tag: AI Engineer',
                  subColor: 'text-slate-400',
                  subMetrics: [
                    { name: 'AI Engineer', score: 92 },
                    { name: 'ML Engineer', score: 89 },
                    { name: 'Data Scientist', score: 86 }
                  ]
                },
                { 
                  id: 'salary', 
                  label: 'Salary Potential', 
                  val: '₹18 LPA', 
                  color: 'text-amber-500', 
                  subtext: '↑ 32% vs current',
                  subColor: 'text-emerald-500',
                  subMetrics: [
                    { name: 'Current Market Value', score: 6, isLpa: true },
                    { name: 'Potential', score: 18, isLpa: true }
                  ]
                }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="relative cursor-pointer p-2 rounded-xl hover:bg-slate-50/50 transition-colors"
                  onMouseEnter={() => setActiveMetricHover(item.id)}
                  onMouseLeave={() => setActiveMetricHover(null)}
                >
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold text-slate-405">{item.label}</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className={`text-xl font-[800] tracking-tight ${item.color}`}>{item.val}</span>
                    <span className={`text-[9px] font-[700] ${item.subColor}`}>{item.subtext}</span>
                  </div>
                  
                  {/* Detailed sub-scores layout on hover */}
                  <AnimatePresence>
                    {activeMetricHover === item.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[9px] text-slate-500 mt-2 font-semibold space-y-1.5 overflow-hidden"
                      >
                        {item.subMetrics.map((sm: any, smIdx: number) => (
                          <div key={smIdx} className="space-y-1">
                            <div className="flex justify-between items-center text-[8.5px]">
                              <span>{sm.name}</span>
                              <span className="font-extrabold">{sm.isLpa ? `₹${sm.score} LPA` : `${sm.score}%`}</span>
                            </div>
                            <div className="h-1 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                              <div 
                                className="h-full bg-[#5B3DF5] rounded-full" 
                                style={{ width: sm.isLpa ? `${(sm.score / 24) * 100}%` : `${sm.score}%` }} 
                              />
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => navigate('/career-analysis')}
              className="w-full mt-4 pt-4 border-t border-slate-50 text-[#5B3DF5] hover:text-[#7C6CFD] text-[10px] font-bold transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>View Full Analysis</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

      </section>

      {/* Orbit Click: Slide-Over Detail Panel Drawer */}
      <AnimatePresence>
        {selectedRole && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs" 
              onClick={() => setSelectedRole(null)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedRole.label} Genome</h3>
                  <p className="text-[10px] text-slate-405 font-bold uppercase tracking-wider mt-0.5">Interactive Career Pathway</p>
                </div>
                <button 
                  onClick={() => setSelectedRole(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-[#5B3DF5] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Salary Growth Graph */}
              <div className="space-y-2 text-left">
                <h4 className="text-xs font-bold text-slate-555 uppercase tracking-widest">Expected Salary growth</h4>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
                  {[
                    { year: 'Year 1 (Starting)', amount: selectedRole.salary, progress: 40 },
                    { year: 'Year 3 (Mid level)', amount: `₹${parseInt(selectedRole.salary.replace(/[^0-9]/g, '')) * 1.5} LPA`, progress: 65 },
                    { year: 'Year 5 (Lead/Architect)', amount: `₹${parseInt(selectedRole.salary.replace(/[^0-9]/g, '')) * 2.2} LPA`, progress: 95 }
                  ].map((row, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold">
                        <span className="text-slate-400">{row.year}</span>
                        <span className="text-slate-900 font-black">{row.amount}</span>
                      </div>
                      <div className="h-1.5 bg-white border border-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#5B3DF5] to-[#00C2FF] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${row.progress}%` }}
                          transition={{ duration: 1, delay: idx * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Syllabus Roadmaps */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-555 uppercase tracking-widest">Skill Milestones</h4>
                <div className="relative pl-6 space-y-4 pt-1">
                  <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-indigo-105" />
                  
                  {[
                    'Python Syntax & Core Logic',
                    'Statistics & Analytics Fundamentals',
                    'Machine Learning Architectures',
                    'Deep Learning & PyTorch Core',
                    'LLMs, RAG Pipelines & APIs',
                    `${selectedRole.label} Portfolio Build`
                  ].map((skill, idx) => (
                    <div key={idx} className="relative flex items-center gap-3">
                      <div className="absolute -left-5 w-2.5 h-2.5 rounded-full bg-[#5B3DF5] ring-4 ring-indigo-50" />
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl w-full text-left flex justify-between items-center hover:border-[#5B3DF5]/30 transition-colors">
                        <div>
                          <h5 className="text-xs font-bold text-slate-700">{skill}</h5>
                          <p className="text-[8px] text-slate-400 mt-0.5">Verified module checks and drills.</p>
                        </div>
                        <span className="text-[8px] font-bold text-slate-400">Step {idx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Projects */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-555 uppercase tracking-widest">Real Projects Portfolio</h4>
                <div className="grid grid-cols-2 gap-3 text-left">
                  {selectedRole.projects.map((proj, idx) => (
                    <div key={idx} className="p-3 border border-slate-100 rounded-xl space-y-1 hover:border-[#5B3DF5]/30 hover:bg-slate-50/50 transition-colors">
                      <h5 className="text-[10px] font-extrabold text-slate-707 leading-snug">{proj}</h5>
                      <span className="text-[7.5px] font-bold text-[#5B3DF5] bg-indigo-50 px-1 py-0.5 rounded">Verified Capstone</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hiring Companies */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-555 uppercase tracking-widest">Hiring Companies</h4>
                <div className="flex flex-wrap gap-2 text-left">
                  {selectedRole.companies.map((company, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl text-[10px] font-bold shadow-xs">
                      {company}
                    </span>
                  ))}
                </div>
              </div>

              {/* Enroll button */}
              <button 
                onClick={() => {
                  setSelectedRole(null);
                  navigate('/programs');
                }}
                className="w-full mt-auto py-3.5 bg-gradient-to-r from-[#5B3DF5] to-[#7C6CFD] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#5B3DF5]/10 cursor-pointer text-center"
              >
                Enroll in {selectedRole.label} Program
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* STATS BAR SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="bg-white border-y border-slate-100 py-6 md:py-0 md:h-[120px] flex items-center px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 items-center w-full">
          {[
            { metric: '12,000+', label: 'Placed Learners', icon: Users },
            { metric: '900+', label: 'Hiring Partners', icon: Briefcase },
            { metric: '67%', label: 'Average Hike', icon: BarChart3 },
            { metric: '120+', label: 'Verified Capstones', icon: Code2 },
            { metric: '200+', label: 'FAANG Advisors', icon: GraduationCap }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-3 justify-start md:justify-center border-r last:border-r-0 border-slate-100/80 pr-4 last:pr-0">
                <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-[#5B3DF5] flex-shrink-0">
                  <Icon size={18} className="stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-[800] text-slate-900 leading-tight tracking-tight">{item.metric}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* PROGRAMS SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-28 px-6 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="text-left space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B3DF5]">Transformative Paths</p>
            <h2 className="text-3xl md:text-5xl font-[700] text-slate-900 tracking-tight leading-none font-display">
              Discover Programs That Transform Careers
            </h2>
            <p className="text-slate-500 text-sm">
              Industry-recognized programs designed with top companies to get you job-ready.
            </p>
          </div>
          <button 
            onClick={() => navigate('/programs')}
            className="flex items-center gap-1.5 text-[#5B3DF5] hover:text-[#7C6CFD] text-xs font-bold transition-colors cursor-pointer group"
          >
            <span>View All Programs</span>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Programs Grid */}
        <div className="flex flex-wrap justify-center gap-8">
          {PROGRAMS_LIST.map((prog, i) => {
            return (
              <div 
                key={i} 
                className="w-[320px] h-[460px] bg-white border border-slate-100 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group hover:border-[#5B3DF5]/30 hover:shadow-2xl hover:shadow-[#5B3DF5]/5 transition-all duration-300 cursor-pointer hover:-translate-y-2"
                style={{
                  boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.02)'
                }}
              >
                <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${prog.color}`} />
                
                {/* Content */}
                <div className="space-y-4 text-left flex-grow flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-[#5B3DF5]/5 border border-[#5B3DF5]/10 text-[9px] font-bold text-[#5B3DF5]">
                        {prog.duration}
                      </span>
                      {prog.isPopular && (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 text-[9px] font-bold text-amber-600">
                          Popular
                        </span>
                      )}
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{prog.tag}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-snug group-hover:text-[#5B3DF5] transition-colors">
                      {prog.title}
                    </h3>

                    <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3 font-medium">
                      {prog.desc}
                    </p>
                  </div>

                  {/* Highlights / Bullet points */}
                  <ul className="space-y-2 py-3 border-y border-slate-50 flex-grow flex flex-col justify-center">
                    {prog.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[11px] text-slate-505 font-medium">
                        <Check size={12} className="text-[#5B3DF5] flex-shrink-0" />
                        <span className="line-clamp-1">{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Placement Statistics row */}
                  <div className="grid grid-cols-2 gap-3 py-3">
                    <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-2 text-center">
                      <p className="text-lg font-[800] text-[#5B3DF5] leading-none">{prog.placementRate}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Placement Rate</p>
                    </div>
                    <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-2 text-center">
                      <p className="text-lg font-[800] text-slate-900 leading-none">{prog.avgPackage}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Average Package</p>
                    </div>
                  </div>

                  {/* CTA button inside Card */}
                  <div className="pt-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/program/${prog.slug}`);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-[#5B3DF5] text-slate-700 hover:text-white rounded-xl text-[11px] font-bold transition-all duration-300 cursor-pointer group/btn"
                    >
                      <span>Explore Program DNA</span> 
                      <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* AI CAREER COPILOT SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-28 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="copilot">
        
        {/* Left: Explanation Card */}
        <div className="lg:col-span-4 text-left space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5B3DF5]/5 border border-[#5B3DF5]/10">
            <Award size={14} className="text-[#5B3DF5] animate-pulse" />
            <span className="text-[10px] font-[800] tracking-wider text-[#5B3DF5] uppercase font-sans">AI Career Copilot</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-[700] text-slate-900 leading-[1.1] font-display">
            Your Personal <br />
            AI Career Copilot
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            Get personalized roadmaps, resume analysis, mock interview feedback, and job matching - all inside one intelligent dashboard. Switch tabs in the mockup dashboard to experience the workspace live.
          </p>
          <button 
            onClick={() => navigate('/ai-copilot')} 
            className="flex items-center gap-1.5 px-6 py-3.5 bg-gradient-to-r from-[#5B3DF5] to-[#7C6CFD] text-white rounded-xl font-bold text-xs shadow-lg shadow-[#5B3DF5]/10 hover:shadow-[#5B3DF5]/20 active:scale-95 transition-all cursor-pointer"
          >
            Try AI Copilot Free <ArrowRight size={14} />
          </button>
        </div>

        {/* Right: High fidelity working mockup dashboard */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row min-h-[500px] text-left">
          
          {/* Dashboard Sidebar */}
          <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-slate-100 bg-white p-4 space-y-4 flex flex-col justify-between flex-shrink-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-5 h-5 rounded-lg bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <Brain size={11} />
                </div>
                <span className="font-bold text-xs text-slate-800 tracking-tight font-display">
                  Career<span className="text-indigo-600">Veda</span>
                </span>
              </div>
              <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-1 pb-2 md:pb-0 scrollbar-none">
                {[
                  { name: 'Dashboard', icon: LayoutDashboard },
                  { name: 'Roadmap', icon: Map },
                  { name: 'AI Copilot', icon: MessageSquare },
                  { name: 'Skills', icon: Award },
                  { name: 'Projects', icon: Code2 },
                  { name: 'Interviews', icon: UserCheck },
                  { name: 'Jobs', icon: Briefcase },
                  { name: 'Mentors', icon: Users },
                  { name: 'Certificates', icon: GraduationCap },
                  { name: 'Settings', icon: Settings }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button 
                      key={tab.name}
                      onClick={() => {
                        setActiveDashboardTab(tab.name);
                        setSelectedDashboardMetric(null);
                      }}
                      className={`px-3 py-2.5 rounded-xl text-[9px] font-bold cursor-pointer text-left whitespace-nowrap transition-all flex-shrink-0 md:w-full flex items-center gap-2 ${
                        activeDashboardTab === tab.name 
                          ? 'bg-[#5B3DF5] text-white shadow-sm shadow-[#5B3DF5]/15' 
                          : 'text-slate-500 hover:text-[#5B3DF5] hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={12} className={activeDashboardTab === tab.name ? 'text-white' : 'text-slate-400'} />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Minimal brand footer in sidebar */}
            <div className="text-[7.5px] font-semibold text-slate-400 px-1 hidden md:block">
              v1.0.4 · Active Session
            </div>
          </div>

          {/* Dashboard Main Workspace Area */}
          <div className="flex-grow flex flex-col min-h-[480px]">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 p-6">
              <div>
                <h4 className="font-bold text-xs text-slate-800">Welcome back, Rohan 👋</h4>
                <p className="text-[8.5px] text-slate-400 mt-0.5 font-medium">Let&apos;s accelerate your career today!</p>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-bold text-[#5B3DF5] bg-[#5B3DF5]/5 px-2.5 py-1 rounded-lg border border-[#5B3DF5]/10">
                <span>Current Streak</span>
                <span>🔥 12 days</span>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow p-6 flex flex-col justify-between">
              
              <div className="flex-grow">
                
                {activeDashboardTab === 'Dashboard' && (
                  <div className="space-y-6">
                    {/* KPI Cards Row (4 Columns on Desktop) */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { id: 'ready', label: 'Career Readiness', value: '87%', trend: '↑ 12%', color: 'text-slate-800' },
                        { id: 'score', label: 'Interview Score', value: '74%', trend: '↑ 8%', color: 'text-slate-800' },
                        { id: 'chance', label: 'Placement Chance', value: '81%', trend: '↑ 15%', color: 'text-slate-800' },
                        { id: 'progress', label: 'Skills Progress', value: '65%', trend: '↑ 10%', color: 'text-slate-800' }
                      ].map((m) => (
                        <div 
                          key={m.id}
                          onClick={() => setSelectedDashboardMetric(selectedDashboardMetric === m.id ? null : m.id)}
                          className={`p-3 bg-white border rounded-2xl cursor-pointer transition-all hover:border-[#5B3DF5]/35 hover:shadow-xs ${
                            selectedDashboardMetric === m.id ? 'border-[#5B3DF5] bg-[#5B3DF5]/5 shadow-sm' : 'border-slate-100'
                          }`}
                        >
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</p>
                          <div className="flex items-baseline justify-between mt-1">
                            <span className={`text-sm font-extrabold ${m.color}`}>{m.value}</span>
                            <span className="text-[7.5px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded flex items-center">
                              {m.trend}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Deeper insights panel (collapsible on clicking KPI) */}
                    {selectedDashboardMetric && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[9px] space-y-1.5 text-left animate-in fade-in slide-in-from-top-1 duration-150"
                      >
                        <p className="font-bold text-slate-700 uppercase text-[8px] tracking-wider">Detailed Insight Breakdown</p>
                        {selectedDashboardMetric === 'ready' && (
                          <div className="grid grid-cols-2 gap-2 text-slate-500">
                            <p>Resume Score: <strong className="text-slate-800">87%</strong></p>
                            <p>Portfolio Score: <strong className="text-slate-800">85%</strong></p>
                            <p>LinkedIn Score: <strong className="text-slate-800">82%</strong></p>
                            <p>Project Score: <strong className="text-slate-800">89%</strong></p>
                          </div>
                        )}
                        {selectedDashboardMetric === 'score' && (
                          <div className="grid grid-cols-2 gap-2 text-slate-500">
                            <p>DSA Score: <strong className="text-slate-800">82%</strong></p>
                            <p>System Design: <strong className="text-slate-800">65%</strong></p>
                            <p>Behavioral: <strong className="text-slate-800">88%</strong></p>
                            <p>Communication: <strong className="text-slate-800">80%</strong></p>
                          </div>
                        )}
                        {selectedDashboardMetric === 'chance' && (
                          <div className="grid grid-cols-2 gap-2 text-slate-500">
                            <p>Google Match: <strong className="text-[#5B3DF5]">92%</strong></p>
                            <p>Amazon Match: <strong className="text-[#5B3DF5]">88%</strong></p>
                            <p>Microsoft Match: <strong className="text-[#5B3DF5]">89%</strong></p>
                          </div>
                        )}
                        {selectedDashboardMetric === 'progress' && (
                          <div className="grid grid-cols-2 gap-2 text-slate-500">
                            <p>Python: <strong className="text-emerald-500">100%</strong></p>
                            <p>Machine Learning: <strong className="text-emerald-500">100%</strong></p>
                            <p>Deep Learning: <strong className="text-[#5B3DF5]">40%</strong></p>
                            <p>LLMs: <strong className="text-slate-400">0%</strong></p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Bottom Row: Roadmap & Next Milestone Side-by-Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      
                      {/* Learning Roadmap Card (Left - col-span-8) */}
                      <div className="lg:col-span-8 border border-slate-100 rounded-2xl p-4 bg-white shadow-xs">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h5 className="font-bold text-[10px] text-slate-800">Your Learning Roadmap</h5>
                            <p className="text-[8px] text-slate-400 mt-0.5">AI Engineer Roadmap • 12 Months</p>
                          </div>
                          <span className="text-[8px] font-bold text-[#5B3DF5] bg-[#5B3DF5]/5 px-2 py-0.5 rounded-lg">66% Complete</span>
                        </div>

                        {/* Horizontal Tracker */}
                        <div className="relative pt-6 pb-2">
                          <div className="absolute top-8 left-6 right-6 h-0.5 bg-slate-100 rounded" />
                          <div className="absolute top-8 left-6 w-[75%] h-0.5 bg-[#5B3DF5] rounded transition-all duration-500" />
                          
                          <div className="relative flex justify-between z-10">
                            {[
                              { name: 'Python Fundamentals', status: 'completed' },
                              { name: 'Machine Learning', status: 'completed' },
                              { name: 'Deep Learning', status: 'completed' },
                              { name: 'LLMs & AI Engineering', status: 'active' },
                              { name: 'AI Engineer Portfolio', status: 'upcoming' }
                            ].map((step, idx) => (
                              <div key={idx} className="flex flex-col items-center w-1/5 relative">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                  step.status === 'completed' 
                                    ? 'bg-[#5B3DF5] border-[#5B3DF5] text-white shadow-sm'
                                    : step.status === 'active'
                                      ? 'bg-white border-[#5B3DF5] text-[#5B3DF5] shadow-md shadow-[#5B3DF5]/20 scale-110'
                                      : 'bg-white border-slate-200 text-slate-300'
                                }`}>
                                  {step.status === 'completed' ? (
                                    <Check size={10} className="stroke-[3]" />
                                  ) : step.status === 'active' ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#5B3DF5] animate-pulse" />
                                  ) : (
                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                  )}
                                </div>
                                <span className={`text-[7.5px] font-bold text-center mt-2 max-w-[85px] leading-tight transition-colors ${
                                  step.status === 'completed' 
                                    ? 'text-slate-700' 
                                    : step.status === 'active'
                                      ? 'text-[#5B3DF5]'
                                      : 'text-slate-400'
                                }`}>
                                  {step.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Next Milestone Card (Right - col-span-4) */}
                      <div className="lg:col-span-4 border border-slate-100 rounded-2xl p-4 bg-white shadow-xs flex flex-col justify-between">
                        <div className="space-y-1.5 text-left">
                          <p className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest">Next Milestone</p>
                          <h5 className="text-[10px] font-black text-slate-800 leading-snug">Build 1 end-to-end AI project</h5>
                          <p className="text-[7.5px] font-semibold text-slate-400">Due in 7 days</p>
                        </div>
                        <button 
                          onClick={() => navigate('/dashboard')}
                          className="w-full mt-4 py-2.5 bg-[#5B3DF5] hover:bg-[#7C6CFD] text-white rounded-xl text-[9px] font-bold tracking-wider transition-all shadow-md shadow-[#5B3DF5]/10 hover:shadow-[#5B3DF5]/25 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        >
                          Continue Learning
                        </button>
                      </div>

                    </div>
                  </div>
                )}

                {activeDashboardTab === 'Roadmap' && (
                  <div className="space-y-4 text-left">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest font-sans">Completed progress tracker</p>
                    
                    {/* Learning Roadmap Nodes timeline */}
                    <div className="relative pl-6 space-y-4">
                      <div className="absolute left-2.5 top-1 bottom-1 w-px bg-slate-100" />
                      {[
                        { node: 'Python Fundamentals', hours: '12 Hours', diff: 'Beginner', comp: 100, proj: '2 Projects' },
                        { node: 'Machine Learning Core', hours: '24 Hours', diff: 'Intermediate', comp: 100, proj: '3 Projects' },
                        { node: 'Deep Learning & NLP', hours: '30 Hours', diff: 'Advanced', comp: 40, proj: '4 Projects' },
                        { node: 'LLMs & AI Systems', hours: '18 Hours', diff: 'Advanced', comp: 0, proj: '3 Projects' },
                        { node: 'AI Engineer Portfolio', hours: '10 Hours', diff: 'Project', comp: 0, proj: 'Capstone' }
                      ].map((step, sIdx) => (
                        <div 
                          key={sIdx} 
                          className="relative cursor-pointer"
                          onMouseEnter={() => setHoveredRoadmapNode(step.node)}
                          onMouseLeave={() => setHoveredRoadmapNode(null)}
                          onClick={() => setSelectedRoadmapNode(selectedRoadmapNode === step.node ? null : step.node)}
                        >
                          <span className={`absolute -left-[21.5px] w-2.5 h-2.5 rounded-full border-2 ${
                            step.comp === 100 
                              ? 'bg-[#5B3DF5] border-[#5B3DF5]' 
                              : step.comp > 0 
                                ? 'bg-white border-[#5B3DF5] animate-pulse' 
                                : 'bg-white border-slate-200'
                          }`} />
                          <div className="flex justify-between items-center">
                            <span className={`text-[10px] font-bold ${step.comp > 0 ? 'text-[#5B3DF5]' : 'text-slate-600'}`}>
                              {step.node}
                            </span>
                            <span className="text-[8px] text-slate-400 font-extrabold">{step.comp}% Done</span>
                          </div>
                          
                          {/* Roadmap hover details */}
                          {hoveredRoadmapNode === step.node && (
                            <div className="text-[7.5px] text-[#5B3DF5] font-bold mt-0.5">
                              Duration: {step.hours} · Level: {step.diff} · Projects: {step.proj}
                            </div>
                          )}

                          {/* Roadmap click details */}
                          {selectedRoadmapNode === step.node && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg mt-1 text-[8.5px] text-slate-500 leading-normal"
                            >
                              Includes hands-on coding assignments, GPU notebook submissions, and real-time mentor audits to lock in verification credentials.
                            </motion.div>
                          )}

                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeDashboardTab === 'AI Copilot' && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 min-h-[180px] flex flex-col justify-between">
                      <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                        {chatMessages.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-xl px-3 py-1.5 text-[9px] max-w-[80%] leading-relaxed ${
                              msg.sender === 'user' 
                                ? 'bg-[#5B3DF5] text-white font-semibold' 
                                : 'bg-white border border-slate-100 text-slate-700 font-medium'
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                      
                      <div className="flex gap-2 pt-2 border-t border-slate-100">
                        <input 
                          type="text" 
                          placeholder="Ask Copilot (e.g. roadmap, resume)..." 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                          className="flex-grow bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-[9px] focus:outline-none focus:border-[#5B3DF5]"
                        />
                        <button 
                          onClick={handleSendChat}
                          className="p-1.5 bg-[#5B3DF5] text-white rounded-xl hover:bg-[#7C6CFD] transition-colors cursor-pointer"
                        >
                          <Send size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeDashboardTab === 'Skills' && (
                  <div className="space-y-3">
                    <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-sans">Verified Skill Matrix</h5>
                    <div className="space-y-2">
                      {[
                        { name: 'Python Systems & Logic', score: 92, badge: 'Advanced' },
                        { name: 'Machine Learning Engineering', score: 85, badge: 'Intermediate' },
                        { name: 'System Design Patterns', score: 62, badge: 'Intermediate' },
                        { name: 'Generative AI APIs', score: 78, badge: 'Advanced' }
                      ].map((skill, skIdx) => (
                        <div key={skIdx} className="space-y-1 bg-slate-50 border border-slate-100 p-2 rounded-xl">
                          <div className="flex justify-between text-[8.5px] font-bold text-slate-600">
                            <span>{skill.name}</span>
                            <span className="text-[#5B3DF5]">{skill.score}% ({skill.badge})</span>
                          </div>
                          <div className="h-1.5 rounded bg-white overflow-hidden border border-slate-100">
                            <div className="h-full bg-[#5B3DF5] rounded" style={{ width: `${skill.score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Tabs */}
                {['Projects', 'Interviews', 'Jobs', 'Mentors', 'Certificates', 'Settings'].includes(activeDashboardTab) && (
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-2">
                    <Award size={20} className="text-[#5B3DF5] mx-auto" />
                    <p className="text-[10px] font-bold text-slate-700">{activeDashboardTab} Workspace</p>
                    <p className="text-[8px] text-slate-400 leading-normal">A fully integrated environment loaded with verified assets ready to be matched with recruiters.</p>
                  </div>
                )}

              </div>

              {/* Console Footer */}
              <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[8px] font-bold text-slate-400 mt-6">
                <span>Verified Student Console</span>
                <span>Active</span>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ---------------------------------------------------- */}
      {/* PARTNER LOGOS SECTION: MONOCHROME TRUST STRIP */}
      {/* ---------------------------------------------------- */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Learners Hired By Global Leaders</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {['Google', 'Microsoft', 'Amazon', 'Adobe', 'TCS', 'Infosys', 'Deloitte', 'Flipkart'].map((brand) => (
              <div 
                key={brand}
                className="relative cursor-pointer group"
                onMouseEnter={() => setHoveredPartner(brand)}
                onMouseLeave={() => setHoveredPartner(null)}
              >
                <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-200 transition-all duration-300 flex items-center justify-center min-h-[52px]">
                  {brand === 'Google' && (
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span className="font-bold text-slate-800 text-sm tracking-tight font-sans">Google</span>
                    </div>
                  )}
                  {brand === 'Microsoft' && (
                    <div className="flex items-center gap-2">
                      <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5 flex-shrink-0">
                        <div className="bg-[#F25022] w-1.5 h-1.5" />
                        <div className="bg-[#7FBA00] w-1.5 h-1.5" />
                        <div className="bg-[#00A4EF] w-1.5 h-1.5" />
                        <div className="bg-[#FFB900] w-1.5 h-1.5" />
                      </div>
                      <span className="font-semibold text-slate-700 text-sm tracking-tight font-sans">Microsoft</span>
                    </div>
                  )}
                  {brand === 'Amazon' && (
                    <div className="flex flex-col items-center justify-center relative py-1">
                      <span className="font-black text-slate-850 text-sm tracking-tight leading-none font-sans">amazon</span>
                      <svg className="w-12 h-2.5 text-[#FF9900]" viewBox="0 0 50 12" fill="none">
                        <path d="M2 3C15 9 35 9 48 3C44 7 35 9 25 9C15 9 6 7 2 3Z" fill="currentColor" />
                        <path d="M48 3L44.5 1.5M48 3L47.5 7" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                  {brand === 'Adobe' && (
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-[#FF0000] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.3 2H22v19.8zM9.7 2H2v19.8zM12 9.5l4.7 12.3h-3.5l-1.2-3.4H9.9l-1.2 3.4H5.2z" />
                      </svg>
                      <span className="font-extrabold text-slate-800 text-sm tracking-tight font-sans">Adobe</span>
                    </div>
                  )}
                  {brand === 'TCS' && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-4.5 h-4.5 rounded-full bg-gradient-to-br from-[#1C3F94] to-[#00A4EF] flex items-center justify-center text-[8.5px] font-black text-white shadow-xs">
                        T
                      </div>
                      <span className="font-black text-[#1C3F94] text-sm tracking-tight font-sans">tcs</span>
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none self-end pb-0.5 font-sans">Tata</span>
                    </div>
                  )}
                  {brand === 'Infosys' && (
                    <div className="flex items-center">
                      <span className="font-black text-[#007CC3] text-base tracking-tight font-sans italic">Infosys</span>
                    </div>
                  )}
                  {brand === 'Deloitte' && (
                    <div className="flex items-center">
                      <span className="font-black text-slate-800 text-sm tracking-tight font-sans">Deloitte</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#86BC25] ml-0.5 self-end mb-1" />
                    </div>
                  )}
                  {brand === 'Flipkart' && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-lg bg-[#2874F0] flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                        <svg className="w-3 h-3 text-[#FFE500]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.21 9l-4.38-6.56c-.19-.28-.51-.44-.83-.44s-.64.16-.83.43L6.79 9H2c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h20c.55 0 1-.45 1-1V10c0-.55-.45-1-1-1h-4.79zM9 9l3-4.5L15 9H9z" />
                        </svg>
                      </div>
                      <span className="font-black text-[#2874F0] text-sm tracking-tight italic font-sans">
                        Flipkart
                      </span>
                    </div>
                  )}
                </div>

                {/* Tooltip on hover */}
                <AnimatePresence>
                  {hoveredPartner === brand && partnerDetails[brand] && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="absolute bottom-[55px] left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-2xl p-4 w-[240px] shadow-xl border border-slate-800 z-50 text-left space-y-2 pointer-events-none"
                    >
                      <h5 className="font-extrabold text-xs text-white border-b border-slate-800 pb-1 font-display">{brand} Insights</h5>
                      
                      <div className="grid grid-cols-2 gap-2 text-[8px] font-bold text-slate-400">
                        {brand === 'Amazon' ? (
                          <div className="col-span-2 font-sans">
                            <p>Top Hired Program</p>
                            <p className="text-indigo-300 mt-0.5">{partnerDetails[brand].topProgram}</p>
                          </div>
                        ) : (
                          <>
                            <div>
                              <p>Open Positions</p>
                              <p className="text-white mt-0.5">{partnerDetails[brand].roles} Active</p>
                            </div>
                            <div>
                              <p>Avg Salary</p>
                              <p className="text-emerald-400 mt-0.5">{partnerDetails[brand].salary}</p>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-[7.5px] text-slate-400 uppercase font-black font-sans">Top matching skills</p>
                        <div className="flex flex-wrap gap-1">
                          {partnerDetails[brand].skills.map((skill, skIdx) => (
                            <span key={skIdx} className="px-1.5 py-0.5 bg-slate-800 text-slate-350 rounded text-[7px] font-bold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* BENEFITS GRID SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-28 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#5B3DF5] font-sans">Core Benefits</p>
          <h2 className="text-3xl md:text-5xl font-[700] text-slate-900 leading-tight font-display">
            Why CareerVeda AI OS?
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            A comprehensive, modular environment engineered to transform professional capabilities. Hover cards to reveal proof metrics.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left pt-12">
            {benefitMetrics.map((benefit, i) => (
              <div 
                key={i}
                className="bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                onMouseEnter={() => setHoveredBenefitIdx(i)}
                onMouseLeave={() => setHoveredBenefitIdx(null)}
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#5B3DF5]/5 border border-[#5B3DF5]/10 flex items-center justify-center mb-3 text-[#5B3DF5]">
                    <CheckCircle2 size={15} className="stroke-[1.5]" />
                  </div>
                  <h3 className="text-xs font-[700] text-slate-800 leading-tight tracking-tight min-h-[32px] font-display">{benefit.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{benefit.desc}</p>
                  
                  {/* Expanded story block */}
                  <AnimatePresence>
                    {hoveredBenefitIdx === i && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 pt-3 border-t border-slate-50 overflow-hidden text-left"
                      >
                        <p className="text-[11px] font-[800] text-[#5B3DF5] font-sans">{benefit.stat}</p>
                        <p className="text-[9px] text-slate-400 font-bold font-sans">{benefit.proof}</p>
                        <p className="text-[9px] text-slate-405 italic font-semibold bg-[#5B3DF5]/5 p-2 rounded font-sans">{benefit.story}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* TRUST SECTION: Live Student Projects Showcase & filter */}
      {/* ---------------------------------------------------- */}
      <section className="py-28 px-6 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#5B3DF5] font-sans">Student Showcase</p>
          <h2 className="text-3xl md:text-5xl font-[700] text-slate-900 tracking-tight leading-none font-display">
            Verified Portfolios & Projects
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Review actual capstone projects submitted by alumni. Click filter tabs below to toggle.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap justify-center gap-3 font-sans">
          {['All', 'AI', 'Web Development', 'Data Science', 'Product Management'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setPlacedFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                placedFilter === tab 
                  ? 'bg-[#5B3DF5] text-white shadow-md' 
                  : 'bg-white border border-slate-200 text-slate-650 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {studentProjects
            .filter((proj) => placedFilter === 'All' || proj.category === placedFilter)
            .map((proj, pIdx) => (
              <div 
                key={pIdx}
                className="bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-lg hover:border-[#5B3DF5]/30 transition-all duration-300 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[9px] font-bold text-[#5B3DF5] font-sans">
                    {proj.category}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 font-sans">By {proj.creator}</span>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-800 text-sm font-display">{proj.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-sans">Full working deployment on cloud container instances.</p>
                </div>

                <div className="flex flex-wrap gap-1 font-sans">
                  {proj.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-1.5 py-0.5 bg-slate-55 border border-slate-100 text-slate-500 rounded text-[8px] font-bold">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-50 text-[10px] font-semibold text-slate-400 font-sans">
                  <span>🚀 Active link verified</span>
                  <span>{proj.views} views</span>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* TRUST SECTION: MOCK INTERACTIVE AI ANALYSIS DEMO      */}
      {/* ---------------------------------------------------- */}
      <section className="py-28 px-6 bg-slate-50/50 border-t border-slate-100" id="demo-section">
        <div className="max-w-4xl mx-auto space-y-10 text-center">
          
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B3DF5] font-sans">Try AI Sandbox Before Signup</p>
            <h2 className="text-3xl md:text-5xl font-[700] text-slate-900 tracking-tight leading-none font-display">
              Free AI Career Assessment
            </h2>
            <p className="text-slate-505 text-sm max-w-xl mx-auto font-sans">
              Input your target job title or upload details to simulate an instant assessment report. Experience the OS before creation.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left">
            
            {/* Left: input form */}
            <div className="md:col-span-5 space-y-4 w-full text-left">
              <h3 className="font-bold text-xs text-slate-805 uppercase tracking-wider font-display">Analysis Console</h3>
              
              <form onSubmit={handleMockAnalyze} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Target Job / Role</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. AI Engineer, Product Manager"
                    value={analyzerInput}
                    onChange={(e) => setAnalyzerInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5B3DF5] text-xs bg-slate-50 focus:bg-white transition-all focus:ring-2 focus:ring-indigo-105"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Upload Resume (Mock)</label>
                  <div className="border border-dashed border-slate-200 hover:border-indigo-300 rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center bg-slate-50 hover:bg-white font-sans">
                    <Upload size={18} className="text-slate-400 mb-1 animate-bounce" />
                    <span className="text-[9px] text-slate-400 font-bold">Select PDF, DOCX file</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={analyzingFile}
                  className="w-full flex items-center justify-center gap-1.5 py-3 bg-[#5B3DF5] hover:bg-[#7C6CFD] text-white rounded-xl text-xs font-bold shadow-md shadow-[#5B3DF5]/10 hover:shadow-[#5B3DF5]/25 transition-all disabled:opacity-50 cursor-pointer font-sans"
                >
                  {analyzingFile ? (
                    <>
                      <Play size={12} className="animate-spin" />
                      Analyzing profiles...
                    </>
                  ) : (
                    <>
                      Assess My Candidate DNA <ArrowRight size={12} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Mock analysis report result */}
            <div className="md:col-span-7 bg-slate-50/50 border border-slate-100 rounded-2xl p-6 min-h-[280px] flex flex-col justify-between w-full text-left font-sans">
              
              {analyzerReport ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4 text-xs text-left"
                >
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm font-display">Parsed DNA report</h4>
                      <p className="text-[8px] text-slate-400 uppercase tracking-widest font-black mt-0.5">Target: {analyzerInput}</p>
                    </div>
                    <span className="text-base font-black text-[#5B3DF5] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                      {analyzerReport.score}/100 ATS Score
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Skill Gaps Found</p>
                      <ul className="space-y-1 text-[9px] text-slate-500 font-semibold">
                        {analyzerReport.gaps.map((gap: string, gIdx: number) => (
                          <li key={gIdx} className="flex items-center gap-1 text-slate-600 font-sans">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1 text-left">
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Predicted Salary Range</p>
                      <p className="font-black text-emerald-600 text-sm">{analyzerReport.salary}</p>
                      <span className="text-[8px] text-slate-400 font-bold block mt-0.5">Matching target metrics</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Custom syllabus milestones</p>
                    <div className="relative pl-4 space-y-1 font-semibold text-[9px] text-slate-600">
                      <div className="absolute left-1.5 top-1 bottom-1 w-px bg-indigo-100" />
                      {analyzerReport.roadmap.map((step: string, rIdx: number) => (
                        <div key={rIdx} className="relative flex items-center gap-2">
                          <span className="absolute -left-[12px] w-1.5 h-1.5 rounded-full bg-[#5B3DF5]" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/register')}
                    className="w-full mt-2 py-2.5 bg-[#5B3DF5] hover:bg-[#7C6CFD] text-white rounded-xl text-[10px] font-bold shadow-md shadow-[#5B3DF5]/10 text-center cursor-pointer font-sans"
                  >
                    Enroll & Configure Personalized OS Dashboard
                  </button>

                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-grow text-center text-slate-400 space-y-3 p-6 border border-dashed border-slate-200 rounded-xl bg-white">
                  <Brain size={24} className="text-indigo-400 animate-pulse animate-sans" />
                  <p className="text-[9.5px] font-bold leading-normal font-sans">Enter your target job details and submit to trigger a simulated AI assessment report instantly.</p>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FAQ SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#5B3DF5] font-sans">Got Questions?</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none font-display">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            { q: 'How does CareerVeda work?', a: 'CareerVeda is an AI-powered Career Operating System. We run analysis on your current skills, build a customized module roadmap to cover gaps, host mock interviews with real-time feedback, and feed you directly to recruiters at our 900+ partners.' },
            { q: 'Is placement support included?', a: 'Yes. Upon passing your technical and portfolio benchmarks, interviews are coordinated directly with verified partners hiring in our network.' },
            { q: 'Are programs beginner friendly?', a: 'Yes, our AI Copilot sets up prerequisite modules like Python syntax and statistics so you can build foundations before taking on complex deep learning modules.' },
            { q: 'What is AI Career Copilot?', a: 'A 24/7 personalized advisor capable of reviewing repository code, giving interview feedback, and checking keyword alignment on resumes.' },
            { q: 'Do I receive certifications?', a: 'Yes. Verifiable PG certifications are generated immediately upon completing all capstone and modular syllabus milestones.' }
          ].map((faq, fIdx) => (
            <div 
              key={fIdx} 
              className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs text-left"
            >
              <h4 className="font-bold text-xs text-slate-805 font-display">{faq.q}</h4>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed font-sans">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* CTA SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-28 px-6 text-center max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-slate-950 to-indigo-950 text-white rounded-3xl p-12 relative overflow-hidden space-y-6 shadow-2xl">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#5B3DF5]/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="space-y-3 relative z-10 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight font-display">Start Your Career Transformation Today</h2>
            <p className="text-indigo-200 text-xs font-sans">Configure your AI Career Operating System and access 900+ recruiting pipelines.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-4 font-sans">
            <button 
              onClick={() => navigate('/register')} 
              className="px-6 py-3.5 bg-[#5B3DF5] hover:bg-[#7C6CFD] text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              Start Free Analysis
            </button>
            <button 
              onClick={() => alert('Consultation Calendar Triggered!')} 
              className="px-6 py-3.5 border border-white/20 hover:bg-white/5 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Book Career Consultation
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
