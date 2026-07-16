import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl'
import { useCallback, useEffect, useRef } from 'react'
import './CircularGallery.css'

function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

function lerp(p1, p2, t) { return p1 + (p2 - p1) * t }

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance)
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance)
    }
  })
}

const DEFAULT_FONT = '900 72px Figtree'
const DEFAULT_FONT_URL = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;700;900&display=swap'

function deriveFontFamilyFromUrl(url) {
  const fileName = (url.split('/').pop() || 'custom-font').split('?')[0]
  const base = fileName.replace(/\.(woff2?|ttf|otf|eot)$/i, '')
  return base.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'CircularGalleryFont'
}

async function loadFontFromStylesheet(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch font stylesheet (${response.status})`)
  const cssText = await response.text()
  const faceBlocks = cssText.match(/@font-face\s*{[^}]*}/g) || []
  let family = null
  const fontFaces = []
  for (const block of faceBlocks) {
    const familyMatch = block.match(/font-family:\s*['"]?([^;'"]+)['"]?/)
    const urlMatch = block.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/)
    if (!familyMatch || !urlMatch) continue
    family = familyMatch[1].trim()
    const descriptors = {}
    const weightMatch = block.match(/font-weight:\s*([^;]+);/)
    const styleMatch = block.match(/font-style:\s*([^;]+);/)
    const rangeMatch = block.match(/unicode-range:\s*([^;]+);/)
    if (weightMatch) descriptors.weight = weightMatch[1].trim()
    if (styleMatch) descriptors.style = styleMatch[1].trim()
    if (rangeMatch) descriptors.unicodeRange = rangeMatch[1].trim()
    fontFaces.push(new FontFace(family, `url(${urlMatch[1]})`, descriptors))
  }
  if (!family) throw new Error('No @font-face rule found in the stylesheet')
  await Promise.allSettled(fontFaces.map(async face => { await face.load(); document.fonts.add(face) }))
  return family
}

async function loadFontFromFile(url) {
  const family = deriveFontFamilyFromUrl(url)
  const fontFace = new FontFace(family, `url(${url})`)
  await fontFace.load()
  document.fonts.add(fontFace)
  return family
}

async function loadCustomFont(fontUrl) {
  const isStylesheet = fontUrl.includes('fonts.googleapis.com') || /\.css(\?.*)?$/i.test(fontUrl)
  return isStylesheet ? loadFontFromStylesheet(fontUrl) : loadFontFromFile(fontUrl)
}

async function resolveFont(font, fontUrl) {
  const effectiveUrl = fontUrl || (font === DEFAULT_FONT ? DEFAULT_FONT_URL : null)
  if (!effectiveUrl) {
    if (document.fonts?.load) { try { await document.fonts.load(font); await document.fonts.ready } catch {} }
    return font
  }
  try {
    const family = await loadCustomFont(effectiveUrl)
    const sizeMatch = font.match(/^\s*(.*?\d+px)/)
    const prefix = sizeMatch ? sizeMatch[1].trim() : 'bold 30px'
    const resolved = `${prefix} "${family}"`
    if (document.fonts?.load) { try { await document.fonts.load(resolved) } catch {} }
    return resolved
  } catch (error) {
    return font
  }
}

function getFontSize(font) {
  const match = font.match(/(\d+)px/)
  return match ? parseInt(match[1], 10) : 30
}

function createTextTexture(gl, text, font = '900 72px monospace', color = 'black') {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if ('letterSpacing' in context) context.letterSpacing = '0px'
  context.font = font
  const metrics = context.measureText(text)
  const textWidth = Math.ceil(metrics.width)
  const textHeight = Math.ceil(getFontSize(font) * 1.2)
  canvas.width = textWidth + 24
  canvas.height = textHeight + 24
  if ('letterSpacing' in context) context.letterSpacing = '0px'
  context.font = font
  context.fillStyle = color
  context.textBaseline = 'middle'
  context.textAlign = 'center'
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillText(text, canvas.width / 2, canvas.height / 2)
  const texture = new Texture(gl, { generateMipmaps: false })
  texture.image = canvas
  return { texture, width: canvas.width, height: canvas.height }
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = '#545050', font = '30px sans-serif' }) {
    autoBind(this)
    this.gl = gl; this.plane = plane; this.renderer = renderer
    this.text = text; this.textColor = textColor; this.font = font
    this.createMesh()
  }
  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor)
    const geometry = new Plane(this.gl)
    const program = new Program(this.gl, {
      vertex: `attribute vec3 position; attribute vec2 uv; uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix; varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragment: `precision highp float; uniform sampler2D tMap; varying vec2 vUv; void main() { vec4 color = texture2D(tMap, vUv); if (color.a < 0.1) discard; gl_FragColor = color; }`,
      uniforms: { tMap: { value: texture } },
      transparent: true
    })
    this.mesh = new Mesh(this.gl, { geometry, program })
    const aspect = width / height
    const screenWidth = this.renderer.gl.canvas?.clientWidth || window.innerWidth
    const textScale = screenWidth < 768 ? 0.065 : screenWidth < 1025 ? 0.08 : 0.1
    const textHeight = this.plane.scale.y * textScale
    const textWidthRaw = textHeight * aspect
    const maxWidth = this.plane.scale.x * 0.85
    const clamp = Math.min(1, maxWidth / textWidthRaw)
    const textWidth = textWidthRaw * clamp
    this.mesh.scale.set(textWidth, textHeight * clamp, 1)
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * clamp * 0.5 - 0.05
    this.mesh.setParent(this.plane)
  }
}

