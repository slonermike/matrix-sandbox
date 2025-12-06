import { Reorder } from 'framer-motion'
import { useState } from "react";
import { useSandboxStore } from '../store/sandboxStore';
import { TransformItem } from './TransformItem';

export function TransformList() {
  const transforms = useSandboxStore(state => state.transforms)
  const setTransforms = useSandboxStore(state => state.setTransforms)
  const setHoveredId = useSandboxStore(state => state.setHoveredId)
  const [isDragging, setIsDragging] = useState(false)

  return <Reorder.Group axis="x" as="div" style={{
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'row'
  }} values={transforms} onReorder={setTransforms}>
    {transforms.map((t) => {
      return <Reorder.Item as="div" key={t.id} value={t} onDrag={() => setHoveredId(null)} onDragStart={() => setIsDragging(true)} onDragEnd={() => setIsDragging(false)}>
        <TransformItem
          t={t}
          isDragging={isDragging}
        />
    </Reorder.Item>
    })}
  </Reorder.Group>
}


