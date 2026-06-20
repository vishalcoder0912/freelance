import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, ArrowLeft, Send, Sparkles, User, Loader2, RefreshCw, ChevronRight } from 'lucide-react';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  roadmap?: { month: string; topic: string; color: string }[];
}

export default function AICopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hi! I'm your AI Career Copilot. 👋 What role are you aiming to transition to?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0 = role, 1 = level, 2 = done
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userText = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (step === 0) {
        setRole(userText);
        setMessages(prev => [...prev, { sender: 'ai', text: `Got it! What is your current experience level (e.g., Beginner, Intermediate, Advanced)?` }]);
        setStep(1);
      } else if (step === 1) {
        setLevel(userText);
        setMessages(prev => [
          ...prev, 
          { sender: 'ai', text: `Excellent! Building your customized ${role} roadmap for the ${userText} level...` }
        ]);
        
        // Generate simulated roadmap
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setStep(2);
          setMessages(prev => [
            ...prev,
            { 
              sender: 'ai', 
              text: `✨ Here is your personalized 6-month roadmap:`,
              roadmap: [
                { month: 'Month 1', topic: 'Core Foundations & syntax', color: '#6C63FF' },
                { month: 'Month 2', topic: 'Framework fundamentals', color: '#00D4FF' },
                { month: 'Month 3', topic: 'Advanced systems & DB integrations', color: '#7CFFB2' },
                { month: 'Month 4', topic: 'Deployment, Docker & basic Cloud', color: '#F59E0B' },
                { month: 'Month 5', topic: 'LLM & prompt engineering wrappers', color: '#6C63FF' },
                { month: 'Month 6', topic: 'Portfolio capstone & placement prep', color: '#00D4FF' }
              ]
            }
          ]);
        }, 1500);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: `Feel free to ask any questions about this roadmap, such as syllabus details or book recommendations!` }]);
      }
    }, 1000);
  };

  const handleReset = () => {
    setMessages([{ sender: 'ai', text: "Hi! I'm your AI Career Copilot. 👋 What role are you aiming to transition to?" }]);
    setStep(0);
    setRole('');
    setLevel('');
    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col justify-between grid-bg-light">
      
      {/* Top Header */}
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
            <div>
              <p className="text-xs font-bold text-slate-800">AI Career Copilot</p>
              <p className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Powered by DeepSeek-R1
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 text-xs font-bold transition-all cursor-pointer"
        >
          <RefreshCw size={12} /> Restart Chat
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-grow max-w-3xl w-full mx-auto px-6 py-6 overflow-y-auto space-y-6">
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                <Sparkles size={14} />
              </div>
            )}
            
            <div className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-white border border-slate-100 rounded-tl-none text-slate-700'
            }`}>
              <p className="text-xs leading-relaxed font-semibold whitespace-pre-line">{msg.text}</p>
              
              {/* If message contains roadmap */}
              {msg.roadmap && (
                <div className="mt-4 grid gap-2">
                  {msg.roadmap.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-bold text-slate-400 w-14">{item.month}</span>
                      <ChevronRight size={12} className="text-slate-400" />
                      <span className="text-xs font-semibold text-slate-700">{item.topic}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold text-xs">
                U
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
              <Loader2 size={14} className="animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-100 rounded-tl-none text-slate-400">
              <span className="text-xs font-medium animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-100 p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-3 relative">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            placeholder={
              step === 0 
                ? "Enter your target career path (e.g., AI Engineer, Product Manager)..." 
                : step === 1 
                  ? "Enter your experience level (e.g., Beginner, Intermediate)..." 
                  : "Ask any question about your roadmap..."
            }
            className="w-full pl-4 pr-14 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-xs bg-slate-50/50"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="absolute right-1.5 top-1.5 bottom-1.5 w-11 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Send size={14} />
          </button>
        </form>
      </div>

    </div>
  );
}
