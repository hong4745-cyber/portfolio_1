// TextPressure(커서 반응 가변 폰트) + ScrollFloat(진입 시 한 번 떠오르는 효과)를 한 텍스트에 함께 적용
import { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from 'react'
import { gsap } from 'gsap'

const dist = (a, b) => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.sqrt(dx * dx + dy * dy)
}

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist)
  return Math.max(minVal, val + minVal)
}

const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

export function TextPressureFloat({
  text = '',
  fontFamily = 'Roboto Flex',
  fontUrl = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap',
  width = true,
  weight = true,
  italic = false,
  textColor = '#ffffff',
  minFontSize = 24,
  sizeMultiplier = 1,
  play = true,
  delay = 0,
  animationDuration = 1,
  ease = 'expo.out',
  className = '',
}) {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const spansRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const cursorRef = useRef({ x: 0, y: 0 })
  const [fontSize, setFontSize] = useState(minFontSize)

  const chars = useMemo(() => text.split(''), [text])

  // 커서 위치 추적
  useEffect(() => {
    const handleMouseMove = e => {
      cursorRef.current.x = e.clientX
      cursorRef.current.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    if (containerRef.current) {
      const { left, top, width: w, height: h } = containerRef.current.getBoundingClientRect()
      mouseRef.current.x = left + w / 2
      mouseRef.current.y = top + h / 2
      cursorRef.current.x = mouseRef.current.x
      cursorRef.current.y = mouseRef.current.y
    }

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // 컨테이너 너비 기반 폰트 크기 계산 (TextPressure 방식)
  const setSize = useCallback(() => {
    if (!containerRef.current) return
    const { width: containerW } = containerRef.current.getBoundingClientRect()
    const estimate = Math.max(containerW / (chars.length / 2), minFontSize) * sizeMultiplier
    setFontSize(estimate)

    // 폰트 로드 완료 후 실제 렌더 너비 측정 → 넘치면 축소
    const checkFit = () => {
      requestAnimationFrame(() => {
        if (!titleRef.current || !containerRef.current) return
        const actualWidth    = titleRef.current.scrollWidth
        const availableWidth = containerRef.current.clientWidth
        if (actualWidth > availableWidth) {
          setFontSize(prev => prev * (availableWidth / actualWidth) * 0.96)
        }
      })
    }
    if (document.fonts?.ready) {
      document.fonts.ready.then(checkFit)
    } else {
      setTimeout(checkFit, 300)
    }
  }, [chars.length, minFontSize, sizeMultiplier])

  useEffect(() => {
    const debounced = debounce(setSize, 100)
    debounced()
    window.addEventListener('resize', debounced)
    return () => window.removeEventListener('resize', debounced)
  }, [setSize])

  // 커서 거리 기반 font-variation-settings (계속 반응)
  useEffect(() => {
    let rafId
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect()
        const maxDist = titleRect.width / 2

        spansRef.current.forEach(span => {
          if (!span) return
          const rect = span.getBoundingClientRect()
          const charCenter = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
          const d = dist(mouseRef.current, charCenter)

          const wdth = width ? Math.floor(getAttr(d, maxDist, 70, 150)) : 100
          const wght = weight ? Math.floor(getAttr(d, maxDist, 300, 900)) : 400
          const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0
          const settings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`

          if (span.style.fontVariationSettings !== settings) {
            span.style.fontVariationSettings = settings
          }
        })
      }
      rafId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(rafId)
  }, [width, weight, italic])

  // 마운트 시 h1을 clip 영역 아래로 숨김 (페인트 전 적용)
  useLayoutEffect(() => {
    if (titleRef.current) gsap.set(titleRef.current, { yPercent: 110 })
  }, [])

  // About 진입 시 라인 전체가 아래서 올라오는 Scroll Float 효과
  useEffect(() => {
    if (!play) return
    if (!titleRef.current) return
    const tween = gsap.to(titleRef.current, {
      yPercent: 0,
      duration: animationDuration,
      ease,
      delay,
    })
    return () => tween.kill()
  }, [play, animationDuration, ease, delay])

  const styleElement = useMemo(() => <style>{`@import url('${fontUrl}');`}</style>, [fontUrl])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', width: '100%', overflow: 'hidden' }}
    >
      {styleElement}
      <h1
        ref={titleRef}
        style={{
          fontFamily,
          textTransform: 'uppercase',
          fontSize,
          lineHeight: 1.2,
          color: textColor,
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontWeight: 100,
          width: '100%',
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={el => (spansRef.current[i] = el)}
            style={{ display: 'inline-block', color: textColor }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </h1>
    </div>
  )
}
