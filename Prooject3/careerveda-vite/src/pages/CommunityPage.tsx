import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  MessageSquare, Users, Calendar, Trophy, Bell, Send, ThumbsUp,
  Share2, Flag, ChevronRight, Sparkles, BookOpen, Award, Star
} from 'lucide-react';
import { getStudentData, addNotification } from '@/lib/studentData';

const DISCUSSIONS = [
  { id: 'd1', title: 'Tips for cracking Data Science interviews at FAANG', author: 'Rohan Sharma', replies: 24, likes: 56, time: '2 hours ago', tags: ['Interview', 'FAANG'] },
  { id: 'd2', title: 'My ML project deployment journey on AWS', author: 'Priya Patel', replies: 18, likes: 42, time: '5 hours ago', tags: ['MLOps', 'AWS'] },
  { id: 'd3', title: 'Understanding Transformer architectures — ELI5', author: 'Aditya Sen', replies: 31, likes: 89, time: '1 day ago', tags: ['Deep Learning', 'NLP'] },
  { id: 'd4', title: 'Career switch from finance to data science — AMA', author: 'Neha Gupta', replies: 45, likes: 112, time: '3 days ago', tags: ['Career', 'AMA'] },
  { id: 'd5', title: 'Best resources for learning Generative AI in 2026', author: 'Arjun Mehta', replies: 27, likes: 73, time: '4 days ago', tags: ['Gen AI', 'Resources'] },
];

const ANNOUNCEMENTS = [
  { title: 'Hackathon: Build an AI Agent — Prizes worth ₹50K', date: 'Jun 28, 2026', type: 'event' },
  { title: 'Guest Lecture: Scaling ML at Uber by VP Engineering', date: 'Jun 30, 2026', type: 'event' },
  { title: 'Placement Drive: 12 new companies joining this month', date: 'Jul 5, 2026', type: 'announcement' },
];

const LEADERBOARD = [
  { name: 'Aditya Sen', points: 2840, badges: 12, rank: 1 },
  { name: 'Rohan Sharma', points: 2510, badges: 9, rank: 2 },
  { name: 'Priya Patel', points: 2230, badges: 8, rank: 3 },
  { name: 'Neha Gupta', points: 1980, badges: 7, rank: 4 },
  { name: 'Arjun Mehta', points: 1750, badges: 5, rank: 5 },
];

export default function CommunityPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'discussions' | 'announcements' | 'leaderboard'>('discussions');
  const [commentText, setCommentText] = useState('');
  const [selectedDiscussion, setSelectedDiscussion] = useState<string | null>(null);

  const data = getStudentData();
  const activity = data.communityActivity;

  const handleComment = () => {
    if (!commentText.trim()) return;
    addNotification('general', `You commented on a discussion: "${commentText.slice(0, 50)}..."`, '/community');
    setCommentText('');
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Community</h1>
          <p className="text-sm text-slate-500 mt-1">Connect, discuss, and grow together</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Discussions', value: activity.discussions, icon: MessageSquare, color: 'from-[#6D28D9] to-[#8B5CF6]' },
            { label: 'Events', value: activity.events, icon: Calendar, color: 'from-[#10B981] to-[#059669]' },
            { label: 'Hackathons', value: activity.hackathons, icon: Trophy, color: 'from-[#F59E0B] to-[#D97706]' },
            { label: 'Referrals', value: activity.referrals, icon: Users, color: 'from-[#3B82F6] to-[#2563EB]' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white`}>
                <Icon size={18} className="opacity-80 mb-2" />
                <p className="text-2xl font-extrabold">{s.value || 0}</p>
                <p className="text-[10px] text-white/70 mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-1 border-b border-slate-200">
          {(['discussions', 'announcements', 'leaderboard'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all capitalize cursor-pointer ${
                activeTab === tab ? 'text-[#6D28D9] border-[#6D28D9]' : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}>{tab}</button>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-3">
            {activeTab === 'discussions' && (
              <>
                {DISCUSSIONS.map((d) => (
                  <div key={d.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedDiscussion(selectedDiscussion === d.id ? null : d.id)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-slate-900">{d.title}</h3>
                        <p className="text-[10px] text-slate-400 mt-1">Posted by {d.author} · {d.time}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          {d.tags.map((t, i) => (
                            <span key={i} className="px-2 py-0.5 bg-violet-50 text-[#6D28D9] rounded text-[8px] font-bold">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-slate-400 shrink-0">
                        <span className="flex items-center gap-1"><ThumbsUp size={12} /> {d.likes}</span>
                        <span className="flex items-center gap-1"><MessageSquare size={12} /> {d.replies}</span>
                      </div>
                    </div>

                    {selectedDiscussion === d.id && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex gap-2">
                          <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..." className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#6D28D9]" />
                          <button onClick={handleComment} className="px-3 py-2 bg-[#6D28D9] text-white rounded-xl text-xs font-bold hover:bg-[#5B21B6] transition-colors cursor-pointer flex items-center gap-1">
                            <Send size={12} /> Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {activeTab === 'announcements' && (
              <div className="space-y-3">
                {ANNOUNCEMENTS.map((a, i) => (
                  <div key={i} className={`bg-white border rounded-2xl p-5 shadow-sm ${
                    a.type === 'event' ? 'border-violet-200' : 'border-slate-100'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        a.type === 'event' ? 'bg-violet-100 text-[#6D28D9]' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {a.type === 'event' ? <Calendar size={18} /> : <Bell size={18} />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
                        <p className="text-[10px] text-slate-400 mt-1">{a.date}</p>
                        <button className="mt-2 text-[10px] font-bold text-[#6D28D9] hover:underline cursor-pointer">Learn more <ChevronRight size={10} className="inline" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-left">
                        <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Rank</th>
                        <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Name</th>
                        <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Points</th>
                        <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Badges</th>
                      </tr>
                    </thead>
                    <tbody>
                      {LEADERBOARD.map((u, i) => (
                        <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                              u.rank === 1 ? 'bg-amber-100 text-amber-600' : u.rank === 2 ? 'bg-slate-100 text-slate-600' : u.rank === 3 ? 'bg-orange-100 text-orange-600' : 'text-slate-400'
                            }`}>#{u.rank}</span>
                          </td>
                          <td className="px-5 py-4 text-xs font-bold text-slate-700">{u.name}</td>
                          <td className="px-5 py-4 text-xs font-bold text-slate-800">{u.points.toLocaleString()}</td>
                          <td className="px-5 py-4">
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Award size={12} className="text-amber-500" /> {u.badges}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-4 space-y-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Sparkles size={14} className="text-[#6D28D9]" /> Trending Topics
              </h3>
              <div className="space-y-2">
                {['Generative AI', 'Placement Preparation', 'System Design', 'MLOps', 'Career Switch'].map((t, i) => (
                  <button key={i} className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-violet-50 rounded-xl text-xs font-medium text-slate-600 hover:text-[#6D28D9] transition-colors cursor-pointer">
                    #{t}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button onClick={() => addNotification('general', 'You created a new discussion', '/community')}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-[#6D28D9]/5 text-[#6D28D9] rounded-xl text-xs font-bold hover:bg-[#6D28D9]/10 transition-colors cursor-pointer">
                  <MessageSquare size={14} /> Start Discussion
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer">
                  <Users size={14} /> Find Study Buddy
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer">
                  <Trophy size={14} /> Join Hackathon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
