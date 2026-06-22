import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  ArrowLeft, User, BookOpen, Calendar, ClipboardList, FolderKanban,
  FileText, Video, Award, TrendingUp, AlertTriangle, Star,
  Mail, Phone, MapPin, GraduationCap, Percent, Target,
  ChevronRight, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { fetchStudentById } from '@/services/mentorService';
import type { Student } from '@/services/mentorService';

function MetricCard({ label, value, icon: Icon, color, max }: { label: string; value: string | number; icon: any; color: string; max?: number }) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const pct = max ? (numValue / max) * 100 : numValue;

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
          <Icon size={14} />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-lg font-extrabold text-slate-900">{value}{max ? `/${max}` : ''}</p>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function MentorStudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchStudentById(id).then((s) => {
      setStudent(s);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-slate-800">Student not found</h2>
          <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-700" onClick={() => navigate('/mentor/students')}>Back to Students</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/mentor/students')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
            <ArrowLeft size={18} className="text-slate-500" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
            {student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{student.name}</h1>
            <p className="text-xs text-slate-500">{student.program}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${
              student.placementReadiness >= 70 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              student.placementReadiness >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-red-50 text-red-700 border-red-200'
            }`}>
              {student.placementReadiness >= 70 ? 'Placement Ready' :
               student.placementReadiness >= 40 ? 'Almost Ready' : 'Needs Work'}
            </span>
            <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-indigo-700 transition-colors">
              <Mail size={12} className="inline mr-1" /> Contact
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard label="Attendance" value={student.attendance} icon={Calendar} color="#6366F1" max={100} />
          <MetricCard label="Progress" value={student.progress} icon={TrendingUp} color="#10B981" max={100} />
          <MetricCard label="Assignments" value={`${student.assignmentsCompleted}/${student.assignmentsTotal}`} icon={ClipboardList} color="#F59E0B" max={student.assignmentsTotal} />
          <MetricCard label="Resume Score" value={student.resumeScore} icon={FileText} color="#8B5CF6" max={100} />
          <MetricCard label="Interview Score" value={student.interviewScore} icon={Video} color="#EC4899" max={100} />
          <MetricCard label="Placement Readiness" value={student.placementReadiness} icon={Award} color="#6D28D9" max={100} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Student Info + Notes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <User size={16} className="text-indigo-500" /> Student Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Email', value: student.email, icon: Mail },
                  { label: 'Program', value: student.program, icon: GraduationCap },
                  { label: 'Attendance', value: `${student.attendance}%`, icon: Calendar },
                  { label: 'Progress', value: `${student.progress}%`, icon: TrendingUp },
                  { label: 'AI Score', value: `${student.aiScore}%`, icon: Star },
                  { label: 'Resume Score', value: `${student.resumeScore}%`, icon: FileText },
                  { label: 'Interview Score', value: `${student.interviewScore}/100`, icon: Video },
                  { label: 'Readiness', value: `${student.placementReadiness}%`, icon: Award },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <Icon size={14} className="text-slate-400" />
                      <div>
                        <p className="text-[10px] text-slate-400">{item.label}</p>
                        <p className="text-xs font-bold text-slate-700">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FolderKanban size={16} className="text-indigo-500" /> Recent Activity
              </h2>
              <div className="space-y-3">
                {[
                  { action: 'Submitted Assignment', title: 'ML Model Deployment Part 2', time: '2 days ago', status: 'pending' },
                  { action: 'Completed Session', title: 'Career Guidance Session', time: '3 days ago', status: 'completed' },
                  { action: 'Project Review', title: 'End-to-End ML Pipeline', time: '1 week ago', status: 'reviewed' },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      a.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                      a.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                      'bg-indigo-50 text-indigo-600'
                    }`}>
                      {a.status === 'completed' ? <CheckCircle size={14} /> :
                       a.status === 'pending' ? <Clock size={14} /> : <Star size={14} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-700">{a.action}</p>
                      <p className="text-[10px] text-slate-400">{a.title} &middot; {a.time}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Mentor Notes + Upcoming */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileText size={16} className="text-indigo-500" /> Mentor Notes
              </h2>
              <textarea
                rows={5}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add private notes about this student..."
                className="w-full px-3 py-2 border border-slate-100 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20 resize-none"
              />
              <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-indigo-700 transition-colors">Save Notes</button>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Calendar size={16} className="text-indigo-500" /> Upcoming Sessions
              </h2>
              <div className="space-y-3">
                {[
                  { title: 'Career Guidance', date: 'Tomorrow, 11:00 AM', type: '1:1 Mentoring' },
                  { title: 'Resume Review', date: 'Jun 25, 2:00 PM', type: 'Review' },
                ].map((s, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                    <p className="text-xs font-bold text-slate-700">{s.title}</p>
                    <p className="text-[10px] text-slate-400">{s.date}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-emerald-700 transition-colors">Join</button>
                      <button className="flex-1 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-slate-200 transition-colors">Reschedule</button>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 cursor-pointer hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                  + Schedule Session
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" /> Flags
              </h2>
              <div className="space-y-2">
                {student.assignmentsMissing > 0 && (
                  <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-100 rounded-lg">
                    <AlertCircle size={12} className="text-red-500" />
                    <span className="text-[10px] font-bold text-red-700">{student.assignmentsMissing} missing assignments</span>
                  </div>
                )}
                {student.attendance < 60 && (
                  <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-100 rounded-lg">
                    <AlertCircle size={12} className="text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-700">Low attendance ({student.attendance}%)</span>
                  </div>
                )}
                {student.progress < 30 && (
                  <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-100 rounded-lg">
                    <AlertCircle size={12} className="text-red-500" />
                    <span className="text-[10px] font-bold text-red-700">Low progress ({student.progress}%)</span>
                  </div>
                )}
                {student.interviewScore < 50 && (
                  <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-100 rounded-lg">
                    <AlertCircle size={12} className="text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-700">Low interview score ({student.interviewScore}/100)</span>
                  </div>
                )}
                {student.assignmentsMissing === 0 && student.attendance >= 60 && student.progress >= 70 && student.interviewScore >= 70 && (
                  <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <CheckCircle size={12} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-700">Student is on track</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
