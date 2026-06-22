import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getCurrentUser } from '@/lib/auth';
import {
  Users, Calendar, ClipboardList, TrendingUp, BookOpen, FolderKanban,
  Star, Award, ExternalLink, Github, FileText, MessageSquare,
  User, BarChart3, CheckCircle, Clock, Play, ChevronRight,
  Percent, Timer, Target, Zap
} from 'lucide-react';

const SESSIONS_TODAY = [
  { student: 'Priya Patel', time: '4:00 PM', topic: 'Data Science Q&A' },
  { student: 'Aditya Sen', time: '5:30 PM', topic: 'MLOps Pipeline Review' },
  { student: 'Neha Gupta', time: '7:00 PM', topic: 'Product Strategy Workshop' },
];

const PENDING_REVIEWS = [
  { student: 'Rohan Sharma', assignment: 'ML Model Deployment', submitted: '2 days ago' },
  { student: 'Priya Patel', assignment: 'SQL Optimization', submitted: '1 day ago' },
  { student: 'Aditya Sen', assignment: 'Neural Network Design', submitted: '5 hours ago' },
];

const STUDENTS_TABLE = [
  { name: 'Rohan Sharma', program: 'AI Engineering', progress: 72, aiScore: 88, resumeScore: 76, readiness: 'High' },
  { name: 'Priya Patel', program: 'Data Science', progress: 58, aiScore: 82, resumeScore: 71, readiness: 'Medium' },
  { name: 'Aditya Sen', program: 'AI Engineering', progress: 91, aiScore: 94, resumeScore: 89, readiness: 'High' },
  { name: 'Neha Gupta', program: 'Product Management', progress: 45, aiScore: 79, resumeScore: 85, readiness: 'Medium' },
  { name: 'Arjun Mehta', program: 'Full Stack Dev', progress: 65, aiScore: 73, resumeScore: 68, readiness: 'Low' },
  { name: 'Sneha Kapoor', program: 'Data Science', progress: 83, aiScore: 90, resumeScore: 82, readiness: 'High' },
];

const ASSIGNMENTS = [
  { student: 'Rohan Sharma', title: 'ML Model Deployment Part 2', submitted: '2026-06-18', score: 'A' },
  { student: 'Priya Patel', title: 'Database Schema Design', submitted: '2026-06-19', score: 'B+' },
  { student: 'Aditya Sen', title: 'Neural Network Optimization', submitted: '2026-06-20', score: null },
  { student: 'Neha Gupta', title: 'Product Roadmap Presentation', submitted: '2026-06-17', score: 'A-' },
];

const PROJECTS = [
  { student: 'Rohan Sharma', title: 'End-to-End ML Pipeline', github: '#', demo: '#', docs: '#' },
  { student: 'Priya Patel', title: 'Real-time Data Dashboard', github: '#', demo: '#', docs: '#' },
  { student: 'Aditya Sen', title: 'Computer Vision API', github: '#', demo: '#', docs: '#' },
];

const UPCOMING_SESSIONS = [
  { student: 'Rohan Sharma', topic: 'Career Guidance', time: 'Tomorrow, 11:00 AM' },
  { student: 'Sneha Kapoor', topic: 'Resume Review', time: 'Tomorrow, 2:00 PM' },
  { student: 'Arjun Mehta', topic: 'System Design', time: 'Jun 24, 10:00 AM' },
];

const COMPLETED_SESSIONS = [
  { student: 'Priya Patel', topic: 'Data Science Q&A', date: 'Jun 20, 2026', duration: '45 min' },
  { student: 'Aditya Sen', topic: 'MLOps Review', date: 'Jun 19, 2026', duration: '50 min' },
  { student: 'Neha Gupta', topic: 'Product Strategy', date: 'Jun 18, 2026', duration: '40 min' },
];

