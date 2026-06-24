import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimalSounds } from '../../../shared/games/animal-sounds/AnimalSounds'
import { GameCard } from '../../../shared/components/GameCard'
import { AnimatedCharacter } from '../../../shared/components/AnimatedCharacter'
import { ArrowLeft, PawPrint, Music, Globe } from 'lucide-react'

const animals = [
  { name: 'Dog', emoji: '🐶', sound: 'Woof! Woof!', habitat: '🏠', fact: 'Dogs are called man\'s best friend!' },
  { name: 'Cat', emoji: '🐱', sound: 'Meow! Meow!', habitat: '🏠', fact: 'Cats can jump 6 times their length!' },
  { name: 'Cow', emoji: '🐄', sound: 'Moo! Moo!', habitat: '🌾', fact: 'Cows have best friends!' },
  { name: 'Lion', emoji: '🦁', sound: 'Roar!', habitat: '🌿', fact: 'Lions are the kings of the jungle!' },
  { name: 'Duck', emoji: '🦆', sound: 'Quack! Quack!', habitat: '🌊', fact: 'Ducks have waterproof feathers!' },
  { name: 'Sheep', emoji: '🐑', sound: 'Baa! Baa!', habitat: '🌾', fact: 'Sheep have excellent memories!' },
  { name: 'Horse', emoji: '🐴', sound: 'Neigh!', habitat: '🌾', fact: 'Horses can sleep standing up!' },
  { name: 'Chicken', emoji: '🐔', sound: 'Cluck! Cluck!', habitat: '🏠', fact: 'Chickens have over 200 sounds!' },
  { name: 'Frog', emoji: '🐸', sound: 'Ribbit! Ribbit!', habitat: '🌊', fact: 'Frogs can jump 20 times their body!' },
  { name: 'Elephant', emoji: '🐘', sound: 'Toot!', habitat: '🌿', fact: 'Elephants are the biggest land animals!' },
  { name: 'Monkey', emoji: '🐵', sound: 'Ooh Ooh Ah Ah!', habitat: '🌴', fact: 'Monkeys are very smart!' },
  { name: 'Bear', emoji: '🐻', sound: 'Grrr!', habitat: '🌲', fact: 'Bears love honey!' },
  { name: 'Penguin', emoji: '🐧', sound: 'Honk!', habitat: '❄️', fact: 'Penguins are great swimmers!' },
  { name: 'Owl', emoji: '🦉', sound: 'Hoot! Hoot!', habitat: '🌲', fact: 'Owls can turn their heads all around!' },
  { name: 'Rabbit', emoji: '🐰', sound: 'Squeak!', habitat: '🌿', fact: 'Rabbits have over 28 teeth!' },
  { name: 'Pig', emoji: '🐷', sound: 'Oink! Oink!', habitat: '🏠', fact: 'Pigs are very clean animals!' },
]

type View = 'menu' | 'game' | 'explore'

function AnimalCard({ animal, onClick }: { animal: typeof animals[0]; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg text-center cursor-pointer"
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <motion.span
        className="text-5xl block mb-2"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {animal.emoji}
      </motion.span>
      <p className="text-sm font-bold font-fredoka text-gray-700">{animal.name}</p>
      <p className="text-xs text-gray-400 mt-1">{animal.sound}</p>
    </motion.button>
  )
}

export function AnimalKingdom() {
  const [view, setView] = useState<View>('menu')
  const [selectedAnimal, setSelectedAnimal] = useState<typeof animals[0] | null>(null)

  const habitats = [...new Set(animals.map(a => a.habitat))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            {view !== 'menu' && (
              <motion.button
                onClick={() => setView('menu')}
                className="p-2 rounded-xl bg-white shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
            )}
            <h1 className="text-2xl font-bold text-gray-800 font-fredoka">Animal Kingdom</h1>
          </div>
          <AnimatedCharacter name="Animals" emoji="🐾" size="sm" />
        </motion.div>

        <AnimatePresence mode="wait">
          {view === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <GameCard
                  title="Animal Sounds"
                  icon={<span className="text-4xl">🎯</span>}
                  color="lime"
                  description="Match the sounds!"
                  onClick={() => setView('game')}
                />
                <GameCard
                  title="Animal Explorer"
                  icon={<span className="text-4xl">🔍</span>}
                  color="green"
                  description="Explore all animals"
                  onClick={() => setView('explore')}
                />
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-md">
                <h2 className="text-lg font-bold text-gray-800 font-fredoka mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-kid-lime" />
                  Animals by Habitat
                </h2>
                {habitats.map((habitat) => (
                  <div key={habitat} className="mb-4">
                    <h3 className="font-bold text-gray-600 text-sm mb-2 flex items-center gap-1">
                      <span className="text-lg">{habitat}</span>
                      {habitat === '🏠' ? 'Domestic' : habitat === '🌾' ? 'Farm' : habitat === '🌿' ? 'Wild' : habitat === '🌊' ? 'Water' : habitat === '🌴' ? 'Jungle' : habitat === '🌲' ? 'Forest' : habitat === '❄️' ? 'Cold' : ''}
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                      {animals.filter(a => a.habitat === habitat).map((animal) => (
                        <motion.button
                          key={animal.name}
                          onClick={() => { setSelectedAnimal(animal); setView('explore') }}
                          className="bg-white rounded-xl p-2 text-center shadow-sm hover:shadow"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-2xl">{animal.emoji}</span>
                          <p className="text-[10px] font-bold text-gray-600 truncate">{animal.name}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <h2 className="text-xl font-bold text-gray-800 font-fredoka mb-4 text-center">Animal Sounds Game</h2>
              <AnimalSounds />
            </motion.div>
          )}

          {view === 'explore' && selectedAnimal && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-md text-center"
            >
              <AnimatedCharacter name={selectedAnimal.name} emoji={selectedAnimal.emoji} size="lg" />

              <motion.div
                className="text-8xl my-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {selectedAnimal.emoji}
              </motion.div>

              <p className="text-2xl font-bold font-fredoka text-gray-800 mb-2">{selectedAnimal.name}</p>

              <div className="space-y-3 max-w-md mx-auto">
                <div className="bg-gradient-to-r from-green-50 to-lime-50 rounded-xl p-4 flex items-center gap-3 justify-center">
                  <Music className="w-5 h-5 text-kid-green" />
                  <span className="font-bold text-gray-700">Sound: <span className="text-kid-orange italic">&ldquo;{selectedAnimal.sound}&rdquo;</span></span>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 flex items-center gap-3 justify-center">
                  <PawPrint className="w-5 h-5 text-kid-blue" />
                  <span className="font-bold text-gray-700">Habitat: <span className="text-lg">{selectedAnimal.habitat}</span></span>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 flex items-center gap-3 justify-center">
                  <Globe className="w-5 h-5 text-kid-purple" />
                  <span className="font-bold text-gray-700 text-sm">{selectedAnimal.fact}</span>
                </div>
              </div>

              <div className="flex gap-2 justify-center mt-6 flex-wrap">
                {animals.slice(0, 10).map(a => (
                  <motion.button
                    key={a.name}
                    onClick={() => setSelectedAnimal(a)}
                    className={`w-12 h-12 rounded-xl text-2xl transition-all ${a.name === selectedAnimal.name ? 'ring-2 ring-offset-2 ring-green-400 scale-110 shadow-md bg-green-50' : 'opacity-60 hover:opacity-100 bg-gray-50'}`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    title={a.name}
                  >
                    {a.emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
