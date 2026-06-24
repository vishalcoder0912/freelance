import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedCharacter } from '../../../shared/components/AnimatedCharacter'
import { ArrowLeft, Music, Play, Pause, Volume2, ChevronRight, ChevronLeft } from 'lucide-react'

const rhymes = [
  {
    id: 'twinkle',
    title: 'Twinkle Twinkle Little Star',
    emoji: '⭐',
    color: 'from-yellow-400 to-orange-500',
    lyrics: [
      'Twinkle, twinkle, little star,',
      'How I wonder what you are!',
      'Up above the world so high,',
      'Like a diamond in the sky.',
      'Twinkle, twinkle, little star,',
      'How I wonder what you are!',
    ],
    characters: ['⭐', '🌟', '✨', '💫'],
  },
  {
    id: 'rainbow',
    title: 'Rainbow Song',
    emoji: '🌈',
    color: 'from-pink-400 to-purple-500',
    lyrics: [
      'Red and yellow and pink and green,',
      'Purple and orange and blue,',
      'I can sing a rainbow,',
      'Sing a rainbow,',
      'Sing a rainbow too!',
    ],
    characters: ['🔴', '🟡', '🩷', '🟢', '🟣', '🟠', '🔵'],
  },
  {
    id: 'old-macdonald',
    title: 'Old MacDonald',
    emoji: '🐄',
    color: 'from-green-400 to-teal-500',
    lyrics: [
      'Old MacDonald had a farm,',
      'E-I-E-I-O!',
      'And on his farm he had a cow,',
      'E-I-E-I-O!',
      'With a moo-moo here,',
      'And a moo-moo there,',
      'Here a moo, there a moo,',
      'Everywhere a moo-moo!',
    ],
    characters: ['🐄', '🐑', '🐔', '🐷', '🦆'],
  },
  {
    id: 'wheels',
    title: 'Wheels on the Bus',
    emoji: '🚌',
    color: 'from-blue-400 to-indigo-500',
    lyrics: [
      'The wheels on the bus go round and round,',
      'Round and round, round and round,',
      'The wheels on the bus go round and round,',
      'All through the town!',
    ],
    characters: ['🚌', '🛞', '🚦', '👶', '🚪'],
  },
  {
    id: 'itsy-bitsy',
    title: 'Itsy Bitsy Spider',
    emoji: '🕷️',
    color: 'from-purple-400 to-pink-500',
    lyrics: [
      'The itsy bitsy spider',
      'Climbed up the water spout,',
      'Down came the rain',
      'And washed the spider out!',
      'Out came the sun',
      'And dried up all the rain,',
      'And the itsy bitsy spider',
      'Climbed up the spout again!',
    ],
    characters: ['🕷️', '🌧️', '☀️', '💧'],
  },
  {
    id: 'mary',
    title: 'Mary Had a Little Lamb',
    emoji: '🐑',
    color: 'from-sky-400 to-blue-500',
    lyrics: [
      'Mary had a little lamb,',
      'Little lamb, little lamb,',
      'Mary had a little lamb,',
      'Its fleece was white as snow!',
      'And everywhere that Mary went,',
      'Mary went, Mary went,',
      'Everywhere that Mary went,',
      'The lamb was sure to go!',
    ],
    characters: ['🐑', '👧', '❄️', '🌸'],
  },
  {
    id: 'row',
    title: 'Row Row Row Your Boat',
    emoji: '🚣',
    color: 'from-cyan-400 to-teal-500',
    lyrics: [
      'Row, row, row your boat,',
      'Gently down the stream,',
      'Merrily, merrily, merrily, merrily,',
      'Life is but a dream!',
    ],
    characters: ['🚣', '🌊', '☀️', '🕊️'],
  },
  {
    id: 'baa',
    title: 'Baa Baa Black Sheep',
    emoji: '🐑',
    color: 'from-gray-400 to-gray-600',
    lyrics: [
      'Baa, baa, black sheep,',
      'Have you any wool?',
      'Yes sir, yes sir,',
      'Three bags full!',
      'One for the master,',
      'One for the dame,',
      'And one for the little boy',
      'Who lives down the lane!',
    ],
    characters: ['🐑', '🖤', '👜', '👦'],
  },
  {
    id: 'humpty',
    title: 'Humpty Dumpty',
    emoji: '🥚',
    color: 'from-amber-400 to-orange-500',
    lyrics: [
      'Humpty Dumpty sat on a wall,',
      'Humpty Dumpty had a great fall!',
      'All the king\'s horses',
      'And all the king\'s men,',
      'Couldn\'t put Humpty together again!',
    ],
    characters: ['🥚', '🧱', '👑', '🐴'],
  },
  {
    id: 'jack',
    title: 'Jack and Jill',
    emoji: '⛰️',
    color: 'from-green-400 to-emerald-500',
    lyrics: [
      'Jack and Jill went up the hill,',
      'To fetch a pail of water,',
      'Jack fell down and broke his crown,',
      'And Jill came tumbling after!',
    ],
    characters: ['⛰️', '🪣', '💧', '👦👧'],
  },
]

