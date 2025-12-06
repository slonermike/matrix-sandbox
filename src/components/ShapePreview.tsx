import { type CSSProperties, useCallback, useEffect, useMemo, useRef } from "react"
import { type vec2 } from "gl-matrix"

interface ShapePreviewProps {
  shape: vec2[]
  size?: number
}

const containerStyle: CSSProperties = {
  position: 'relative',
  display: 'inline-block'
}

const canvasStyle: CSSProperties = {
  display: 'block',
  border: '1px solid black',
  backgroundColor: '#f0f0f0'
}

export function ShapePreview({ shape, size = 150 }: ShapePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const bounds = useMemo(() => {
    let minX = Infinity, maxX = -Infinity
    let minY = Infinity, maxY = -Infinity

    for (const point of shape) {
      minX = Math.min(minX, point[0])
      maxX = Math.max(maxX, point[0])
      minY = Math.min(minY, point[1])
      maxY = Math.max(maxY, point[1])
    }

    const shapeWidth = maxX - minX
    const shapeHeight = maxY - minY
    const shapeCenterX = (minX + maxX) / 2
    const shapeCenterY = (minY + maxY) / 2

    // Calculate scale to fit shape with 10% padding
    const padding = 0.9 // 90% of canvas, leaving 10% total padding
    const scaleX = (size * padding) / shapeWidth
    const scaleY = (size * padding) / shapeHeight
    const scale = Math.min(scaleX, scaleY)

    return { shapeCenterX, shapeCenterY, scale }
  }, [shape, size])

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { shapeCenterX, shapeCenterY, scale } = bounds

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Transform from shape coordinates to canvas coordinates
    const toCanvasX = (x: number) => size / 2 + (x - shapeCenterX) * scale
    const toCanvasY = (y: number) => size / 2 - (y - shapeCenterY) * scale

    // Draw grid
    ctx.strokeStyle = '#d0d0d0'
    ctx.lineWidth = 1

    const gridSpacing = 50 // pixels in shape space, will be scaled
    const gridSteps = 5

    for (let i = -gridSteps; i <= gridSteps; i++) {
      const shapeCoord = i * gridSpacing

      // Vertical lines
      const canvasX = toCanvasX(shapeCoord)
      if (canvasX >= 0 && canvasX <= size) {
        ctx.beginPath()
        ctx.moveTo(canvasX, 0)
        ctx.lineTo(canvasX, size)
        ctx.stroke()
      }

      // Horizontal lines
      const canvasY = toCanvasY(shapeCoord)
      if (canvasY >= 0 && canvasY <= size) {
        ctx.beginPath()
        ctx.moveTo(0, canvasY)
        ctx.lineTo(size, canvasY)
        ctx.stroke()
      }
    }

    // Draw axes
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    const centerX = toCanvasX(0)
    const centerY = toCanvasY(0)

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

    // Draw shape
    if (shape.length > 0) {
      ctx.fillStyle = 'rgba(0, 128, 128, 0.25)'
      ctx.strokeStyle = 'rgba(0, 128, 128, 0.5)'
      ctx.lineWidth = 2

      ctx.beginPath()
      const firstPoint = shape[0]
      ctx.moveTo(toCanvasX(firstPoint[0]), toCanvasY(firstPoint[1]))

      for (let i = 1; i < shape.length; i++) {
        const point = shape[i]
        ctx.lineTo(toCanvasX(point[0]), toCanvasY(point[1]))
      }

      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }
  }, [shape, size, bounds])

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
      />
    </div>
  )
}
