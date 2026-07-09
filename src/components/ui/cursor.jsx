import { useEffect, useRef } from 'react'

const isTouchDevice =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

const isInteractive = (el) =>
  el.closest?.('a, button, .dot, .slide, [data-cursor-hover]')

export function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (isTouchDevice) return
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX  = mouseX
    let ringY  = mouseY
    let rafId

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
    }

    // 링은 도트를 살짝 지연 추적 → 관성 있는 느낌
    const tick = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      rafId = requestAnimationFrame(tick)
    }

    const onOver = (e) => {
      if (!isInteractive(e.target)) return
      ring.classList.add('cursor-ring--hover')
      dot.classList.add('cursor-dot--hover')
    }
    const onOut = (e) => {
      if (!isInteractive(e.target)) return
      ring.classList.remove('cursor-ring--hover')
      dot.classList.remove('cursor-dot--hover')
    }
    const onDown = () => ring.classList.add('cursor-ring--down')
    const onUp   = () => ring.classList.remove('cursor-ring--down')

    document.documentElement.classList.add('has-custom-cursor')
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    rafId = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (isTouchDevice) return null

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  )
}
