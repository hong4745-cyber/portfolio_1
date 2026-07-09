import { Children, cloneElement, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// GSAP 기반 무한 마퀴 — 콘텐츠를 2벌 이어붙이고 절반 너비만큼 반복 이동시켜 이음매 없이 순환시킨다.
export function LogoMarquee({ items, direction = 1, speed = 60, className = '' }) {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const width = track.scrollWidth / 2
    const tween = gsap.fromTo(
      track,
      { x: direction > 0 ? 0 : -width },
      { x: direction > 0 ? -width : 0, duration: width / speed, ease: 'none', repeat: -1 }
    )
    return () => tween.kill()
  }, [direction, speed])

  return (
    <div className={`logo-marquee ${className}`.trim()}>
      <div className="logo-marquee-track" ref={trackRef}>
        {Children.map(items, child => cloneElement(child, { key: `${child.key}-a` }))}
        {Children.map(items, child => cloneElement(child, { key: `${child.key}-b` }))}
      </div>
    </div>
  )
}