class Media {
  constructor({ geometry, gl, image, index, length, renderer, scene, screen, text, viewport, bend, textColor, borderRadius = 0, font, app }) {
    this.extra = 0; this.highlightT = 0
    this.geometry = geometry; this.gl = gl; this.image = image
    this.index = index; this.length = length; this.renderer = renderer
    this.scene = scene; this.screen = screen; this.text = text
    this.viewport = viewport; this.bend = bend; this.textColor = textColor
    this.borderRadius = borderRadius; this.font = font
    this.app = app
    this.createShader(); this.createMesh(); this.onResize()
  }
  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true })
    this.program = new Program(this.gl, {
      depthTest: false, depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position; attribute vec2 uv;
        uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix;
        uniform float uTime; uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }`,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes; uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform float uHighlight;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);

          // 흑백 → 컬러 (hover)
          vec3 finalColor = color.rgb;

          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);

          gl_FragColor = vec4(finalColor, alpha);
        }`,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uHighlight: { value: 1 },
      },
      transparent: true
    })
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = this.image
    img.onload = () => {
      texture.image = img
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight]
    }
  }
  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program })
    this.plane.setParent(this.scene)
  }
  createTitle() {
    this.title = new Title({ gl: this.gl, plane: this.plane, renderer: this.renderer, text: this.text, textColor: this.textColor, font: this.font })
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra

    const x = this.plane.position.x
    const H = this.viewport.width / 2
    const effectiveBend = this.screen.width < 768 ? 0.35 : this.screen.width < 1025 ? 1.1 : this.bend

    if (effectiveBend === 0) {
      this.plane.position.y = 0; this.plane.rotation.z = 0
    } else {
      const B_abs = Math.abs(effectiveBend)
      const R = (H * H + B_abs * B_abs) / (2 * B_abs)
      const effectiveX = Math.min(Math.abs(x), H)
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX)
      if (effectiveBend > 0) {
        this.plane.position.y = -arc
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R)
      } else {
        this.plane.position.y = arc
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R)
      }
    }

    this.speed = scroll.current - scroll.last
    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = this.speed

    // Hover highlight: compare mouse X to item screen center
    const screenScale = this.screen.width / this.viewport.width
    const itemScreenCx = x * screenScale + this.screen.width / 2
    const itemHalfW = (this.plane.scale.x * screenScale) / 2
    const mouseX = this.app.mouse ? this.app.mouse.x : -9999
    const inBounds = Math.abs(itemScreenCx - mouseX) < itemHalfW
    this.highlightT = lerp(this.highlightT, inBounds ? 1 : 0, 0.1)
    this.program.uniforms.uHighlight.value = this.highlightT

    const planeOffset = this.plane.scale.x / 2
    const viewportOffset = this.viewport.width / 2
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset
    if (direction === 'right' && this.isBefore) { this.extra -= this.widthTotal; this.isBefore = this.isAfter = false }
    if (direction === 'left' && this.isAfter) { this.extra += this.widthTotal; this.isBefore = this.isAfter = false }
  }
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen
    if (viewport) { this.viewport = viewport; if (this.plane.program.uniforms.uViewportSizes) this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height] }
    const isMobile = this.screen.width < 768
    const isTablet = this.screen.width < 1025
    const planeBaseWidth = isMobile ? 460 : isTablet ? 600 : 860
    const planeBaseHeight = isMobile ? 300 : isTablet ? 390 : 570
    this.scale = this.screen.height / 1500
    this.plane.scale.y = (this.viewport.height * (planeBaseHeight * this.scale)) / this.screen.height
    this.plane.scale.x = (this.viewport.width * (planeBaseWidth * this.scale)) / this.screen.width
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]
    this.padding = isMobile ? 0.75 : isTablet ? 1 : 1.6
    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length
    this.x = this.width * this.index
  }
}

