import { Children, cloneElement, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// GSAP 기반 무한 마퀴 — 콘텐츠를 2벌 이어붙이고 절반 너비만큼 반복 이동시켜 이음매 없이 순환시킨다.
export function LogoMarquee({ items, direction = 1, speed = 60, className = '' }) {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // 아이콘(iconify 비동기 로딩)이 늦게 그려지면 최초 측정한 scrollWidth가 실제보다 작아서
    // 루프 지점이 어긋나 두 사본이 겹쳐 보인다 — 크기 변화를 감지해 매번 다시 계산한다.
    let tween
    const start = () => {
      tween?.kill()
      const width = track.scrollWidth / 2
      if (!width) return
      tween = gsap.fromTo(
        track,
        { x: direction > 0 ? 0 : -width },
        { x: direction > 0 ? -width : 0, duration: width / speed, ease: 'none', repeat: -1 }
      )
    }

    start()
    const observer = new ResizeObserver(start)
    observer.observe(track)

    return () => {
      observer.disconnect()
      tween?.kill()
    }
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
