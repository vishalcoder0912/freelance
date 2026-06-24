/*
 * useConfetti.ts - Custom hook for confetti celebration effects.
 * Wraps the canvas-confetti library with two presets: a general
 * celebration burst and a star-shaped achievement burst.
 */

import confetti from 'canvas-confetti'

/**
 * useConfetti - Returns functions to trigger confetti animations.
 *
 * @returns fireConfetti - Dual-sided burst animation for 2 seconds.
 * @returns fireAchievement - Single star-shaped burst for achievements.
 */
export function useConfetti() {
  /** Launches confetti from both sides of the screen for 2 seconds */
  const fireConfetti = () => {
    const duration = 2000
    const end = Date.now() + duration

    const frame = () => {
      // Left-side burst
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#FF9800', '#E91E63', '#4A90D9', '#4CAF50', '#9C27B0']
      })
      // Right-side burst
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#FF9800', '#E91E63', '#4A90D9', '#4CAF50', '#9C27B0']
      })

      // Continue animating until the duration elapses
      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }

  /** Fires star-shaped confetti for achievement unlocks */
  const fireAchievement = () => {
    const scalar = 2
    // Create a custom star shape from the emoji character
    const star = confetti.shapeFromText({ text: '\u2B50', scalar })

    confetti({
      shapes: [star],
      scalar,
      particleCount: 30,
      spread: 100,
      origin: { y: 0.4 }
    })
  }

  return { fireConfetti, fireAchievement }
}
