

import { type vec2, mat2d } from "gl-matrix";

interface RotateTransform {
  type: 'rotate',
  radians: number
}

interface ScaleTransform {
  type: 'scale',
  scale: vec2
}

interface MoveTransform {
  type: 'move',
  move: vec2
}

export type Transform = RotateTransform | ScaleTransform | MoveTransform

export function transformToMatrix(transform: Transform): mat2d {
  const m = mat2d.create()
  switch(transform.type) {
    case 'move':
      mat2d.fromTranslation(m, transform.move)
      break
    case 'rotate':
      mat2d.fromRotation(m, transform.radians)
      break
    case 'scale':
      mat2d.fromScaling(m, transform.scale)
      break
    default:
      break
  }
  return  m
}
