import confetti from 'canvas-confetti'

export function useConfetti() {
  const fireConfetti = () => {
    const duration = 2000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#FF9800', '#E91E63', '#4A90D9', '#4CAF50', '#9C27B0']
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#FF9800', '#E91E63', '#4A90D9', '#4CAF50', '#9C27B0']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }

  const fireAchievement = () => {
    const scalar = 2
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
