import { useEffect, useRef, useState } from 'react'

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  stepDuration = 0.35,
  onAnimationComplete,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setInView(true), 100)
          observer.unobserve(ref.current)
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const translateY = direction === 'top' ? '-20px' : '20px'

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap', margin: 0 }}>
      {elements.map((segment, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            whiteSpace: 'pre',
            opacity: inView ? 1 : 0,
            filter: inView ? 'blur(0px)' : 'blur(10px)',
            transform: inView ? 'translateY(0)' : `translateY(${translateY})`,
            transition: [
              `opacity ${stepDuration * 2}s ease ${(index * delay) / 1000}s`,
              `filter ${stepDuration * 2}s ease ${(index * delay) / 1000}s`,
              `transform ${stepDuration * 2}s ease ${(index * delay) / 1000}s`,
            ].join(', '),
          }}
          onTransitionEnd={index === elements.length - 1 && onAnimationComplete ? onAnimationComplete : undefined}
        >
          {segment}
          {animateBy === 'words' && index < elements.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}

export default BlurText
