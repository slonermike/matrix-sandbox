import { useState } from "react"

function InfoVerbose() {
  return <div className={'info-verbose-container'}>
    <div className={'info-verbose'}>
      <h3>Matrix Transformation Sandbox</h3>
      <p>
        This tool demonstrates how the <strong>order of transformation matrices</strong> affects
        the final result when transforming objects in 2D space.
      </p>

      <h4>How to Use:</h4>
      <ul>
        <li><strong>Add transformations</strong> using the buttons (Translate, Rotate, Scale)</li>
        <li><strong>Reorder transformations</strong> by dragging them in the list</li>
        <li><strong>Adjust values</strong> using the sliders for each transformation</li>
        <li><strong>Remove transformations</strong> by clicking the X button</li>
      </ul>

      <h4>Key Concept:</h4>
      <p>
        Matrix multiplication is <strong>not commutative</strong>, meaning A × B ≠ B × A.
        The order in which you apply transformations matters! Try rotating then translating
        versus translating then rotating to see the difference.
      </p>
    </div>
  </div>
}

export function InfoOverlay() {
  const [isMousedOver, setIsMousedOver] = useState(false)
  const [stayOpen, setStayOpen] = useState(false)
  return <div className={'info-overlay'}>
    <div
      className={`info-circle hover-link ${stayOpen ? 'stay-open' : ''}`}
      onMouseOver={() => setIsMousedOver(true)}
      onMouseOut={() => setIsMousedOver(false)}
      onMouseDown={() => {
        setStayOpen(!stayOpen)
        setIsMousedOver(false)
      }}
    >
      <span>i</span>
      {(isMousedOver || stayOpen) ? <InfoVerbose /> : null}
    </div>
    <a href="https://github.com/slonermike/matrix-sandbox" target="_blank" rel="noreferrer noopener"><img className="hover-link" src="/github.svg" width="50" height="50" /></a>
    </div>
}