import { useState } from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, Plus, Trash2, Save, Eye } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

export default function QuizBuilder() {
  const [quizTitle, setQuizTitle] = useState<string>('Weekly Math Quiz')
  const [subject, setSubject] = useState<string>('Mathematics')
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, question: 'What is 2 + 3?', options: ['4', '5', '6', '7'], correctAnswer: 1 },
    { id: 2, question: 'What is 10 - 4?', options: ['5', '6', '7', '8'], correctAnswer: 1 },
    { id: 3, question: 'What shape has 4 equal sides?', options: ['Rectangle', 'Triangle', 'Square', 'Circle'], correctAnswer: 2 },
  ])

  const addQuestion = () => {
    const newId = Math.max(...questions.map((q: Question) => q.id), 0) + 1
    setQuestions([...questions, { id: newId, question: '', options: ['', '', '', ''], correctAnswer: 0 }])
  }

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q: Question) => q.id !== id))
  }

  const updateQuestion = (id: number, field: keyof Question, value: string | number) => {
    setQuestions(questions.map((q: Question) => q.id === id ? { ...q, [field]: value } : q))
  }

  const updateOption = (qId: number, optIdx: number, value: string) => {
    setQuestions(questions.map((q: Question) => q.id === qId ? { ...q, options: q.options.map((o: string, i: number) => i === optIdx ? value : o) } : q))
  }

  const savedQuizzes = [
    { id: 1, title: 'Addition Basics', subject: 'Mathematics', questions: 5, status: 'published' as const },
    { id: 2, title: 'Alphabet Quiz', subject: 'English', questions: 10, status: 'draft' as const },
    { id: 3, title: 'Animal Science', subject: 'Science', questions: 8, status: 'published' as const },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div variants={card} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka text-gray-800 flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-kid-purple" /> Quiz Builder
          </h1>
          <p className="text-gray-500 font-nunito">Create interactive quizzes for your class</p>
        </div>
        <motion.button
          className="bg-gradient-to-r from-kid-purple to-kid-pink text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-1 self-start"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Eye className="w-4 h-4" /> Preview
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={card} className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Quiz Title</label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuizTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kid-purple/30"
                />
              </div>
              <div className="w-full sm:w-40">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Subject</label>
                <select
                  value={subject}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kid-purple/30"
                >
                  <option>Mathematics</option>
                  <option>English</option>
                  <option>Science</option>
                  <option>Hindi</option>
                </select>
              </div>
            </div>
          </div>

              {questions.map((q: Question, idx: number) => (
            <motion.div
              key={q.id}
              variants={card}
              className="bg-white rounded-2xl p-5 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-kid-purple">Question {idx + 1}</span>
                <motion.button
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-kid-red"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => removeQuestion(q.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
              <input
                type="text"
                placeholder="Enter your question..."
                value={q.question}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuestion(q.id, 'question', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-kid-purple/30"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt: string, oi: number) => (
                  <div
                    key={oi}
                    className={`flex items-center gap-2 p-2 rounded-xl border-2 cursor-pointer transition-colors ${
                      q.correctAnswer === oi ? 'border-kid-green bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateQuestion(q.id, 'correctAnswer', oi)}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      q.correctAnswer === oi ? 'bg-kid-green text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {String.fromCharCode(65 + oi)}
                    </div>
                    <input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                      value={opt}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOption(q.id, oi, e.target.value)}
                      className="flex-1 text-sm bg-transparent focus:outline-none"
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    />
                    {q.correctAnswer === oi && <span className="text-[10px] font-bold text-kid-green">✓ Correct</span>}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          <motion.button
            className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 text-sm font-semibold hover:border-kid-purple hover:text-kid-purple transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.01 }}
            onClick={addQuestion}
          >
            <Plus className="w-4 h-4" /> Add Question
          </motion.button>

          <motion.button
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-kid-purple to-kid-pink text-white text-sm font-bold shadow-md flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-4 h-4" /> Save Quiz ({questions.length} questions)
          </motion.button>
        </motion.div>

        <motion.div variants={card} className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="font-fredoka text-gray-700 mb-3">Quiz Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Questions</span>
                <span className="font-bold text-gray-700">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Subject</span>
                <span className="font-bold text-gray-700">{subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Points</span>
                <span className="font-bold text-gray-700">{questions.length * 5}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="font-fredoka text-gray-700 mb-3">Saved Quizzes</h3>
            <div className="space-y-2">
              {savedQuizzes.map((q) => (
                <div key={q.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-gray-700">{q.title}</p>
                    <p className="text-xs text-gray-400">{q.subject} · {q.questions} Qs</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${q.status === 'published' ? 'bg-green-50 text-kid-green' : 'bg-orange-50 text-kid-orange'}`}>
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
