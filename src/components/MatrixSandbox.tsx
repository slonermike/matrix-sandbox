import { vec2 } from "gl-matrix"

import { TransformList } from "./TransformList"
import { Visualizer } from "./Visualizer"
import { SandboxContentProvider } from "./SandboxContext"

//const SQUARE: vec2[] = [[100, 100], [-100, 100], [-100, -100], [100, -100]]
const ARROW: vec2[] = [[-25, 0], [25, 0], [25, 150], [50, 150], [0, 250], [-50, 150], [-25, 150]]

export function MatrixSandbox() {
  return <SandboxContentProvider>
      <Visualizer shape={ARROW} />
      <TransformList />
  </SandboxContentProvider>
}