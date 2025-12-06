import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react"
import { type vec2 } from "gl-matrix"

interface Vec2InputProps {
  value: vec2
  scale: number
  onChange: (value: vec2) => void
  size?: number
}

const containerStyle: CSSProperties = {
  position: 'relative',
  display: 'inline-block',
  userSelect: 'none',
  touchAction: 'none'
}

const canvasStyle: CSSProperties = {
  display: 'block',
  cursor: 'crosshair',
  border: '1px solid black',
  backgroundColor: '#f0f0f0'
}

const valueDisplayStyle: CSSProperties = {
  marginTop: '4px',
  fontSize: '12px',
  fontFamily: 'monospace',
  textAlign: 'center'
}

export function Vec2Input({ value, scale, onChange, size = 150 }: Vec2InputProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const coordsToCanvas = useCallback((x: number, y: number): [number, number] => {
    const centerX = size / 2
    const centerY = size / 2
    const pixelsPerUnit = size / (2 * scale)
    return [
      centerX + x * pixelsPerUnit,
      centerY - y * pixelsPerUnit
    ]
  }, [size, scale])

  const canvasToCoords = useCallback((canvasX: number, canvasY: number): vec2 => {
    const centerX = size / 2
    const centerY = size / 2
    const pixelsPerUnit = size / (2 * scale)
    return [
      (canvasX - centerX) / pixelsPerUnit,
      -(canvasY - centerY) / pixelsPerUnit
    ]
  }, [size, scale])

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

    const gridSteps = 5
    for (let i = -gridSteps; i <= gridSteps; i++) {
      const gridValue = (i / gridSteps) * scale
      const [x] = coordsToCanvas(gridValue, 0)
      const [, _y] = coordsToCanvas(0, gridValue)

      // Vertical lines
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, size)
      ctx.stroke()

      // Horizontal lines
      ctx.beginPath()
      ctx.moveTo(0, _y)
      ctx.lineTo(size, _y)
      ctx.stroke()
    }

    // Draw axes
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    const [centerX, centerY] = coordsToCanvas(0, 0)

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

    // Draw nub
    const [nubX, nubY] = coordsToCanvas(value[0], value[1])
    ctx.fillStyle = '#ff0000'
    ctx.beginPath()
    ctx.arc(nubX, nubY, 6, 0, 2 * Math.PI)
    ctx.fill()

    // Draw crosshair on nub
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(nubX - 4, nubY)
    ctx.lineTo(nubX + 4, nubY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(nubX, nubY - 4)
    ctx.lineTo(nubX, nubY + 4)
    ctx.stroke()
  }, [value, scale, size, coordsToCanvas])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.stopPropagation()
    setIsDragging(true)
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top
    const newValue = canvasToCoords(canvasX, canvasY)
    onChange(newValue)
  }, [canvasToCoords, onChange])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return

    e.stopPropagation()
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top
    const newValue = canvasToCoords(canvasX, canvasY)
    onChange(newValue)
  }, [isDragging, canvasToCoords, onChange])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Draw on mount and whenever dependencies change
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
      <div style={valueDisplayStyle}>
        ({value[0].toFixed(2)}, {value[1].toFixed(2)})
      </div>
    </div>
  )
}
