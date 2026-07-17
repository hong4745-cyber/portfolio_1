import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroParticles } from '@/components/ui/hero-particles'
import { ScrollIndicator } from '@/components/ui/scroll-indicator'
import { TiltCard } from '@/components/ui/tilt-card'
import { SplitHeroLine } from '@/components/ui/split-hero-line'
import { Starfield } from '@/components/ui/starfield'
import { FallingPetals } from '@/components/ui/falling-petals'
import { DemoOne } from '@/components/ui/demo'
import ScrollStack, { ScrollStackItem } from '@/components/ui/scroll-stack'
import { ResumeSchedule } from '@/components/ui/resume-schedule'
import CircularGallery from '@/components/ui/CircularGallery'
import { BentoCell, BentoGrid, ContainerScroll } from '@/components/ui/hero-gallery-scroll-animation'
import CelestialBloomShader from '@/components/ui/celestial-bloom-shader'
import { BlurIn } from '@/components/ui/blur-in'
import BlurText from '@/components/ui/BlurText'
import ExpandOnHover from '@/components/ui/ExpandOnHover'
import { LogoMarquee } from '@/components/ui/LogoMarquee'
import { Palette, Film, Code2, Server, Sparkles, Workflow as WorkflowIcon, X } from 'lucide-react'
import projImg1 from '@/assets/images/hemilygroup.png'
import projImg2 from '@/assets/images/poster_1.jpg'
import projImg3 from '@/assets/images/Mock-up/festival_night.png'
import mockup1 from '@/assets/images/Mock-up/festival_night.png'
import mockup2 from '@/assets/images/Mock-up/festival_night_1.png'
import mockup3 from '@/assets/images/Mock-up/festival_night_2.png'
import mockup4 from '@/assets/images/Mock-up/exhibition.png'
import mockup8 from '@/assets/images/Mock-up/exhibition catalog_8.png'
import projectArchiveBook from '@/assets/images/Mock-up/2020.12_공주학아카이브 - 연구총서 제4집_1.png'
import galleryYogaMain from '@/assets/images/kimyoga_1.JPG'
import galleryYoga from '@/assets/images/kimyoga_3.JPG'
import galleryOnepage from '@/assets/images/onepage.png'
import galleryHemily from '@/assets/images/hemilygroup_1.JPG'
import projectPoster from '@/assets/images/poster.png'
import projectOnepageSquare from '@/assets/images/onepage_2.png'
import iconClaudeCode from '@/assets/images/claudecode-color.png'
import bloomingProcess1 from '@/assets/images/Blooming Process_1.png'
import bloomingProcess2 from '@/assets/images/Blooming Process_2.png'
import bloomingProcess3 from '@/assets/images/Blooming Process_3.png'
import bloomingProcess4 from '@/assets/images/Blooming Process_4.png'
import bloomingProcess5 from '@/assets/images/Blooming Process_6.png'
import './App.css'

const SECTIONS = ['about', 'about_1', 'skills', 'projects_0', 'projects', 'epilogue']
const HERO_VH = 700

const heroLines = [
  ['계속 배우고,', '계속 만들어왔습니다.'],
  ['디자인을 넘어,', '경험을 설계합니다.'],
  ['아직 완성은 아닙니다.', '하지만 계속 피어나는 중입니다.'],
]

// 각 줄의 등장/퇴장 진행도 임계값 — 겹치지 않는 순차 구간
const HERO_APPEARS = [0.08, 0.28, 0.54]
const HERO_EXITS   = [0.24, 0.48, 0.80]

