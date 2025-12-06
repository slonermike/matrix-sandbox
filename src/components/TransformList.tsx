import { Reorder, useDragControls } from 'framer-motion'
import { useSandboxStore } from '../store/sandboxStore';
import { TransformItem } from './TransformItem';
import { type Transform } from '../transform';
import { type CSSProperties } from 'react';

const dragHandleStyle: CSSProperties = {
  cursor: 'grab',
  padding: '4px',
  userSelect: 'none',
  position: 'absolute',
  top: '8px',
  left: '8px'
}

function ReorderableTransformItem({ t }: { t: Transform }) {
  const dragControls = useDragControls()
  const setHoveredId = useSandboxStore(state => state.setHoveredId)

  return (
    <Reorder.Item
      as="div"
      key={t.id}
      value={t}
      dragListener={false}
      dragControls={dragControls}
      onDrag={() => setHoveredId(null)}
      onDragStart={() => {}}
      onDragEnd={() => {}}
      style={{ position: 'relative' }}
    >
      <span
        style={dragHandleStyle}
        onPointerDown={(e) => dragControls.start(e)}
      >
        ⋮⋮
      </span>
      <TransformItem t={t} />
    </Reorder.Item>
  )
}

export function TransformList() {
  const transforms = useSandboxStore(state => state.transforms)
  const setTransforms = useSandboxStore(state => state.setTransforms)

  return <Reorder.Group axis="x" as="div" style={{
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'row'
  }} values={transforms} onReorder={setTransforms}>
    {transforms.map((t) => (
      <ReorderableTransformItem key={t.id} t={t} />
    ))}
  </Reorder.Group>
}


