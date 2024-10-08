import {vec2, mat2d} from 'gl-matrix'
import { useLayoutEffect, useMemo, useState } from 'react'

interface VisualizerProps {
  shape: vec2[]
  transforms: mat2d[]
}

export function Visualizer({shape, transforms}: VisualizerProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

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

  const finalTransform = useMemo(() => {
    const m = mat2d.create()
    mat2d.copy(m, viewTransform)
    for (const transform of transforms) {
      mat2d.multiply(m, m, transform)
    }
    return m
  }, [transforms, viewTransform])

  const transformedShape = useMemo(() => {
    return shape.map(vec => {
      const newVec = vec2.create()
      vec2.transformMat2d(newVec, vec, finalTransform)
      return newVec
    })
  }, [finalTransform, shape])

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

        <polygon
          points={transformedShape.flat().join(', ')}
          stroke={'rgba(0,128,128,1)'}
          strokeWidth={6}
          fill={'rgba(0,128,128,0.5)'}
        />
      </svg>
    </div>
    )
}
