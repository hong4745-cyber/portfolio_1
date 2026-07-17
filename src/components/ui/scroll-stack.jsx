import { useEffect, useRef } from 'react'

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
)

export default function ScrollStack({ children, className = '' }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const cards = Array.from(root.querySelectorAll('.scroll-stack-card'))
    const count = cards.length
    if (!count) return

    const segSize = 1 / count

    const update = () => {
      const rect = root.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0

      cards.forEach((card, i) => {
        const segStart = i * segSize
        const segEnd = segStart + segSize
        const enterP = Math.min(Math.max((progress - segStart) / (segSize * 0.6), 0), 1)
        const depth = Math.min(Math.max((progress - segEnd) / segSize, 0), count)

        const enterY = (1 - enterP) * 70
        const recedeY = depth * 16
        const scale = 1 - depth * 0.055
        const opacity = enterP * (1 - depth * 0.05)
        const blur = depth * 1.1
        const rotate = depth > 0 ? (i % 2 === 0 ? -1 : 1) * Math.min(depth, 3) * 0.8 : 0

        card.style.transform =
          `translate3d(0, calc(${enterY}vh - ${recedeY}px), 0) scale(${scale}) rotate(${rotate}deg)`
        card.style.opacity = String(Math.max(opacity, 0))
        card.style.filter = blur > 0 ? `blur(${blur}px)` : 'none'
        card.style.zIndex = String(i + 1)
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div ref={rootRef} className={`scroll-stack-root ${className}`.trim()}>
      <div className="scroll-stack-sticky">{children}</div>
    </div>
  )
}
