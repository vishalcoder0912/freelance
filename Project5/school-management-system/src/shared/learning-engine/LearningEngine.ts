export type ClassLevel = 'kindergarten' | 'nursery' | 'lkg' | 'ukg'

export interface Activity {
  id: string
  title: string
  description: string
  type: 'game' | 'lesson' | 'quiz' | 'drawing' | 'story' | 'assessment'
  completed: boolean
  score: number
  stars: number
  path: string
}

export interface Module {
  id: string
  title: string
  icon: string
  activities: Activity[]
  color: string
}

export interface Progress {
  totalActivities: number
  completedActivities: number
  totalStars: number
  level: number
  badges: { id: string; title: string; emoji: string; description: string; unlocked: boolean }[]
}

export function calculateLevel(stars: number): number {
  if (stars >= 100) return 4
  if (stars >= 50) return 3
  if (stars >= 25) return 2
  if (stars >= 10) return 1
  return 0
}

export const classLevels: Record<ClassLevel, string> = {
  kindergarten: 'Kindergarten',
  nursery: 'Nursery',
  lkg: 'LKG',
  ukg: 'UKG',
}

export const kindergartenModules: Module[] = [
  {
    id: 'alphabet-world', title: 'Alphabet World', icon: '🔤', color: 'blue',
    activities: [
      { id: 'abc-match', title: 'ABC Match', description: 'Match letters with pictures', type: 'game', completed: false, score: 0, stars: 0, path: '/kindergarten/alphabet-world' },
      { id: 'abc-trace', title: 'Letter Tracing', description: 'Trace letters A-Z', type: 'lesson', completed: false, score: 0, stars: 0, path: '/kindergarten/alphabet-world' },
    ]
  },
  {
    id: 'number-world', title: 'Number World', icon: '🔢', color: 'green',
    activities: [
      { id: 'count-1', title: 'Counting Fun', description: 'Learn numbers 1-10', type: 'game', completed: false, score: 0, stars: 0, path: '/kindergarten/number-world' },
    ]
  },
  {
    id: 'color-learning', title: 'Color Learning', icon: '🎨', color: 'pink',
    activities: [
      { id: 'color-match', title: 'Color Match', description: 'Match colors', type: 'game', completed: false, score: 0, stars: 0, path: '/kindergarten/color-learning' },
    ]
  },
  {
    id: 'shape-learning', title: 'Shape Learning', icon: '⭐', color: 'orange',
    activities: [
      { id: 'shape-sorter', title: 'Shape Sorter', description: 'Sort shapes', type: 'game', completed: false, score: 0, stars: 0, path: '/kindergarten/shape-learning' },
    ]
  },
  {
    id: 'animal-kingdom', title: 'Animal Kingdom', icon: '🐾', color: 'lime',
    activities: [
      { id: 'animal-sounds', title: 'Animal Sounds', description: 'Learn animal sounds', type: 'game', completed: false, score: 0, stars: 0, path: '/kindergarten/animal-kingdom' },
    ]
  },
  {
    id: 'rhymes-zone', title: 'Rhymes Zone', icon: '🎵', color: 'purple',
    activities: [
      { id: 'rhymes-1', title: 'Nursery Rhymes', description: 'Sing along!', type: 'story', completed: false, score: 0, stars: 0, path: '/kindergarten/rhymes-zone' },
    ]
  },
  {
    id: 'drawing-board', title: 'Drawing Board', icon: '✏️', color: 'red',
    activities: [
      { id: 'draw-1', title: 'Free Draw', description: 'Draw anything!', type: 'drawing', completed: false, score: 0, stars: 0, path: '/kindergarten/drawing-board' },
    ]
  },
]

export const nurseryModules: Module[] = [
  { id: 'alphabets', title: 'Alphabets', icon: '📖', color: 'blue', activities: [
    { id: 'a-to-z', title: 'A-Z Learning', description: 'Learn all letters', type: 'lesson', completed: false, score: 0, stars: 0, path: '/nursery/alphabets' },
  ]},
  { id: 'numbers', title: 'Numbers 1-20', icon: '🔢', color: 'green', activities: [
    { id: 'num-1-20', title: 'Count to 20', description: 'Numbers recognition', type: 'game', completed: false, score: 0, stars: 0, path: '/nursery/numbers' },
  ]},
  { id: 'fruits', title: 'Fruits', icon: '🍎', color: 'red', activities: [
    { id: 'fruit-id', title: 'Fruit Identification', description: 'Learn fruits', type: 'lesson', completed: false, score: 0, stars: 0, path: '/nursery/fruits-learning' },
  ]},
  { id: 'vegetables', title: 'Vegetables', icon: '🥕', color: 'orange', activities: [
    { id: 'veg-id', title: 'Vegetable Identification', description: 'Learn vegetables', type: 'lesson', completed: false, score: 0, stars: 0, path: '/nursery/vegetables-learning' },
  ]},
  { id: 'transport', title: 'Transport', icon: '🚗', color: 'teal', activities: [
    { id: 'trans-id', title: 'Transport Learning', description: 'Learn vehicles', type: 'lesson', completed: false, score: 0, stars: 0, path: '/nursery/transport-learning' },
  ]},
  { id: 'stories', title: 'Story World', icon: '📚', color: 'purple', activities: [
    { id: 'story-1', title: 'Story Animations', description: 'Watch and learn', type: 'story', completed: false, score: 0, stars: 0, path: '/nursery/story-world' },
  ]},
  { id: 'memory', title: 'Memory Games', icon: '🧠', color: 'pink', activities: [
    { id: 'memory-1', title: 'Memory Challenge', description: 'Match cards', type: 'game', completed: false, score: 0, stars: 0, path: '/nursery/memory-games' },
  ]},
]

