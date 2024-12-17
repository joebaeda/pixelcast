'use client'

import { useEffect, useRef, RefObject } from 'react'

interface PixelGridProps {
  gridSize: { width: number; height: number }
  selectedColor: string
  canvasRef: RefObject<HTMLCanvasElement>
}

const PixelGrid = ({ gridSize, selectedColor, canvasRef }: PixelGridProps) => {
  const isDrawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pixelSize = 8 // 384 / 48 = 8
    canvas.width = gridSize.width * pixelSize
    canvas.height = gridSize.height * pixelSize

    // Restore saved pixel art
    const savedArt = localStorage.getItem('pixelArt')
    if (savedArt) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
      img.src = savedArt
    }
  }, [gridSize, canvasRef])

  const drawPixel = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pixelSize = 8
    const pixelX = Math.floor(x / pixelSize) * pixelSize
    const pixelY = Math.floor(y / pixelSize) * pixelSize

    ctx.fillStyle = selectedColor
    ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize)
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault() // Prevent default gestures like scrolling
    isDrawing.current = true
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    drawPixel(x, y)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    drawPixel(x, y)
  }

  const handlePointerUp = () => {
    isDrawing.current = false
    // Save the current state to localStorage
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png')
      localStorage.setItem('pixelArt', dataUrl)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex items-center justify-center p-4">
        <canvas
          ref={canvasRef}
          className="w-full block bg-gray-200 shadow-inner touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
    </div>
  )
}

export default PixelGrid
