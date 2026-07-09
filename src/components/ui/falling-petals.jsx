import { useEffect, useRef } from 'react'

const COLORS = ['#ffd1e8', '#ffffff', '#ffb6d9', '#f7c6e0']

function drawPetal(ctx, size, color) {
  ctx.beginPath()
  ctx.moveTo(0, -size)
  ctx.bezierCurveTo(size * 0.8, -size * 0.6, size * 0.8, size * 0.6, 0, size)
  ctx.bezierCurveTo(-size * 0.8, size * 0.6, -size * 0.8, -size * 0.6, 0, -size)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

export function FallingPetals({ count = 10, className = '', sizeScale = 1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let rafId

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const petals = Array.from({ length: count }, () => ({
      baseX: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: (Math.random() * 2.5 + 2) * sizeScale,
      vy: Math.random() * 0.07 + 0.04,
      swaySpeed: Math.random() * 0.012 + 0.006,
      swayAmount: Math.random() * 25 + 15,
      swayOffset: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      alpha: Math.random() * 0.25 + 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      x: 0,
    }))

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of petals) {
        p.y += p.vy
        p.swayOffset += p.swaySpeed
        p.x = p.baseX + Math.sin(p.swayOffset) * p.swayAmount
        p.rotation += p.rotationSpeed

        if (p.y - p.size > canvas.height) {
          p.y = -p.size
          p.baseX = Math.random() * canvas.width
        }

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        drawPetal(ctx, p.size, p.color)
        ctx.restore()
      }
      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
