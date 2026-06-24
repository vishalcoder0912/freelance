/*
 * AIFeatures.tsx - Interactive AI Learning Assistant panel.
 * Provides tabbed access to AI-generated stories, quizzes, homework,
 * progress reports, and activity recommendations for children.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, BookOpen, Brain, FileText, Lightbulb, Stars } from 'lucide-react'
import { generateStory, generateQuiz, generateHomework, generateParentReport, generateActivityRecommendation } from '../../services/aiFeatures'

interface Props {
  childName?: string
  age?: number
  grade?: string
}

/** Available AI feature tabs with icons and gradient colors */
const tabs = [
  { id: 'story', label: 'Story', icon: <BookOpen className="w-4 h-4" />, color: 'from-purple-400 to-pink-500' },
  { id: 'quiz', label: 'Quiz', icon: <Brain className="w-4 h-4" />, color: 'from-green-400 to-teal-500' },
  { id: 'homework', label: 'Homework', icon: <FileText className="w-4 h-4" />, color: 'from-blue-400 to-indigo-500' },
  { id: 'report', label: 'Report', icon: <Stars className="w-4 h-4" />, color: 'from-orange-400 to-red-500' },
  { id: 'recommend', label: 'Recommend', icon: <Lightbulb className="w-4 h-4" />, color: 'from-yellow-400 to-orange-500' },
]

/**
 * AIFeatures - Main AI assistant component with tab switching.
 * Generates new content each time a tab is selected or the
 * "Generate New" button is clicked.
 */
export function AIFeatures({ childName = 'Student', age = 4, grade = 'kindergarten' }: Props) {
  const [activeTab, setActiveTab] = useState('story')
  const [topic, setTopic] = useState('friendship')
  const [content, setContent] = useState(generateStory('friendship', age))

  /** Generates fresh content for the selected tab */
  const handleGenerate = (tab: string) => {
    setActiveTab(tab)
    switch (tab) {
      case 'story':
        const topics = ['friendship', 'adventure', 'animals', 'nature', 'space']
        const t = topics[Math.floor(Math.random() * topics.length)]
        setTopic(t)
        setContent(generateStory(t, age))
        break
      case 'quiz':
        const quizSubjects = ['alphabets', 'numbers', 'colors', 'animals']
        const subject = quizSubjects[Math.floor(Math.random() * quizSubjects.length)]
        setContent(JSON.stringify(generateQuiz(subject, age)))
        break
      case 'homework':
        const subjects = ['english', 'math', 'general']
        const subj = subjects[Math.floor(Math.random() * subjects.length)]
        setContent(JSON.stringify(generateHomework(grade, subj)))
        break
      case 'report':
        setContent(JSON.stringify(generateParentReport(childName, 75, 10)))
        break
      case 'recommend':
        setContent(JSON.stringify(generateActivityRecommendation(age, [])))
        break
    }
  }

  /** Renders the active tab's content with appropriate layout */
  const renderContent = () => {
    // Story view - displays narrative text with a topic emoji
    if (activeTab === 'story') {
      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="prose max-w-none">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{topic === 'friendship' ? '🌈' : topic === 'adventure' ? '🗺️' : topic === 'animals' ? '🐾' : topic === 'nature' ? '🌻' : '🚀'}</span>
            <span className="text-sm font-bold text-purple-600 capitalize">{topic} Story</span>
          </div>
          <p className="text-gray-700 leading-relaxed">{content}</p>
        </motion.div>
      )
    }
    // Quiz view - renders questions with answer options (correct answer highlighted)
    if (activeTab === 'quiz') {
      const quiz = JSON.parse(content)
      return (
        <div className="space-y-4">
          {quiz.map((q: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="font-bold text-gray-700 mb-2">{i + 1}. {q.question}</p>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt: string, j: number) => (
                  <div key={j} className={`p-2 rounded-lg text-sm ${j === q.answer ? 'bg-green-100 text-green-700 font-bold' : 'bg-gray-50 text-gray-600'}`}>
                    {opt}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )
    }
    // Homework view - numbered task list
    if (activeTab === 'homework') {
      const tasks = JSON.parse(content)
      return (
        <ul className="space-y-2">
          {tasks.map((task: string, i: number) => (
            <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
              <span className="w-6 h-6 rounded-full bg-kid-blue text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <span className="text-gray-700">{task}</span>
            </motion.li>
          ))}
        </ul>
      )
    }
    // Report view - progress card with strengths, improvements, and teacher note
    if (activeTab === 'report') {
      const report = JSON.parse(content)
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-gradient-to-r from-kid-orange to-kid-pink rounded-xl p-4 text-white">
            <p className="font-bold text-lg">{report.childName}'s Progress</p>
            <p className="text-sm opacity-90">Attendance: {report.attendance}</p>
          </div>
          <div>
            <p className="font-bold text-green-600 mb-2">Strengths</p>
            {report.strengths.map((s: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <span>✅</span> {s}
              </div>
            ))}
          </div>
          <div>
            <p className="font-bold text-orange-600 mb-2">Improvements</p>
            {report.improvements.map((s: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <span>📝</span> {s}
              </div>
            ))}
          </div>
          <p className="text-sm italic text-gray-500 bg-gray-50 rounded-xl p-3">"{report.teacherNote}"</p>
        </motion.div>
      )
    }
    return null
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-kid-purple" />
        <h2 className="font-fredoka text-lg text-gray-800">AI Learning Assistant</h2>
      </div>

      {/* Feature tabs row */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => handleGenerate(tab.id)}
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all
              ${activeTab === tab.id ? `bg-gradient-to-r ${tab.color} text-white shadow-md` : 'bg-white text-gray-600 hover:shadow'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Dynamic content area with enter/exit transitions */}
      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>

      {/* Generate new content button */}
      <motion.button
        onClick={() => handleGenerate(activeTab)}
        className="mt-4 w-full bg-gradient-to-r from-kid-purple to-kid-pink text-white py-2 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Sparkles className="w-4 h-4" />
        Generate New
      </motion.button>
    </div>
  )
}
