import { useEffect, useRef } from 'react'
import BorderGlow from './BorderGlow'
import './ReflectiveCard.css'

const ReflectiveCard = ({
  blurStrength = 12,
  color = 'white',
  metalness = 1,
  roughness = 0.4,
  overlayColor = 'rgba(0, 0, 0, 0.25)',
  displacementStrength = 20,
  noiseScale = 1,
  specularConstant = 1.2,
  grayscale = 1,
  glassDistortion = 0,
  item,
  animDir = 'fwd',
  slideKey,
  className = '',
  style = {}
}) => {
  const videoRef = useRef(null)
  const contentRef = useRef(null)

  // slideKey 변경 시 DOM 노드 유지하면서 animation만 재시작
  // key 기반 unmount/remount를 피해 opacity:0 플래시 없앰
  useEffect(() => {
    const el = contentRef.current
    if (!el || slideKey == null) return
    el.classList.remove('rc-anim--fwd', 'rc-anim--bwd')
    void el.offsetWidth // reflow → animation 재시작 트리거
    el.classList.add(`rc-anim--${animDir}`)
  }, [slideKey, animDir])

  useEffect(() => {
    let stream = null
    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
        })
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch (err) {
        // 웹캠 없으면 어두운 단색 배경으로 폴백
      }
    }
    startWebcam()
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()) }
  }, []) // 마운트 1회만 — 카드는 고정

  const baseFrequency = 0.03 / Math.max(0.1, noiseScale)
  const saturation = 1 - Math.max(0, Math.min(1, grayscale))

  const cssVariables = {
    '--blur-strength': `${blurStrength}px`,
    '--metalness': metalness,
    '--roughness': roughness,
    '--overlay-color': overlayColor,
    '--text-color': color,
    '--saturation': saturation
  }

  if (!item) return null

  return (
    <div className={`reflective-card-container ${className}`} style={{ ...style, ...cssVariables }}>
      <svg className="reflective-svg-filters" aria-hidden="true">
        <defs>
          <filter id="metallic-displacement" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency={baseFrequency} numOctaves="2" result="noise" />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={displacementStrength}
              xChannelSelector="R" yChannelSelector="G" result="rippled" />
            <feSpecularLighting in="noiseAlpha" surfaceScale={displacementStrength}
              specularConstant={specularConstant} specularExponent="20"
              lightingColor="#ffffff" result="light">
              <fePointLight x="0" y="0" z="300" />
            </feSpecularLighting>
            <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
            <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
            <feColorMatrix in="SourceAlpha" type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="solidAlpha" />
            <feMorphology in="solidAlpha" operator="erode" radius="45" result="erodedAlpha" />
            <feGaussianBlur in="erodedAlpha" stdDeviation="10" result="blurredMap" />
            <feComponentTransfer in="blurredMap" result="glassMap">
              <feFuncA type="linear" slope="0.5" intercept="0" />
            </feComponentTransfer>
            <feDisplacementMap in="metallic-result" in2="glassMap" scale={glassDistortion}
              xChannelSelector="A" yChannelSelector="A" result="final" />
          </filter>
        </defs>
      </svg>

      <video ref={videoRef} autoPlay playsInline muted className="reflective-video" />
      <div className="reflective-noise" />
      <div className="reflective-sheen" />
      <div className="reflective-border" />

      {/* ref로 animation 재시작 — unmount 없이 콘텐츠만 교체 */}
      <div ref={contentRef} className="reflective-content">
        <div className="rc-header">
          <BorderGlow
            className="rc-badge-glow"
            backgroundColor="rgba(10,12,28,0.7)"
            borderRadius={500}
            glowRadius={18}
            glowColor={
              item.type === 'career' ? '186 100 76' :
              item.type === 'intern' ? '258 100 73' :
              item.type === 'edu'    ? '45 100 65'  :
                                       '210 30 70'
            }
            colors={
              item.type === 'career' ? ['#06b6d4', '#3b82f6', '#06b6d4'] :
              item.type === 'intern' ? ['#818cf8', '#c084fc', '#818cf8'] :
              item.type === 'edu'    ? ['#f59e0b', '#fbbf24', '#f59e0b'] :
                                       ['#94a3b8', '#cbd5e1', '#94a3b8']
            }
            edgeSensitivity={20}
            glowIntensity={1.2}
            coneSpread={30}
          >
            <span className={`rc-badge rc-badge--${item.type}`}>{item.label}</span>
          </BorderGlow>
        </div>

        <div className="rc-body">
          <span className="rc-year-ghost" aria-hidden="true">{item.year}</span>
          <h3 className="rc-org">
            {item.org}
            {item.location && <span className="rc-location">{item.location}</span>}
          </h3>
          {item.role && <p className="rc-role">{item.role}</p>}
          {item.tasks?.length > 0 && (
            <ul className="rc-tasks">
              {item.tasks.map((t, i) => <li key={i} className="rc-task">{t}</li>)}
            </ul>
          )}
        </div>

        <div className="rc-footer">
          <div className="rc-period">
            <span className="rc-period-label">Period</span>
            <span className="rc-period-value">{item.period}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReflectiveCard
