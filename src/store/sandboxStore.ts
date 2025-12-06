import {create} from 'zustand'
import { move, rotate, scale, type Transform } from '../transform'
import { type vec2 } from 'gl-matrix'

interface SandboxStore {
    transforms: Transform[]
    hoveredId: number | null
    infoOpen: boolean
    shape: vec2[]

    setTransforms: (transforms: Transform[]) => void
    replaceTransform: (transform: Transform) => void
    setHoveredId: (id: number | null) => void
    setInfoOpen: (open: boolean) => void
    setShape: (shape: vec2[]) => void
}

export const useSandboxStore = create<SandboxStore>((set) => ({
    transforms: [move([50, 50]),
    rotate(Math.PI * 0.1),
    scale([1, 1.5])],
    hoveredId: null,
    infoOpen: true,
    shape: [[-25, 0], [25, 0], [25, 150], [50, 150], [0, 250], [-50, 150], [-25, 150]],

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
    },
    setInfoOpen: (infoOpen) => {
        set({ infoOpen })
    },
    setShape: (shape) => {
        set({ shape })
    }
}))