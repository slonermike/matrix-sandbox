import { type vec2 } from "gl-matrix"
import { Visualizer } from "./components/Visualizer"
import { transformToMatrix, move, rotate, scale } from "./transform";
import { TransformList } from "./components/TransformList";

const SQUARE: vec2[] = [[100, 100], [-100, 100], [-100, -100], [100, -100]]

const transforms = [
  move([Math.random() * 250, Math.random() * 500]),
  rotate(Math.random() * Math.PI * 2),
  scale([1 + Math.random(), 1 + Math.random()])
]

const App = () => {
  return (
    <div>
      <Visualizer shape={SQUARE} transforms={transforms.map(x => transformToMatrix(x))} />
      <TransformList transforms={transforms} />
    </div>
  )
};

export default App;