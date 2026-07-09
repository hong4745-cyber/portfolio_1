import { forwardRef } from 'react'

export const ScrollIndicator = forwardRef(function ScrollIndicator(_, ref) {
  return (
    <div ref={ref} className="scroll-indicator">
      <span className="scroll-indicator-text">Scroll</span>
      <span className="scroll-indicator-line" />
    </div>
  )
})
