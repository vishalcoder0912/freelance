import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Check, Play, Lock, FileText, BookOpen, MessageSquare,
  ChevronDown, ChevronRight, Maximize2, Minimize2, Clock, Award,
  Sparkles, Send, Loader2, Monitor, PenTool, Download, ExternalLink
} from 'lucide-react';
import { PROGRAMS_DATA } from '@/lib/programsData';
import { getProgramLessons, getLesson, getLessonKey, getPrevNextLesson, type Lesson } from '@/lib/lessonsData';
import {
  getStudentData, completeLesson, isLessonCompleted,
  saveLessonNote, getLessonNote, setCurrentLesson,
  getCourseProgressPercent
} from '@/lib/studentData';

export default function LearnPage() {
  const { programId, moduleId, lessonId } = useParams<{ programId: string; moduleId: string; lessonId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState(getStudentData());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'resources'>('content');
  const [noteText, setNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [videoExpanded, setVideoExpanded] = useState(false);

  const program = programId ? PROGRAMS_DATA[programId] : null;
  const modules = programId ? getProgramLessons(programId) : [];
  const currentModule = modules.find(m => m.id === moduleId);
  const currentLesson = (moduleId && lessonId) ? getLesson(programId!, moduleId, lessonId) : null;
  const coursePct = getCourseProgressPercent();

  const lessonKey = moduleId && lessonId ? getLessonKey(moduleId, lessonId) : '';
  const completed = lessonKey ? isLessonCompleted(lessonKey) : false;

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = modules.reduce((sum, m) =>
    sum + m.lessons.filter(l => isLessonCompleted(getLessonKey(m.id, l.id))).length, 0
  );

  const nav = useMemo(() => {
    if (!programId || !moduleId || !lessonId) return { prev: null, next: null };
    return getPrevNextLesson(programId, moduleId, lessonId);
  }, [programId, moduleId, lessonId]);

  useEffect(() => {
    if (lessonKey) {
      setNoteText(getLessonNote(lessonKey));
      setCurrentLesson(lessonKey);
    }
  }, [lessonKey]);

  useEffect(() => {
    if (!program || !currentModule || !currentLesson) return;
    setActiveTab('content');
    setAiResponse(null);
    setAiQuestion('');
  }, [moduleId, lessonId]);

  const refresh = () => setData(getStudentData());

  if (!program || !currentModule || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFC]">
        <div className="text-center space-y-3">
          <p className="text-slate-500 text-sm">Lesson not found.</p>
          <button onClick={() => navigate('/dashboard')} className="text-xs font-bold text-[#6D28D9] hover:underline cursor-pointer">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleMarkComplete = () => {
    if (!lessonKey) return;
    completeLesson(lessonKey);
    refresh();
  };

  const handleSaveNote = () => {
    if (!lessonKey) return;
    saveLessonNote(lessonKey, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleAiAsk = () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    const q = aiQuestion.toLowerCase();
    setTimeout(() => {
      let response = '';
      if (q.includes('explain') || q.includes('what is')) {
        response = `Based on this lesson about "${currentLesson.title}", the key concept is that this topic forms a fundamental building block in the field. Mastering it requires understanding both the theoretical underpinnings and practical applications. Think of it as a tool that helps you solve specific types of problems more efficiently.`;
      } else if (q.includes('example') || q.includes('show')) {
        response = `Here's a practical example related to "${currentLesson.title}":\n\n1. Start by identifying the input data and desired output\n2. Apply the core principles covered in this lesson\n3. Test your implementation with sample data\n4. Iterate based on results\n\nTry the practice exercises in the resources section to reinforce this!`;
      } else if (q.includes('summary') || q.includes('recap')) {
        response = `Key takeaways from "${currentLesson.title}":\n\n• Core concepts and fundamental principles\n• Practical implementation patterns\n• Common pitfalls and how to avoid them\n• Real-world applications and use cases\n\nReview the lesson content and try the hands-on exercises to solidify your understanding.`;
      } else {
        response = `Great question about "${currentLesson.title}"! Here's what you need to know:\n\nThe concept you're asking about is closely related to the core material. I recommend:\n1. Reviewing the video again for visual understanding\n2. Checking the supplementary resources\n3. Practicing with the provided examples\n\nIf you need more specific help, try rephrasing your question with more detail.`;
      }
      setAiResponse(response);
      setAiLoading(false);
    }, 1200);
  };

  const getLessonIcon = (mid: string, lid: string) => {
    const key = getLessonKey(mid, lid);
    if (isLessonCompleted(key)) return <Check size={14} className="text-emerald-500" />;
    if (mid === moduleId && lid === lessonId) return <Play size={12} className="text-[#6D28D9] ml-0.5" />;
    return <Lock size={12} className="text-slate-300" />;
  };

  const getLessonStyle = (mid: string, lid: string) => {
    const key = getLessonKey(mid, lid);
    if (isLessonCompleted(key)) return 'text-emerald-600 bg-emerald-50';
    if (mid === moduleId && lid === lessonId) return 'text-[#6D28D9] bg-violet-50 font-bold';
    return 'text-slate-400';
  };

  const getModuleProgress = (mod: typeof modules[0]) => {
    const done = mod.lessons.filter(l => isLessonCompleted(getLessonKey(mod.id, l.id))).length;
    return mod.lessons.length > 0 ? Math.round((done / mod.lessons.length) * 100) : 0;
  };

  const navigateToLesson = (mid: string, lid: string) => {
    navigate(`/learn/${programId}/${mid}/${lid}`);
  };

  const navigateToNav = (target: { moduleId: string; lessonId: string } | null) => {
    if (!target) return;
    navigate(`/learn/${programId}/${target.moduleId}/${target.lessonId}`);
  };

  return (
    <div className="h-screen flex flex-col bg-[#FAFAFC] overflow-hidden">
      {/* ================================================================ */}
      {/* TOP BAR                                                           */}
      {/* ================================================================ */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{program.title}</p>
            <p className="text-xs font-bold text-slate-700">{currentModule.title} / {currentLesson.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock size={13} />
            <span>{currentLesson.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#6D28D9] h-full rounded-full" style={{ width: `${coursePct}%` }} />
            </div>
            <span className="text-[10px] font-bold text-slate-500">{completedCount}/{totalLessons}</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-all cursor-pointer"
          >
            {sidebarOpen ? <ChevronRight size={16} /> : <ChevronDown size={16} className="rotate-90" />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ================================================================ */}
        {/* LEFT SIDEBAR - Module/Lesson List                                 */}
        {/* ================================================================ */}
        {sidebarOpen && (
          <div className="shrink-0 w-72 bg-white border-r border-slate-200 overflow-y-auto">
            {modules.map((mod) => {
              const modPct = getModuleProgress(mod);
              const isOpen = mod.id === moduleId || mod.lessons.some(l => isLessonCompleted(getLessonKey(mod.id, l.id)));
              return (
                <div key={mod.id} className="border-b border-slate-100 last:border-b-0">
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Module {mod.id.replace('m', '')}</p>
                      <p className="text-xs font-bold text-slate-700 truncate mt-0.5">{mod.title}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${modPct === 100 ? 'bg-emerald-500' : 'bg-[#6D28D9]'}`} style={{ width: `${modPct}%` }} />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400">{modPct}%</span>
                    </div>
                  </div>
                  <div className="pb-2">
                    {mod.lessons.map((lesson) => {
                      const isActive = mod.id === moduleId && lesson.id === lessonId;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => navigateToLesson(mod.id, lesson.id)}
                          className={`w-full text-left flex items-center gap-3 px-4 py-2 text-xs transition-all cursor-pointer ${
                            isActive ? 'bg-violet-50 border-r-2 border-[#6D28D9]' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className="shrink-0 w-5 flex items-center justify-center">
                            {getLessonIcon(mod.id, lesson.id)}
                          </span>
                          <span className={`truncate ${getLessonStyle(mod.id, lesson.id)}`}>
                            {lesson.title}
                          </span>
                          {isActive && <span className="shrink-0 text-[9px] text-[#6D28D9] font-bold ml-auto">Now</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================================================================ */}
        {/* MAIN CONTENT AREA                                                */}
        {/* ================================================================ */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-6">
              {/* Video Player */}
              <div className={`${videoExpanded ? '' : 'mb-6'}`}>
                <div className={`relative bg-black rounded-2xl overflow-hidden ${videoExpanded ? 'fixed inset-0 z-50 rounded-none' : 'aspect-video'}`}>
                  <iframe
                    src={currentLesson.videoUrl + '?autoplay=1&rel=0'}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={currentLesson.title}
                  />
                  <button
                    onClick={() => setVideoExpanded(!videoExpanded)}
                    className="absolute bottom-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg transition-all cursor-pointer"
                  >
                    {videoExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                </div>
              </div>

              {/* Tab Bar */}
              <div className="flex items-center gap-1 mb-4 border-b border-slate-200">
                {(['content', 'resources'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer capitalize ${
                      activeTab === tab
                        ? 'text-[#6D28D9] border-[#6D28D9]'
                        : 'text-slate-400 border-transparent hover:text-slate-600'
                    }`}
                  >
                    {tab === 'content' ? <BookOpen size={14} className="inline mr-1.5" /> : <FileText size={14} className="inline mr-1.5" />}
                    {tab}
                  </button>
                ))}
                <div className="flex-1" />
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    showNotes ? 'bg-violet-100 text-[#6D28D9]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <PenTool size={14} className="inline mr-1.5" />
                  Notes
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'content' && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Lesson Resources</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentLesson.resources.map((r, i) => (
                      <a
                        key={i}
                        href={r.url}
                        className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-[#6D28D9]/30 hover:bg-violet-50/50 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-violet-100 group-hover:text-[#6D28D9] transition-all">
                          {r.type === 'pdf' ? <FileText size={18} /> : r.type === 'video' ? <Play size={16} className="ml-0.5" /> : r.type === 'code' ? <Monitor size={18} /> : <ExternalLink size={18} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate">{r.title}</p>
                          <p className="text-[9px] text-slate-400 uppercase mt-0.5">{r.type}</p>
                        </div>
                        <Download size={14} className="text-slate-300 group-hover:text-[#6D28D9] shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Tutor Section */}
              <div className="mt-6 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-[#6D28D9]" />
                  <h3 className="text-sm font-bold text-slate-800">AI Tutor</h3>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Ask anything</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiAsk()}
                    placeholder={`Ask about "${currentLesson.title}"...`}
                    className="flex-1 px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9]/20"
                  />
                  <button
                    onClick={handleAiAsk}
                    disabled={aiLoading || !aiQuestion.trim()}
                    className="px-4 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  </button>
                </div>
                {aiResponse && (
                  <div className="mt-4 p-4 bg-violet-50 border border-violet-100 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-[#6D28D9]" />
                      <span className="text-[10px] font-bold text-[#6D28D9]">AI Response</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
                  </div>
                )}
                {!aiResponse && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {['Explain this concept', 'Give an example', 'Summarize key points', 'Common mistakes'].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setAiQuestion(s); setTimeout(handleAiAsk, 100); }}
                        className="px-2.5 py-1 text-[9px] font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-violet-50 hover:border-violet-200 hover:text-[#6D28D9] transition-all cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* BOTTOM NAVIGATION BAR                                            */}
          {/* ================================================================ */}
          <div className="shrink-0 bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between">
            <button
              onClick={() => navigateToNav(nav.prev)}
              disabled={!nav.prev}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ArrowLeft size={14} /> Previous Lesson
            </button>
            <button
              onClick={handleMarkComplete}
              className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                completed
                  ? 'bg-emerald-100 text-emerald-700 cursor-default'
                  : 'bg-[#6D28D9] hover:bg-[#5B21B6] text-white'
              }`}
            >
              {completed ? <Check size={14} /> : <Check size={14} />}
              {completed ? 'Completed' : 'Mark as Complete'}
            </button>
            <button
              onClick={() => navigateToNav(nav.next)}
              disabled={!nav.next}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Next Lesson <ArrowLeft size={14} className="rotate-180" />
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* RIGHT NOTES PANEL                                                */}
        {/* ================================================================ */}
        {showNotes && (
          <div className="shrink-0 w-80 bg-white border-l border-slate-200 flex flex-col">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <PenTool size={14} className="text-[#6D28D9]" />
                Your Notes
              </h3>
              <button
                onClick={() => setShowNotes(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="flex-1 p-4 flex flex-col">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write your notes for this lesson..."
                className="flex-1 w-full p-3 text-xs border border-slate-200 rounded-xl resize-none focus:outline-none focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9]/20 placeholder:text-slate-300"
              />
              <button
                onClick={handleSaveNote}
                className="mt-3 w-full py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                {noteSaved ? 'Saved!' : 'Save Notes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
