import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Award, Download, ExternalLink } from 'lucide-react';
import { getStudentData } from '@/lib/studentData';

export default function MyCertificatesPage() {
  const [data, setData] = useState(getStudentData());
  useEffect(() => { setData(getStudentData()); }, []);
  const certs = data.certificates || [];
  const allSkills = certs.flatMap(c => c.skills);
  const uniqueSkills = [...new Set(allSkills)];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Certificates</h1>
          <p className="text-sm text-slate-500 mt-1">Verified credentials and certificates from completed programs.</p>
        </div>

        {certs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certs.map((cert) => (
                <div key={cert.id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-500/5 to-violet-500/10 rounded-full -mr-8 -mt-8" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                        <Award size={18} className="text-amber-500" />
                      </div>
                      <button className="p-1.5 text-slate-400 hover:text-[#6D28D9] hover:bg-slate-50 rounded-lg transition-colors">
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
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-semibold text-[#6D28D9] hover:underline">
                        <ExternalLink size={12} /> Verify Credential
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] rounded-2xl p-6 text-white flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm font-bold">Total Certificates Earned</p>
                <p className="text-3xl font-extrabold mt-1">{certs.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">Skills Verified</p>
                <p className="text-3xl font-extrabold mt-1">{uniqueSkills.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Award size={24} />
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
            <Award size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-500">No certificates yet</p>
            <p className="text-xs text-slate-400 mt-1">Complete program modules to earn certificates</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