function MentorHome() {
  const user = getCurrentUser();
  const name = user?.name || 'Mentor';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Welcome back, {name}</h1>
        <p className="text-sm text-slate-500 mt-1">Senior Product Mentor</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Students Assigned', value: '48', icon: Users },
          { label: 'Sessions Today', value: '6', icon: Calendar },
          { label: 'Pending Reviews', value: '12', icon: ClipboardList },
          { label: 'Avg Student Score', value: '84%', icon: TrendingUp },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#6D28D9]/10 text-[#6D28D9] flex items-center justify-center">
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-xs font-bold text-slate-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={16} className="text-[#6D28D9]" /> Today's Sessions
            </h2>
            <span className="text-xs font-bold text-slate-400">{SESSIONS_TODAY.length} sessions</span>
          </div>
          <div className="space-y-3">
            {SESSIONS_TODAY.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-700">{s.student}</p>
                  <p className="text-[10px] text-slate-400">{s.topic} &middot; {s.time}</p>
                </div>
                <button className="px-3 py-1.5 bg-[#6D28D9] text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-[#5B21B6] transition-colors">Join</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList size={16} className="text-[#F59E0B]" /> Pending Reviews
            </h2>
            <span className="text-xs font-bold text-slate-400">{PENDING_REVIEWS.length} pending</span>
          </div>
          <div className="space-y-3">
            {PENDING_REVIEWS.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-700">{r.student}</p>
                  <p className="text-[10px] text-slate-400">{r.assignment} &middot; {r.submitted}</p>
                </div>
                <button className="px-3 py-1.5 bg-[#F59E0B] text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-[#D97706] transition-colors">Review</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MentorStudents() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Students</h1>
        <p className="text-sm text-slate-500 mt-1">Manage and track your mentees</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Name</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Program</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Score</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resume Score</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Readiness</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {STUDENTS_TABLE.map((student, i) => (
                <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-xs">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">{student.program}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#6D28D9] rounded-full" style={{ width: `${student.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold ${student.aiScore >= 85 ? 'text-[#10B981]' : student.aiScore >= 75 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>{student.aiScore}%</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold ${student.resumeScore >= 80 ? 'text-[#10B981]' : student.resumeScore >= 70 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>{student.resumeScore}%</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      student.readiness === 'High' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                      student.readiness === 'Medium' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' :
                      'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
                    }`}>{student.readiness}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="px-3 py-1 bg-[#6D28D9] text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-[#5B21B6] transition-colors">View</button>
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

function MentorAssignments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Assignment Reviews</h1>
        <p className="text-sm text-slate-500 mt-1">Review and grade student submissions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ASSIGNMENTS.map((a, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-xs">
                {a.student.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">{a.student}</p>
                <p className="text-[10px] text-slate-400">{a.submitted}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{a.title}</p>
            </div>
            <div className="flex items-center justify-between">
              {a.score ? (
                <span className="px-2.5 py-1 bg-[#10B981]/10 text-[#10B981] rounded-lg text-xs font-bold border border-[#10B981]/20">{a.score}</span>
              ) : (
                <span className="px-2.5 py-1 bg-[#F59E0B]/10 text-[#F59E0B] rounded-lg text-xs font-bold border border-[#F59E0B]/20">Pending</span>
              )}
              <button className="px-3 py-1.5 bg-[#6D28D9] text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-[#5B21B6] transition-colors">Review</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MentorProjects() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Project Reviews</h1>
        <p className="text-sm text-slate-500 mt-1">Evaluate student projects and provide feedback</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {PROJECTS.map((p, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-xs">
                {p.student.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">{p.student}</p>
                <p className="text-sm font-bold text-slate-800">{p.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a href={p.github} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                <Github size={12} /> GitHub
              </a>
              <a href={p.demo} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                <ExternalLink size={12} /> Demo
              </a>
              <a href={p.docs} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                <FileText size={12} /> Docs
              </a>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Comment</label>
              <textarea
                rows={2}
                placeholder="Write your feedback..."
                className="w-full px-3 py-2 border border-slate-100 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9]/20 resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <select className="px-3 py-1.5 border border-slate-100 rounded-lg text-xs font-bold text-slate-600 bg-white focus:outline-none focus:border-[#6D28D9] cursor-pointer">
                <option value="">Select grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
              <button className="px-4 py-1.5 bg-[#6D28D9] text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-[#5B21B6] transition-colors">Submit Review</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MentorSessions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Sessions</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your mentoring sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Play size={16} className="text-[#10B981]" />
            <h2 className="text-base font-bold text-slate-800">Upcoming Sessions</h2>
          </div>
          <div className="space-y-3">
            {UPCOMING_SESSIONS.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-700">{s.student}</p>
                  <p className="text-[10px] text-slate-400">{s.topic} &middot; {s.time}</p>
                </div>
                <button className="px-3 py-1.5 bg-[#10B981] text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-[#059669] transition-colors">Join</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-slate-400" />
            <h2 className="text-base font-bold text-slate-800">Completed Sessions</h2>
          </div>
          <div className="space-y-3">
            {COMPLETED_SESSIONS.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-700">{s.student}</p>
                  <p className="text-[10px] text-slate-400">{s.topic} &middot; {s.date}</p>
                </div>
                <span className="text-[10px] text-slate-400">{s.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MentorAnalytics() {
  const metrics = [
    { label: 'Student Progress', value: 72, icon: TrendingUp, color: '#6D28D9' },
    { label: 'Completion Rate', value: 68, icon: Target, color: '#10B981' },
    { label: 'Average Score', value: 84, icon: Star, color: '#F59E0B' },
    { label: 'Placement Success', value: 91, icon: Award, color: '#6D28D9' },
    { label: 'Mentoring Hours', value: 128, icon: Clock, color: '#10B981', suffix: ' hrs' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Track your mentoring impact</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          const showValue = m.value > 100 ? m.value : m.value;
          const displayValue = m.suffix ? `${showValue}${m.suffix}` : `${showValue}%`;
          const barWidth = m.suffix ? Math.min(showValue / 2, 100) : showValue;

          return (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400">{m.label}</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${m.color}15`, color: m.color }}>
                  <Icon size={15} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{displayValue}</p>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${barWidth}%`, backgroundColor: m.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MentorMessages() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">Communicate with your students</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#6D28D9]/10 flex items-center justify-center mb-4">
          <MessageSquare size={28} className="text-[#6D28D9]" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">Messages coming soon</h3>
        <p className="text-xs text-slate-400 max-w-xs">In-app messaging is being built. You'll be able to chat with students directly here.</p>
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
        <div className="w-16 h-16 rounded-2xl bg-[#6D28D9]/10 flex items-center justify-center mb-4">
          <User size={28} className="text-[#6D28D9]" />
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
      case '/mentor/assignments':
        return <MentorAssignments />;
      case '/mentor/projects':
        return <MentorProjects />;
      case '/mentor/sessions':
        return <MentorSessions />;
      case '/mentor/analytics':
        return <MentorAnalytics />;
      case '/mentor/messages':
        return <MentorMessages />;
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