const projectsData = [
  {
    num: '01',
    title: 'Web Publishing',
    desc: '실제 기업 홈페이지를 분석하여\n반응형 퍼블리싱과 인터랙션을 구현한 프로젝트입니다.',
    tags: ['WEB', 'HTML5', 'CSS3', 'JAVASCRIPT'],
    image: projImg1,
    url: 'https://hong4745-cyber.github.io/hemilygroup/',
  },
  {
    num: '02',
    title: 'UI/UX Web Renewal',
    desc: '기존 요가·필라테스 홈페이지를\n사용자 중심의 반응형 웹으로 리뉴얼한 프로젝트입니다.',
    tags: ['Figma', 'HTML5', 'CSS3', 'JavaScript', 'Firebase'],
    image: galleryYoga,
    url: 'https://hong4745-cyber.github.io/kimyoga/',
    planUrl: 'https://www.figma.com/design/EudRn9g7JHQEF84xqjTqEP/%ED%99%88%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%A6%AC%EB%89%B4%EC%96%BC?node-id=553-77&t=EKgT5TVB6ojHSfvY-1',
    designUrl: 'https://www.figma.com/design/EudRn9g7JHQEF84xqjTqEP/%ED%99%88%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%A6%AC%EB%89%B4%EC%96%BC?node-id=314-1942&t=EKgT5TVB6ojHSfvY-1',
  },
  {
    num: '03',
    title: 'UI/UX Web Design',
    desc: '프리미엄 오디오 브랜드를 모티브로 제작한\nReact 기반 커머스 웹사이트 프로젝트입니다.',
    tags: ['React', 'Firebase', 'GSAP', 'Polar.sh'],
    image: galleryOnepage,
    url: 'https://onepage-khaki.vercel.app',
    planUrl: 'https://www.figma.com/design/6iPpbhdNdxPyyJlw12D01Q/%EC%9D%BC%EC%B2%B4%ED%98%95-%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%B0%B1%EC%A7%80%EC%9D%80?node-id=206-1017&t=jqUWdvsvtDzZcWvW-1',
    designUrl: 'https://www.figma.com/design/6iPpbhdNdxPyyJlw12D01Q/%EC%9D%BC%EC%B2%B4%ED%98%95-%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%B0%B1%EC%A7%80%EC%9D%80?node-id=0-1&t=jqUWdvsvtDzZcWvW-1',
  },
  {
    num: '04',
    title: 'Editorial Design',
    desc: "전통문화 행사 '공주 야행'의 포스터, 리플렛 등\n홍보물 전반을 디자인한 프로젝트입니다.",
    tags: ['InDesign', 'Photoshop', 'Illustrator'],
    image: mockup1,
    url: null,
  },
  {
    num: '05',
    title: 'Editorial Design',
    desc: "전통문화 행사 '공주 야행'의 포스터, 리플렛 등\n홍보물 전반을 디자인한 프로젝트입니다.",
    tags: ['InDesign', 'Photoshop', 'Illustrator'],
    image: mockup2,
    url: null,
  },
  {
    num: '06',
    title: 'Exhibition Catalog Design',
    desc: '박물관 기획전 도록의 표지와 내지를 디자인하고,\n정보 전달과 가독성을 고려한 편집 레이아웃을 제작한 프로젝트입니다.',
    tags: ['InDesign', 'Photoshop', 'Illustrator'],
    image: mockup8,
    url: null,
  },
]


const skillsData = [
  { num: '01', title: 'Design',      tags: ['Figma', 'Illustrator', 'Photoshop', 'InDesign'],              accent: '#7F29DA' },
  { num: '02', title: 'Motion',      tags: ['Premiere', 'GSAP', 'CSS Animation'],                          accent: '#f472b6' },
  { num: '03', title: 'Frontend',    tags: ['HTML5', 'CSS3', 'JavaScript', 'React', 'TypeScript'],         accent: '#34d399' },
  { num: '04', title: 'Backend',     tags: ['Firebase', 'REST API', 'GitHub'],                            accent: '#fb923c' },
  { num: '05', title: 'AI Tools',    tags: ['ChatGPT', 'Claude', 'Claude Code', 'Gemini'],                 accent: '#818cf8' },
  { num: '06', title: 'Workflow',    tags: ['VS Code', 'Notion', 'Slack', 'Figma Dev Mode'],               accent: '#fbbf24' },
]

