import { createContext, ReactNode, useState } from "react";
import { move, rotate, scale, Transform } from "../transform";

export interface SandboxContextData {
  transforms: Transform[],
  hoveredId: number | null,
  setTransforms: (transforms: Transform[]) => void,
  setHoveredId: (hoveredId: number | null) => void
}

export const SandboxContext = createContext<SandboxContextData>({
  transforms: [],
  hoveredId: null,
  setTransforms: () => {},
  setHoveredId: () => {}
})

export function SandboxContentProvider({children}: {children: ReactNode}) {
  const [transforms, setTransforms] = useState<Transform[]>([
    move([200, 200]),
    rotate(Math.PI * 0.1),
    scale([1, 2])
  ])
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return <SandboxContext.Provider value={{
    transforms,
    hoveredId,
    setTransforms,
    setHoveredId
  }}>
    {children}
  </SandboxContext.Provider>
}
