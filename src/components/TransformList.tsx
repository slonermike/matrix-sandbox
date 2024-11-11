import { Reorder } from 'framer-motion'
import { vec2 } from 'gl-matrix'
import { KeyboardEvent, ChangeEvent, CSSProperties, useCallback, useEffect, useMemo, useState } from "react";
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
  alignItems: 'center',
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
            updateTransforms(transforms.map(oldT => {
              if (oldT.id === t.id) {
                return t
              } else {
                return oldT
              }
            }))
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
  const strings = useMemo(() => transformValueStrings(t), [t])
  const [inputValues, setInputValues] = useState<string[]>(strings)

  const onEdit = useCallback((e: ChangeEvent<HTMLInputElement>, index: number) => {
    setInputValues(strings => {
      const newStrings = [...strings]
      newStrings[index] = e.target.value
      return newStrings
    })
  }, [setInputValues])

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
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
    }
  }, [replaceTransform, inputValues, t])

  return <div style={transformStyle}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    >
    <div style={titleStyle}>{t.type}</div>
    {inputValues.map((s, index) => <input
      key={index}
      value={s}
      onChange={e => onEdit(e, index)}
      onKeyDown={onKeyDown}
    ></input>)}
  </div>
}