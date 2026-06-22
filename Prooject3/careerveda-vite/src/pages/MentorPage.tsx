import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getCurrentUser } from '@/lib/auth';
import {
  Users, Calendar, ClipboardList, TrendingUp, BookOpen, FolderKanban,
  Star, Award, ExternalLink, GitBranch, FileText, MessageSquare,
  User, BarChart3, CheckCircle, Clock, Play, ChevronRight,
  Percent, Timer, Target, Zap, AlertTriangle, Phone, Video,
  GraduationCap, Briefcase, AlertCircle, Bell, HelpCircle,
  ArrowUp, ArrowDown, Eye, Search, Mail, Download
} from 'lucide-react';
import {
  fetchKPIs, fetchAtRiskStudents, fetchStudentPipeline,
  fetchPlacementReadiness, fetchReviewQueue, fetchMentorAnalytics,
  fetchSessions, fetchDeadlines, fetchMessages, fetchStudents,
} from '@/services/mentorService';
import type { Student, AtRiskStudent, Session, Deadline } from '@/services/mentorService';

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) {
  const colors = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${colors[variant]}`}>
      {children}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, color, subtitle }: { label: string; value: string | number; icon: any; color: string; subtitle?: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs font-bold text-slate-400 mt-1">{label}</p>
      {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function MentorHome() {
  const user = getCurrentUser();
  const name = user?.name || 'Mentor';
  const navigate = useNavigate();

  const [kpis, setKpis] = useState<any>(null);
  const [atRisk, setAtRisk] = useState<AtRiskStudent[]>([]);
  const [pipeline, setPipeline] = useState<any>(null);
  const [placement, setPlacement] = useState<any>(null);
  const [reviewQueue, setReviewQueue] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [k, ar, pl, pr, rq, ma, ss, dl, ms] = await Promise.all([
        fetchKPIs(), fetchAtRiskStudents(), fetchStudentPipeline(),
        fetchPlacementReadiness(), fetchReviewQueue(), fetchMentorAnalytics(),
        fetchSessions(), fetchDeadlines(), fetchMessages(),
      ]);
      setKpis(k); setAtRisk(ar); setPipeline(pl); setPlacement(pr);
      setReviewQueue(rq); setAnalytics(ma); setSessions(ss);
      setDeadlines(dl); setMessages(ms);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Welcome back, {name}</h1>
        <p className="text-sm text-slate-500 mt-1">Here's your student success overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Students Assigned" value={kpis.studentsAssigned} icon={Users} color="#6D28D9" />
        <StatCard label="At-Risk Students" value={kpis.atRiskStudents} icon={AlertTriangle} color="#EF4444" subtitle="Need immediate attention" />
        <StatCard label="Pending Reviews" value={kpis.pendingReviews} icon={ClipboardList} color="#F59E0B" />
        <StatCard label="Placement Ready" value={kpis.placementReadyStudents} icon={Award} color="#10B981" subtitle="Ready for hiring" />
      </div>

      {/* At-Risk Students + Communication Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" /> At-Risk Students
            </h2>
            <span className="text-xs font-bold text-slate-400">{atRisk.length} flagged</span>
          </div>
          <div className="space-y-3">
            {atRisk.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-red-50/50 border border-red-100 rounded-xl cursor-pointer hover:bg-red-50 transition-colors" onClick={() => navigate(`/mentor/student/${s.id}`)}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${
                    s.severity === 'high' ? 'bg-red-500' : s.severity === 'medium' ? 'bg-amber-500' : 'bg-amber-400'
                  }`}>
                    {s.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">{s.name}</p>
                    <p className="text-[10px] text-slate-400">{s.reason}: {s.value}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-300" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare size={16} className="text-indigo-500" /> Communication Center
            </h2>
            <div className="space-y-3">
              {messages?.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-2">
                    {m.type === 'urgent' ? <AlertCircle size={14} className="text-red-500" /> :
                     m.type === 'question' ? <HelpCircle size={14} className="text-amber-500" /> :
                     <Bell size={14} className="text-indigo-500" />}
                    <span className="text-xs font-bold text-slate-600 capitalize">
                      {m.type === 'general' ? 'Unread Messages' :
                       m.type === 'question' ? 'Student Questions' : 'Urgent Requests'}
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-800">{m.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock size={16} className="text-rose-500" /> Upcoming Deadlines
            </h2>
            <div className="space-y-3">
              {deadlines?.map((d) => {
                const urgency = d.priority === 'high' ? 'bg-red-50 border-red-100' : d.priority === 'medium' ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100';
                return (
                  <div key={d.id} className={`flex items-center justify-between p-3 border rounded-xl ${urgency}`}>
                    <div>
                      <p className="text-xs font-bold text-slate-700">{d.title}</p>
                      <p className="text-[10px] font-bold text-slate-400">{d.due}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      d.priority === 'high' ? 'bg-red-500' : d.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-300'
                    }`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Student Progress Pipeline + Placement Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-500" /> Student Progress Pipeline
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Onboarding', value: pipeline?.onboarding || 0, color: '#94A3B8' },
              { label: 'Learning', value: pipeline?.learning || 0, color: '#6366F1' },
              { label: 'Assignments', value: pipeline?.assignments || 0, color: '#F59E0B' },
              { label: 'Projects', value: pipeline?.projects || 0, color: '#10B981' },
              { label: 'Placement Ready', value: pipeline?.placementReady || 0, color: '#6D28D9' },
              { label: 'Placed', value: pipeline?.placed || 0, color: '#059669' },
            ].map((stage) => (
              <div key={stage.label} className="flex items-center gap-3">
                <span className="w-28 text-[10px] font-bold text-slate-500">{stage.label}</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(stage.value / 48) * 100}%`, backgroundColor: stage.color }} />
                </div>
                <span className="text-xs font-extrabold text-slate-700 w-6 text-right">{stage.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Award size={16} className="text-emerald-500" /> Placement Readiness
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-xl font-extrabold text-emerald-600">{placement?.ready || 0}</p>
                <p className="text-[10px] font-bold text-emerald-600">Ready</p>
              </div>
              <div className="text-center p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xl font-extrabold text-amber-600">{placement?.almostReady || 0}</p>
                <p className="text-[10px] font-bold text-amber-600">Almost Ready</p>
              </div>
              <div className="text-center p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-xl font-extrabold text-red-600">{placement?.needsWork || 0}</p>
                <p className="text-[10px] font-bold text-red-600">Needs Work</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList size={16} className="text-amber-500" /> Review Queue
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Assignment Reviews', value: reviewQueue?.assignmentReviews || 0 },
                { label: 'Project Reviews', value: reviewQueue?.projectReviews || 0 },
                { label: 'Resume Reviews', value: reviewQueue?.resumeReviews || 0 },
                { label: 'Interview Feedback', value: reviewQueue?.interviewFeedback || 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
                  <span className="text-sm font-extrabold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mentor Analytics */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 size={16} className="text-indigo-500" /> Mentor Analytics
          </h2>
          <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700" onClick={() => navigate('/mentor/analytics')}>
            View All <ChevronRight size={12} className="inline" />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Students Improved', value: `+${analytics?.studentsImproved || 0}%`, icon: ArrowUp, color: '#10B981' },
            { label: 'Average Completion', value: `${analytics?.averageCompletion || 0}%`, icon: Percent, color: '#6D28D9' },
            { label: 'Placement Success', value: `${analytics?.placementSuccess || 0}%`, icon: Award, color: '#F59E0B' },
            { label: 'Feedback Rating', value: `${analytics?.feedbackRating || 0}/5`, icon: Star, color: '#6366F1' },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${m.color}15`, color: m.color }}>
                  <Icon size={15} />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-slate-900">{m.value}</p>
                  <p className="text-[10px] font-bold text-slate-400">{m.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Sessions Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={16} className="text-indigo-500" /> Today's Sessions
            </h2>
            <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700" onClick={() => navigate('/mentor/sessions')}>
              View All <ChevronRight size={12} className="inline" />
            </button>
          </div>
          <div className="space-y-3">
            {sessions.filter(s => s.status === 'upcoming').slice(0, 3).map((s) => (
              <div key={s.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-[10px]">
                      {s.studentName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="text-xs font-bold text-slate-700">{s.studentName}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{s.time}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <p className="text-slate-400">Program</p>
                    <p className="font-bold text-slate-600">{s.program}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Progress</p>
                    <p className="font-bold text-slate-600">{s.progress}%</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Readiness</p>
                    <p className="font-bold text-slate-600">{s.placementReadiness}/100</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-500">Topic: {s.topic}</p>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-indigo-700 transition-colors">Join Session</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Reviews Preview */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList size={16} className="text-amber-500" /> Pending Reviews
            </h2>
            <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700" onClick={() => navigate('/mentor/assignments')}>
              View All <ChevronRight size={12} className="inline" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { student: 'Rohan Sharma', type: 'Assignment', title: 'ML Model Deployment', submitted: '2 days ago' },
              { student: 'Priya Patel', type: 'Project', title: 'SQL Optimization', submitted: '1 day ago' },
              { student: 'Aditya Sen', type: 'Resume', title: 'Neural Network Design', submitted: '5 hours ago' },
            ].map((r, i) => (
              <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-[10px]">
                      {r.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="text-xs font-bold text-slate-700">{r.student}</p>
                    <Badge variant={r.type === 'Resume' ? 'info' : r.type === 'Project' ? 'success' : 'warning'}>{r.type}</Badge>
                  </div>
                  <span className="text-[10px] text-slate-400">{r.submitted}</span>
                </div>
                <p className="text-[10px] text-slate-500">{r.title}</p>
                <div className="flex gap-2">
                  <button className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-amber-600 transition-colors">Review</button>
                  <button className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-slate-200 transition-colors">View Submission</button>
                  <button className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-slate-200 transition-colors">View GitHub</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MentorStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents().then(setStudents);
  }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.program.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Students</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track your mentees</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 w-56 bg-slate-50/50"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Program</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assignments</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resume</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interview</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Readiness</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => navigate(`/mentor/student/${s.id}`)}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs">
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">{s.program}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.progress}%`, backgroundColor: s.progress >= 70 ? '#10B981' : s.progress >= 40 ? '#F59E0B' : '#EF4444' }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold ${s.attendance >= 80 ? 'text-emerald-600' : s.attendance >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{s.attendance}%</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">{s.assignmentsCompleted}/{s.assignmentsTotal}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold ${s.resumeScore >= 80 ? 'text-emerald-600' : s.resumeScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{s.resumeScore}%</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold ${s.interviewScore >= 70 ? 'text-emerald-600' : s.interviewScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{s.interviewScore}/100</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      s.placementReadiness >= 70 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      s.placementReadiness >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>{s.placementReadiness}%</span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-indigo-700 transition-colors" onClick={(e) => { e.stopPropagation(); navigate(`/mentor/student/${s.id}`); }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-400">No students found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MentorLearning() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Learning Progress</h1>
        <p className="text-sm text-slate-500 mt-1">Track student learning progress across programs</p>
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
        <p className="text-sm text-slate-400">Learning progress tracking will be available here.</p>
      </div>
    </div>
  );
}

function MentorAssignments() {
  const navigate = useNavigate();
  const assignments = [
    { id: '1', student: 'Rohan Sharma', studentId: '1', title: 'ML Model Deployment Part 2', submitted: '2026-06-18', score: 'A', type: 'Assignment', gradeLocked: true },
    { id: '2', student: 'Priya Patel', studentId: '2', title: 'Database Schema Design', submitted: '2026-06-19', score: 'B+', type: 'Assignment', gradeLocked: true },
    { id: '3', student: 'Aditya Sen', studentId: '3', title: 'Neural Network Optimization', submitted: '2026-06-20', score: null, type: 'Assignment', gradeLocked: false },
    { id: '4', student: 'Neha Gupta', studentId: '4', title: 'Product Roadmap Presentation', submitted: '2026-06-17', score: 'A-', type: 'Assignment', gradeLocked: true },
    { id: '5', student: 'Vikram Singh', studentId: '7', title: 'Python Fundamentals', submitted: '2026-06-21', score: null, type: 'Assignment', gradeLocked: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Assignment Reviews</h1>
        <p className="text-sm text-slate-500 mt-1">Review and grade student submissions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((a) => (
          <div key={a.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer" onClick={() => navigate(`/mentor/student/${a.studentId}`)}>
                {a.student.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-700">{a.student}</p>
                <p className="text-[10px] text-slate-400">{a.submitted}</p>
              </div>
              <Badge variant={a.type === 'Assignment' ? 'warning' : 'success'}>{a.type}</Badge>
            </div>
            <p className="text-sm font-bold text-slate-800">{a.title}</p>
            <div className="flex items-center justify-between">
              {a.score ? (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">{a.score}</span>
              ) : (
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-200">Pending</span>
              )}
              <div className="flex gap-1.5">
                <button className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-amber-600 transition-colors">Review</button>
                <button className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-slate-200 transition-colors">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MentorProjects() {
  const navigate = useNavigate();
  const projects = [
    { id: '1', student: 'Rohan Sharma', studentId: '1', title: 'End-to-End ML Pipeline', github: '#', demo: '#', docs: '#', status: 'Pending' },
    { id: '2', student: 'Priya Patel', studentId: '2', title: 'Real-time Data Dashboard', github: '#', demo: '#', docs: '#', status: 'Under Review' },
    { id: '3', student: 'Aditya Sen', studentId: '3', title: 'Computer Vision API', github: '#', demo: '#', docs: '#', status: 'Approved' },
    { id: '4', student: 'Neha Gupta', studentId: '4', title: 'Product Analytics Suite', github: '#', demo: '#', docs: '#', status: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Project Reviews</h1>
        <p className="text-sm text-slate-500 mt-1">Evaluate student projects and provide feedback</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer" onClick={() => navigate(`/mentor/student/${p.studentId}`)}>
                {p.student.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-700">{p.student}</p>
                <p className="text-sm font-bold text-slate-800">{p.title}</p>
              </div>
              <Badge variant={p.status === 'Approved' ? 'success' : p.status === 'Under Review' ? 'warning' : 'default'}>{p.status}</Badge>
            </div>

            <div className="flex items-center gap-2">
              <a href={p.github} className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                <GitBranch size={12} /> GitHub
              </a>
              <a href={p.demo} className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                <ExternalLink size={12} /> Demo
              </a>
              <a href={p.docs} className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                <FileText size={12} /> Docs
              </a>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Comment</label>
              <textarea rows={2} placeholder="Write your feedback..." className="w-full px-3 py-2 border border-slate-100 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20 resize-none" />
            </div>

            <div className="flex items-center justify-between">
              <select className="px-3 py-1.5 border border-slate-100 rounded-lg text-xs font-bold text-slate-600 bg-white focus:outline-none focus:border-indigo-600 cursor-pointer">
                <option value="">Select grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
              <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-indigo-700 transition-colors">Submit Review</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MentorResumes() {
  const resumes = [
    { id: '1', student: 'Sneha Kapoor', submitted: '2 days ago', score: 82, status: 'Reviewed' },
    { id: '2', student: 'Arjun Mehta', submitted: '5 days ago', score: 68, status: 'Pending' },
    { id: '3', student: 'Neha Gupta', submitted: '1 week ago', score: 85, status: 'Reviewed' },
    { id: '4', student: 'Vikram Singh', submitted: '3 days ago', score: null, status: 'Pending' },
    { id: '5', student: 'Rohan Sharma', submitted: 'Just now', score: null, status: 'New' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Resume Reviews</h1>
        <p className="text-sm text-slate-500 mt-1">Review and provide feedback on student resumes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resumes.map((r) => (
          <div key={r.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                {r.student.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-700">{r.student}</p>
                <p className="text-[10px] text-slate-400">{r.submitted}</p>
              </div>
              <Badge variant={r.status === 'Reviewed' ? 'success' : r.status === 'New' ? 'danger' : 'warning'}>{r.status}</Badge>
            </div>
            {r.score && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Score:</span>
                <span className={`text-sm font-extrabold ${r.score >= 80 ? 'text-emerald-600' : r.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{r.score}%</span>
              </div>
            )}
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-indigo-700 transition-colors">Review Resume</button>
              <button className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-slate-200 transition-colors">
                <Download size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MentorInterviews() {
  const interviews = [
    { id: '1', student: 'Aditya Sen', date: 'Jun 25, 2026', type: 'Technical', score: 41, status: 'Pending' },
    { id: '2', student: 'Sneha Kapoor', date: 'Jun 26, 2026', type: 'HR', score: null, status: 'Scheduled' },
    { id: '3', student: 'Priya Patel', date: 'Jun 20, 2026', type: 'Technical', score: 68, status: 'Completed' },
    { id: '4', student: 'Neha Gupta', date: 'Jun 22, 2026', type: 'Product Sense', score: 72, status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Mock Interviews</h1>
        <p className="text-sm text-slate-500 mt-1">Track student interview readiness and provide feedback</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((i) => (
                <tr key={i.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-xs font-bold text-slate-700">{i.student}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">{i.date}</td>
                  <td className="px-5 py-4">
                    <Badge variant={i.type === 'Technical' ? 'info' : i.type === 'HR' ? 'default' : 'warning'}>{i.type}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    {i.score ? (
                      <span className={`text-xs font-bold ${i.score >= 70 ? 'text-emerald-600' : i.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{i.score}/100</span>
                    ) : <span className="text-xs text-slate-400">--</span>}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={i.status === 'Completed' ? 'success' : i.status === 'Scheduled' ? 'info' : 'warning'}>{i.status}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    {i.status === 'Pending' ? (
                      <button className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-indigo-700 transition-colors">Give Feedback</button>
                    ) : i.status === 'Completed' ? (
                      <button className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-slate-200 transition-colors">View</button>
                    ) : (
                      <button className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-emerald-700 transition-colors">Conduct</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MentorSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetchSessions().then(setSessions);
  }, []);

  const upcoming = sessions.filter(s => s.status === 'upcoming');
  const completed = sessions.filter(s => s.status === 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Sessions</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your mentoring sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Play size={16} className="text-emerald-500" />
            <h2 className="text-base font-bold text-slate-800">Upcoming Sessions</h2>
            <span className="text-xs font-bold text-slate-400 ml-auto">{upcoming.length} sessions</span>
          </div>
          <div className="space-y-3">
            {upcoming.map((s) => (
              <div key={s.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs">
                      {s.studentName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">{s.studentName}</p>
                      <p className="text-[10px] text-slate-400">{s.topic}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{s.time}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-[10px] bg-white rounded-lg p-2 border border-slate-100">
                  <div>
                    <p className="text-slate-400">Program</p>
                    <p className="font-bold text-slate-700">{s.program}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Progress</p>
                    <p className="font-bold text-slate-700">{s.progress}%</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Readiness</p>
                    <p className="font-bold text-slate-700">{s.placementReadiness}/100</p>
                  </div>
                </div>
                <button className="w-full py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-emerald-700 transition-colors">Join Session</button>
              </div>
            ))}
            {upcoming.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No upcoming sessions</p>}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-slate-400" />
            <h2 className="text-base font-bold text-slate-800">Completed Sessions</h2>
            <span className="text-xs font-bold text-slate-400 ml-auto">{completed.length} sessions</span>
          </div>
          <div className="space-y-3">
            {completed.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-700">{s.studentName}</p>
                  <p className="text-[10px] text-slate-400">{s.topic} &middot; {s.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">{s.duration}</span>
                  <button className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-indigo-700 transition-colors">Notes</button>
                </div>
              </div>
            ))}
            {completed.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No completed sessions</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MentorMessages() {
  const [messagesData, setMessagesData] = useState<any[]>([]);

  useEffect(() => {
    fetchMessages().then(setMessagesData);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">Communicate with your students</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {messagesData.map((m) => (
          <div key={m.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-3 text-center">
            <div className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center ${
              m.type === 'urgent' ? 'bg-red-50' : m.type === 'question' ? 'bg-amber-50' : 'bg-indigo-50'
            }`}>
              {m.type === 'urgent' ? <AlertCircle size={22} className="text-red-500" /> :
               m.type === 'question' ? <HelpCircle size={22} className="text-amber-500" /> :
               <Bell size={22} className="text-indigo-500" />}
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{m.count}</p>
            <p className="text-xs font-bold text-slate-400 capitalize">
              {m.type === 'general' ? 'Unread Messages' : m.type === 'question' ? 'Student Questions' : 'Urgent Requests'}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search messages..."
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
          />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-indigo-700 transition-colors">New Message</button>
        </div>
        <div className="text-center py-12 text-sm text-slate-400">
          <Mail size={24} className="mx-auto mb-2 text-slate-300" />
          <p>Message history will appear here</p>
        </div>
      </div>
    </div>
  );
}

function MentorPlacements() {
  const [placement, setPlacement] = useState<any>(null);

  useEffect(() => {
    fetchPlacementReadiness().then(setPlacement);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Placement Tracking</h1>
        <p className="text-sm text-slate-500 mt-1">Track student placement readiness and progress</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 text-center">
          <p className="text-3xl font-extrabold text-emerald-600">{placement?.ready || 0}</p>
          <p className="text-xs font-bold text-slate-400 mt-1">Placement Ready</p>
          <p className="text-[10px] text-emerald-600 mt-1">Ready for hiring pipeline</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 text-center">
          <p className="text-3xl font-extrabold text-amber-600">{placement?.almostReady || 0}</p>
          <p className="text-xs font-bold text-slate-400 mt-1">Almost Ready</p>
          <p className="text-[10px] text-amber-600 mt-1">Needs 1-2 improvements</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 text-center">
          <p className="text-3xl font-extrabold text-red-600">{placement?.needsWork || 0}</p>
          <p className="text-xs font-bold text-slate-400 mt-1">Needs Work</p>
          <p className="text-[10px] text-red-600 mt-1">Requires significant support</p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-800 mb-4">Placement Pipeline</h2>
        <div className="space-y-3">
          {[
            { stage: 'Resume Shortlisted', count: 8, color: '#6366F1' },
            { stage: 'Interview Scheduled', count: 5, color: '#F59E0B' },
            { stage: 'Interview Completed', count: 3, color: '#10B981' },
            { stage: 'Offer Received', count: 1, color: '#6D28D9' },
            { stage: 'Placed', count: 0, color: '#059669' },
          ].map((s) => (
            <div key={s.stage} className="flex items-center gap-3">
              <span className="w-36 text-[10px] font-bold text-slate-500">{s.stage}</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(s.count / 48) * 100}%`, backgroundColor: s.color }} />
              </div>
              <span className="text-xs font-extrabold text-slate-700 w-6 text-right">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MentorAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchMentorAnalytics().then(setAnalytics);
  }, []);

  const metrics = [
    { label: 'Students Improved', value: analytics ? `+${analytics.studentsImproved}%` : '--', icon: ArrowUp, color: '#10B981', desc: 'vs last month' },
    { label: 'Average Completion', value: analytics ? `${analytics.averageCompletion}%` : '--', icon: Percent, color: '#6D28D9', desc: 'across all students' },
    { label: 'Placement Success', value: analytics ? `${analytics.placementSuccess}%` : '--', icon: Award, color: '#F59E0B', desc: 'placed / eligible' },
    { label: 'Feedback Rating', value: analytics ? `${analytics.feedbackRating}/5` : '--', icon: Star, color: '#6366F1', desc: 'from student surveys' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Track your mentoring impact</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400">{m.label}</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${m.color}15`, color: m.color }}>
                  <Icon size={15} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{m.value}</p>
              <p className="text-[10px] text-slate-400">{m.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-800">Monthly Activity</h2>
          <div className="space-y-3">
            {[
              { label: 'Sessions Conducted', value: 24, total: 30 },
              { label: 'Reviews Completed', value: 18, total: 25 },
              { label: 'Students Reached', value: 12, total: 15 },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 font-medium">{item.label}</span>
                  <span className="font-bold text-slate-800">{item.value}/{item.total}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(item.value / item.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-800">Student Performance Distribution</h2>
          <div className="space-y-3">
            {[
              { label: 'Excellent (80-100%)', value: 18, color: '#10B981' },
              { label: 'Good (60-79%)', value: 14, color: '#6366F1' },
              { label: 'Average (40-59%)', value: 10, color: '#F59E0B' },
              { label: 'Needs Improvement (&lt;40%)', value: 6, color: '#EF4444' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-slate-500 flex-1">{item.label}</span>
                <span className="text-xs font-extrabold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MentorProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your mentor profile</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-4">
          <User size={28} className="text-indigo-600" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">Profile settings coming soon</h3>
        <p className="text-xs text-slate-400 max-w-xs">You'll be able to update your bio, expertise areas, availability, and preferences here.</p>
      </div>
    </div>
  );
}

export default function MentorDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const renderPage = () => {
    switch (location.pathname) {
      case '/mentor':
        return <MentorHome />;
      case '/mentor/students':
        return <MentorStudents />;
      case '/mentor/learning':
        return <MentorLearning />;
      case '/mentor/assignments':
        return <MentorAssignments />;
      case '/mentor/projects':
        return <MentorProjects />;
      case '/mentor/resumes':
        return <MentorResumes />;
      case '/mentor/interviews':
        return <MentorInterviews />;
      case '/mentor/sessions':
        return <MentorSessions />;
      case '/mentor/messages':
        return <MentorMessages />;
      case '/mentor/placements':
        return <MentorPlacements />;
      case '/mentor/analytics':
        return <MentorAnalytics />;
      case '/mentor/profile':
        return <MentorProfile />;
      default:
        return <MentorHome />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">{renderPage()}</div>
    </DashboardLayout>
  );
}