const skillIcons = [Palette, Film, Code2, Server, Sparkles, WorkflowIcon]

const skillLogos = [
  { name: 'HTML5',         icon: 'logos:html-5',                    usage: '웹 퍼블리싱, 시멘틱 마크업',                    usedIn: ['01', '02', '03'] },
  { name: 'CSS3',          icon: 'logos:css-3',                     usage: '반응형 레이아웃, 커스텀 애니메이션',              usedIn: ['01', '02', '03'] },
  { name: 'JavaScript',    icon: 'logos:javascript',                usage: 'DOM 제어, 인터랙션 구현, API 연동',             usedIn: ['01', '02', '03'] },
  { name: 'React',         icon: 'logos:react',                     usage: 'SPA 컴포넌트 설계 및 개발',                    usedIn: ['03', 'portfolio'] },
  { name: 'TypeScript',    icon: 'logos:typescript-icon',           usage: '컴포넌트 타입 정의 및 안전한 코드 작성',          usedIn: ['portfolio'] },
  { name: 'GitHub',        icon: 'logos:github-icon',  invert: true, usage: '버전 관리 및 GitHub Pages 배포',             usedIn: ['01', '02', '03'] },
  { name: 'Figma',         icon: 'logos:figma',                     usage: 'UI 기획, 와이어프레임, 프로토타입 제작',          usedIn: ['02', 'portfolio'] },
  { name: 'Firebase',      icon: 'logos:firebase',                  usage: 'Realtime Database, 호스팅, 인증',              usedIn: ['02', '03'] },
  { name: 'Photoshop',     icon: 'logos:adobe-photoshop',           usage: '이미지 보정·합성, 포스터·브로슈어 시각 작업',     usedIn: ['04', '05', '06'] },
  { name: 'Illustrator',   icon: 'logos:adobe-illustrator',         usage: '벡터 그래픽, 포스터·홍보물 일러스트 제작',        usedIn: ['04', '05', '06'] },
  { name: 'Premiere Pro',  icon: 'logos:adobe-premiere',            usage: '컷 편집, 자막, 색보정, 출력',                   usedIn: ['edu-video'] },
  { name: 'InDesign',      icon: 'logos:adobe-indesign',            usage: '브로슈어·리플렛·포스터·도록 편집 레이아웃 제작',   usedIn: ['04', '05', '06'] },
  { name: 'ChatGPT',       icon: 'simple-icons:openai',  color: '#74AA9C', usage: '코드 보조 및 콘텐츠 기획',              usedIn: ['portfolio-gpt'] },
  { name: 'GPT Codex',     icon: 'simple-icons:openai',  color: '#ffffff', usage: '코드 자동 완성 및 생성 보조',            usedIn: ['portfolio-codex'] },
  { name: 'Claude',        icon: 'simple-icons:claude',  color: '#D97757', usage: 'AI 페어 프로그래밍, 설계 검토',          usedIn: ['portfolio-claude'] },
  { name: 'Claude Code',   imgSrc: iconClaudeCode,       color: '#CC785C', usage: '포트폴리오 전반 개발 협업',              usedIn: ['03', 'portfolio'] },
  { name: 'Gemini',        icon: 'simple-icons:googlegemini', color: '#8E75B2', usage: 'AI 이미지 생성, 광고 콘텐츠 기획', usedIn: ['edu-ai'] },
  { name: 'Canva',         icon: 'simple-icons:canva',        color: '#00C4CC', usage: '소셜 콘텐츠·발표자료·간편 그래픽 제작', usedIn: [] },
  { name: 'Flow',          icon: 'mdi:movie-play-outline',    color: '#4285F4', usage: 'Google AI 영상 생성 및 편집',            usedIn: [] },
]

const galleryItems = projectsData.map(p => ({ image: p.image, text: p.title }))

