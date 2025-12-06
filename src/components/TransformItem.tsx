import { type ChangeEvent, useCallback } from "react"
import { type Transform } from "../transform"
import { useSandboxStore } from "../store/sandboxStore"
import { type vec2 } from "gl-matrix"
import { Vec2Input } from "./Vec2Input"
import { RotationInput } from "./RotationInput"
import "./TransformCard.css"

interface ItemProps {
  t: Transform
}

export function TransformItem({t}: ItemProps) {
  const replaceTransform = useSandboxStore(state => state.replaceTransform)
  const setHoveredId = useSandboxStore(state => state.setHoveredId)
  const onCheckActive = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    replaceTransform({
      ...t,
      active: e.target.checked
    })
  }, [replaceTransform, t])

  const onCheckInvert = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    replaceTransform({
      ...t,
      invert: e.target.checked
    })
  }, [replaceTransform, t])

  const onMouseOver = useCallback(() => setHoveredId(t.id), [t.id, setHoveredId])
  const onMouseOut = useCallback(() => setHoveredId(null), [setHoveredId])

  const onVec2Change = useCallback((newValue: vec2) => {
    let newTransform: Transform
    switch (t.type) {
      case 'move':
        newTransform = {
          ...t,
          move: newValue
        }
        break
      case 'scale':
        newTransform = {
          ...t,
          scale: newValue
        }
        break
      default:
        return
    }
    replaceTransform(newTransform)
  }, [t, replaceTransform])

  const onRotationChange = useCallback((newValue: number) => {
    if (t.type !== 'rotate') return
    const newTransform: Transform = {
      ...t,
      radians: newValue
    }
    replaceTransform(newTransform)
  }, [t, replaceTransform])

  return <div className="transform-card"
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    >
    <div className="transform-card-title">{t.type}<input type={'checkbox'} checked={t.active} onChange={onCheckActive}/></div>
    {t.type === 'move' && (
      <Vec2Input value={t.move} scale={200} onChange={onVec2Change} />
    )}
    {t.type === 'scale' && (
      <Vec2Input value={t.scale} scale={2} onChange={onVec2Change} />
    )}
    {t.type === 'rotate' && (
      <RotationInput value={t.radians} onChange={onRotationChange} />
    )}
    <div><input type={'checkbox'} checked={!!t.invert} onChange={onCheckInvert}/>Invert</div>
  </div>
}