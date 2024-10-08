import { type vec2 } from "gl-matrix"
import { Visualizer } from "./components/Visualizer"
import { Transform, transformToMatrix } from "./transform";

const SQUARE: vec2[] = [[100, 100], [-100, 100], [-100, -100], [100, -100]]
const App = () => {
  const translate: Transform = {
    type: 'move',
    move: [Math.random() * 250, Math.random() * 500]
  }
  const rotate: Transform = {
    type: 'rotate',
    rotation: Math.random() * Math.PI * 2
  }
  const scale: Transform = {
    type: 'scale',
    scale: [1 + Math.random(), 1 + Math.random()]
  }

  const transforms = [translate, rotate, scale]

  return (
    <div>
      <Visualizer shape={SQUARE} transforms={transforms.map(x => transformToMatrix(x))} />
    </div>
  )
};

export default App;