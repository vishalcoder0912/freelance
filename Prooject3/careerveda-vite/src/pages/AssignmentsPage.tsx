import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  FileText, Clock, CheckCircle, AlertCircle, Upload,   GitBranch, ExternalLink,
  ArrowLeft, ChevronRight, Calendar, Star, MessageSquare, Download
} from 'lucide-react';
import { getStudentData, submitAssignment, getCourseProgressPercent } from '@/lib/studentData';

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(getStudentData());
  const [selectedId, setSelectedId] = useState<string | null>(id || null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  useEffect(() => { setData(getStudentData()); }, [id]);

  const assignment = selectedId ? data.assignments.find(a => a.id === selectedId) : null;
  const refresh = () => setData(getStudentData());
  const coursePct = getCourseProgressPercent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;
    submitAssignment(assignment.id, uploadFile?.name || 'uploaded_file', githubUrl || undefined, liveUrl || undefined);
    refresh();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const isOverdue = (d: string) => !assignment?.submitted && new Date(d) < new Date();

  if (selectedId && assignment) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <button onClick={() => { setSelectedId(null); navigate('/assignments'); }} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#6D28D9] transition-colors cursor-pointer">
            <ArrowLeft size={14} /> Back to Assignments
          </button>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">{assignment.title}</h1>
                <p className="text-xs text-slate-500 mt-1">{assignment.program} · {assignment.module}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                assignment.submitted ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                isOverdue(assignment.deadline) ? 'bg-rose-50 text-rose-600 border-rose-200' :
                'bg-amber-50 text-amber-600 border-amber-200'
              }`}>
                {assignment.submitted ? 'Submitted' : isOverdue(assignment.deadline) ? 'Overdue' : 'Pending'}
              </span>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-500 mb-6">
              <span className="flex items-center gap-1.5"><Calendar size={13} /> Deadline: {formatDate(assignment.deadline)}</span>
              {assignment.submitted && assignment.submittedAt && (
                <span className="flex items-center gap-1.5"><Clock size={13} /> Submitted: {formatDate(assignment.submittedAt)}</span>
              )}
              {assignment.score !== null && (
                <span className="flex items-center gap-1.5"><Star size={13} className="text-amber-500" /> Score: {assignment.score}%</span>
              )}
            </div>

            {assignment.feedback && (
              <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare size={14} className="text-[#6D28D9]" />
                  <span className="text-xs font-bold text-[#6D28D9]">Mentor Feedback</span>
                </div>
                <p className="text-xs text-slate-700">{assignment.feedback}</p>
              </div>
            )}

            {!assignment.submitted && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Upload File (PDF, DOCX)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-[#6D28D9]/30 transition-colors cursor-pointer" onClick={() => document.getElementById('fileInput')?.click()}>
                    <Upload size={20} className="mx-auto text-slate-400 mb-1" />
                    <p className="text-xs text-slate-500">{uploadFile ? uploadFile.name : 'Click to upload or drag & drop'}</p>
                    <input id="fileInput" type="file" accept=".pdf,.docx" className="hidden" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">GitHub URL (optional)</label>
                    <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 focus-within:border-[#6D28D9]">
                      <GitBranch size={14} className="text-slate-400 mr-2" />
                      <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className="w-full text-xs outline-none bg-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Live URL (optional)</label>
                    <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 focus-within:border-[#6D28D9]">
                      <ExternalLink size={14} className="text-slate-400 mr-2" />
                      <input type="url" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://..." className="w-full text-xs outline-none bg-transparent" />
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-[#6D28D9] text-white rounded-xl text-xs font-bold hover:bg-[#5B21B6] transition-colors cursor-pointer">
                  Submit Assignment
                </button>
              </form>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Assignments</h1>
          <p className="text-sm text-slate-500 mt-1">Track and submit your assignments</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total', value: data.assignments.length, icon: FileText, color: 'text-blue-500 bg-blue-50' },
            { label: 'Submitted', value: data.assignments.filter(a => a.submitted).length, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
            { label: 'Pending', value: data.assignments.filter(a => !a.submitted).length, icon: Clock, color: 'text-amber-500 bg-amber-50' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`${s.color.split(' ')[1]} border border-slate-100 rounded-2xl p-4 shadow-sm`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className={s.color.split(' ')[0]} />
                  <span className="text-[10px] font-bold text-slate-500">{s.label}</span>
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Assignment</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Deadline</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Status</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Score</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.assignments.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-xs text-slate-400">No assignments yet.</td></tr>
                ) : data.assignments.map((a) => (
                  <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-slate-700">{a.title}</p>
                      <p className="text-[10px] text-slate-400">{a.module}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">{formatDate(a.deadline)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        a.submitted ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        isOverdue(a.deadline) ? 'bg-rose-50 text-rose-600 border-rose-200' :
                        'bg-amber-50 text-amber-600 border-amber-200'
                      }`}>
                        {a.submitted ? 'Submitted' : isOverdue(a.deadline) ? 'Overdue' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold ${a.score !== null ? 'text-slate-800' : 'text-slate-400'}`}>
                        {a.score !== null ? `${a.score}%` : '--'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => { setSelectedId(a.id); navigate(`/assignments/${a.id}`); }}
                        className="px-3 py-1 bg-[#6D28D9] text-white rounded-lg text-[10px] font-bold hover:bg-[#5B21B6] transition-colors cursor-pointer">
                        {a.submitted ? 'View' : 'Submit'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
