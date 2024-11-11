import { Reorder } from 'framer-motion'
import { vec2 } from 'gl-matrix'
import { CSSProperties, useEffect } from "react";
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

function vec2string(v: vec2, numDigits: number = 0) {
  return `<${
    v[0].toLocaleString('en', {maximumFractionDigits: numDigits, minimumFractionDigits: numDigits})
  }, ${
    v[1].toLocaleString('en', {maximumFractionDigits: numDigits, minimumFractionDigits: numDigits})}>`
}

function transformValueString(transform: Transform) {
  if (transform.type === 'move') {
    return vec2string(transform.move)
  } else if (transform.type === 'scale') {
    return vec2string(transform.scale, 2)
  } else if (transform.type === 'rotate') {
    return `${Math.floor(transform.radians * 180 / Math.PI)}º`
  }
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
        />
    </Reorder.Item>
    })}
  </Reorder.Group>
}

interface ItemProps {
  onMouseOver: () => void
  onMouseOut: () => void,
  t: Transform
}

function TransformItem({t, onMouseOver, onMouseOut}: ItemProps) {
  return <div style={transformStyle}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    >
    <div style={titleStyle}>{t.type}</div>
    <div>{transformValueString(t)}</div>
  </div>
}