import { type ChangeEvent, type CSSProperties, type KeyboardEvent, useCallback, useMemo, useState } from "react"
import { type Transform } from "../transform"
import { transformValueStrings } from "../util/inputUtils"
import { useSandboxStore } from "../store/sandboxStore"
import { type vec2 } from "gl-matrix"
import { Vec2Input } from "./Vec2Input"
import { RotationInput } from "./RotationInput"

const titleStyle: CSSProperties = {
  fontWeight: 'bold',
  textTransform: 'capitalize',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '8px',
  width: '100%'
}

const transformStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  border: '2px black solid',
  borderRadius: '6px',
  margin: '8px',
  padding: '8px',
  backgroundColor: `rgb(0, 128, 128)`,
  gap: '8px'
}

interface ItemProps {
  t: Transform
}

function myParseFloat(str: string) {
  const f = parseFloat(str)
  return isNaN(f) ? 0 : f
}

export function TransformItem({t}: ItemProps) {
  const [inputValues, setInputValues] = useState<string[]>(transformValueStrings(t))
  const replaceTransform = useSandboxStore(state => state.replaceTransform)
  const setHoveredId = useSandboxStore(state => state.setHoveredId)

  const updateStrings = useCallback((t: Transform) => {
    setInputValues(transformValueStrings(t))
  }, [])

  const onEdit = useCallback((e: ChangeEvent<HTMLInputElement>, index: number) => {
    setInputValues(strings => {
      const newStrings = [...strings]
      newStrings[index] = e.target.value
      return newStrings
    })
  }, [setInputValues])

  const styles = useMemo(() => {
    return transformStyle
  }, [])

  const moveValue = useCallback((t: Transform, key: string, mod: boolean, index: number) => {
    const change: vec2 = [0, 0]
    change[index] += key === 'ArrowUp' ? 1 : 0
    change[index] -= key === 'ArrowDown' ? 1 : 0
    change[index] *= mod ? 1 : 5

    const newT = {...t}
    switch(newT.type) {
      case 'move':
        if (newT.type === 'move') {
          newT.move = [newT.move[0] + change[0], newT.move[1] + change[1]]
        }
      break
      case 'scale':
        if (newT.type === 'scale') {
          newT.scale = [newT.scale[0] + change[0] * 0.1, newT.scale[1] + change[1] * 0.1]
        }
      break
      case 'rotate':
        if (newT.type === 'rotate') {
          const degrees = newT.radians * (180 / Math.PI) + change[0] + change[1]
          newT.radians = degrees / (180 / Math.PI)
        }
        break
      default:
        break
    }

    replaceTransform(newT)
    updateStrings(newT)
  }, [replaceTransform, updateStrings])

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      let newTransform: Transform
      switch (t.type) {
        case 'move':
          newTransform = {
            ...t
          }
          for (let i = 0; i < inputValues.length; i++) {
            newTransform.move[i] = myParseFloat(inputValues[i])
          }
          break
        case 'rotate':
          newTransform = {
            ...t
          }
          for (let i = 0; i < inputValues.length; i++) {
            newTransform.radians = myParseFloat(inputValues[i]) / (180 / Math.PI)
          }
          break
        case 'scale':
          newTransform = {
            ...t
          }
          for (let i = 0; i < inputValues.length; i++) {
            newTransform.scale[i] = myParseFloat(inputValues[i])
          }
          break
      }
      replaceTransform(newTransform)
      updateStrings(newTransform)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      moveValue(t, e.key, e.shiftKey, index)
    }
  }, [replaceTransform, inputValues, t, moveValue, updateStrings])

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
    updateStrings(newTransform)
  }, [t, replaceTransform, updateStrings])

  const onRotationChange = useCallback((newValue: number) => {
    if (t.type !== 'rotate') return
    const newTransform: Transform = {
      ...t,
      radians: newValue
    }
    replaceTransform(newTransform)
    updateStrings(newTransform)
  }, [t, replaceTransform, updateStrings])

  return <div style={styles}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    >
    <div style={titleStyle}>{t.type}<input type={'checkbox'} checked={t.active} onChange={onCheckActive}/></div>
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