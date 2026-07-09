import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Cursor } from '@/components/ui/cursor'
import { HeroParticles } from '@/components/ui/hero-particles'
import { ScrollIndicator } from '@/components/ui/scroll-indicator'
import { TiltCard } from '@/components/ui/tilt-card'
import { SplitHeroLine } from '@/components/ui/split-hero-line'
import { TextPressureFloat } from '@/components/ui/text-pressure-float'
import { Starfield } from '@/components/ui/starfield'
import { FallingPetals } from '@/components/ui/falling-petals'
import { BentoGallery } from '@/components/ui/bento-gallery'
import LineSidebar from '@/components/ui/LineSidebar'
import CircularGallery from '@/components/ui/CircularGallery'
import ReflectiveCard from '@/components/ui/ReflectiveCard'
import NeuralBackground from '@/components/ui/NeuralBackground'
import InfiniteGallery from '@/components/ui/InfiniteGallery'
import BorderGlow from '@/components/ui/BorderGlow'
import BlurText from '@/components/ui/BlurText'
import ExpandOnHover from '@/components/ui/ExpandOnHover'
import { LogoMarquee } from '@/components/ui/LogoMarquee'
import { Palette, Film, Code2, Server, Sparkles, Workflow as WorkflowIcon } from 'lucide-react'
import profileImg2 from '@/assets/images/back_2.png'
import projImg1 from '@/assets/images/hemilygroup.png'
import projImg2 from '@/assets/images/poster_1.jpg'
import projImg3 from '@/assets/images/Mock-up/festival_night.png'
import projImg4 from '@/assets/images/onepage.png'
import projImg5 from '@/assets/images/Digital Cultural Heritage Exhibition_1.jpg'
import mockup1 from '@/assets/images/Mock-up/festival_night.png'
import mockup2 from '@/assets/images/Mock-up/festival_night_1.png'
import mockup3 from '@/assets/images/Mock-up/festival_night_2.png'
import mockup4 from '@/assets/images/Mock-up/exhibition.png'
import mockup5 from '@/assets/images/Mock-up/exhibition catalog_5.png'
import mockup6 from '@/assets/images/Mock-up/exhibition catalog_6.png'
import mockup7 from '@/assets/images/Mock-up/exhibition catalog_7.png'
import mockup8 from '@/assets/images/Mock-up/exhibition catalog_8.png'
import mockup9 from '@/assets/images/Mock-up/Seoktaek-ri.png'
import mockup10 from '@/assets/images/Mock-up/Sericulture.png'
import galleryHemily from '@/assets/images/hemilygroup_1.JPG'
import galleryYoga from '@/assets/images/kimyoga_2.JPG'
import galleryOnepage from '@/assets/images/onepage_1.JPG'
import './App.css'

const SECTIONS = ['about', 'about_1', 'journey', 'skills', 'projects_0', 'projects', 'epilogue']
const HERO_VH = 400

const heroLines = [
  ['계속 배우고,', '계속 만들어왔습니다.'],
  ['디자인을 넘어,', '경험을 설계합니다.'],
  ['아직 완성은 아닙니다.', '하지만 계속 피어나는 중입니다.'],
]

// 각 줄의 등장/퇴장 진행도 임계값 — 겹치지 않는 순차 구간
const HERO_APPEARS = [0.05, 0.36, 0.64]
const HERO_EXITS   = [0.30, 0.58, 0.88]

