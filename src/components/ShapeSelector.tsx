import { useCallback } from "react"
import { useSandboxStore } from "../store/sandboxStore"
import { shapes, type ShapeName } from "../shapes"
import { ShapePreview } from "./ShapePreview"
import "./TransformCard.css"

export function ShapeSelector() {
  const shapeName = useSandboxStore(state => state.shapeName)
  const setShapeName = useSandboxStore(state => state.setShapeName)

  const onSelectShape = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setShapeName(e.target.value as ShapeName)
  }, [setShapeName])

  const currentShape = shapes[shapeName]

  return (
    <div className="transform-card">
      <div className="transform-card-title">Shape</div>
      <ShapePreview shape={currentShape} />
      <select
        value={shapeName}
        onChange={onSelectShape}
        className="shape-dropdown"
      >
        {Object.keys(shapes).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}
