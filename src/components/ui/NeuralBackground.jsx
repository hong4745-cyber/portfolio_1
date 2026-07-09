import { useEffect, useRef } from 'react'

export default function NeuralBackground({
  className = '',
  color = '#06b6d4',
  trailOpacity = 0.12,
  particleCount = 600,
  speed = 1,
  overlay = false,
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = container.clientWidth
    let height = container.clientHeight
    let particles = []
    let animationFrameId
    let mouse = { x: -1000, y: -1000 }

    class Particle {
      constructor() { this.reset(true) }

      reset(init = false) {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = 0
        this.vy = 0
        this.age = init ? Math.random() * 200 : 0
        this.life = Math.random() * 200 + 100
      }

      update() {
        const angle = (Math.cos(this.x * 0.005) + Math.sin(this.y * 0.005)) * Math.PI
        this.vx += Math.cos(angle) * 0.2 * speed
        this.vy += Math.sin(angle) * 0.2 * speed

        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const force = (150 - dist) / 150
          this.vx -= dx * force * 0.05
          this.vy -= dy * force * 0.05
        }

        this.x += this.vx
        this.y += this.vy
        this.vx *= 0.95
        this.vy *= 0.95
        this.age++

        if (this.age > this.life) this.reset()
        if (this.x < 0) this.x = width
        if (this.x > width) this.x = 0
        if (this.y < 0) this.y = height
        if (this.y > height) this.y = 0
      }

      draw(ctx) {
        const alpha = 1 - Math.abs((this.age / this.life) - 0.5) * 2
        ctx.globalAlpha = Math.max(0, alpha) * 0.85
        ctx.fillStyle = color
        ctx.fillRect(this.x, this.y, 1.5, 1.5)
      }
    }

    const init = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      particles = Array.from({ length: particleCount }, () => new Particle())
    }

    const animate = () => {
      if (overlay) {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.fillStyle = `rgba(0,0,0,${trailOpacity})`
        ctx.fillRect(0, 0, width, height)
        ctx.globalCompositeOperation = 'source-over'
      } else {
        ctx.fillStyle = `rgba(0,0,0,${trailOpacity})`
        ctx.fillRect(0, 0, width, height)
      }
      ctx.globalAlpha = 1
      particles.forEach(p => { p.update(); p.draw(ctx) })
      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      width = container.clientWidth
      height = container.clientHeight
      init()
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => { mouse.x = -1000; mouse.y = -1000 }

    init()
    animate()

    window.addEventListener('resize', handleResize)
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [color, trailOpacity, particleCount, speed, overlay])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        background: overlay ? 'transparent' : '#0c1634',
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
