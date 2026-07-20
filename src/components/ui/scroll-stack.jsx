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
    let rawProgress = 0
    let smoothProgress = 0
    let rafId = null

    const smoothstep = t => t * t * (3 - 2 * t)
    const ENTER_FRAC = 0.32
    const EXIT_FRAC = 0.32

    const render = progress => {
      cards.forEach((card, i) => {
        const segStart = i * segSize
        // 카드마다 자기 구간 안에서 진행도(local: 0~1)를 기준으로 등장→유지→퇴장을 매끄럽게 이어붙인다.
        // 경계에서 값이 뚝 끊기지 않도록 각 구간 경계에서 y가 항상 같은 값으로 만나게 설계했다.
        const local = (progress - segStart) / segSize

        let y
        if (local <= 0) {
          y = 100
        } else if (local < ENTER_FRAC) {
          y = 100 * (1 - smoothstep(local / ENTER_FRAC))
        } else if (local < 1 - EXIT_FRAC) {
          y = 0
        } else if (local < 1) {
          y = -100 * smoothstep((local - (1 - EXIT_FRAC)) / EXIT_FRAC)
        } else {
          y = -100
        }

        card.style.transform = `translate3d(0, ${y}vh, 0)`
        card.style.filter = 'none'
        card.style.zIndex = String(i + 1)
      })
    }

    const measure = () => {
      const rect = root.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      rawProgress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0
    }

    const tick = () => {
      smoothProgress += (rawProgress - smoothProgress) * 0.025
      if (Math.abs(rawProgress - smoothProgress) < 0.0005) smoothProgress = rawProgress
      render(smoothProgress)
      rafId = requestAnimationFrame(tick)
    }

    measure()
    smoothProgress = rawProgress
    render(smoothProgress)
    rafId = requestAnimationFrame(tick)

    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)

    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={rootRef} className={`scroll-stack-root ${className}`.trim()}>
      <div className="scroll-stack-sticky">{children}</div>
    </div>
  )
}
