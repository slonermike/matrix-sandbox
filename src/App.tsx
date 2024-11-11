import { type vec2 } from "gl-matrix"
import { Visualizer } from "./components/Visualizer"
import { TransformList } from "./components/TransformList";
import { Transform } from "./transform";
import { useState } from "react";

//const SQUARE: vec2[] = [[100, 100], [-100, 100], [-100, -100], [100, -100]]
const ARROW: vec2[] = [[-25, -25], [25, -25], [25, 150], [50, 150], [0, 250], [-50, 150], [-25, 150]]

const App = () => {
  const [transforms, setTransforms] = useState<Transform[]>([])
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div>
      <Visualizer shape={ARROW} transforms={transforms} hoveredId={hoveredId} />
      <TransformList updateTransforms={setTransforms} transforms={transforms} setHoveredId={setHoveredId} />
    </div>
  )
};

export default App;