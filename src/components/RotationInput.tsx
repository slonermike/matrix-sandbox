import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react"

interface RotationInputProps {
  value: number // radians
  onChange: (value: number) => void
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

export function RotationInput({ value, onChange, size = 150 }: RotationInputProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const angleToCanvas = useCallback((radians: number): [number, number] => {
    const centerX = size / 2
    const centerY = size / 2
    const radius = (size / 2) * 0.7 // 70% of radius for the handle
    // Negate radians to make counter-clockwise positive (matching the main view)
    return [
      centerX + Math.cos(-radians - Math.PI / 2) * radius,
      centerY + Math.sin(-radians - Math.PI / 2) * radius
    ]
  }, [size])

  const canvasToAngle = useCallback((canvasX: number, canvasY: number): number => {
    const centerX = size / 2
    const centerY = size / 2
    const dx = canvasX - centerX
    const dy = canvasY - centerY
    // Negate to make counter-clockwise positive (matching the main view)
    return -(Math.atan2(dy, dx) + Math.PI / 2)
  }, [size])

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = size / 2
    const centerY = size / 2

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Draw circle background
    ctx.strokeStyle = '#d0d0d0'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, (size / 2) * 0.7, 0, 2 * Math.PI)
    ctx.stroke()

    // Draw angle markers (0, 90, 180, 270 degrees)
    ctx.strokeStyle = '#888888'
    ctx.lineWidth = 1
    const markerRadius = (size / 2) * 0.7
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2
      const x1 = centerX + Math.cos(angle) * (markerRadius - 5)
      const y1 = centerY + Math.sin(angle) * (markerRadius - 5)
      const x2 = centerX + Math.cos(angle) * (markerRadius + 5)
      const y2 = centerY + Math.sin(angle) * (markerRadius + 5)
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    // Draw center point
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI)
    ctx.fill()

    // Draw line from center to handle
    const [handleX, handleY] = angleToCanvas(value)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(handleX, handleY)
    ctx.stroke()

    // Draw handle
    ctx.fillStyle = '#ff0000'
    ctx.beginPath()
    ctx.arc(handleX, handleY, 8, 0, 2 * Math.PI)
    ctx.fill()

    // Draw crosshair on handle
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(handleX - 5, handleY)
    ctx.lineTo(handleX + 5, handleY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(handleX, handleY - 5)
    ctx.lineTo(handleX, handleY + 5)
    ctx.stroke()
  }, [value, size, angleToCanvas])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.stopPropagation()
    setIsDragging(true)
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top
    const newValue = canvasToAngle(canvasX, canvasY)
    onChange(newValue)
  }, [canvasToAngle, onChange])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return

    e.stopPropagation()
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top
    const newValue = canvasToAngle(canvasX, canvasY)
    onChange(newValue)
  }, [isDragging, canvasToAngle, onChange])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Draw on mount and whenever dependencies change
  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  const degrees = (value * 180) / Math.PI

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
        {degrees.toFixed(1)}°
      </div>
    </div>
  )
}
