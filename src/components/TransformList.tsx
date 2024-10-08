import { vec2 } from 'gl-matrix'
import { CSSProperties, useMemo } from "react";
import { Transform } from "../transform";

interface TransformListProps {
  transforms: Transform[]
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

function TransformListItem({transform}: {transform: Transform}) {
  const valueString = useMemo(() => {
    if (transform.type === 'move') {
      return vec2string(transform.move)
    } else if (transform.type === 'scale') {
      return vec2string(transform.scale, 2)
    } else if (transform.type === 'rotate') {
      return `${Math.floor(transform.radians * 180 / Math.PI)}º`
    }
  }, [transform])
  return <div style={transformStyle}>
      <div style={titleStyle}>{transform.type}</div>
      <div>{valueString}</div>
    </div>
}

export function TransformList({transforms}: TransformListProps) {
  return <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'row'
  }}>
    {transforms.map((t, i) => {
      return <>
        <TransformListItem key={`${t.type}-${i}`} transform={t} />
      </>
    })}
    <div style={transformStyle}>
      <div style={titleStyle}>Position</div>
    </div>
  </div>
}