export const lkgModules: Module[] = [
  { id: 'phonics', title: 'Phonics', icon: '🔤', color: 'blue', activities: [
    { id: 'phonics-1', title: 'Phonics Fun', description: 'Learn letter sounds', type: 'game', completed: false, score: 0, stars: 0, path: '/lkg/phonics' },
  ]},
  { id: 'reading', title: 'Reading Zone', icon: '📖', color: 'green', activities: [
    { id: 'read-1', title: 'Read Words', description: 'Simple words reading', type: 'lesson', completed: false, score: 0, stars: 0, path: '/lkg/reading-zone' },
  ]},
  { id: 'counting', title: 'Counting', icon: '🔢', color: 'orange', activities: [
    { id: 'count-2', title: 'Counting Games', description: 'Count objects', type: 'game', completed: false, score: 0, stars: 0, path: '/lkg/counting' },
  ]},
  { id: 'handwriting', title: 'Handwriting', icon: '✍️', color: 'purple', activities: [
    { id: 'handwrite-1', title: 'Letter Tracing', description: 'Practice writing', type: 'lesson', completed: false, score: 0, stars: 0, path: '/lkg/handwriting' },
  ]},
  { id: 'math', title: 'Math Fun', icon: '➕', color: 'red', activities: [
    { id: 'math-1', title: 'Basic Addition', description: 'Learn addition', type: 'quiz', completed: false, score: 0, stars: 0, path: '/lkg/math-fun' },
  ]},
  { id: 'science', title: 'Science Fun', icon: '🔬', color: 'teal', activities: [
    { id: 'science-1', title: 'Science Activities', description: 'Explore science', type: 'lesson', completed: false, score: 0, stars: 0, path: '/lkg/science-fun' },
  ]},
  { id: 'assessments', title: 'Assessments', icon: '📝', color: 'yellow', activities: [
    { id: 'quiz-1', title: 'Animated Quizzes', description: 'Test your knowledge', type: 'assessment', completed: false, score: 0, stars: 0, path: '/lkg/assessments' },
  ]},
]

export const ukgModules: Module[] = [
  { id: 'english', title: 'English', icon: '📚', color: 'blue', activities: [
    { id: 'eng-1', title: 'Reading Practice', description: 'Read sentences', type: 'lesson', completed: false, score: 0, stars: 0, path: '/ukg/english' },
  ]},
  { id: 'mathematics', title: 'Mathematics', icon: '🔢', color: 'green', activities: [
    { id: 'math-2', title: 'Add & Subtract', description: 'Basic arithmetic', type: 'game', completed: false, score: 0, stars: 0, path: '/ukg/mathematics' },
  ]},
  { id: 'evs', title: 'Environmental Science', icon: '🌍', color: 'lime', activities: [
    { id: 'evs-1', title: 'Science Exploration', description: 'Learn about world', type: 'lesson', completed: false, score: 0, stars: 0, path: '/ukg/environmental-science' },
  ]},
  { id: 'gk', title: 'General Knowledge', icon: '💡', color: 'orange', activities: [
    { id: 'gk-1', title: 'GK Activities', description: 'Fun facts', type: 'quiz', completed: false, score: 0, stars: 0, path: '/ukg/general-knowledge' },
  ]},
  { id: 'creative', title: 'Creative Zone', icon: '🎨', color: 'pink', activities: [
    { id: 'creative-1', title: 'Creative Activities', description: 'Draw & create', type: 'drawing', completed: false, score: 0, stars: 0, path: '/ukg/creative-zone' },
  ]},
  { id: 'coding', title: 'Coding for Kids', icon: '💻', color: 'purple', activities: [
    { id: 'coding-1', title: 'Coding Puzzles', description: 'Learn logic', type: 'game', completed: false, score: 0, stars: 0, path: '/ukg/coding-for-kids' },
  ]},
  { id: 'exams', title: 'Interactive Exams', icon: '📋', color: 'red', activities: [
    { id: 'exam-1', title: 'Smart Assessments', description: 'Test your skills', type: 'assessment', completed: false, score: 0, stars: 0, path: '/ukg/exams' },
  ]},
]
