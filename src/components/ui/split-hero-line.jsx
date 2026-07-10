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

  useGSAP(
    () => {
      const rows = containerRef.current?.querySelectorAll('.hero-line-row')
      if (!rows || !rows.length) return

      const split = new SplitText(rows, { type: 'chars', charsClass: 'split-char' })
      charsRef.current = split.chars
      gsap.set(split.chars, { opacity: 0, x: side === 'left' ? -36 : 36 })

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

      if (state === 'enter') {
        gsap.fromTo(
          chars,
          { opacity: 0, x: side === 'left' ? -36 : 36, y: 0 },
          { opacity: 1, x: 0, y: 0, duration: 1.9, ease: 'power2.out', stagger: 0.055, overwrite: 'auto' }
        )
      } else if (state === 'exit') {
        gsap.to(chars, { opacity: 0, y: -36, duration: 0.72, ease: 'power2.inOut', stagger: 0.01, overwrite: 'auto' })
      } else {
        // 역스크롤로 등장 임계값 아래로 되돌아갈 때 — 빠르게 제자리로
        gsap.to(chars, { opacity: 0, x: side === 'left' ? -36 : 36, y: 0, duration: 0.34, ease: 'power2.inOut', stagger: 0.004, overwrite: 'auto' })
      }
      prevStateRef.current = state
    },
    { dependencies: [state] }
  )

  useImperativeHandle(ref, () => ({
    // 같은 쪽(side)에 다음 문장이 등장할 때, 아직 퇴장 애니메이션 중인 이전 문장을
    // 즉시 강제로 숨겨서 두 문장 글자가 겹쳐 보이는 걸 막는다.
    hardHide() {
      const chars = charsRef.current
      if (!chars.length) return
      gsap.killTweensOf(chars)
      gsap.set(chars, { opacity: 0, x: side === 'left' ? -36 : 36, y: 0 })
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
