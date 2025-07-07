import {vec2, mat2d} from 'gl-matrix'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { transformToMatrix } from '../transform'
import { SandboxContext } from './SandboxContext'

interface VisualizerProps {
  shape: vec2[]
}

interface TransformStep {
  matrix: mat2d,
  type: string,
  id: number
}

export function Visualizer({shape}: VisualizerProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  const {transforms, hoveredId} = useContext(SandboxContext)

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