const projects0Images = [
  {
    src: galleryYogaMain,
    alt: 'Kim Yoga main visual',
  },
  {
    src: projectArchiveBook,
    alt: 'Gongju Studies Archive research book',
  },
  {
    src: projectPoster,
    alt: 'Poster design',
  },
  {
    src: galleryHemily,
    alt: 'Hemilygroup project',
  },
  {
    src: projectOnepageSquare,
    alt: 'Onepage project',
  },
]

const bloomingProcessImages = [
  { src: bloomingProcess1, alt: 'Blooming Process 1', num: '01', title: 'Root', subtitle: '디자인의 기본을 쌓다.' },
  { src: bloomingProcess2, alt: 'Blooming Process 2', num: '02', title: 'Expand', subtitle: '사용자의 경험을 설계하다.' },
  { src: bloomingProcess3, alt: 'Blooming Process 3', num: '03', title: 'Build', subtitle: '디자인을 직접 구현하다.' },
  { src: bloomingProcess4, alt: 'Blooming Process 4', num: '04', title: 'Connect', subtitle: '디자인과 개발을 연결하다.' },
  { src: bloomingProcess5, alt: 'Blooming Process 5', num: '05', title: 'Bloom', subtitle: '배움을 프로젝트로 완성하다.' },
]

function LazyIframe({ src, title, style, className }) {
  const frameRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const node = frameRef.current
    if (!node) return

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShouldLoad(true)
      },
      { rootMargin: '650px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={frameRef} className={className} style={style}>
      {shouldLoad && (
        <iframe
          src={src}
          frameBorder="0"
          allowFullScreen
          title={title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
        />
      )}
    </div>
  )
}