const projectsData = [
  {
    num: '01',
    title: 'Web Publishing',
    desc: '실제 기업 홈페이지를 분석하여\n반응형 퍼블리싱과 인터랙션을 구현한 프로젝트입니다.',
    tags: ['WEB', 'HTML/CSS', 'JAVASCRIPT'],
    image: projImg1,
    url: 'https://hong4745-cyber.github.io/hemilygroup/',
  },
  {
    num: '02',
    title: 'UI/UX Web Renewal',
    desc: '기존 요가·필라테스 홈페이지를\n사용자 중심의 반응형 웹으로 리뉴얼한 프로젝트입니다.',
    tags: ['Figma', 'HTML', 'CSS', 'JavaScript', 'Firebase', 'NAVER API'],
    image: galleryYoga,
    url: 'https://hong4745-cyber.github.io/kimyoga/',
  },
  {
    num: '03',
    title: 'UI/UX Web Design',
    desc: '프리미엄 오디오 브랜드를 모티브로 제작한\nReact 기반 커머스 웹사이트 프로젝트입니다.',
    tags: ['React', 'Vite', 'Firebase', 'GSAP', 'Polar.sh'],
    image: galleryOnepage,
    url: 'https://onepage-khaki.vercel.app',
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
  { num: '02', title: 'Motion',      tags: ['Premiere', 'After Effects', 'GSAP', 'CSS Animation'],         accent: '#f472b6' },
  { num: '03', title: 'Frontend',    tags: ['HTML5', 'CSS3', 'JavaScript', 'React', 'TypeScript'],         accent: '#34d399' },
  { num: '04', title: 'Backend',     tags: ['Firebase', 'REST API', 'GitHub', 'Vite'],                     accent: '#fb923c' },
  { num: '05', title: 'AI Tools',    tags: ['ChatGPT', 'Claude', 'Claude Code', 'Gemini'],                 accent: '#818cf8' },
  { num: '06', title: 'Workflow',    tags: ['VS Code', 'Notion', 'Slack', 'Figma Dev Mode'],               accent: '#fbbf24' },
]

const skillIcons = [Palette, Film, Code2, Server, Sparkles, WorkflowIcon]

const skillLogos = [
  { name: 'HTML5',         icon: 'logos:html-5',                    usedIn: ['01', '02', '03'] },
  { name: 'CSS3',          icon: 'logos:css-3',                     usedIn: ['01', '02', '03'] },
  { name: 'JavaScript',    icon: 'logos:javascript',                usedIn: ['01', '02', '03'] },
  { name: 'React',         icon: 'logos:react',                     usedIn: ['03', 'portfolio'] },
  { name: 'TypeScript',    icon: 'logos:typescript-icon',           usedIn: ['portfolio'] },
  { name: 'GitHub',        icon: 'logos:github-icon',  invert: true, usedIn: ['01', '02', '03'] },
  { name: 'Figma',         icon: 'logos:figma',                     usedIn: ['02', 'portfolio'] },
  { name: 'Vite',          icon: 'logos:vitejs',                    usedIn: ['03', 'portfolio'] },
  { name: 'Firebase',      icon: 'logos:firebase',                  usedIn: ['02', '03'] },
  { name: 'REST API',      icon: 'lucide:globe',  color: '#7F29DA', usedIn: ['02'] },
  { name: 'Photoshop',     icon: 'logos:adobe-photoshop',           usedIn: ['04', '05', '06'] },
  { name: 'Illustrator',   icon: 'logos:adobe-illustrator',         usedIn: ['04', '05', '06'] },
  { name: 'Premiere Pro',  icon: 'logos:adobe-premiere',            usedIn: ['edu-video'] },
  { name: 'After Effects', icon: 'logos:adobe-after-effects',       usedIn: ['edu-video', 'edu-ai'] },
  { name: 'InDesign',      icon: 'logos:adobe-indesign',            usedIn: ['04', '05', '06'] },
  { name: 'ChatGPT',       icon: 'simple-icons:openai',  color: '#74AA9C', usedIn: ['portfolio'] },
  { name: 'GPT Codex',     icon: 'simple-icons:openai',  color: '#ffffff', usedIn: ['portfolio'] },
  { name: 'Claude',        icon: 'simple-icons:claude',  color: '#D97757', usedIn: ['portfolio'] },
  { name: 'Claude Code',   icon: 'simple-icons:claude',  color: '#CC785C', usedIn: ['03', 'portfolio'] },
  { name: 'Gemini',        icon: 'simple-icons:googlegemini', color: '#8E75B2', usedIn: ['edu-ai'] },
]

const journeyData = [
  {
    type: 'grad',   year: '2013',    label: '학력',
    period: '2013.03 ~ 2015.02',
    org: '우송정보대학',  location: '대전',
    role: '시각디자인과 졸업',
    tasks: [],
  },
  {
    type: 'career', year: '2015',    label: '경력',
    period: '2015.03 ~ 2016.03',
    org: '우송정보대학',  location: '대전',
    role: '',
    tasks: [],
  },
  {
    type: 'intern', year: '2016',    label: '인턴',
    period: '2016.03 ~ 2016.05',
    org: '크리시드',       location: '대전',
    role: '시각디자인 전반',
    tasks: [
      '관공서 홍보 패널 디자인 및 편집 제작',
      '브로슈어·리플렛·포스터 등 인쇄물 편집디자인 및 출력 데이터 제작',
      '프랜차이즈 브랜드 브랜딩 디자인 보조 및 디자인 시안 제작',
      '다양한 편집디자인 실무 및 디자인 수정·운영 업무 수행',
    ],
  },
  {
    type: 'career', year: '2016',    label: '경력',
    period: '2016.07 ~ 2016.11',
    org: '케이씽킹',       location: '대전',
    role: '편집디자인',
    tasks: [
      '기업 홍보 브로슈어 및 광고 디자인',
      '리플렛 등 인쇄 홍보물 디자인',
      '굿즈 기획 및 디자인 제작',
    ],
  },
  {
    type: 'career', year: '2017',    label: '경력',
    period: '2017.05 ~ 2025.12',
    org: '디자인핏',       location: '대전',
    role: '시각디자인 전반',
    tasks: [
      '공주야행 포스터 디자인 및 홍보물 제작',
      '충남문화재단 브로슈어·리플렛 디자인',
      '관공서 브로슈어·리플렛 편집디자인',
      '전시 홍보물 및 각종 편집디자인 전반 담당',
    ],
  },
  {
    type: 'edu',    year: '2026',    label: '교육',
    period: '2026.03 ~ 2026.04',
    org: '그린컴퓨터학원', location: '대전',
    role: '영상편집 (Premiere Pro, After Effects)',
    tasks: [
      '훈련과정: 최신 밈을 이용한 유튜브 쇼츠·릴스 제작',
      '실습 1(숏폼): 15초 요가 호흡법 콘텐츠 기획 및 제작',
      '실습 2(롱폼): 3분 여행 영상 편집 (컷편집, 음향, 자막)',
    ],
  },
  {
    type: 'edu',    year: '2026',    label: '교육',
    period: '2026.04 ~ 2026.05',
    org: '(주)모두의연구소', location: '서울 (온라인)',
    role: '생성형 AI를 활용한 15초 광고 만들기',
    tasks: [
      '실습: 화장품 광고 영상 제작 (생성형 AI 기반 이미지·영상 생성, 15초 분량)',
      '콘셉트 기획부터 이미지 생성, 영상 편집까지 전 과정 수행',
    ],
  },
  {
    type: 'edu',    year: '2026',    label: '교육',
    period: '2026.04 ~ 2026.07',
    org: '그린컴퓨터아트학원', location: '대전',
    role: 'AI 바이브코딩 웹비즈니스 구축 및 마케팅',
    tasks: [
      '실습 1: 요가필라테스 학원 홈페이지 리뉴얼 (경쟁사 분석, IA 재설계, 13p 와이어프레임)',
      '실습 2: 기업 홈페이지 클론코딩 (반응형 레이아웃, JS 인터랙션)',
      'AI 도구(Claude Code 등) 활용 바이브코딩으로 기획부터 마케팅 콘텐츠까지 구축',
    ],
  },
]


const galleryItems = projectsData.map(p => ({ image: p.image, text: p.title }))

function App() {
  const slideRefs      = useRef({ 2: 0 })
  const [slides, setSlides]           = useState({ 2: 0 })
  const [lineStates, setLineStates]   = useState(() => heroLines.map(() => 'idle'))
  const [taglinePlay, setTaglinePlay] = useState(false)
  const taglinePlayedRef   = useRef(false)
  const [journeyAnim, setJourneyAnim] = useState('fwd')
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const jumpSlideRef = useRef(null)
  const lineStatesRef      = useRef(lineStates)
  const heroLineRefs       = useRef([])
  const bentoGalleryRef    = useRef(null)
  const heroOverlayRef     = useRef(null)
  const heroParticlesRef   = useRef(null)
  const scrollIndicatorRef = useRef(null)
const splineRef          = useRef(null)
  const splineStickyRef    = useRef(null)
  const aboutSectionRef    = useRef(null)
  const aboutSplineRef     = useRef(null)
  const aboutInnerRef      = useRef(null)
  const journeyProfileRef  = useRef(null)
  const journeyBioRef      = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const heroEnd = () => (HERO_VH / 100 - 1) * window.innerHeight

    // ── 히어로 스크롤 애니메이션 (기존 유지) ──────────────────────────
    const onScroll = () => {
      scrollIndicatorRef.current?.classList.toggle('scroll-indicator--hidden', window.scrollY > 40)
      const progress = Math.min(window.scrollY / heroEnd(), 1)
      if (splineRef.current) splineRef.current.style.transform = `scale(${1 + progress * 0.18})`
      const FADE_START = 0.78
      const sticky = splineStickyRef.current
      if (progress >= FADE_START) {
        const t = Math.min((progress - FADE_START) / (1 - FADE_START), 1)
        if (sticky) { sticky.style.opacity = String(1 - t * 0.35); sticky.style.filter = `blur(${(t * 8).toFixed(1)}px)`; sticky.style.transform = `scale(${1 + t * 0.03})` }
      } else {
        if (sticky) { sticky.style.opacity = '1'; sticky.style.filter = 'none'; sticky.style.transform = 'none' }
      }
      const nextStates = HERO_APPEARS.map((appear, i) => {
        if (progress >= HERO_EXITS[i]) return 'exit'
        if (progress >= appear) return 'enter'
        return 'idle'
      })
      if (nextStates.some((s, i) => s !== lineStatesRef.current[i])) {
        const prevLineStates = lineStatesRef.current

        // 새 라인이 enter될 때 → 나머지 모든 라인 즉시 숨김 (겹침 방지)
        nextStates.forEach((s, i) => {
          if (s === 'enter' && prevLineStates[i] !== 'enter') {
            heroLineRefs.current.forEach((ref, ri) => {
              if (ri !== i && prevLineStates[ri] !== 'idle') ref?.hardHide()
            })
          }
        })

        // 빠른 역스크롤: 여러 라인이 동시에 idle → 전부 즉시 숨김
        const goingIdle = nextStates.filter((s, i) => s === 'idle' && prevLineStates[i] !== 'idle')
        if (goingIdle.length > 1) {
          nextStates.forEach((s, i) => {
            if (s === 'idle' && prevLineStates[i] !== 'idle') heroLineRefs.current[i]?.hardHide()
          })
        }

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

    // ── GSAP ScrollTrigger — 연속 씬 ───────────────────────────────────
    // About: 콘텐츠는 CSS 기본 visible — GSAP scrub 애니메이션 제거
    // (fromTo scrub은 초기화 시 opacity:0 즉시 적용 버그 있음)
    // About-inner 페이드 헬퍼 (GSAP 사용 — CSS transition보다 신뢰성 높음)
    const fadeAbout = (opts) => {
      if (!aboutInnerRef.current) return
      gsap.to(aboutInnerRef.current, { overwrite: true, ...opts })
    }

    ScrollTrigger.create({
      trigger: '#about',
      start: 'top top',
      end: '+=200%',
      pin: true,
      anticipatePin: 1,
      // ↓ 아래에서 위로 진입 (Hero → About)
      onEnter: () => {
        fadeAbout({ opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' })
        if (aboutSplineRef.current) aboutSplineRef.current.style.opacity = '1'
        if (!taglinePlayedRef.current) { taglinePlayedRef.current = true; setTaglinePlay(true) }
      },
      // ↓ 아래로 이탈 (About → About_1)
      onLeave: () => {
        fadeAbout({ opacity: 0, scale: 1.45, duration: 0.5, ease: 'power2.in' })
      },
      // ↓ 아래에서 다시 진입 (About_1 → About)
      onEnterBack: () => {
        fadeAbout({ opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' })
      },
      // ↓ 위로 이탈 (About → Hero) — 이게 빠져있어서 페이드 없었음
      onLeaveBack: () => {
        fadeAbout({ opacity: 0, scale: 0.92, duration: 0.4, ease: 'power2.in' })
      },
    })

    // About_1: 핀 + progress를 BentoGallery의 Flip 트윈에 직접 넘겨 스크럽 제어
    ScrollTrigger.create({
      trigger: '#about_1',
      start: 'top top',
      end: '+=150%',
      pin: true,
      anticipatePin: 1,
      scrub: 0.4,
      onUpdate: (self) => bentoGalleryRef.current?.setProgress(self.progress),
    })

    // Journey: 스크롤 위치로 연도 스텝 결정
    const journeyStep = { value: -1 }
    // Journey 프로필 초기 숨김
    if (journeyProfileRef.current) {
      gsap.set(journeyProfileRef.current, { opacity: 0, y: 60 })
    }

    ScrollTrigger.create({
      id: 'journey-pin',
      trigger: '#journey',
      start: 'top top',
      end: `+=${journeyData.length * 100}%`,
      pin: true,
      anticipatePin: 1,
      scrub: 0.6,
      onEnter: () => {
        gsap.to(journeyProfileRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
        journeyBioRef.current?.classList.add('bio--visible')
      },
      onEnterBack: () => {
        gsap.to(journeyProfileRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        journeyBioRef.current?.classList.add('bio--visible')
      },
      onLeaveBack: () => {
        gsap.to(journeyProfileRef.current, { opacity: 0, y: 60, duration: 0.4, ease: 'power2.in' })
      },
      onUpdate: (self) => {
        const step = Math.min(Math.floor(self.progress * journeyData.length), journeyData.length - 1)
        if (step !== journeyStep.value && step >= 0) {
          const dir = journeyStep.value < 0 || step > journeyStep.value ? 'fwd' : 'bwd'
          journeyStep.value = step
          setJourneyAnim(dir)
          slideRefs.current[2] = step
          setSlides(s => ({ ...s, 2: step }))
        }
      },
    })

    // LineSidebar 클릭 → 해당 스텝 스크롤 위치로 이동
    jumpSlideRef.current = (index) => {
      const trigger = ScrollTrigger.getById('journey-pin')
      if (!trigger) return
      const progress = (index + 0.1) / journeyData.length
      const targetScroll = trigger.start + (trigger.end - trigger.start) * progress
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }

    // Skills — 진입 scale 애니메이션 (마퀴만)
    gsap.fromTo('.skills-velocity-wrap',
      { scale: 0.2, opacity: 0, filter: 'blur(20px)' },
      {
        scale: 1, opacity: 1, filter: 'blur(0px)',
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '#skills',
          start: 'top bottom',
          end: 'top top',
          scrub: 1,
        }
      }
    )

    ScrollTrigger.create({
      trigger: '#skills',
      start: 'top top',
      end: '+=40%',
      pin: true,
      anticipatePin: 1,
    })

    // Projects_0 — InfiniteGallery 인터랙션 페이지
    ScrollTrigger.create({
      trigger: '#projects_0',
      start: 'top top',
      end: '+=40%',
      pin: true,
      anticipatePin: 1,
    })

    // Projects — 진입 scale 애니메이션 (드라마틱)
    gsap.fromTo('#projects',
      { scale: 0.4, opacity: 0, filter: 'blur(18px)' },
      {
        scale: 1, opacity: 1, filter: 'blur(0px)',
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '#projects',
          start: 'top bottom',
          end: 'top top',
          scrub: 1.2,
        }
      }
    )

    ScrollTrigger.create({
      trigger: '#projects',
      start: 'top top',
      end: '+=150%',
      pin: true,
      anticipatePin: 1,
    })

    // Epilogue
    ScrollTrigger.create({
      trigger: '#epilogue',
      start: 'top top',
      end: '+=80%',
      pin: true,
      anticipatePin: 1,
    })

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
      splineRef.current?.removeEventListener('load', onSplineLoad)
      aboutSplineRef.current?.removeEventListener('load', onSplineLoad)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  const specialProjects = {
    portfolio: { title: 'Portfolio', desc: '이 포트폴리오 사이트 (React · Vite · GSAP)' },
    'edu-video': { title: '영상편집 교육 실습', desc: 'Premiere Pro · After Effects 단편영상 제작' },
    'edu-ai':    { title: 'AI 광고 제작 실습', desc: '생성형 AI 기반 15초 광고 영상 제작' },
  }

  const skillsMarqueeRow = skillLogos.map(s => (
    <span
      key={s.name}
      className="skills-logo-item"
      role="button"
      tabIndex={0}
      onClick={() => setSelectedSkill(s)}
    >
      <Icon
        icon={s.icon}
        width={40}
        height={40}
        style={{ flexShrink: 0, color: s.color || 'inherit', filter: s.invert ? 'invert(1)' : undefined }}
      />
      <span>{s.name}</span>
    </span>
  ))

  return (
    <>
      <Cursor />
      <div className="grain-overlay" aria-hidden="true" />

      {/* Hero */}
      <div className="hero-wrapper">
        <div className="spline-sticky" ref={splineStickyRef}>
          <div className="hero-bg-fade">
            <spline-viewer ref={splineRef} url="https://prod.spline.design/odJVGxy-8nJh1r21/scene.splinecode" />
            <div className="hero-starfield" aria-hidden="true"><Starfield count={90} /></div>
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
        <div className="about-starfield" aria-hidden="true"><Starfield sizeScale={1.6} /></div>
        <div className="about-scrim" aria-hidden="true" />
        <div className="about-petals" aria-hidden="true"><FallingPetals count={14} sizeScale={1.8} /></div>
        <div ref={aboutInnerRef} className="about-inner">
          <div className="about-text">
            <div className="about-tagline-float">
              <TextPressureFloat
                text="Designing experiences,"
                className="about-tagline-row"
                minFontSize={28}
                sizeMultiplier={2}
                play={taglinePlay}
                delay={0}
              />
              <TextPressureFloat
                text="not just interfaces."
                className="about-tagline-row"
                minFontSize={28}
                sizeMultiplier={2}
                play={taglinePlay}
                delay={0.18}
              />
            </div>

            <p className="about-bio">
              편집디자인에서 시작해 웹디자인을 배우고,<br />
              지금은 UI/UX와 프론트엔드를 함께 공부하고 있습니다.
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

      {/* About_1 — 벤토 갤러리 */}
      <section id="about_1" className="section section--about-1">
        <BentoGallery ref={bentoGalleryRef} />
      </section>

      {/* Journey — 가로 타임라인 + 카드 */}
      <section id="journey" className="section section--journey">
        <div className="section-top-blend" aria-hidden="true" />
        <div className="journey-inner">

          {/* 좌측: 사진 + 바이오 */}
          <div className="journey-left">
            <div className="journey-profile" ref={journeyProfileRef}>
              <img className="journey-profile-photo" src={profileImg2} alt="백지은" />
            </div>
            <div className="journey-profile-bio" ref={journeyBioRef}>
              <strong className="journey-bio-title">
                {'성장을 선택하는 사람'.split(' ').map((word, i) => (
                  <span key={i} className="blur-word" style={{ '--i': i, '--delay': `${i * 0.12}s` }}>{word}{i < 2 ? ' ' : ''}</span>
                ))}
              </strong>
              <p className="journey-bio-desc">
                {'디자인에서 시작해 웹으로 확장했습니다.'.split(' ').map((word, i) => (
                  <span key={`a${i}`} className="blur-word" style={{ '--delay': `${0.3 + i * 0.08}s` }}>{word}{' '}</span>
                ))}
                <span className="blur-word bio-break" style={{ '--delay': '0.62s' }} />
                {'더 나은 사용자 경험을 위해 배우고 구현하고 있습니다.'.split(' ').map((word, i) => (
                  <span key={`b${i}`} className="blur-word" style={{ '--delay': `${0.7 + i * 0.08}s` }}>{word}{' '}</span>
                ))}
              </p>
            </div>
          </div>

          {/* 우측: 가로 타임라인 + 카드 */}
          <div className="journey-right">

            {/* 가로 타임라인 */}
            <div className="journey-h-timeline">
              {journeyData.map((d, i) => (
                <button
                  key={i}
                  className={`journey-h-dot${i === slides[2] ? ' active' : ''}`}
                  onClick={() => jumpSlideRef.current?.(i)}
                >
                  <span className="journey-h-dot-circle" />
                  <span className="journey-h-dot-year">{d.year}</span>
                </button>
              ))}
            </div>

            {/* 카드 */}
            <div className="journey-content">
              <BorderGlow
                backgroundColor="transparent"
                borderRadius={22}
                glowRadius={36}
                glowColor="186 100 76"
                colors={['#7F29DA', '#3b82f6', '#818cf8']}
                edgeSensitivity={20}
                glowIntensity={1.2}
                coneSpread={28}
                className="journey-card-glow"
              >
                <ReflectiveCard
                  item={journeyData[slides[2]]}
                  animDir={journeyAnim}
                  slideKey={slides[2]}
                  overlayColor="rgba(0,0,0,0.12)"
                  blurStrength={10}
                  metalness={0.7}
                  roughness={0.35}
                  displacementStrength={18}
                  noiseScale={1.2}
                  specularConstant={1.8}
                  grayscale={0.6}
                  glassDistortion={12}
                />
              </BorderGlow>
            </div>

          </div>

        </div>
        <NeuralBackground
          className="journey-neural-overlay"
          color="#A629DA"
          trailOpacity={0.1}
          particleCount={700}
          speed={0.9}
          overlay={true}
        />
        <div className="section-bg-tint"    aria-hidden="true" />
        <div className="section-bg-stars"   aria-hidden="true"><Starfield count={140} sizeScale={1.6} /></div>
        <div className="section-bg-scrim"   aria-hidden="true" />
        <div className="section-bg-petals"  aria-hidden="true"><FallingPetals count={14} sizeScale={1.8} /></div>
        <div className="journey-bottom-fade" aria-hidden="true" />
      </section>

      {/* Skills — 로고 스크롤 마퀴 */}
      <section id="skills" className="section section--skills">
        <div className="skills-top-blend"  aria-hidden="true" />
        <div className="section-bg-tint"   aria-hidden="true" />
        <div className="section-bg-stars"  aria-hidden="true"><Starfield count={140} sizeScale={1.6} /></div>
        <div className="section-bg-scrim"  aria-hidden="true" />
        <div className="section-bg-petals" aria-hidden="true"><FallingPetals count={14} sizeScale={1.8} /></div>
        <div className="skills-velocity-wrap">
          <LogoMarquee items={skillsMarqueeRow} direction={1} speed={50} />
          <LogoMarquee items={skillsMarqueeRow} direction={-1} speed={50} />
        </div>

        <div className="section-bottom-fade" aria-hidden="true" />

        {selectedSkill && (
          <div className="skill-popup-backdrop" onClick={() => setSelectedSkill(null)}>
            <div className="skill-popup" onClick={e => e.stopPropagation()}>
              <button className="skill-popup-close" onClick={() => setSelectedSkill(null)}>✕</button>
              <div className="skill-popup-header">
                <Icon
                  icon={selectedSkill.icon}
                  width={52}
                  height={52}
                  style={{ color: selectedSkill.color || 'inherit', filter: selectedSkill.invert ? 'invert(1)' : undefined }}
                />
                <h3 className="skill-popup-name">{selectedSkill.name}</h3>
              </div>
              <p className="skill-popup-section-label">사용된 프로젝트</p>
              <div className="skill-popup-projects">
                {(selectedSkill.usedIn || []).map(key => {
                  const proj = projectsData.find(p => p.num === key)
                  const special = specialProjects[key]
                  if (proj) return (
                    <div key={key} className="skill-popup-project">
                      <div className="skill-popup-project-header">
                        <span className="skill-popup-project-num">{proj.num}</span>
                        <span className="skill-popup-project-title">{proj.title}</span>
                      </div>
                      <div className="skill-popup-project-tags">
                        {proj.tags.map(t => <span key={t} className="skill-popup-project-tag">{t}</span>)}
                      </div>
                    </div>
                  )
                  if (special) return (
                    <div key={key} className="skill-popup-project">
                      <div className="skill-popup-project-header">
                        <span className="skill-popup-project-title">{special.title}</span>
                      </div>
                      <p className="skill-popup-project-desc">{special.desc}</p>
                    </div>
                  )
                  return null
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Projects_0 — InfiniteGallery 인터랙션 */}
      <section id="projects_0" className="section section--projects_0">
        <div className="section-top-blend" aria-hidden="true" />
        <InfiniteGallery
          images={[galleryHemily, galleryYoga, galleryOnepage, mockup4, mockup5, mockup6, mockup7, mockup8, mockup9, mockup10]}
          speed={2.5}
          visibleCount={8}
          style={{ width: '100%', height: '100%' }}
        />
        <div className="projects0-overlay">
          <p className="projects0-sub">SCROLL TO EXPLORE</p>
          <h2 className="projects0-title">WORKS</h2>
        </div>
        <div className="section-bottom-fade" aria-hidden="true" />
      </section>

      {/* Projects — CircularGallery + 팝업 */}
      <section id="projects" className="section section--projects">
        <div className="section-top-blend"  aria-hidden="true" />
        <div className="section-bg-tint"   aria-hidden="true" />
        <div className="section-bg-stars"  aria-hidden="true"><Starfield count={140} sizeScale={1.6} /></div>
        <div className="section-bg-scrim"  aria-hidden="true" />
        <div className="section-bg-petals" aria-hidden="true"><FallingPetals count={14} sizeScale={1.8} /></div>
        <div className="projects-content">
        <CircularGallery
          items={galleryItems}
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollSpeed={2}
          scrollEase={0.02}
          onItemClick={(index) => setSelectedProject(index)}
        />

        {selectedProject !== null && (() => {
          const p = projectsData[selectedProject]
          return (
            <div className="project-modal-backdrop" onClick={() => setSelectedProject(null)}>
              <div className="project-modal" onClick={e => e.stopPropagation()}>
                <button className="project-modal-close" onClick={() => setSelectedProject(null)}>✕</button>
                <img className="project-modal-img" src={p.image} alt={p.title} />
                <div className="project-modal-body">
                  <div className="project-modal-meta">
                    <span className="project-modal-num">{p.num}</span>
                    {p.tags.map(tag => <span key={tag} className="project-modal-tag">{tag}</span>)}
                  </div>
                  <h2 className="project-modal-title">{p.title}</h2>
                  <p className="project-modal-desc" style={{ whiteSpace: 'pre-line' }}>{p.desc}</p>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener" className="project-modal-link">
                      View Project →
                    </a>
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
        <iframe
          src="https://my.spline.design/scrollflower-23e41v80nJdwQts1xJCbVJNs/"
          frameBorder="0"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          title="Epilogue"
        />
        <div className="epilogue-footer">
          <div className="epilogue-footer-info">
            <p className="epilogue-footer-name">백지은 <span>Baek Jieun</span></p>
            <p className="epilogue-footer-role">Visual Designer &amp; Frontend Developer</p>
          </div>
          <div className="epilogue-footer-stack">
            <p className="epilogue-footer-label">Built with</p>
            <ul>
              <li>React · Vite</li>
              <li>GSAP · ScrollTrigger</li>
              <li>Three.js · Spline</li>
              <li>CSS3 · Canvas API</li>
            </ul>
          </div>
          <div className="epilogue-footer-contact">
            <p className="epilogue-footer-label">Contact</p>
            <a href="mailto:hong4745@gmail.com">hong4745@gmail.com</a>
            <a href="https://www.instagram.com/still___digging" target="_blank" rel="noopener noreferrer" className="epilogue-footer-insta">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              @still___digging
            </a>
            <p className="epilogue-footer-copy">© 2025 Baek Jieun. All rights reserved.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default App
