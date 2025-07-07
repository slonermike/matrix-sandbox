import { vec2 } from "gl-matrix"
import { useState } from "react"

import { TransformList } from "./TransformList"
import { Visualizer } from "./Visualizer"
import { Transform } from "../transform"

//const SQUARE: vec2[] = [[100, 100], [-100, 100], [-100, -100], [100, -100]]
const ARROW: vec2[] = [[-25, 0], [25, 0], [25, 150], [50, 150], [0, 250], [-50, 150], [-25, 150]]

export function MatrixSandbox() {
  const [transforms, setTransforms] = useState<Transform[]>([])
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  return <div>
    <Visualizer shape={ARROW} transforms={transforms} hoveredId={hoveredId} />
    <TransformList updateTransforms={setTransforms} transforms={transforms} setHoveredId={setHoveredId} />
  </div>
}