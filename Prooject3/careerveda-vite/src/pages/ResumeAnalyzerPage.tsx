import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, ArrowLeft, Upload, Sparkles, FileText, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

export default function ResumeAnalyzerPage() {
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      triggerAnalysis();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      triggerAnalysis();
    }
  };

  const triggerAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-20 grid-bg-light">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={14} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Brain size={16} />
            </div>
            <span className="font-bold text-xs text-slate-800">AI Resume Analyzer</span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 text-xs font-bold rounded-xl bg-white transition-all"
        >
          My Dashboard
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-8">
        
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">AI Resume Analyzer</h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Upload your resume to get instant ATS scores, identify critical keyword gaps, and receive suggestions tailored to your target job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Drag & Drop Card */}
          <div className="md:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Resume Upload</h3>
            
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
                dragActive 
                  ? 'border-indigo-600 bg-indigo-50/30' 
                  : 'border-slate-200 hover:border-indigo-400 bg-slate-50/20'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                onChange={handleFileSelect}
                accept=".pdf,.docx,.doc"
                className="hidden"
              />
              <Upload size={28} className="text-slate-400 mb-3 group-hover:text-indigo-600" />
              <p className="text-xs font-bold text-slate-700">Drag & Drop Resume</p>
              <p className="text-[10px] text-slate-400 mt-1">Supports PDF, DOC, DOCX up to 5MB</p>
              
              {fileName && (
                <div className="mt-4 p-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-2 max-w-full">
                  <FileText size={14} className="text-indigo-600 flex-shrink-0" />
                  <span className="text-[9px] font-bold text-slate-600 truncate">{fileName}</span>
                </div>
              )}
            </div>

            <button 
              onClick={triggerAnalysis}
              disabled={analyzing}
              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {analyzing ? 'Analyzing Resume...' : <><Sparkles size={14} /> Review ATS Score</>}
            </button>
          </div>

          {/* Right Column: Score Breakdown */}
          <div className="md:col-span-7">
            {analyzing && (
              <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm space-y-4">
                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-slate-500 text-xs font-semibold">Running ATS parser, comparing keywords in our database...</p>
              </div>
            )}

            {!analyzing && !analyzed && (
              <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
                  <FileText size={32} />
                </div>
                <p className="text-slate-500 text-xs font-semibold">Upload your resume to calculate your score breakdown.</p>
              </div>
            )}

            {!analyzing && analyzed && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                
                {/* Score Header */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">ATS Feedback Summary</h3>
                    <p className="text-[9px] text-slate-400">Calculated score for target: AI Engineer</p>
                  </div>
                  <div className="w-14 h-14 rounded-full border-4 border-indigo-600 flex items-center justify-center font-black text-xs text-indigo-600 bg-indigo-50">
                    84%
                  </div>
                </div>

                {/* Feedback Blocks */}
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle2, title: 'Matched Core Keywords', desc: 'React.js, Node.js, TypeScript, SQL, and Docker were successfully matched.', color: 'text-emerald-500 bg-emerald-50' },
                    { icon: AlertTriangle, title: 'Missing Skill Keywords', desc: 'Consider adding PyTorch, Kubernetes, and MLOps to boost score for target position.', color: 'text-amber-500 bg-amber-50' },
                    { icon: Lightbulb, title: 'Optimization Tips', desc: 'Quantify achievements with percentages and metrics rather than listing general responsibilities.', color: 'text-sky-500 bg-sky-50' }
                  ].map((tip, idx) => {
                    const Icon = tip.icon;
                    return (
                      <div key={idx} className="flex gap-3.5 items-start p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tip.color}`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{tip.title}</h4>
                          <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{tip.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-50 flex gap-4">
                  <button 
                    onClick={() => navigate('/interview-coach')}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Proceed to Interview Prep <Sparkles size={14} />
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
