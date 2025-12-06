import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSandboxStore } from "../store/sandboxStore"

const slides = [
  {
    title: "Matrix Transformation Sandbox",
    content: "This tool demonstrates how the order of transformation matrices affects the final result when transforming objects in 2D space."
  },
  {
    title: "Move Transformation",
    content: "The move (translation) transformation shifts the object's position. Drag the red handle on the 2D graph to move the shape. The grid shows you the coordinate space, with (0, 0) at the center."
  },
  {
    title: "Rotate Transformation",
    content: "The rotate transformation spins the object around the origin (0, 0). Drag the red handle around the circle to adjust the rotation angle. Positive values rotate counter-clockwise."
  },
  {
    title: "Scale Transformation",
    content: "The scale transformation changes the object's size. Drag the red handle on the 2D graph to scale in X and Y directions independently. Values greater than 1 make the object larger, less than 1 make it smaller."
  },
  {
    title: "Reordering Transformations",
    content: "Click and drag the ⋮⋮ handle on the left of each transformation card to reorder them. Watch how the shape changes as you rearrange the order!"
  },
  {
    title: "Pre-Multiplication & Order",
    content: "Transformations are applied right-to-left using pre-multiplication. If you have Move then Rotate, the rotation happens first, then the move. This is why order matters: rotating then moving gives a different result than moving then rotating."
  },
  {
    title: "Enable/Disable Transformations",
    content: "Use the checkbox on each transformation to enable or disable it. This lets you see the effect of each transformation individually."
  },
  {
    title: "Inverting Transformations",
    content: "Check the 'Invert' checkbox to apply the inverse of a transformation. This is useful for understanding how to undo transformations."
  },
  {
    title: "Key Concept: Non-Commutativity",
    content: "Matrix multiplication is not commutative, meaning A × B ≠ B × A. The order in which you apply transformations matters! Try rotating then translating versus translating then rotating to see the difference."
  }
]

function InfoPanel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const setInfoOpen = useSandboxStore(state => state.setInfoOpen)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className={'info-verbose-container'}>
      <div className={'info-verbose'} style={{ position: 'relative' }}>
        <button
          onClick={() => setInfoOpen(false)}
          className="info-close-button"
        >
          ×
        </button>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3>{slides[currentSlide].title}</h3>
            <p>{slides[currentSlide].content}</p>
          </motion.div>
        </AnimatePresence>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '16px',
          gap: '8px'
        }}>
          <button onClick={prevSlide} style={{
            padding: '8px 16px',
            cursor: 'pointer',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: '#fff'
          }}>
            ← Previous
          </button>
          <span style={{ fontSize: '14px' }}>
            {currentSlide + 1} / {slides.length}
          </span>
          <button onClick={nextSlide} style={{
            padding: '8px 16px',
            cursor: 'pointer',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: '#fff'
          }}>
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoButton() {
  const infoOpen = useSandboxStore(state => state.infoOpen)
  const setInfoOpen = useSandboxStore(state => state.setInfoOpen)

  return (
    <div
      className={`info-circle hover-link ${infoOpen ? 'stay-open' : ''}`}
      onClick={() => setInfoOpen(!infoOpen)}
    >
      <span>i</span>
    </div>
  )
}

export function InfoOverlay() {
  const infoOpen = useSandboxStore(state => state.infoOpen)

  return (
    <div className={'info-overlay'}>
      {infoOpen && <InfoPanel />}
      <InfoButton />
      <a href="https://github.com/slonermike/matrix-sandbox" target="_blank" rel="noreferrer noopener">
        <img className="hover-link" src="/github.svg" width="50" height="50" />
      </a>
    </div>
  )
}