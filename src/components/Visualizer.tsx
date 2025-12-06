import {vec2, mat2d} from 'gl-matrix'
import { useLayoutEffect, useMemo, useState } from 'react'
import { transformToMatrix } from '../transform'
import { useSandboxStore } from '../store/sandboxStore'

interface TransformStep {
  matrix: mat2d,
  type: string,
  id: number
}

export function Visualizer() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  const {transforms, hoveredId, shape} = useSandboxStore()

  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const viewTransform = useMemo(() => {
    const mView = mat2d.create()
    mat2d.fromTranslation(mView, [windowWidth * 0.5, windowHeight * 0.5])
    return mView
  }, [windowWidth, windowHeight])

  const transformSteps: TransformStep[] = useMemo(() => {
    const steps: TransformStep[] = [{
      matrix: viewTransform,
      type: 'origin',
      id: -1
    }]

    for (const transform of transforms) {
      const tMatrix = transformToMatrix(transform)
      const m = mat2d.create()
      mat2d.multiply(m, steps[steps.length-1].matrix, tMatrix)
      steps.push({
        matrix: m,
        type: transform.type,
        id: transform.id
      })
    }

    return steps
  }, [transforms, viewTransform])

  const transformedShapes = useMemo(() => {
    return transformSteps.map(step => {
      return shape.map(vec => {
        const newVec = vec2.create()
        vec2.transformMat2d(newVec, vec, step.matrix)
        return newVec
      })
    })
  }, [transformSteps, shape])

  const focusId = hoveredId !== null ? hoveredId : transforms[transforms.length-1]?.id

  const gridLines = useMemo(() => {
    const lines: { x1: number, y1: number, x2: number, y2: number }[] = []
    const gridSpacing = 100 // pixels
    const centerX = windowWidth / 2
    const centerY = windowHeight / 2

    // Vertical lines
    for (let x = centerX % gridSpacing; x < windowWidth; x += gridSpacing) {
      lines.push({ x1: x, y1: 0, x2: x, y2: windowHeight })
    }

    // Horizontal lines
    for (let y = centerY % gridSpacing; y < windowHeight; y += gridSpacing) {
      lines.push({ x1: 0, y1: y, x2: windowWidth, y2: y })
    }

    return lines
  }, [windowWidth, windowHeight])

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%'
        }}
    >
      <svg
        width={'100%'}
        height={'100%'}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,

          // Use 1 -1 scale to put the origin on the bottom left.
          scale: '1 -1'
        }}
      >
        {/* Grid lines */}
        {gridLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(200, 200, 200, 0.3)"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        <line
          x1={windowWidth / 2}
          y1={0}
          x2={windowWidth / 2}
          y2={windowHeight}
          stroke="rgba(100, 100, 100, 0.5)"
          strokeWidth={2}
        />
        <line
          x1={0}
          y1={windowHeight / 2}
          x2={windowWidth}
          y2={windowHeight / 2}
          stroke="rgba(100, 100, 100, 0.5)"
          strokeWidth={2}
        />

        {transformedShapes.map((transformedShape, i) => {
          const focused = focusId === transformSteps[i].id
          return <polygon key={transforms[i-1]?.id ?? 'root'}
          points={transformedShape.flat().join(', ')}
          stroke={focused ? 'rgba(0,128,128,0.5)' : 'rgba(128,128,128,0.1)'}
          strokeWidth={6}
          fill={focused ? 'rgba(0,128,128,0.25)' : 'rgba(128,128,128,0.05)'}
        />
        })}
      </svg>
    </div>
    )
}