function RhymeCard({ rhyme, onClick, index }: { rhyme: typeof rhymes[0]; onClick: () => void; index: number }) {
  return (
    <motion.button
      onClick={onClick}
      className={`bg-gradient-to-br ${rhyme.color} rounded-2xl p-5 text-white shadow-lg text-center cursor-pointer`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      layout
    >
      <motion.span
        className="text-5xl block mb-3"
        animate={{ y: [0, -5, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {rhyme.emoji}
      </motion.span>
      <h3 className="font-bold font-fredoka text-sm leading-tight">{rhyme.title}</h3>
      <div className="flex justify-center gap-1 mt-3">
        {rhyme.characters.slice(0, 3).map((c, i) => (
          <span key={i} className="text-lg">{c}</span>
        ))}
      </div>
    </motion.button>
  )
}

export function RhymesZone() {
  const [selectedRhyme, setSelectedRhyme] = useState<typeof rhymes[0] | null>(null)
  const [playing, setPlaying] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)

  const handlePlayPause = () => {
    if (!playing) {
      setPlaying(true)
      if (currentLine >= (selectedRhyme?.lyrics.length || 0)) {
        setCurrentLine(0)
      }
    } else {
      setPlaying(false)
    }
  }

  const handlePrevLine = () => {
    setPlaying(false)
    setCurrentLine(prev => Math.max(0, prev - 1))
  }

  const handleNextLine = () => {
    if (selectedRhyme && currentLine < selectedRhyme.lyrics.length - 1) {
      setPlaying(false)
      setCurrentLine(prev => prev + 1)
    }
  }

  if (selectedRhyme && playing) {
    const timer = setTimeout(() => {
      if (currentLine < selectedRhyme.lyrics.length - 1) {
        setCurrentLine(prev => prev + 1)
      } else {
        setPlaying(false)
        setCurrentLine(0)
      }
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            {selectedRhyme && (
              <motion.button
                onClick={() => { setSelectedRhyme(null); setPlaying(false); setCurrentLine(0) }}
                className="p-2 rounded-xl bg-white shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
            )}
            <h1 className="text-2xl font-bold text-gray-800 font-fredoka">Rhymes Zone</h1>
          </div>
          <AnimatedCharacter name="Rhymes" emoji="🎵" size="sm" />
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedRhyme ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-6">
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <Music className="w-4 h-4 text-kid-purple" />
                  Tap a rhyme to sing along!
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {rhymes.map((rhyme, index) => (
                  <RhymeCard key={rhyme.id} rhyme={rhyme} onClick={() => { setSelectedRhyme(rhyme); setCurrentLine(0); setPlaying(false) }} index={index} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              <div className={`bg-gradient-to-br ${selectedRhyme.color} rounded-3xl p-8 text-white text-center shadow-xl mb-6`}>
                <div className="flex justify-center gap-2 mb-4">
                  {selectedRhyme.characters.map((c, i) => (
                    <motion.span
                      key={i}
                      className="text-4xl"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                    >
                      {c}
                    </motion.span>
                  ))}
                </div>

                <h2 className="text-2xl font-bold font-fredoka mb-4">{selectedRhyme.title}</h2>

                <motion.div
                  key={currentLine}
                  className="bg-white/20 rounded-xl p-4 min-h-[80px] flex items-center justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-lg font-medium italic">&ldquo;{selectedRhyme.lyrics[currentLine]}&rdquo;</p>
                </motion.div>

                <div className="flex items-center justify-center gap-4 mt-6">
                  <motion.button
                    onClick={handlePrevLine}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={currentLine === 0}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    onClick={handlePlayPause}
                    className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {playing ? (
                      <Pause className="w-7 h-7 text-kid-purple" />
                    ) : (
                      <Play className="w-7 h-7 text-kid-purple ml-1" />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleNextLine}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={currentLine >= selectedRhyme.lyrics.length - 1}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="flex justify-center gap-1 mt-4">
                  {selectedRhyme.lyrics.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${i === currentLine ? 'bg-white scale-125' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-md">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-kid-purple" />
                  Full Lyrics
                </h3>
                <div className="space-y-1">
                  {selectedRhyme.lyrics.map((line, i) => (
                    <motion.p
                      key={i}
                      className={`text-sm py-1 px-3 rounded-lg transition-all ${i === currentLine ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-600'}`}
                      animate={i === currentLine ? { scale: [1, 1.02, 1] } : {}}
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
