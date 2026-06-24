import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const stories = [
  {
    id: 1,
    title: 'The Brave Little Car',
    emoji: '🚗',
    description: 'A little car learns to be brave on the road!',
    fullStory: 'Once upon a time, there was a little red car named Roary. Roary was scared of the big trucks on the road. One day, Roary helped a lost puppy find its way home. Roary realized that being brave means helping others!',
    color: 'from-red-400 to-orange-500',
    moral: 'Bravery comes from helping others!',
  },
  {
    id: 2,
    title: 'The Friendly Apple Tree',
    emoji: '🍎',
    description: 'An apple tree makes new friends in the garden.',
    fullStory: 'In a sunny garden, an apple tree named Andy felt lonely. All the other trees had birds and squirrels playing on them. Andy wished for friends too. Soon, a little girl planted flowers around Andy, and all the garden friends came to play!',
    color: 'from-green-400 to-emerald-500',
    moral: 'Friendship grows when you share!',
  },
  {
    id: 3,
    title: 'Sunny the Sunflower',
    emoji: '🌻',
    description: 'A sunflower learns to always look on the bright side.',
    fullStory: 'Sunny was a sunflower who always looked down. The other flowers told her to look up at the sun! When Sunny lifted her head, she saw the beautiful blue sky, flying butterflies, and smiling children. Sunny learned that looking up makes everything brighter!',
    color: 'from-yellow-400 to-amber-500',
    moral: 'Always look on the bright side!',
  },
  {
    id: 4,
    title: 'Buzzy the Bee',
    emoji: '🐝',
    description: 'A busy bee discovers the joy of teamwork.',
    fullStory: 'Buzzy the bee tried to make honey all by herself, but it was too hard. She asked her bee friends for help. Together, they collected nectar from many flowers and made the sweetest honey ever! Buzzy learned that teamwork makes everything easier and more fun!',
    color: 'from-yellow-400 to-orange-500',
    moral: 'Teamwork makes dreams work!',
  },
  {
    id: 5,
    title: 'Rainbow Rabbit',
    emoji: '🌈',
    description: 'A rabbit discovers the magic of colors.',
    fullStory: 'Rainbow was a white rabbit who wished to be colorful. She hopped through a magical forest where she met a red fox, a blue bird, and a yellow butterfly. They each shared their color with her, and Rainbow became the most colorful bunny in the forest!',
    color: 'from-purple-400 to-pink-500',
    moral: 'Everyone has something special to share!',
  },
  {
    id: 6,
    title: 'The Kind Whale',
    emoji: '🐋',
    description: 'A big whale shows that kindness matters most.',
    fullStory: 'Wally the whale was the biggest creature in the ocean. The little fish were scared of him. One day, Wally saved a tiny seahorse from a storm. After that, all the sea creatures became his friends. Wally learned that kindness is what makes you truly big!',
    color: 'from-blue-400 to-cyan-500',
    moral: 'Kindness makes you truly big!',
  },
]

export function StoryWorld() {
  const [selectedStory, setSelectedStory] = useState<typeof stories[0] | null>(null)
  const [showFull, setShowFull] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 md:p-6">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold font-fredoka text-gray-800">
          📚 Story World
        </h1>
        <p className="text-gray-500 mt-2">Magical stories for little learners!</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
      >
        {stories.map((story) => (
          <motion.button
            key={story.id}
            onClick={() => { setSelectedStory(story); setShowFull(false) }}
            className={`bg-gradient-to-br ${story.color} rounded-2xl p-6 shadow-lg cursor-pointer text-white text-left`}
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-5xl">{story.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold font-fredoka truncate">{story.title}</h3>
              </div>
            </div>
            <p className="text-sm text-white/80">{story.description}</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-white/60">
              <span>✨ Read more</span>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedStory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  className="text-7xl mb-4 inline-block"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {selectedStory.emoji}
                </motion.div>
                <h2 className="text-2xl font-bold font-fredoka text-gray-800">{selectedStory.title}</h2>
              </div>

              {!showFull ? (
                <div className="mt-6 text-center">
                  <p className="text-gray-600">{selectedStory.description}</p>
                  <motion.button
                    onClick={() => setShowFull(true)}
                    className="mt-4 bg-gradient-to-r from-kid-purple to-kid-pink text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📖 Read the Story
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedStory.fullStory}
                    </p>
                  </div>
                  <div className="mt-4 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <p className="text-sm font-bold text-yellow-700">
                      🌟 Moral: {selectedStory.moral}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3 mt-6 justify-center">
                {showFull && (
                  <motion.button
                    onClick={() => setShowFull(false)}
                    className="bg-gray-100 text-gray-600 px-6 py-3 rounded-full font-bold shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🔄 Back
                  </motion.button>
                )}
                <motion.button
                  onClick={() => setSelectedStory(null)}
                  className="bg-gradient-to-r from-kid-purple to-kid-pink text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close ✨
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
