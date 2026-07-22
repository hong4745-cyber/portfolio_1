import { useImperativeHandle, useRef, forwardRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(SplitText)

// scroll 진행률에 따라 App.jsx가 계산해 넘기는 상태값으로 등장/퇴장을 직접 구동한다.
// (Hero가 sticky-pinned 섹션이라 SplitText 내장 ScrollTrigger의 "뷰포트 진입" 감지가 통하지 않음)
export const SplitHeroLine = forwardRef(function SplitHeroLine({ lines, state = 'idle', side = 'left', className = '' }, ref) {
  const containerRef = useRef(null)
  const charsRef      = useRef([])
  const prevStateRef  = useRef('idle')

  // side='down': 위에서 아래로 슬라이드 입장 (mobile manifesto용)
  const initX = side === 'down' ? 0 : (side === 'left' ? -36 : 36)
  const initY = side === 'down' ? -28 : 0

  useGSAP(
    () => {
      const rows = containerRef.current?.querySelectorAll('.hero-line-row')
      if (!rows || !rows.length) return

      const split = new SplitText(rows, { type: 'chars', charsClass: 'split-char' })
      charsRef.current = split.chars
      gsap.set(containerRef.current, { autoAlpha: 0 })
      gsap.set(split.chars, { opacity: 0, x: initX, y: initY })

      return () => split.revert()
    },
    { scope: containerRef, dependencies: [side, lines.join('|')] }
  )

  useGSAP(
    () => {
      const chars = charsRef.current
      if (!chars.length) return
      const prev = prevStateRef.current
      if (prev === state) return
      gsap.killTweensOf(chars)
      gsap.killTweensOf(containerRef.current)

      if (state === 'enter') {
        gsap.set(containerRef.current, { autoAlpha: 1 })
        gsap.fromTo(
          chars,
          { opacity: 0, x: initX, y: initY },
          {
            opacity: 1, x: 0, y: 0,
            duration: side === 'down' ? 2.4 : 3.1,
            ease: 'power2.out',
            stagger: side === 'down' ? 0.07 : 0.085,
            overwrite: 'auto',
          }
        )
      } else if (state === 'exit') {
        gsap.to(chars, { opacity: 0, y: -36, duration: 0.72, ease: 'power2.inOut', stagger: 0.01, overwrite: 'auto' })
      } else {
        // 역스크롤로 등장 임계값 아래로 되돌아갈 때 — 빠르게 제자리로
        gsap.set(containerRef.current, { autoAlpha: 0 })
        gsap.set(chars, { opacity: 0, x: initX, y: initY })
      }
      prevStateRef.current = state
    },
    { dependencies: [state] }
  )

  useImperativeHandle(ref, () => ({
    hardHide() {
      const chars = charsRef.current
      if (!chars.length) return
      gsap.killTweensOf(chars)
      gsap.killTweensOf(containerRef.current)
      gsap.set(containerRef.current, { autoAlpha: 0 })
      gsap.set(chars, { opacity: 0, x: initX, y: initY })
      prevStateRef.current = 'idle'
    },
  }))

  return (
    <p ref={containerRef} className={`hero-line ${className}`.trim()} data-side={side}>
      {lines.map((row, i) => (
        <span key={i} className="hero-line-row">{row}</span>
      ))}
    </p>
  )
})
