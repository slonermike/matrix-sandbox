import { useCallback } from "react"
import { useSandboxStore } from "../store/sandboxStore"
import { shapes } from "../shapes"
import { CustomShapeDrawer } from "./CustomShapeDrawer"
import "./TransformCard.css"

export function ShapeSelector() {
  const setShape = useSandboxStore(state => state.setShape)

  const onSelectPreset = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const shapeName = e.target.value
    if (shapeName !== 'custom') {
      setShape(shapes[shapeName as keyof typeof shapes])
    }
  }, [setShape])

  return (
    <div className="transform-card">
      <div className="transform-card-title">Shape</div>
      <CustomShapeDrawer />
      <select
        onChange={onSelectPreset}
        className="shape-dropdown"
        defaultValue=""
      >
        <option value="" disabled>Load preset...</option>
        {Object.keys(shapes).filter(name => name !== 'custom').map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}
