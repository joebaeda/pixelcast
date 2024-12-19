'use client'

import { useEffect, useRef, RefObject } from 'react'

interface PixelGridProps {
  gridSize: { width: number; height: number }
  selectedColor: string
  canvasRef: RefObject<HTMLCanvasElement>
}

const PixelGrid = ({ gridSize, selectedColor, canvasRef }: PixelGridProps) => {
  const isDrawing = useRef(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

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
    e.preventDefault()
    isDrawing.current = true
    const { x, y } = getCanvasCoordinates(e)
    drawPixel(x, y)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return
    const { x, y } = getCanvasCoordinates(e)
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

  const getCanvasCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  return (
    <div ref={wrapperRef} className="p-4 flex justify-center items-center touch-none">
      <canvas
        ref={canvasRef}
        className="block w-full max-w-[384px] aspect-square bg-gray-200 shadow-inner rounded-2xl touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: 'none' }}
      />
    </div>
  )
}

export default PixelGrid

