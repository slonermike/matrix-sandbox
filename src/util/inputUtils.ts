import { type vec2 } from "gl-matrix"
import { type Transform } from "../transform"

export function vec2strings(v: vec2, numDigits: number = 0): string[] {
  return [
    v[0].toLocaleString('en', {maximumFractionDigits: numDigits, minimumFractionDigits: numDigits}),
    v[1].toLocaleString('en', {maximumFractionDigits: numDigits, minimumFractionDigits: numDigits})
  ]
}

export function transformValueStrings(transform: Transform): string[] {
  if (transform.type === 'move') {
    return vec2strings(transform.move)
  } else if (transform.type === 'scale') {
    return vec2strings(transform.scale, 2)
  } else if (transform.type === 'rotate') {
    return [`${Math.ceil(transform.radians * 180 / Math.PI)}º`]
  }

  return []
}