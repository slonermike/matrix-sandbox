import {create} from 'zustand'
import { move, rotate, scale, type Transform } from '../transform'

interface SandboxStore {
    transforms: Transform[]
    hoveredId: number | null

    setTransforms: (transforms: Transform[]) => void
    replaceTransform: (transform: Transform) => void
    setHoveredId: (id: number | null) => void
}

export const useSandboxStore = create<SandboxStore>((set) => ({
    transforms: [move([200, 200]),
    rotate(Math.PI * 0.1),
    scale([1, 2])],
    hoveredId: null,

    setTransforms: (transforms) => {
        set({transforms})
    },
    replaceTransform: (t: Transform) => {
        set((prevState) => {
            const transforms = prevState.transforms.map(oldT => {
                if (oldT.id === t.id) {
                return t
                } else {
                return oldT
                }
            })
            return {transforms}
        })
    },
    setHoveredId: (hoveredId) => {
        set({
            hoveredId
        })
    }
}))