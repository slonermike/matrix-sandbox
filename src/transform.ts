

import { type vec2, mat2d } from "gl-matrix";

interface RotateTransform {
  id: number,
  active: boolean,
  type: 'rotate',
  radians: number
}

interface ScaleTransform {
  id: number,
  active: boolean,
  type: 'scale',
  scale: vec2
}

interface MoveTransform {
  id: number,
  active: boolean,
  type: 'move',
  move: vec2
}

export type Transform = RotateTransform | ScaleTransform | MoveTransform

let idCounter = 0

export function transformToMatrix(transform: Transform): mat2d {
  const m = mat2d.create()
  if (!transform.active) {
    return m
  }
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

export function rotate(radians: number): RotateTransform {
  return {
    type: 'rotate',
    active: true,
    id: idCounter++,
    radians
  }
}

export function move(move: vec2): MoveTransform {
  return {
    type: 'move',
    active: true,
    id: idCounter++,
    move
  }
}

export function scale(scale: vec2): ScaleTransform {
  return {
    type: 'scale',
    active: true,
    id: idCounter++,
    scale
  }
}
