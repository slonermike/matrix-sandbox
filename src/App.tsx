import { type vec2 } from "gl-matrix"
import { Visualizer } from "./components/Visualizer"
import { Transform, transformToMatrix } from "./transform";
import { TransformList } from "./components/TransformList";

const SQUARE: vec2[] = [[100, 100], [-100, 100], [-100, -100], [100, -100]]
const App = () => {
  const translate: Transform = {
    type: 'move',
    move: [Math.random() * 250, Math.random() * 500]
  }
  const rotate: Transform = {
    type: 'rotate',
    radians: Math.random() * Math.PI * 0.5
  }
  const scale: Transform = {
    type: 'scale',
    scale: [1 + Math.random(), 1 + Math.random()]
  }

  const transforms = [translate, rotate, scale]

  return (
    <div>
      <Visualizer shape={SQUARE} transforms={transforms.map(x => transformToMatrix(x))} />
      <TransformList transforms={transforms} />
    </div>
  )
};

export default App;