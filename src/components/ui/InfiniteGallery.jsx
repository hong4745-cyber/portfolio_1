import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

const DEPTH_RANGE = 50
const VISIBLE_COUNT = 10
const MAX_H = 8
const MAX_V = 6

const VERT = `
  uniform float scrollForce;
  uniform float time;
  uniform float isHovered;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float curveIntensity = scrollForce * 0.25;
    float dist = length(pos.xy);
    float curve = dist * dist * curveIntensity;
    float ripple = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.018
                 + sin(pos.y * 2.5 + scrollForce * 2.0) * 0.012;
    float cloth = ripple * abs(curveIntensity) * 2.0;
    float flag = 0.0;
    if (isHovered > 0.5) {
      float d = smoothstep(-0.5, 0.5, pos.x);
      flag = sin(pos.x * 3.0 + time * 8.0) * 0.09 * d
           + sin(pos.x * 5.5 + time * 13.0) * 0.025 * d;
    }
    pos.z -= (curve + cloth + flag);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const FRAG = `
  uniform sampler2D map;
  uniform float opacity;
  uniform float blurAmount;
  varying vec2 vUv;
  void main() {
    vec4 col = texture2D(map, vUv);
    if (blurAmount > 0.01) {
      vec2 ts = 1.0 / vec2(512.0);
      vec4 blurred = vec4(0.0);
      float total = 0.0;
      for (float x = -2.0; x <= 2.0; x += 1.0) {
        for (float y = -2.0; y <= 2.0; y += 1.0) {
          float w = 1.0 / (1.0 + length(vec2(x,y)));
          blurred += texture2D(map, vUv + vec2(x,y) * ts * blurAmount) * w;
          total += w;
        }
      }
      col = blurred / total;
    }
    gl_FragColor = vec4(col.rgb, col.a * opacity);
  }