class App {
  constructor(container, { items, bend, textColor = '#ffffff', borderRadius = 0, font = 'bold 30px Figtree', scrollSpeed = 2, scrollEase = 0.05, onItemClick, onFrame } = {}) {
    this.container = container
    this.scrollSpeed = scrollSpeed
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 }
    this.mouse = { x: -9999, y: -9999 }
    this.onItemClick = onItemClick
    this.onFrame = onFrame || null
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200)
    this.createRenderer(); this.createCamera(); this.createScene()
    this.onResize(); this.createGeometry()
    this.createMedias(items, bend, textColor, borderRadius, font)
    this.update(); this.addEventListeners()
  }
  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)
  }
  createCamera() { this.camera = new Camera(this.gl); this.camera.fov = 45; this.camera.position.z = 20 }
  createScene() { this.scene = new Transform() }
  createGeometry() { this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 }) }
  createMedias(items, bend = 1, textColor, borderRadius, font) {
    const defaultItems = [
      { image: `https://picsum.photos/seed/1/800/600`, text: 'Project 01' },
      { image: `https://picsum.photos/seed/2/800/600`, text: 'Project 02' },
      { image: `https://picsum.photos/seed/3/800/600`, text: 'Project 03' },
    ]
    const galleryItems = items?.length ? items : defaultItems
    this.galleryLength = galleryItems.length
    this.mediasImages = galleryItems.concat(galleryItems)
    this.medias = this.mediasImages.map((data, index) => new Media({
      geometry: this.planeGeometry, gl: this.gl, image: data.image, index,
      length: this.mediasImages.length, renderer: this.renderer, scene: this.scene,
      screen: this.screen, text: data.text, viewport: this.viewport,
      bend, textColor, borderRadius, font, app: this
    }))
  }
  onTouchDown(e) { this.isDown = true; this.scroll.position = this.scroll.current; this.start = e.touches ? e.touches[0].clientX : e.clientX }
  onTouchMove(e) {
    if (!this.isDown) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    this.scroll.target = this.scroll.position + (this.start - x) * (this.scrollSpeed * 0.025)
  }
  onTouchUp(e) {
    this.isDown = false
    // Click detection: minimal drag
    if (this.start !== undefined) {
      const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
      const drag = Math.abs(this.start - x)
      if (drag < 6 && this.onItemClick) {
        // Find item under mouse
        const rect = this.container.getBoundingClientRect()
        const clickX = (e.clientX || (e.changedTouches?.[0].clientX ?? 0)) - rect.left
        this.findAndClickItem(clickX)
      }
    }
    this.onCheck()
  }
  findAndClickItem(screenX) {
    if (!this.medias) return
    const screenScale = this.screen.width / this.viewport.width
    let closest = null; let closestDist = Infinity; let closestHalfW = 0
    for (let i = 0; i < this.medias.length; i++) {
      const m = this.medias[i]
      const itemScreenCx = m.plane.position.x * screenScale + this.screen.width / 2
      const dist = Math.abs(itemScreenCx - screenX)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
        closestHalfW = (m.plane.scale.x * screenScale) / 2
      }
    }
    // 실제 이미지 영역 안을 클릭했을 때만 팝업 — 빈 공간 클릭은 무시
    if (closest !== null && closestDist < closestHalfW) {
      const originalIndex = closest % this.galleryLength
      this.onItemClick(originalIndex)
    }
  }
  onMouseMove(e) {
    const rect = this.container.getBoundingClientRect()
    this.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    this.container.style.cursor = this.mouse ? 'pointer' : 'grab'
  }
  onMouseLeave() { this.mouse = { x: -9999, y: -9999 } }
  onWheel(e) {
    e.stopPropagation()
    const delta = e.deltaY || e.wheelDelta || e.detail
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2
    this.onCheckDebounce()
  }
  onCheck() {
    if (!this.medias?.[0]) return
    const width = this.medias[0].width
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width)
    const item = width * itemIndex
    this.scroll.target = this.scroll.target < 0 ? -item : item
  }
  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.camera.perspective({ aspect: this.screen.width / this.screen.height })
    const fov = (this.camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    this.viewport = { width: height * this.camera.aspect, height }
    if (this.medias) this.medias.forEach(m => m.onResize({ screen: this.screen, viewport: this.viewport }))
  }
  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left'
    if (this.medias) this.medias.forEach(m => m.update(this.scroll, direction))
    this.renderer.render({ scene: this.scene, camera: this.camera })
    this.scroll.last = this.scroll.current

    if (this.onFrame && this.medias) {
      const sw = this.screen.width
      const sh = this.screen.height
      const scaleX = sw / this.viewport.width
      const scaleY = sh / this.viewport.height
      const labelOffsetPx = 26 // 이미지 하단 가장자리로부터 텍스트 중심까지의 거리(px, 가장자리와 평행 유지)
      const labelOffset = labelOffsetPx / scaleY // 픽셀 → 월드 단위 환산
      this.onFrame(this.medias.map(m => {
        const hh = m.plane.scale.y / 2
        const theta = m.plane.rotation.z
        // 로컬 하단 중앙 지점 (0, -(hh + labelOffset))을 타일과 같은 각도로 회전시켜
        // 텍스트가 항상 기울어진 하단 가장자리와 평행 + 등간격을 유지하도록 함
        const dist = hh + labelOffset
        const localX = dist * Math.sin(theta)
        const localY = -dist * Math.cos(theta)
        const worldX = m.plane.position.x + localX
        const worldY = m.plane.position.y + localY
        return {
          x: worldX * scaleX + sw / 2,
          y: sh / 2 - worldY * scaleY,
          rotation: theta,
          text: m.text,
        }
      }))
    }

    this.raf = window.requestAnimationFrame(this.update.bind(this))
  }
  addEventListeners() {
    this.boundOnResize   = this.onResize.bind(this)
    this.boundOnWheel    = this.onWheel.bind(this)
    this.boundOnTouchDown = this.onTouchDown.bind(this)
    this.boundOnTouchMove = this.onTouchMove.bind(this)
    this.boundOnTouchUp  = this.onTouchUp.bind(this)
    this.boundOnMouseMove = this.onMouseMove.bind(this)
    this.boundOnMouseLeave = this.onMouseLeave.bind(this)

    // GSAP 핀 등 레이아웃 변경 시 canvas 크기 재조정
    this.resizeObserver = new ResizeObserver(() => this.onResize())
    this.resizeObserver.observe(this.container)

    window.addEventListener('resize', this.boundOnResize)
    this.container.addEventListener('wheel', this.boundOnWheel, { passive: false })
    this.container.addEventListener('mousemove', this.boundOnMouseMove)
    this.container.addEventListener('mouseleave', this.boundOnMouseLeave)
    this.container.addEventListener('mousedown', this.boundOnTouchDown)
    window.addEventListener('mousemove', this.boundOnTouchMove)
    window.addEventListener('mouseup', this.boundOnTouchUp)
    this.container.addEventListener('touchstart', this.boundOnTouchDown)
    window.addEventListener('touchmove', this.boundOnTouchMove)
    window.addEventListener('touchend', this.boundOnTouchUp)
  }
  destroy() {
    window.cancelAnimationFrame(this.raf)
    if (this.resizeObserver) this.resizeObserver.disconnect()
    window.removeEventListener('resize', this.boundOnResize)
    this.container.removeEventListener('wheel', this.boundOnWheel)
    this.container.removeEventListener('mousemove', this.boundOnMouseMove)
    this.container.removeEventListener('mouseleave', this.boundOnMouseLeave)
    this.container.removeEventListener('mousedown', this.boundOnTouchDown)
    window.removeEventListener('mousemove', this.boundOnTouchMove)
    window.removeEventListener('mouseup', this.boundOnTouchUp)
    this.container.removeEventListener('touchstart', this.boundOnTouchDown)
    window.removeEventListener('touchmove', this.boundOnTouchMove)
    window.removeEventListener('touchend', this.boundOnTouchUp)
    if (this.renderer?.gl?.canvas?.parentNode) this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas)
  }
}

