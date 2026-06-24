import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedCharacter } from '../../../shared/components/AnimatedCharacter'
import { ArrowLeft, Undo2, Trash2, Download, Pipette, Pen, Minus, Plus } from 'lucide-react'

const colorPalette = [
  { name: 'Red', hex: '#FF6B6B' },
  { name: 'Blue', hex: '#4A90D9' },
  { name: 'Green', hex: '#4CAF50' },
  { name: 'Yellow', hex: '#FFD93D' },
  { name: 'Purple', hex: '#9C27B0' },
  { name: 'Orange', hex: '#FF9800' },
  { name: 'Pink', hex: '#E91E63' },
  { name: 'Teal', hex: '#009688' },
  { name: 'Brown', hex: '#795548' },
  { name: 'Black', hex: '#333333' },
  { name: 'Gray', hex: '#999999' },
  { name: 'White', hex: '#FFFFFF' },
]

const brushSizes = [4, 8, 12, 18, 24]

interface Stroke {
  color: string
  size: number
  points: { x: number; y: number }[]
}

const stampEmojis = ['🌸', '⭐', '❤️', '🌈', '🦋', '🌞', '🎈', '🍎', '🐱', '🌟', '☁️', '💖']

export function DrawingBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState('#FF6B6B')
  const [brushSize, setBrushSize] = useState(12)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null)
  const [selectedTool, setSelectedTool] = useState<'brush' | 'stamp'>('brush')
  const [selectedStamp, setSelectedStamp] = useState('🌸')

  const getCanvasCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()

    if ('touches' in e) {
      const touch = e.touches[0]
      return {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height),
      }
    }

    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    }
  }, [])

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return
      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.size
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }
      ctx.stroke()
    })

    if (currentStroke && currentStroke.points.length > 1) {
      ctx.beginPath()
      ctx.strokeStyle = currentStroke.color
      ctx.lineWidth = currentStroke.size
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.moveTo(currentStroke.points[0].x, currentStroke.points[0].y)
      for (let i = 1; i < currentStroke.points.length; i++) {
        ctx.lineTo(currentStroke.points[i].x, currentStroke.points[i].y)
      }
      ctx.stroke()
    }
  }, [strokes, currentStroke])

  useEffect(() => {
    redrawCanvas()
  }, [redrawCanvas])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return
    canvas.width = parent.clientWidth
    canvas.height = Math.max(400, window.innerHeight * 0.55)
    redrawCanvas()
  }, [redrawCanvas])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const coords = getCanvasCoordinates(e)

    if (selectedTool === 'stamp') {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.font = `${brushSize * 3}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(selectedStamp, coords.x, coords.y)
      return
    }

    setIsDrawing(true)
    setCurrentStroke({
      color: currentColor,
      size: brushSize,
      points: [coords],
    })
  }, [getCanvasCoordinates, currentColor, brushSize, selectedTool, selectedStamp])

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing || !currentStroke) return
    const coords = getCanvasCoordinates(e)
    setCurrentStroke({
      ...currentStroke,
      points: [...currentStroke.points, coords],
    })
  }, [isDrawing, currentStroke, getCanvasCoordinates])

  const stopDrawing = useCallback(() => {
    if (currentStroke && currentStroke.points.length > 0) {
      setStrokes(prev => [...prev, currentStroke])
    }
    setIsDrawing(false)
    setCurrentStroke(null)
  }, [currentStroke])

  const clearCanvas = () => {
    setStrokes([])
    setCurrentStroke(null)
  }

  const undoLastStroke = () => {
    setStrokes(prev => prev.slice(0, -1))
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'my-drawing.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <motion.div className="flex items-center justify-between mb-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800 font-fredoka">Drawing Board</h1>
          </div>
          <AnimatedCharacter name="Draw" emoji="✏️" size="sm" />
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gradient-to-r from-red-100 via-orange-100 to-amber-100 p-3 flex flex-wrap items-center gap-2 border-b border-gray-200">
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
              <motion.button
                onClick={() => setSelectedTool('brush')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${selectedTool === 'brush' ? 'bg-kid-red text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                whileTap={{ scale: 0.95 }}
              >
                <Pen className="w-4 h-4 inline mr-1" />
                Brush
              </motion.button>
              <motion.button
                onClick={() => setSelectedTool('stamp')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${selectedTool === 'stamp' ? 'bg-kid-red text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                whileTap={{ scale: 0.95 }}
              >
                <Pipette className="w-4 h-4 inline mr-1" />
                Stamp
              </motion.button>
            </div>

            <div className="h-6 w-px bg-gray-300" />

            <div className="flex items-center gap-1">
              {colorPalette.map((c) => (
                <motion.button
                  key={c.hex}
                  onClick={() => setCurrentColor(c.hex)}
                  className={`w-6 h-6 rounded-full transition-all ${c.hex === currentColor ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : ''}`}
                  style={{ backgroundColor: c.hex, border: c.hex === '#FFFFFF' ? '1px solid #ddd' : 'none' }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  title={c.name}
                />
              ))}
            </div>

            <div className="h-6 w-px bg-gray-300" />

            <div className="flex items-center gap-1">
              {brushSizes.map((size) => (
                <motion.button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`p-1.5 rounded-lg transition-all ${size === brushSize ? 'bg-kid-red/20' : 'hover:bg-gray-100'}`}
                  whileTap={{ scale: 0.95 }}
                  title={`${size}px`}
                >
                  <div className="rounded-full bg-gray-600 mx-auto" style={{ width: Math.min(size, 20), height: Math.min(size, 20) }} />
                </motion.button>
              ))}
            </div>

            {selectedTool === 'stamp' && (
              <>
                <div className="h-6 w-px bg-gray-300" />
                <div className="flex items-center gap-1">
                  {stampEmojis.slice(0, 8).map((emoji) => (
                    <motion.button
                      key={emoji}
                      onClick={() => setSelectedStamp(emoji)}
                      className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${emoji === selectedStamp ? 'bg-kid-red/20 ring-1 ring-kid-red' : 'hover:bg-gray-100'}`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </>
            )}

            <div className="ml-auto flex items-center gap-1">
              <motion.button
                onClick={undoLastStroke}
                className="p-2 rounded-lg hover:bg-white/80 text-gray-600"
                whileTap={{ scale: 0.9 }}
                title="Undo"
              >
                <Undo2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={clearCanvas}
                className="p-2 rounded-lg hover:bg-white/80 text-red-500"
                whileTap={{ scale: 0.9 }}
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={downloadCanvas}
                className="p-2 rounded-lg hover:bg-white/80 text-kid-blue"
                whileTap={{ scale: 0.9 }}
                title="Download"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          <div className="relative bg-white" style={{ touchAction: 'none' }}>
            <canvas
              ref={canvasRef}
              className="w-full cursor-crosshair"
              style={{ minHeight: '400px' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {strokes.length === 0 && !currentStroke && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-gray-300 font-fredoka text-lg">Draw something fun! 🎨</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="mt-4 bg-white rounded-2xl p-4 shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 flex-wrap">
            <span>🎨 Pick a color</span>
            <span>✏️ Choose brush size</span>
            <span>🖱️ Draw with your mouse</span>
            <span>📱 Touch to draw on mobile</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