`

function buildSpatial(count) {
  return Array.from({ length: count }, (_, i) => {
    const ha = (i * 2.618) % (Math.PI * 2)
    const va = (i * 1.618 + Math.PI / 3) % (Math.PI * 2)
    const hr = (i % 3) * 1.2
    const vr = ((i + 1) % 4) * 0.8
    return {
      x: (Math.sin(ha) * hr * MAX_H) / 3,
      y: (Math.cos(va) * vr * MAX_V) / 4,
    }
  })
}

export default function InfiniteGallery({ images = [], speed = 1, className = '', style }) {
  const mountRef = useRef(null)
  const stateRef = useRef({ velocity: 0, autoPlay: true, lastInteract: Date.now(), time: 0 })

  const getUrls = useCallback(() =>
    images.map(img => typeof img === 'string' ? img : img.src),
    [images]
  )

  useEffect(() => {
    const container = mountRef.current
    if (!container) return
    const urls = getUrls()
    if (!urls.length) return

    // ── Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }

    // ── Scene + Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200)
    camera.position.set(0, 0, 0)

    resize()
    window.addEventListener('resize', resize)

    // ── Load textures
    const loader = new THREE.TextureLoader()
    const textures = urls.map(url => {
      const t = loader.load(url)
      t.colorSpace = THREE.SRGBColorSpace
      return t
    })

    const spatial = buildSpatial(VISIBLE_COUNT)

    // ── Planes
    const geo = new THREE.PlaneGeometry(1, 1, 32, 32)
    const planes = Array.from({ length: VISIBLE_COUNT }, (_, i) => {
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          map:         { value: textures[i % textures.length] },
          opacity:     { value: 1 },
          blurAmount:  { value: 0 },
          scrollForce: { value: 0 },
          time:        { value: 0 },
          isHovered:   { value: 0 },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
      })

      const sx = 2 * (16 / 9)
      const sy = 2

      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(spatial[i].x, spatial[i].y, ((DEPTH_RANGE / VISIBLE_COUNT) * i) - DEPTH_RANGE / 2)
      mesh.scale.set(sx, sy, 1)
      mesh.userData = {
        z: ((DEPTH_RANGE / VISIBLE_COUNT) * i) % DEPTH_RANGE,
        imgIdx: i % textures.length,
        isHovered: false,
      }
      scene.add(mesh)
      return mesh
    })

    // ── Raycaster for hover
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-99, -99)
    const onMouseMove = e => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }
    container.addEventListener('mousemove', onMouseMove)

    // ── Wheel / interaction
    const onWheel = e => {
      e.stopPropagation() // don't bubble to page scroll
      stateRef.current.velocity += e.deltaY * 0.012 * speed
      stateRef.current.autoPlay = false
      stateRef.current.lastInteract = Date.now()
    }
    container.addEventListener('wheel', onWheel, { passive: true })

    const autoTimer = setInterval(() => {
      if (Date.now() - stateRef.current.lastInteract > 3000) stateRef.current.autoPlay = true
    }, 1000)

    // ── RAF loop
    let rafId
    let lastTime = performance.now()

    const animate = (now) => {
      rafId = requestAnimationFrame(animate)
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      const st = stateRef.current
      st.time += dt

      if (st.autoPlay) st.velocity += 0.25 * dt * speed
      st.velocity *= 0.94

      // Hover detection
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(planes)
      const hoveredMesh = hits.length ? hits[0].object : null
      planes.forEach(m => { m.userData.isHovered = m === hoveredMesh })

      // Update planes
      const imageAdvance = textures.length > 0 ? VISIBLE_COUNT % textures.length || textures.length : 0
      const half = DEPTH_RANGE / 2
      planes.forEach((mesh, i) => {
        const ud = mesh.userData
        let newZ = ud.z + st.velocity * dt * 10

        let wf = 0, wb = 0
        if (newZ >= DEPTH_RANGE) { wf = Math.floor(newZ / DEPTH_RANGE); newZ -= DEPTH_RANGE * wf }
        else if (newZ < 0)       { wb = Math.ceil(-newZ / DEPTH_RANGE); newZ += DEPTH_RANGE * wb }

        if (wf > 0 && imageAdvance > 0) ud.imgIdx = (ud.imgIdx + wf * imageAdvance) % textures.length
        if (wb > 0 && imageAdvance > 0) { const s = ud.imgIdx - wb * imageAdvance; ud.imgIdx = ((s % textures.length) + textures.length) % textures.length }

        ud.z = ((newZ % DEPTH_RANGE) + DEPTH_RANGE) % DEPTH_RANGE
        const worldZ = ud.z - half
        mesh.position.set(spatial[i].x, spatial[i].y, worldZ)

        // Fade / blur
        const norm = ud.z / DEPTH_RANGE
        let opacity = 1
        const fi = { s: 0.05, e: 0.25 }, fo = { s: 0.75, e: 0.88 }
        if (norm < fi.s) opacity = 0
        else if (norm < fi.e) opacity = (norm - fi.s) / (fi.e - fi.s)
        else if (norm > fo.e) opacity = 0
        else if (norm > fo.s) opacity = 1 - (norm - fo.s) / (fo.e - fo.s)

        let blur = 0
        const bi = { s: 0, e: 0.12 }, bo = { s: 0.78, e: 0.88 }, maxB = 6
        if (norm < bi.s) blur = maxB
        else if (norm < bi.e) blur = maxB * (1 - (norm - bi.s) / (bi.e - bi.s))
        else if (norm > bo.e) blur = maxB
        else if (norm > bo.s) blur = maxB * (norm - bo.s) / (bo.e - bo.s)

        // Update texture if wrapping changed image
        const u = mesh.material.uniforms
        if (u.map.value !== textures[ud.imgIdx]) u.map.value = textures[ud.imgIdx]
        u.opacity.value = Math.max(0, Math.min(1, opacity))
        u.blurAmount.value = Math.max(0, Math.min(maxB, blur))
        u.scrollForce.value = st.velocity
        u.time.value = st.time
        u.isHovered.value = ud.isHovered ? 1 : 0
      })

      renderer.render(scene, camera)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      clearInterval(autoTimer)
      window.removeEventListener('resize', resize)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('wheel', onWheel)
      renderer.dispose()
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement)
    }
  }, [getUrls, speed])

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    />
  )
}
