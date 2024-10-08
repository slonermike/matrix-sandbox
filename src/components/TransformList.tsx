import { Reorder } from 'framer-motion'
import { vec2 } from 'gl-matrix'
import { CSSProperties, useEffect } from "react";
import { move, rotate, scale, Transform } from "../transform";

interface TransformListProps {
  transforms: Transform[]
  updateTransforms: (transforms: Transform[]) => void
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

export function TransformList({transforms: items, updateTransforms}: TransformListProps) {

  useEffect(() => {
    updateTransforms([
      move([Math.random() * 250, Math.random() * 500]),
      rotate(Math.random() * Math.PI * 2),
      scale([1 + Math.random(), 1 + Math.random()])
    ])
  }, [updateTransforms])

  return <Reorder.Group axis="x" as="div" style={{
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'row'
  }} values={items} onReorder={updateTransforms}>
    {items.map((t) => {
      return <Reorder.Item as="div" key={t.id} value={t}>
        <div style={transformStyle}>
          <div style={titleStyle}>{t.type}</div>
          <div>{transformValueString(t)}</div>
        </div>
    </Reorder.Item>
    })}
  </Reorder.Group>
}