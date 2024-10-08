import { mat2d, type vec2 } from "gl-matrix"
import { Visualizer } from "./components/Visualizer"

const SQUARE: vec2[] = [[100, 100], [-100, 100], [-100, -100], [100, -100]]
const App = () => {
  const translate = mat2d.create()
  mat2d.fromTranslation(translate, [Math.random() * 250, Math.random() * 500])

  const rotate = mat2d.create()
  mat2d.fromRotation(rotate, Math.random() * Math.PI * 2)

  const scale = mat2d.create()
  mat2d.fromScaling(scale, [1 + Math.random(), 1 + Math.random()])

  return <Visualizer shape={SQUARE} transforms={[translate, rotate, scale]} />
};

export default App;