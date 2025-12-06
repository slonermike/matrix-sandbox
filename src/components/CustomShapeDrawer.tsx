import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react"
import { type vec2 } from "gl-matrix"
import { useSandboxStore } from "../store/sandboxStore"

interface CustomShapeDrawerProps {
  size?: number
}

const containerStyle: CSSProperties = {
  position: 'relative',
  display: 'inline-block'
}

const canvasStyle: CSSProperties = {
  display: 'block',
  border: '1px solid black',
  backgroundColor: '#f0f0f0',
  cursor: 'crosshair'
}

const instructionStyle: CSSProperties = {
  marginTop: '4px',
  fontSize: '12px',
  textAlign: 'center',
  fontStyle: 'italic'
}

export function CustomShapeDrawer({ size = 150 }: CustomShapeDrawerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawingPoints, setDrawingPoints] = useState<vec2[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const shape = useSandboxStore(state => state.shape)
  const setShape = useSandboxStore(state => state.setShape)

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Draw grid
    ctx.strokeStyle = '#d0d0d0'
    ctx.lineWidth = 1

    const gridSpacing = 25
    for (let x = 0; x <= size; x += gridSpacing) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, size)
      ctx.stroke()
    }
    for (let y = 0; y <= size; y += gridSpacing) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(size, y)
      ctx.stroke()
    }

    // Draw axes
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    const centerX = size / 2
    const centerY = size / 2

    // X axis
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(size, centerY)
    ctx.stroke()

    // Y axis
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, size)
    ctx.stroke()

    // Draw the current shape or drawing path
    const pointsToDraw = isDrawing ? drawingPoints : shape
    if (pointsToDraw.length > 0) {
      ctx.strokeStyle = 'rgba(0, 128, 128, 0.8)'
      ctx.fillStyle = 'rgba(0, 128, 128, 0.25)'
      ctx.lineWidth = 2

      ctx.beginPath()
      const firstPoint = pointsToDraw[0]
      ctx.moveTo(centerX + firstPoint[0], centerY - firstPoint[1])

      for (let i = 1; i < pointsToDraw.length; i++) {
        const point = pointsToDraw[i]
        ctx.lineTo(centerX + point[0], centerY - point[1])
      }

      if (pointsToDraw.length > 2) {
        ctx.closePath()
        ctx.fill()
      }
      ctx.stroke()
    }
  }, [drawingPoints, isDrawing, shape, size])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top
    const centerX = size / 2
    const centerY = size / 2
    const x = canvasX - centerX
    const y = -(canvasY - centerY)

    setIsDrawing(true)
    setDrawingPoints([[x, y]])
  }, [size])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top
    const centerX = size / 2
    const centerY = size / 2
    const x = canvasX - centerX
    const y = -(canvasY - centerY)

    setDrawingPoints(points => [...points, [x, y]])
  }, [isDrawing, size])

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return
    setIsDrawing(false)

    if (drawingPoints.length > 2) {
      setShape(drawingPoints)
    }
  }, [isDrawing, drawingPoints, setShape])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  return (
    <div style={containerStyle}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={canvasStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div style={instructionStyle}>
        {drawingPoints.length === 0 ? 'Click and drag to draw' : isDrawing ? 'Drawing...' : 'Shape created!'}
      </div>
    </div>
  )
}
