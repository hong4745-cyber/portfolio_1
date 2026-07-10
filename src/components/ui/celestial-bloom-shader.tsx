import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

type CelestialBloomShaderProps = {
  className?: string
  style?: React.CSSProperties
}

const CelestialBloomShader = ({ className, style }: CelestialBloomShaderProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isActive, setIsActive] = React.useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (!('IntersectionObserver' in window)) {
      setIsActive(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { rootMargin: '450px 0px' },
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !isActive) return

    let renderer: THREE.WebGLRenderer

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)
    } catch (err) {
      console.error('WebGL not supported', err)
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const clock = new THREE.Clock()

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;

      float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 6; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy)
                  / min(iResolution.x, iResolution.y);
        float t = iTime * 1.5;
        float radius = length(uv);
        float angle = atan(uv.y, uv.x);

        float petals = 5.0;
        float bloomShape = sin(angle * petals + t);
        float distorted = radius
                         + bloomShape * 0.1
                         * fbm(uv * 3.0 + t * 0.1);

        vec3 deepSpace = vec3(0.05, 0.0, 0.1);
        vec3 nebula = vec3(0.52, 0.2, 0.86);
        vec3 star = vec3(1.0, 1.0, 0.9);

        float mixVal = smoothstep(0.1, 0.62, distorted);
        vec3 color = mix(nebula, deepSpace, mixVal);

        float coreGlow = smoothstep(0.11, 0.0, radius);
        color = mix(color, star, coreGlow);

        float twinkle = smoothstep(0.985, 0.995, fbm(uv * 10.0));
        color = mix(color, star, twinkle * (1.0 - coreGlow));

        float alpha = smoothstep(1.05, 0.2, radius) * 0.72;
        gl_FragColor = vec4(color, alpha);
      }
    `

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
    }
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    })
    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h, false)
      uniforms.iResolution.value.set(w, h)
    }

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(container)
    onResize()

    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime()
      renderer.render(scene, camera)
    })

    return () => {
      resizeObserver.disconnect()
      renderer.setAnimationLoop(null)

      const canvas = renderer.domElement
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }

      material.dispose()
      geometry.dispose()
      renderer.dispose()
    }
  }, [isActive])

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
      aria-label="Celestial Bloom animated flower"
    />
  )
}

export default CelestialBloomShader
