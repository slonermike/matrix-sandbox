import {mat2d, vec2} from 'gl-matrix'
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';

const gizmoPositions = [[0,0, 100,0], [0,0, 0,100]]
const gizmoColors = ['blue', 'red']

const App = () => {
  const [translation, setTranslation] = useState<vec2>([0, 0])
  const [rotation, setRotation] = useState(0)
  const [scale] = useState<vec2>([250, 100])
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  const [viewTransform, setViewTransform] = useState<mat2d>(mat2d.create())

  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const mView = mat2d.create()
    mat2d.fromTranslation(mView, [windowWidth * 0.5, windowHeight * 0.5])
    setViewTransform(mView)
  }, [windowWidth, windowHeight])

  const rootPositions = useMemo(() => [0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5], [])

  const transformPoints = useCallback((points: number[], ignoreScale: boolean = false) => {
    const m = mat2d.create()
    mat2d.copy(m, viewTransform)
    mat2d.translate(m, m, translation)
    mat2d.rotate(m, m, rotation)

    if (!ignoreScale) {
      mat2d.scale(m, m, scale)
    }

    const newPositions: number[] = []
    for (let i = 0; i < points.length; i += 2) {
      const vec: vec2 = [points[i], points[i+1] ?? 0]
      vec2.transformMat2d(vec, vec, m)
      newPositions.push(...vec)
    }

    return newPositions
  }, [viewTransform, translation, rotation, scale])

  const transformedPositions = useMemo(
    () => transformPoints(rootPositions),
    [rootPositions, transformPoints]
  )

  const transformedGizmo = useMemo(
    () => gizmoPositions.map(shape => transformPoints(shape, true)),
    [transformPoints]
  )

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%'
        }}
      onClick={() => {
        setRotation(Math.random() * Math.PI * 2)
        setTranslation([
          -0.5 * windowWidth + Math.random() * windowWidth,
          -0.5 * windowHeight + Math.random() * windowHeight
        ])
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
          points={transformedPositions.join(', ')}
          stroke={'rgba(0,128,128,1)'}
          strokeWidth={6}
          fill={'rgba(0,128,128,0.5)'}
        />
        {transformedGizmo.map((shape, i) => <polyline
          key={`gizmo-${i}`}
          points={shape.join(', ')}
          stroke={gizmoColors[i % gizmoColors.length]}
          strokeWidth={2}
        />)}
      </svg>
    </div>
  );
};

export default App;