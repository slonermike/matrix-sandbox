import { Reorder } from 'framer-motion'
import { vec2 } from 'gl-matrix'
import { KeyboardEvent, ChangeEvent, CSSProperties, useCallback, useEffect, useState } from "react";
import { move, rotate, scale, Transform } from "../transform";

interface TransformListProps {
  transforms: Transform[]
  updateTransforms: (transforms: Transform[]) => void
  setHoveredId: (id: number | null) => void
}

const titleStyle: CSSProperties = {
  fontWeight: 'bold',
  textTransform: 'capitalize'
}

const transformStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  border: '2px black solid',
  borderRadius: '6px',
  margin: '8px',
  padding: '8px'
}

function vec2strings(v: vec2, numDigits: number = 0): string[] {
  return [
    v[0].toLocaleString('en', {maximumFractionDigits: numDigits, minimumFractionDigits: numDigits}),
    v[1].toLocaleString('en', {maximumFractionDigits: numDigits, minimumFractionDigits: numDigits})
  ]
}

function transformValueStrings(transform: Transform): string[] {
  if (transform.type === 'move') {
    return vec2strings(transform.move)
  } else if (transform.type === 'scale') {
    return vec2strings(transform.scale, 2)
  } else if (transform.type === 'rotate') {
    return [`${Math.ceil(transform.radians * 180 / Math.PI)}º`]
  }

  return []
}

export function TransformList({transforms, updateTransforms, setHoveredId}: TransformListProps) {

  // Default transforms.
  useEffect(() => {
    updateTransforms([
      move([200, 200]),
      rotate(Math.PI * 0.1),
      scale([1, 2])
    ])
  }, [updateTransforms])

  return <Reorder.Group axis="x" as="div" style={{
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'row'
  }} values={transforms} onReorder={updateTransforms}>
    {transforms.map((t) => {
      return <Reorder.Item as="div" key={t.id} value={t} onDrag={() => setHoveredId(null)}>
        <TransformItem
          t={t}
          onMouseOver={() => setHoveredId(t.id)}
          onMouseOut={() => setHoveredId(null)}
          replaceTransform={t => {
            const newTransforms = transforms.map(oldT => {
              if (oldT.id === t.id) {
                return t
              } else {
                return oldT
              }
            })
            updateTransforms(newTransforms)
          }}
        />
    </Reorder.Item>
    })}
  </Reorder.Group>
}

interface ItemProps {
  onMouseOver: () => void
  onMouseOut: () => void,
  t: Transform,
  replaceTransform: (t: Transform) => void
}

function myParseFloat(str: string) {
  const f = parseFloat(str)
  return isNaN(f) ? 0 : f
}

function TransformItem({t, onMouseOver, onMouseOut, replaceTransform}: ItemProps) {
  const [inputValues, setInputValues] = useState<string[]>(transformValueStrings(t))

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

  return <div style={transformStyle}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    >
    <div style={titleStyle}><input type={'checkbox'} checked={t.active} onChange={onCheckActive}/>{t.type}</div>
    {inputValues.map((s, index) => <input
      key={index}
      value={s}
      onChange={e => onEdit(e, index)}
      onKeyDown={e => onKeyDown(e, index)}
    ></input>)}
    <div><input type={'checkbox'} checked={!!t.invert} onChange={onCheckInvert}/>Invert</div>
  </div>
}