function App() {
  const [lineStates, setLineStates]   = useState(() => heroLines.map(() => 'idle'))
  const [selectedProject, setSelectedProject] = useState(null)
  const lineStatesRef      = useRef(lineStates)
  const heroLineRefs       = useRef([])
  const heroOverlayRef     = useRef(null)
  const heroParticlesRef   = useRef(null)
  const scrollIndicatorRef = useRef(null)
const splineRef          = useRef(null)
  const splineStickyRef    = useRef(null)
  const aboutSectionRef    = useRef(null)
  const aboutSplineRef     = useRef(null)
  const aboutInnerRef      = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const heroEnd = () => (HERO_VH / 100 - 1) * window.innerHeight

    // ── 히어로 스크롤 애니메이션 (기존 유지) ──────────────────────────
    const onScroll = () => {
      scrollIndicatorRef.current?.classList.toggle('scroll-indicator--hidden', window.scrollY > 40)
      const progress = Math.min(window.scrollY / heroEnd(), 1)
      if (splineRef.current) splineRef.current.style.transform = `scale(${1 + progress * 0.18})`
      const FADE_START = 0.88
      const sticky = splineStickyRef.current
      if (progress >= FADE_START) {
        const t = Math.min((progress - FADE_START) / (1 - FADE_START), 1)
        if (sticky) { sticky.style.opacity = String(1 - t * 0.35); sticky.style.filter = `blur(${(t * 3).toFixed(1)}px)`; sticky.style.transform = `scale(${1 + t * 0.03})` }
      } else {
        if (sticky) { sticky.style.opacity = '1'; sticky.style.filter = 'none'; sticky.style.transform = 'none' }
      }
      const activeLineIndex = HERO_APPEARS.findIndex((appear, i) =>
        progress >= appear && progress < HERO_EXITS[i]
      )
      const nextStates = HERO_APPEARS.map((_, i) =>
        i === activeLineIndex ? 'enter' : 'idle'
      )
      if (nextStates.some((s, i) => s !== lineStatesRef.current[i])) {
        heroLineRefs.current.forEach((ref, i) => {
          if (i !== activeLineIndex) ref?.hardHide()
        })

        lineStatesRef.current = nextStates
        setLineStates(nextStates)
      }
    }

    const onMouseMove = (e) => {
      if (window.scrollY > heroEnd() - 50) return
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      if (heroOverlayRef.current) heroOverlayRef.current.style.transform = `translate3d(${nx * -14}px, ${ny * -10}px, 0)`
      if (heroParticlesRef.current) heroParticlesRef.current.style.transform = `translate3d(${nx * 8}px, ${ny * 6}px, 0)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouseMove)
    // 마운트 즉시 한 번 실행해 초기 상태 반영
    onScroll()

    const aboutNode = aboutSectionRef.current
    let aboutObserver
    if (aboutNode) {
      if ('IntersectionObserver' in window) {
        aboutObserver = new IntersectionObserver(
          ([entry]) => {
            aboutNode.classList.toggle('about-visible', entry.isIntersecting)
          },
          { threshold: 0.28 },
        )
        aboutObserver.observe(aboutNode)
      } else {
        aboutNode.classList.add('about-visible')
      }
    }

    // ── GSAP ScrollTrigger — 연속 씬 ───────────────────────────────────
    // Skills — 로고마키 스크롤 scale 액션
    gsap.timeline({
      scrollTrigger: {
        trigger: '#skills',
        start: 'top bottom',
        end: 'center center',
        scrub: 0.9,
      },
    })
      .fromTo('.skills-velocity-wrap',
        {
          scale: 0.08,
          y: 42,
          opacity: 0,
          filter: 'blur(10px)',
          transformOrigin: '50% 50%',
        },
        {
          scale: 1.28,
          y: -8,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'expo.out',
          duration: 0.72,
        }
      )
      .to('.skills-velocity-wrap', {
        scale: 1,
        y: 0,
        ease: 'power2.out',
        duration: 0.28,
      })

    // Projects — CircularGallery만 진입 scale 애니메이션
    gsap.fromTo('.projects-gallery-scale',
      { scale: 0.4, opacity: 0, filter: 'blur(8px)' },
      {
        scale: 1, opacity: 1, filter: 'blur(0px)',
        ease: 'expo.out',
        transformOrigin: '50% 50%',
        scrollTrigger: {
          trigger: '#projects',
          start: 'top bottom',
          end: 'top top',
          scrub: 1.2,
        }
      }
    )

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      const projectsPin = ScrollTrigger.create({
        trigger: '#projects',
        start: 'top top',
        end: '+=150%',
        pin: true,
        anticipatePin: 1,
      })

      return () => projectsPin.kill()
    })

    // Epilogue
    gsap.timeline({
      scrollTrigger: {
        trigger: '#epilogue',
        start: 'top top',
        end: '+=180%',
        pin: true,
        anticipatePin: 1,
        scrub: 1.8,
      },
    })
      .fromTo('.epilogue-desc',
        { opacity: 0, y: 52, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'power2.out' },
        0.5
      )

    // Hero/About의 Spline 씬(외부 스크립트)이 초기 계산 이후 늦게 로드되면서 문서 높이가
    // 바뀌면, 그 뒤에 있는 Journey 등의 pin 트리거 위치가 어긋나 스크롤을 되돌릴 때
    // 멈추는 버그가 생긴다 — 씬 자체의 load 이벤트에 맞춰 딱 한 번만 재계산한다.
    // (임의의 타이머로 하면 마침 스크롤/pin 애니메이션 중일 때 겹쳐서 오히려 멈출 수 있음)
    const onSplineLoad = () => ScrollTrigger.refresh()
    splineRef.current?.addEventListener('load', onSplineLoad)
    aboutSplineRef.current?.addEventListener('load', onSplineLoad)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
      aboutObserver?.disconnect()
      splineRef.current?.removeEventListener('load', onSplineLoad)
      aboutSplineRef.current?.removeEventListener('load', onSplineLoad)
      mm.revert()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  const specialProjects = {
    portfolio:          { title: 'Portfolio', desc: 'React · GSAP 포트폴리오 개발' },
    'portfolio-gpt':    { title: 'Portfolio', desc: '콘텐츠 기획 및 텍스트 초안 작성' },
    'portfolio-codex':  { title: 'Portfolio', desc: '코드 자동 완성 및 생성 보조' },
    'portfolio-claude': { title: 'Portfolio', desc: '구조 설계 · 코드 리뷰 AI 협업' },
    'edu-video': { title: '영상편집 교육', desc: '숏폼 콘텐츠·여행 영상 편집 (Premiere)' },
    'edu-ai':    { title: 'AI 광고 제작 실습', desc: '생성형 AI 활용 15초 화장품 광고 영상 제작' },
  }

  const getSkillUses = (skill) => (skill.usedIn || [])
    .map(key => {
      const proj = projectsData.find(p => p.num === key)
      const special = specialProjects[key]
      if (proj) return { title: proj.title, detail: proj.tags.join(' · ') }
      if (special) return special
      return null
    })
    .filter(Boolean)
    .filter(item => item.title !== 'Portfolio')

  const skillsMarqueeRow = skillLogos.map(s => {
    const uses = getSkillUses(s)

    return (
      <span
        key={s.name}
        className={`skills-logo-item ${s.name === 'Firebase' ? 'skills-logo-item--firebase' : ''}`}
        tabIndex={0}
        aria-label={`${s.name} 상세설명`}
      >
        {s.imgSrc ? (
          <img
            src={s.imgSrc}
            alt={s.name}
            width={40}
            height={40}
            style={{ flexShrink: 0, objectFit: 'contain' }}
          />
        ) : (
          <Icon
            icon={s.icon}
            width={40}
            height={40}
            style={{ flexShrink: 0, color: s.color || 'inherit', filter: s.invert ? 'invert(1)' : undefined }}
          />
        )}
        <span className="skills-logo-name">{s.name}</span>
        <span className="skills-logo-tooltip" role="tooltip">
          <strong>{s.name}</strong>
          {s.usage && <span className="skills-logo-tooltip-usage">{s.usage}</span>}
          {uses.length > 0 && (
            <span className="skills-logo-tooltip-projects">
              <span className="skills-logo-tooltip-label">사용된 프로젝트</span>
              <span className="skills-logo-tooltip-list">
                {[...new Set(uses.map(item => item.title))].join(', ')}
              </span>
            </span>
          )}
        </span>
      </span>
    )
  })

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      {/* Hero */}
      <div className="hero-wrapper">
        <div className="spline-sticky" ref={splineStickyRef}>
          <div className="hero-bg-fade">
            <spline-viewer ref={splineRef} url="https://prod.spline.design/odJVGxy-8nJh1r21/scene.splinecode" />
            <div className="hero-starfield" aria-hidden="true"><Starfield count={60} /></div>
            <div ref={heroParticlesRef} className="hero-particles">
              <HeroParticles />
            </div>
            <div className="hero-bottom-blend" aria-hidden="true" />
          </div>
          <div ref={heroOverlayRef} className="hero-overlay">
            {heroLines.map((lines, i) => (
              <SplitHeroLine
                key={i}
                ref={el => (heroLineRefs.current[i] = el)}
                lines={lines}
                state={lineStates[i]}
                side={i % 2 === 0 ? 'left' : 'right'}
                className={i === 0 ? 'hero-line--first' : undefined}
              />
            ))}
          </div>
          <ScrollIndicator ref={scrollIndicatorRef} />
        </div>
      </div>

      <section id="about" ref={aboutSectionRef} className="section section--about">
        <spline-viewer ref={aboutSplineRef} className="about-spline" url="https://prod.spline.design/l9DmAVn1cG5VlQPD/scene.splinecode" />
        <div className="about-color-tint" aria-hidden="true" />
        <div className="about-top-blend" aria-hidden="true" />
        <div className="about-starfield" aria-hidden="true"><Starfield count={80} sizeScale={1.6} /></div>
        <div className="about-scrim" aria-hidden="true" />
        <div className="about-petals" aria-hidden="true"><FallingPetals count={8} sizeScale={1.8} /></div>
        <div ref={aboutInnerRef} className="about-inner">
          <div className="about-text">
            <div className="about-tagline-float">
              <p className="about-tagline-row about-tagline-row--one">DESIGNING EXPERIENCES,</p>
              <p className="about-tagline-row about-tagline-row--two">NOT JUST INTERFACES.</p>
            </div>

            <p className="about-bio">
              편집디자인에서 시작해 웹으로 영역을 넓혔습니다.<br />
              지금은 UI/UX와 프론트엔드를 배우며,<br />
              더 나은 사용자 경험을 만들기 위해 노력하고 있습니다.
            </p>
            <p className="about-bio">
              새로운 기술을 배우는 것을 즐기며,<br />
              사용자가 자연스럽게 경험할 수 있는<br />
              인터페이스를 만드는 것을 목표로 합니다.
            </p>
          </div>
        </div>
        <div className="section-bottom-fade" aria-hidden="true" />
      </section>

      {/* About_1 */}
      <section id="about_1" className="section section--about-1">
        <DemoOne />
      </section>

      <section id="scroll-stack" className="section--scroll-stack">
        <div className="section-bg-tint" aria-hidden="true" />
        <div className="section-bg-stars" aria-hidden="true"><Starfield count={80} sizeScale={1.6} /></div>
        <div className="section-bg-scrim" aria-hidden="true" />
        <div className="section-bg-petals" aria-hidden="true"><FallingPetals count={8} sizeScale={1.8} /></div>
        <ScrollStack>
          {bloomingProcessImages.map(({ src, alt, num, title, subtitle }) => (
            <ScrollStackItem key={src}>
              <div className="scroll-stack-card-text">
                <span className="scroll-stack-card-num">{num}</span>
                <h3 className="scroll-stack-card-title">{title}</h3>
                <p className="scroll-stack-card-sub">{subtitle}</p>
              </div>
              <div className="scroll-stack-card-media">
                <img src={src} alt={alt} />
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </section>

      <ResumeSchedule />

      {/* Skills — 로고 스크롤 마퀴 */}
      <section id="skills" className="section section--skills">
        <CelestialBloomShader className="skills-bloom" />
        <div className="section-bg-tint"   aria-hidden="true" />
        <div className="section-bg-stars"  aria-hidden="true"><Starfield count={80} sizeScale={1.6} /></div>
        <div className="section-bg-scrim"  aria-hidden="true" />
        <div className="section-bg-petals" aria-hidden="true"><FallingPetals count={8} sizeScale={1.8} /></div>
        <div className="skills-velocity-wrap">
          <LogoMarquee items={skillsMarqueeRow} direction={1} speed={50} />
          <LogoMarquee items={skillsMarqueeRow} direction={-1} speed={50} />
        </div>

      </section>

      {/* Projects_0 — Scroll gallery hero */}
      <section id="projects_0" className="section--projects_0">
        <ContainerScroll className="relative z-10 h-[350vh] bg-transparent text-white">
          <div className="sticky left-0 top-0 z-0 h-screen w-full">
            <CelestialBloomShader className="projects-0-bloom" />
            <BentoGrid className="h-full w-full p-4">
              {projects0Images.map((image) => (
                <BentoCell
                  key={image.src}
                  className="overflow-hidden rounded-xl shadow-2xl shadow-black/30"
                >
                  <img
                    className="size-full object-cover object-center"
                    src={image.src}
                    alt={image.alt}
                  />
                </BentoCell>
              ))}
            </BentoGrid>

            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-center">
              <h1 className="projects-0-work-title">
              WORK
              </h1>
            </div>
          </div>
        </ContainerScroll>
      </section>

      {/* Projects — CircularGallery + 팝업 */}
      <section id="projects" className="section section--projects">
        <CelestialBloomShader className="projects-bloom" />
        <div className="section-top-blend"  aria-hidden="true" />
        <div className="section-bg-tint"   aria-hidden="true" />
        <div className="section-bg-stars"  aria-hidden="true"><Starfield count={80} sizeScale={1.6} /></div>
        <div className="section-bg-scrim"  aria-hidden="true" />
        <div className="section-bg-petals" aria-hidden="true"><FallingPetals count={8} sizeScale={1.8} /></div>
        <div className="projects-content">
          <h2 className="projects-heading">PROJECTS</h2>
          <div className="projects-gallery-scale">
            <CircularGallery
              items={galleryItems}
              bend={3}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollSpeed={2}
              scrollEase={0.02}
              onItemClick={(index) => setSelectedProject(index)}
            />
          </div>

        {selectedProject !== null && (() => {
          const p = projectsData[selectedProject]
          return (
            <div className="project-modal-backdrop" onClick={() => setSelectedProject(null)}>
              <div className="project-modal" onClick={e => e.stopPropagation()}>
                <button className="project-modal-close" onClick={() => setSelectedProject(null)} aria-label="닫기">
                  <X size={18} strokeWidth={2.25} />
                </button>
                <img className="project-modal-img" src={p.image} alt={p.title} />
                <div className="project-modal-body">
                  <h2 className="project-modal-title">{p.title}</h2>
                  <p className="project-modal-desc" style={{ whiteSpace: 'pre-line' }}>{p.desc}</p>
                  <div className="project-modal-meta">
                    {p.tags.map(tag => <span key={tag} className="project-modal-tag">{tag}</span>)}
                  </div>
                  {p.url && (
                    <div className="project-modal-actions">
                      <a href={p.url} target="_blank" rel="noopener" className="project-modal-link">
                        View Project →
                      </a>
                      {p.planUrl && p.designUrl && (
                        <>
                          <a href={p.planUrl} target="_blank" rel="noopener" className="project-modal-link">
                            Project Plan →
                          </a>
                          <a href={p.designUrl} target="_blank" rel="noopener" className="project-modal-link">
                            Design →
                          </a>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })()}
        </div>
        <div className="section-bottom-fade" aria-hidden="true" />
      </section>

      <section id="epilogue" className="section section--epilogue">
        <div className="section-top-blend" aria-hidden="true" />
        <LazyIframe
          src="https://my.spline.design/scrollflower-23e41v80nJdwQts1xJCbVJNs/"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          title="Epilogue"
        />
        <div className="epilogue-copy" aria-label="Epilogue message">
          <BlurIn
            word="아직 피어나는 중입니다."
            className="epilogue-title"
            duration={2.4}
          />
          <p className="epilogue-desc">
            여기까지 제 여정을 함께해 주셔서 감사합니다.<br />
            더 나은 사용자 경험을 만들기 위한 도전은 계속됩니다.
          </p>
        </div>
        <div className="epilogue-footer">
          <div className="epilogue-footer-info">
            <p className="epilogue-footer-name">백지은 <span>Baek Jieun</span></p>
            <p className="epilogue-footer-role">Visual Designer &amp; Frontend Developer</p>
          </div>
          <div className="epilogue-footer-stack">
            <p className="epilogue-footer-label">Built with</p>
            <ul>
              <li>React</li>
              <li>GSAP · ScrollTrigger</li>
              <li>Three.js · Spline</li>
              <li>CSS3 · Canvas API</li>
            </ul>
          </div>
          <div className="epilogue-footer-contact">
            <p className="epilogue-footer-label">Contact</p>
            <a href="mailto:hong4745@gmail.com">hong4745@gmail.com</a>
            <a href="https://www.instagram.com/still___digging" target="_blank" rel="noopener noreferrer" className="epilogue-footer-insta">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', top: '1px' }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              @still___digging
            </a>
            <p className="epilogue-footer-copy">© 2026 Baek Jieun. All rights reserved.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default App
