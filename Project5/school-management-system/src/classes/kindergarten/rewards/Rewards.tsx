import { useState } from 'react'
import { motion } from 'framer-motion'
import { RewardSystem } from '../../../shared/games/reward-system/RewardSystem'
import { AnimatedCharacter } from '../../../shared/components/AnimatedCharacter'
import { ProgressBar } from '../../../shared/components/ProgressBar'
import { AchievementBadge } from '../../../shared/components/AchievementBadge'
import { kindergartenModules, calculateLevel } from '../../../shared/learning-engine/LearningEngine'
import { Trophy, Star, Award, Sparkles, Gift, Target, TrendingUp } from 'lucide-react'

const allBadges = [
  { id: 'first-step', title: 'First Step', emoji: '👶', description: 'Complete your first activity', unlocked: true },
  { id: 'abc-star', title: 'ABC Star', emoji: '🔤', description: 'Complete Alphabet World', unlocked: true },
  { id: 'number-ninja', title: 'Number Ninja', emoji: '🔢', description: 'Complete Number World', unlocked: true },
  { id: 'color-artist', title: 'Color Artist', emoji: '🎨', description: 'Complete Color Learning', unlocked: true },
  { id: 'shape-master', title: 'Shape Master', emoji: '⭐', description: 'Complete Shape Learning', unlocked: false },
  { id: 'animal-friend', title: 'Animal Friend', emoji: '🐾', description: 'Complete Animal Kingdom', unlocked: false },
  { id: 'rhyme-time', title: 'Rhyme Time', emoji: '🎵', description: 'Complete Rhymes Zone', unlocked: false },
  { id: 'little-artist', title: 'Little Artist', emoji: '✏️', description: 'Create a drawing', unlocked: false },
  { id: 'star-collector', title: 'Star Collector', emoji: '⭐', description: 'Collect 10 stars', unlocked: true },
  { id: 'bronze-learner', title: 'Bronze Learner', emoji: '🥉', description: 'Reach Bronze level', unlocked: true },
  { id: 'silver-learner', title: 'Silver Learner', emoji: '🥈', description: 'Reach Silver level', unlocked: false },
  { id: 'gold-learner', title: 'Gold Learner', emoji: '🥇', description: 'Reach Gold level', unlocked: false },
  { id: 'perfect-score', title: 'Perfect Score', emoji: '💯', description: 'Get 3 stars in any activity', unlocked: false },
  { id: 'speed-star', title: 'Speed Star', emoji: '⚡', description: 'Complete 5 activities in a day', unlocked: false },
  { id: 'super-fan', title: 'Super Fan', emoji: '🌟', description: 'Complete all activities', unlocked: false },
]

const upcomingRewards = [
  { stars: 5, title: 'Bronze Badge', emoji: '🥉', unlocked: true },
  { stars: 15, title: 'Star Badge', emoji: '⭐', unlocked: true },
  { stars: 30, title: 'Silver Badge', emoji: '🥈', unlocked: false },
  { stars: 50, title: 'Gold Badge', emoji: '🥇', unlocked: false },
  { stars: 75, title: 'Platinum Badge', emoji: '💎', unlocked: false },
  { stars: 100, title: 'Diamond Crown', emoji: '👑', unlocked: false },
]

export function Rewards() {
  const totalActivities = kindergartenModules.reduce((sum, m) => sum + m.activities.length, 0)
  const completedActivities = kindergartenModules.reduce((sum, m) => sum + m.activities.filter(a => a.completed).length, 0)
  const totalStars = kindergartenModules.reduce((sum, m) => sum + m.activities.reduce((s, a) => s + a.stars, 0), 0)
  const level = calculateLevel(totalStars)

  const unlockedBadges = allBadges.filter(b => b.unlocked).length
  const nextBadge = allBadges.find(b => !b.unlocked)

  const levelNames = ['Beginner', 'Bronze', 'Silver', 'Gold', 'Platinum']
  const levelEmojis = ['🌱', '⭐', '🌙', '👑', '💎']

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800 font-fredoka">Rewards</h1>
          </div>
          <AnimatedCharacter name="Rewards" emoji="🏆" size="sm" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className="bg-gradient-to-r from-kid-yellow via-kid-orange to-kid-pink rounded-2xl p-6 text-white shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-fredoka">Your Achievements</h2>
                  <p className="text-white/80 text-sm mt-1">Keep learning to unlock more!</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-3xl">{levelEmojis[level]}</span>
                  </div>
                  <p className="font-bold font-fredoka text-lg">{levelNames[level]} Level</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <Star className="w-5 h-5 mx-auto mb-1 fill-yellow-300 text-yellow-300" />
                  <p className="text-xl font-bold font-fredoka">{totalStars}</p>
                  <p className="text-[10px] text-white/70">Stars</p>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <Award className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-xl font-bold font-fredoka">{unlockedBadges}/{allBadges.length}</p>
                  <p className="text-[10px] text-white/70">Badges</p>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-xl font-bold font-fredoka">{completedActivities}/{totalActivities}</p>
                  <p className="text-[10px] text-white/70">Done</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-5 shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-lg font-bold text-gray-800 font-fredoka mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-kid-yellow" />
                All Badges
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allBadges.map((badge) => (
                  <AchievementBadge key={badge.id} {...badge} />
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-2xl p-5 shadow-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="text-lg font-bold text-gray-800 font-fredoka mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-kid-orange" />
                Upcoming Rewards
              </h2>
              <div className="space-y-3">
                {upcomingRewards.map((reward) => (
                  <motion.div
                    key={reward.stars}
                    className={`p-3 rounded-xl ${reward.unlocked ? 'bg-green-50' : 'bg-gray-50'} flex items-center gap-3`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className={`text-2xl ${reward.unlocked ? '' : 'grayscale opacity-50'}`}>
                      {reward.emoji}
                    </span>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${reward.unlocked ? 'text-green-700' : 'text-gray-500'}`}>
                        {reward.title}
                      </p>
                      <p className="text-xs text-gray-400">{reward.stars} stars needed</p>
                    </div>
                    {reward.unlocked && (
                      <Sparkles className="w-4 h-4 text-green-500" />
                    )}
                    {!reward.unlocked && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-gray-300" />
                        <span className="text-xs text-gray-400">{reward.stars}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-5 shadow-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-bold text-gray-800 font-fredoka mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-kid-purple" />
                Next Goal
              </h2>
              {nextBadge ? (
                <div>
                  <AchievementBadge
                    title={nextBadge.title}
                    emoji={nextBadge.emoji}
                    description={nextBadge.description}
                    unlocked={false}
                  />
                  <p className="text-xs text-gray-400 mt-2">Keep going to unlock this badge!</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="text-4xl block mb-2">🎉</span>
                  <p className="text-sm font-bold text-gray-700">You unlocked every badge!</p>
                  <p className="text-xs text-gray-400">You are a superstar!</p>
                </div>
              )}
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-kid-purple to-kid-pink rounded-2xl p-5 text-white shadow-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h3 className="font-bold font-fredoka mb-2">Keep Learning!</h3>
              <p className="text-sm text-white/80 mb-3">Complete more activities to earn stars and unlock badges.</p>
              <ProgressBar
                value={totalStars}
                max={100}
                color="bg-white"
                showPercent
                size="sm"
              />
              <p className="text-xs text-white/60 mt-2">{100 - totalStars} stars until next level</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
