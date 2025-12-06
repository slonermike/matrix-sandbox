import {create} from 'zustand'
import { move, rotate, scale, type Transform } from '../transform'
import { type ShapeName } from '../shapes'

interface SandboxStore {
    transforms: Transform[]
    hoveredId: number | null
    infoOpen: boolean
    shapeName: ShapeName

    setTransforms: (transforms: Transform[]) => void
    replaceTransform: (transform: Transform) => void
    setHoveredId: (id: number | null) => void
    setInfoOpen: (open: boolean) => void
    setShapeName: (shapeName: ShapeName) => void
}

export const useSandboxStore = create<SandboxStore>((set) => ({
    transforms: [move([50, 50]),
    rotate(Math.PI * 0.1),
    scale([1, 1.5])],
    hoveredId: null,
    infoOpen: true,
    shapeName: 'arrow',

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
    setShapeName: (shapeName) => {
        set({ shapeName })
    }
}))