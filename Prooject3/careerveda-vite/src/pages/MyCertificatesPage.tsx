import DashboardLayout from '@/components/layout/DashboardLayout';
import { Award, Download, ExternalLink, CheckCircle2 } from 'lucide-react';

const CERTIFICATES = [
  { title: 'Python Programming & Math Foundations', issuer: 'CareerVeda', date: 'Jan 2026', credentialId: 'CV-PY-001', skills: ['Python', 'Linear Algebra', 'Statistics'] },
  { title: 'Classical Machine Learning with Scikit-Learn', issuer: 'CareerVeda', date: 'Feb 2026', credentialId: 'CV-ML-002', skills: ['ML', 'Scikit-Learn', 'Pandas'] },
  { title: 'Neural Networks & Deep Learning Core (PyTorch)', issuer: 'CareerVeda', date: 'Mar 2026', credentialId: 'CV-DL-003', skills: ['PyTorch', 'Neural Networks', 'Deep Learning'] },
  { title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: 'Apr 2026', credentialId: 'AWS-CP-004', skills: ['AWS', 'Cloud', 'Infrastructure'] },
];

export default function MyCertificatesPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Certificates</h1>
          <p className="text-sm text-slate-500 mt-1">Verified credentials and certificates from completed programs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CERTIFICATES.map((cert, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-indigo-500/10 rounded-full -mr-8 -mt-8" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                    <Award size={18} className="text-amber-500" />
                  </div>
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <Download size={14} />
                  </button>
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{cert.title}</h3>
                <p className="text-xs text-slate-400 mb-1">{cert.issuer} · {cert.date}</p>
                <p className="text-[10px] text-slate-400 mb-3">Credential ID: {cert.credentialId}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cert.skills.map((skill, j) => (
                    <span key={j} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-medium text-slate-500">{skill}</span>
                  ))}
                </div>
                <button className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                  <ExternalLink size={12} /> Verify Credential
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Total Certificates Earned</p>
            <p className="text-3xl font-extrabold mt-1">4</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">Skills Verified</p>
            <p className="text-3xl font-extrabold mt-1">12</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}