export default function CircularGallery({ items, bend = 3, textColor = '#ffffff', borderRadius = 0.05, font = DEFAULT_FONT, fontUrl, scrollSpeed = 2, scrollEase = 0.05, onItemClick }) {
  const containerRef = useRef(null)
  const appRef = useRef(null)
  const labelsRef = useRef(null)

  const navigate = (dir) => {
    const app = appRef.current
    if (!app || !app.medias?.[0]) return
    const width = app.medias[0].width
    app.scroll.target += dir * width
    app.onCheck()
  }

  const handleFrame = useCallback((positions) => {
    if (!labelsRef.current) return
    const children = labelsRef.current.children
    positions.forEach((pos, i) => {
      const el = children[i]
      if (!el) return
      const deg = -(pos.rotation * 180 / Math.PI)
      el.style.left = `${pos.x}px`
      el.style.top = `${pos.y}px`
      el.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`
    })
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    let isMounted = true
    resolveFont(font, fontUrl).then(resolvedFont => {
      if (!isMounted || !containerRef.current) return
      appRef.current = new App(containerRef.current, { items, bend, textColor, borderRadius, font: resolvedFont, scrollSpeed, scrollEase, onItemClick, onFrame: handleFrame })
    })
    return () => {
      isMounted = false
      if (appRef.current) { appRef.current.destroy(); appRef.current = null }
    }
  }, [items, bend, textColor, borderRadius, font, fontUrl, scrollSpeed, scrollEase, handleFrame])

  const labelItems = items?.length ? [...items, ...items] : []

  return (
    <div className="circular-gallery-wrapper">
      <div
        className="circular-gallery"
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label="Project gallery. Scroll or drag to navigate."
      />

      {/* HTML 텍스트 오버레이 — 각 이미지 하단에 텍스트 표시 */}
      <div ref={labelsRef} className="cg-labels" aria-hidden="true">
        {labelItems.map((item, i) => (
          <span key={i} className="cg-label">{item.text}</span>
        ))}
      </div>

      {/* 하단 화살표 */}
      <div className="circular-gallery-bottom-nav">
        <button
          className="circular-gallery-bottom-btn"
          onClick={() => navigate(-1)}
          aria-label="Previous"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          className="circular-gallery-bottom-btn"
          onClick={() => navigate(1)}
          aria-label="Next"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
