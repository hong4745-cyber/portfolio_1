import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@iconify/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroParticles } from '@/components/ui/hero-particles'
import { ScrollIndicator } from '@/components/ui/scroll-indicator'
import { TiltCard } from '@/components/ui/tilt-card'
import { Starfield } from '@/components/ui/starfield'
import { SplitHeroLine } from '@/components/ui/split-hero-line'
import { FallingPetals } from '@/components/ui/falling-petals'
import { DemoOne } from '@/components/ui/demo'
import FlowArt, { FlowSection } from '@/components/ui/story-scroll'
import { ResumeSchedule } from '@/components/ui/resume-schedule'
import CircularGallery from '@/components/ui/CircularGallery'
import { RevealImageList } from '@/components/ui/reveal-images'
import { StickyScrollGallery } from '@/components/ui/sticky-scroll'
import CelestialBloomShader from '@/components/ui/celestial-bloom-shader'
import { BlurIn } from '@/components/ui/blur-in'
import BlurText from '@/components/ui/BlurText'
import ExpandOnHover from '@/components/ui/ExpandOnHover'
import { LogoMarquee } from '@/components/ui/LogoMarquee'
import { Palette, Film, Code2, Server, Sparkles, Workflow as WorkflowIcon, X, ChevronLeft, ChevronRight, ArrowRight, ArrowUp } from 'lucide-react'
import projImg1 from '@/assets/images/hemilygroup.jpg'
import projImg2 from '@/assets/images/Mock-up/자이언티 & 원슈타인 썸머 콘서트 포스터_1.png'
import projImg3 from '@/assets/images/Mock-up/festival_night.jpg'
import stickyBookcoversImage from '@/assets/images/Mock-up/BOOKCOVERS.png'
import stickyCatalogImage from '@/assets/images/Mock-up/2019충남생활문화축제_포스터_3.png'
import mockup4 from '@/assets/images/Mock-up/PK_번식돈_사양관리_매뉴얼_목업.png'
import stickyDigitalHeritageImage from '@/assets/images/Mock-up/충남 문화유산의 국외 반출과 현재 포스터_1.png'
import projectBookcoversImage from '@/assets/images/Mock-up/BOOKCOVERS.png'
import projectEditorialImage from '@/assets/images/Mock-up/festival_night.jpg'
import projectCatalogImage from '@/assets/images/Mock-up/석택리_홍성의_마한을_기억하다_도록.png'
import projectDigitalHeritageImage from '@/assets/images/Mock-up/공주의_대중문화와_극장_홍보물_통합_목업.png'
import projectArchiveBook from '@/assets/images/Mock-up/공주학연구총서4_mokup_5.png'
import galleryYogaMain from '@/assets/images/kimyoga_1.JPG'
import galleryYoga from '@/assets/images/kimyoga_3.JPG'
import galleryMemorialPoster from '@/assets/images/Mock-up/윤여헌 교수 기증기록물 전시 및 추모 좌담회 포스터_3.png'
import galleryOnepage from '@/assets/images/onepage.png'
import galleryHemily from '@/assets/images/Mock-up/34726923_desk_calendar_mockup_side.png'
import projectPoster from '@/assets/images/Mock-up/세종시립민속박물관 10주년 기획 포스터_3.png'
import projectOnepageSquare from '@/assets/images/onepage_2.png'
import iconClaudeCode from '@/assets/images/claudecode-color.png'
import iconFirebase from '@/assets/images/firebase-color.png'
import bloomingProcess1 from '@/assets/images/Blooming Process_1.jpg'
import bloomingProcess2 from '@/assets/images/Blooming Process_2.jpg'
import bloomingProcess3 from '@/assets/images/Blooming Process_3.jpg'
import bloomingProcess4 from '@/assets/images/Blooming Process_4.jpg'
import bloomingProcess5 from '@/assets/images/Blooming Process_6.jpg'
import './App.css'

const SECTIONS = ['about', 'about_1', 'skills', 'projects_0', 'projects', 'epilogue']
const HERO_VH = 700
const HERO_VH_COMPACT = 420
const HERO_COMPACT_BREAKPOINT = 1024
const SKILLS_COMPACT_BREAKPOINT = 768
const MOBILE_BREAKPOINT = 767

const heroLines = [
  ['계속 배우고,', '계속 만들어왔습니다.'],
  ['디자인을 넘어,', '경험을 설계합니다.'],
  ['아직 완성은 아닙니다.', '하지만 계속 피어나는 중입니다.'],
]

const heroManifestoLines = [
  ['계속 배우고,', '계속 만들어왔습니다.'],
  ['디자인을 넘어,', '경험을 설계합니다.'],
  ['아직 완성은 아닙니다.', '하지만 계속 피어나는 중입니다.'],
]

// 데스크톱(1920)의 순차 등장/퇴장과 같은 방식 — 한 번에 하나씩만 보임
const MANIFESTO_APPEARS = [0.22, 0.44, 0.66]
const MANIFESTO_EXITS   = [0.42, 0.64, 0.88]

// 각 줄의 등장/퇴장 진행도 임계값 — 겹치지 않는 순차 구간
const HERO_APPEARS = [0.08, 0.28, 0.54]
const HERO_EXITS   = [0.24, 0.48, 0.80]

const projectsData = [
  {
    num: '01',
    title: 'hemilygroup_ Clone Project',
    desc: '실제 기업 홈페이지를 분석하여\n반응형 퍼블리싱과 인터랙션을 구현한 프로젝트입니다.',
    tags: ['WEB', 'HTML5', 'CSS3', 'JAVASCRIPT'],
    image: projImg1,
    url: 'https://hong4745-cyber.github.io/hemilygroup/',
    githubUrl: 'https://github.com/hong4745-cyber/hemilygroup',
  },
  {
    num: '02',
    title: 'Kim’s yoga Pilates_ website redesign',
    desc: '기존 요가·필라테스 홈페이지를\n사용자 중심의 반응형 웹으로 리뉴얼한 프로젝트입니다.',
    tags: ['Figma', 'HTML5', 'CSS3', 'JavaScript', 'Firebase'],
    image: galleryYoga,
    url: 'https://hong4745-cyber.github.io/kimyoga/',
    githubUrl: 'https://github.com/hong4745-cyber/kimyoga',
    planUrl: 'https://www.figma.com/design/EudRn9g7JHQEF84xqjTqEP/%ED%99%88%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%A6%AC%EB%89%B4%EC%96%BC?node-id=553-77&t=EKgT5TVB6ojHSfvY-1',
    designUrl: 'https://www.figma.com/design/EudRn9g7JHQEF84xqjTqEP/%ED%99%88%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%A6%AC%EB%89%B4%EC%96%BC?node-id=314-1942&t=EKgT5TVB6ojHSfvY-1',
  },
  {
    num: '03',
    title: 'Bowers & Wilkins_ One-page website',
    desc: '프리미엄 오디오 브랜드를 모티브로 제작한\nReact 기반 커머스 웹사이트 프로젝트입니다.',
    tags: ['React', 'Firebase', 'GSAP', 'Polar.sh'],
    image: galleryOnepage,
    url: 'https://onepage-khaki.vercel.app',
    githubUrl: 'https://github.com/hong4745-cyber/onepage',
    planUrl: 'https://www.figma.com/design/6iPpbhdNdxPyyJlw12D01Q/%EC%9D%BC%EC%B2%B4%ED%98%95-%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%B0%B1%EC%A7%80%EC%9D%80?node-id=206-1017&t=jqUWdvsvtDzZcWvW-1',
    designUrl: 'https://www.figma.com/design/6iPpbhdNdxPyyJlw12D01Q/%EC%9D%BC%EC%B2%B4%ED%98%95-%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%B0%B1%EC%A7%80%EC%9D%80?node-id=0-1&t=jqUWdvsvtDzZcWvW-1',
  },
  {
    num: '04',
    title: 'BOOKCOVERS_ Bookstore Brand Website',
    desc: 'BOOKCOVERS는 책을 발견하고 취향을 연결하는 경험을 설계한\nReact 기반 도서 큐레이션 플랫폼 프로젝트입니다.',
    tags: ['React', 'Firebase', 'GSAP', 'Motion', 'Vite'],
    image: projectBookcoversImage,
    url: 'https://bookverse-app-olive.vercel.app',
    githubUrl: 'https://github.com/hong4745-cyber/Bookverse',
    designUrl: 'https://www.figma.com/design/RNd7tHvZWY31ZQ4YJFjFo6/%EC%9D%B8%ED%84%B0%EB%A0%89%ED%8B%B0%EB%B8%8C-%EC%9B%B9%ED%8E%98%EC%9D%B4%EC%A7%80_Bookcovers?node-id=0-1&t=frJYW3tYy3z9czXm-1',
  },
  {
    num: '05',
    title: 'Editorial Design',
    desc: "전통문화 행사 '공주 야행'의 포스터, 리플렛 등\n홍보물 전반을 디자인한 프로젝트입니다.",
    tags: ['InDesign', 'Photoshop', 'Illustrator'],
    image: projectEditorialImage,
    url: null,
  },
  {
    num: '06',
    title: 'Exhibition Catalog Design',
    desc: "특별전 '석택리, 홍성의 마한을 기억하다'의\n표지와 내지 편집 레이아웃을 디자인한 도록 프로젝트입니다.",
    tags: ['InDesign', 'Photoshop', 'Illustrator'],
    image: projectCatalogImage,
    url: null,
  },
  {
    num: '07',
    title: 'Exhibition Promotion Design',
    desc: "옛 공주읍사무소의 재현 공간과 기록 자료를 바탕으로 포스터 등 전시 홍보물 전반을 제작했습니다.\n공주학연구원 개원 10주년 기획전시 '공주의 대중문화와 극장'을 통해 지역 극장의 문화적 역할을 시각화했습니다.",
    tags: ['InDesign', 'Photoshop', 'Illustrator'],
    image: projectDigitalHeritageImage,
    modalImageAspect: '3 / 2',
    url: null,
  },
]


const skillsData = [
  { num: '01', title: 'Design',      tags: ['Figma', 'Illustrator', 'Photoshop', 'InDesign'],              accent: '#7F29DA' },
  { num: '02', title: 'Motion',      tags: ['GSAP', 'CSS Animation'],                                      accent: '#f472b6' },
  { num: '03', title: 'Frontend',    tags: ['HTML5', 'CSS3', 'JavaScript', 'React', 'TypeScript'],         accent: '#34d399' },
  { num: '04', title: 'Backend',     tags: ['Firebase', 'REST API', 'GitHub'],                            accent: '#fb923c' },
  { num: '05', title: 'AI Tools',    tags: ['ChatGPT', 'Claude', 'Claude Code', 'Gemini'],                 accent: '#818cf8' },
  { num: '06', title: 'Workflow',    tags: ['VS Code', 'Notion', 'Slack', 'Figma Dev Mode'],               accent: '#fbbf24' },
]

const skillIcons = [Palette, Film, Code2, Server, Sparkles, WorkflowIcon]

const skillLogos = [
  { name: 'HTML5',         category: 'Frontend',     icon: 'simple-icons:html5', color: '#E34F26', usage: '웹 퍼블리싱, 시멘틱 마크업',                    usedIn: ['01', '02', '03'] },
  { name: 'CSS3',          category: 'Frontend',     icon: 'simple-icons:css3', color: '#1572B6', usage: '반응형 레이아웃, 커스텀 애니메이션',              usedIn: ['01', '02', '03'] },
  { name: 'JavaScript',    category: 'Frontend',     icon: 'logos:javascript',                usage: 'DOM 제어, 인터랙션 구현, API 연동',             usedIn: ['01', '02', '03'] },
  { name: 'React',         category: 'Frontend',     icon: 'logos:react',                     usage: 'SPA 컴포넌트 설계 및 개발',                    usedIn: ['03', 'portfolio'] },
  { name: 'TypeScript',    category: 'Frontend',     icon: 'logos:typescript-icon',           usage: '컴포넌트 타입 정의 및 안전한 코드 작성',          usedIn: ['portfolio'] },
  { name: 'GSAP',          category: 'Frontend',     icon: 'simple-icons:gsap', color: '#88CE02', usage: 'ScrollTrigger 기반 스크롤 인터랙션과 모션 구현', usedIn: ['03', 'portfolio'] },
  { name: 'Motion',        category: 'Frontend',     icon: 'simple-icons:framer', color: '#ffffff', usage: 'React 컴포넌트 애니메이션과 모션 상태 제어',      usedIn: ['03', 'portfolio'] },
  { name: 'GitHub',        category: 'Frontend',     icon: 'logos:github-icon',  invert: true, usage: '버전 관리 및 GitHub Pages 배포',             usedIn: ['01', '02', '03'] },
  { name: 'Firebase',      category: 'Frontend',     imgSrc: iconFirebase,          usage: 'Authentication 및 Cloud Firestore 데이터 관리', usedIn: ['02', '03'] },
  { name: 'Naver Maps API', category: 'Frontend',    icon: 'mdi:map-marker-path', color: '#03C75A', usage: '지도 표시 및 위치 기반 콘텐츠 구현',          usedIn: ['03'] },
  { name: 'Vercel',        category: 'Frontend',     icon: 'simple-icons:vercel', color: '#ffffff', usage: '프론트엔드 배포 및 호스팅',                     usedIn: ['03', 'portfolio'] },
  { name: 'Figma',         category: 'Design Tools', icon: 'logos:figma',                     usage: 'UI 기획, 와이어프레임, 프로토타입 제작',          usedIn: ['02', 'portfolio'] },
  { name: 'Photoshop',     category: 'Design Tools', icon: 'logos:adobe-photoshop',           usage: '이미지 보정·합성, 포스터·브로슈어 시각 작업',     usedIn: ['04', '05', '06'] },
  { name: 'Illustrator',   category: 'Design Tools', icon: 'logos:adobe-illustrator',         usage: '벡터 그래픽, 포스터·홍보물 일러스트 제작',        usedIn: ['04', '05', '06'] },
  { name: 'InDesign',      category: 'Design Tools', icon: 'logos:adobe-indesign',            usage: '브로슈어·리플렛·포스터·도록 편집 레이아웃 제작',   usedIn: ['04', '05', '06'] },
  { name: 'Canva',         category: 'Design Tools', icon: 'simple-icons:canva',        color: '#00C4CC', usage: '소셜 콘텐츠·발표자료·간편 그래픽 제작', usedIn: [] },
  { name: 'ChatGPT',       category: 'AI Tools',     icon: 'simple-icons:openai',  color: '#74AA9C', usage: '코드 보조 및 콘텐츠 기획',              usedIn: ['portfolio-gpt'] },
  { name: 'GPT Codex',     category: 'AI Tools',     icon: 'simple-icons:openai',  color: '#ffffff', usage: '코드 자동 완성 및 생성 보조',            usedIn: ['portfolio-codex'] },
  { name: 'Claude',        category: 'AI Tools',     icon: 'simple-icons:claude',  color: '#D97757', usage: 'AI 페어 프로그래밍, 설계 검토',          usedIn: ['portfolio-claude'] },
  { name: 'Claude Code',   category: 'AI Tools',     imgSrc: iconClaudeCode,       color: '#CC785C', usage: '포트폴리오 전반 개발 협업',              usedIn: ['03', 'portfolio'] },
  { name: 'Gemini',        category: 'AI Tools',     icon: 'simple-icons:googlegemini', color: '#8E75B2', usage: 'AI 이미지 생성, 광고 콘텐츠 기획', usedIn: ['edu-ai'] },
]

const SKILL_CATEGORY_ORDER = ['Frontend', 'Design Tools', 'AI Tools']

const galleryItems = projectsData.map((p, index) => ({
  image: p.image,
  text: index < 4 ? 'WEB DESIGN' : 'Editorial Design',
}))

const projectsGalleryLeft = [
  { src: projImg1, alt: 'Hemilygroup web publishing project' },
  { src: projImg2, alt: 'Zion.T & Wonstein summer concert poster mockup' },
  { src: stickyBookcoversImage, alt: 'BOOKCOVERS web project main screen' },
  { src: stickyCatalogImage, alt: '2019 Chungnam Living Culture Festival poster design', offsetX: '-10px' },
  { src: mockup4, alt: 'PK breeding sow management manual design' },
]

const projectsGalleryCenter = [
  { src: stickyDigitalHeritageImage, alt: 'Chungnam cultural heritage exhibition poster design' },
  { src: projectArchiveBook, alt: 'Gongju Studies Archive research book' },
  { src: galleryHemily, alt: 'Seocheon County 2026 desk calendar mockup', objectPosition: 'center 42%' },
]

const projectsGalleryRight = [
  { src: galleryYogaMain, alt: 'Kim Yoga main visual' },
  { src: galleryOnepage, alt: 'Onepage UI/UX design project' },
  { src: galleryMemorialPoster, alt: 'Professor Yoon Yeo-heon memorial exhibition poster mockup' },
  { src: projectPoster, alt: 'Poster design' },
  { src: projectOnepageSquare, alt: 'Onepage project' },
]

const bloomingProcessImages = [
  { src: bloomingProcess1, alt: 'Blooming Process 1', num: '01', title: 'Root', subtitle: '디자인의 기본을\n쌓다.' },
  { src: bloomingProcess2, alt: 'Blooming Process 2', num: '02', title: 'Expand', subtitle: '사용자의 경험을\n설계하다.' },
  { src: bloomingProcess3, alt: 'Blooming Process 3', num: '03', title: 'Build', subtitle: '디자인을 직접\n구현하다.' },
  { src: bloomingProcess4, alt: 'Blooming Process 4', num: '04', title: 'Connect', subtitle: '디자인과 개발을\n연결한다.' },
  { src: bloomingProcess5, alt: 'Blooming Process 5', num: '05', title: 'Bloom', subtitle: '배움을 프로젝트로\n완성한다.' },
]

function App() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [projectFilter, setProjectFilter] = useState(null)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const [openSkill, setOpenSkill] = useState(null)
  const [isHeroCompact, setIsHeroCompact] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= HERO_COMPACT_BREAKPOINT
  )
  const [isSkillsCompact, setIsSkillsCompact] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= SKILLS_COMPACT_BREAKPOINT
  )
  const [lineStates, setLineStates] = useState(() => heroLines.map(() => 'idle'))
  const [manifestoStates, setManifestoStates] = useState(() => heroManifestoLines.map(() => 'idle'))
  const lineStatesRef      = useRef(lineStates)
  const manifestoStatesRef = useRef(manifestoStates)
  const heroLineRefs       = useRef([])
  const manifestoLineRefs  = useRef([])
  const isHeroCompactRef   = useRef(isHeroCompact)
  const heroOverlayRef     = useRef(null)
  const heroContentRef     = useRef(null)
  const heroTitleRef       = useRef(null)
  const heroParticlesRef   = useRef(null)
  const scrollIndicatorRef = useRef(null)
const splineRef          = useRef(null)
  const splineStickyRef    = useRef(null)
  const aboutSectionRef    = useRef(null)
  const aboutSplineRef     = useRef(null)
  const aboutInnerRef      = useRef(null)
  const skillHideTimer     = useRef(null)
  const goTopRef           = useRef(null)

  // 768px/375px 같은 반응형 구간에서만 3D Spline 대신 가벼운 셰이더 히어로를 쓴다 — 데스크톱(1920 등)은 기존 3D 유지
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${HERO_COMPACT_BREAKPOINT}px)`)
    const onChange = () => setIsHeroCompact(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // 768px 이하에서는 스킬 로고를 마퀴 대신 카테고리별 고정 그리드로 보여준다 — 좁은 화면에서 탭하기 쉽도록
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${SKILLS_COMPACT_BREAKPOINT}px)`)
    const onChange = () => setIsSkillsCompact(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    isHeroCompactRef.current = isHeroCompact
  }, [isHeroCompact])


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const heroEnd = () => {
      const vh = isHeroCompactRef.current ? HERO_VH_COMPACT : HERO_VH
      return (vh / 100 - 1) * window.innerHeight
    }

    // ── 히어로 스크롤 애니메이션 (기존 유지) ──────────────────────────
    const onScroll = () => {
      scrollIndicatorRef.current?.classList.toggle('scroll-indicator--hidden', window.scrollY > 40)
      const aboutTop = aboutSectionRef.current?.getBoundingClientRect().top
      goTopRef.current?.classList.toggle(
        'go-top-btn--visible',
        typeof aboutTop === 'number' && aboutTop < window.innerHeight,
      )
      const progress = Math.min(window.scrollY / heroEnd(), 1)
      // 모바일(compact)에서는 히어로 전체 스크롤 구간(420vh)이 너무 길어서
      // 손가락 스와이프 한두 번으로는 progress가 거의 안 움직여 꽃이 반응 없어 보임 —
      // 꽃 스케일 반응만 화면 높이 이내로 훨씬 빨리 포화되도록 별도 계산
      const bloomProgress = isHeroCompactRef.current
        ? Math.min(window.scrollY / (window.innerHeight * 0.9), 1)
        : progress
      if (splineRef.current) splineRef.current.style.transform = `scale(${1 + bloomProgress * 0.18})`
      const FADE_START = 0.88
      const sticky = splineStickyRef.current
      if (progress >= FADE_START) {
        const t = Math.min((progress - FADE_START) / (1 - FADE_START), 1)
        if (sticky) { sticky.style.opacity = String(1 - t * 0.35); sticky.style.filter = `blur(${(t * 3).toFixed(1)}px)`; sticky.style.transform = `scale(${1 + t * 0.03})` }
      } else {
        if (sticky) { sticky.style.opacity = '1'; sticky.style.filter = 'none'; sticky.style.transform = 'none' }
      }
      if (isHeroCompactRef.current) {
        // STILL BLOOMING + sub text: 첫 마니페스토 등장 구간(0.04~0.28)에 맞춰 위로 올라가며 사라짐
        if (heroTitleRef.current) {
          const TITLE_EXIT_START = 0.04
          const TITLE_EXIT_END = 0.28
          const t = Math.min(Math.max((progress - TITLE_EXIT_START) / (TITLE_EXIT_END - TITLE_EXIT_START), 0), 1)
          const smooth = t * t * (3 - 2 * t)
          heroTitleRef.current.style.transform = `translateY(${-48 * smooth}vh)`
          heroTitleRef.current.style.opacity = String(1 - smooth)
          heroTitleRef.current.style.filter = smooth > 0.05 ? `blur(${(smooth * 8).toFixed(1)}px)` : 'none'
        }

        const activeManifestoIndex = MANIFESTO_APPEARS.findIndex((appear, i) =>
          progress >= appear && progress < MANIFESTO_EXITS[i]
        )
        const nextManifestoStates = MANIFESTO_APPEARS.map((_, i) =>
          i === activeManifestoIndex ? 'enter' : 'idle'
        )
        if (nextManifestoStates.some((s, i) => s !== manifestoStatesRef.current[i])) {
          manifestoLineRefs.current.forEach((ref, i) => {
            if (i !== activeManifestoIndex) ref?.hardHide()
          })
          manifestoStatesRef.current = nextManifestoStates
          setManifestoStates(nextManifestoStates)
        }
      } else {
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

    // 히어로 텍스트 최초 진입 애니메이션 (스크롤과 무관하게 한 번만, 반응형 구간에서만 존재)
    if (isHeroCompactRef.current) {
      gsap.fromTo('.hero-content',
        { opacity: 0, y: 36, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, delay: 0.3, ease: 'power2.out' }
      )
    }

    const aboutNode = aboutSectionRef.current
    let aboutObserver
    if (aboutNode) {
      if ('IntersectionObserver' in window) {
        aboutObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              aboutNode.classList.add('about-visible')
              aboutObserver.disconnect()
            }
          },
          { threshold: 0 },
        )
        aboutObserver.observe(aboutNode)
      } else {
        aboutNode.classList.add('about-visible')
      }
    }

    // ── GSAP ScrollTrigger — 연속 씬 ───────────────────────────────────
    // Skills — 로고마키 스크롤 scale 액션 (태블릿 768px/모바일 375px 등 반응형에서는 사용하지 않음)
    if (window.innerWidth > SKILLS_COMPACT_BREAKPOINT) {
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
    }

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
    // 원래는 pin+scrub였는데, GSAP의 pin이 걸리면 그 구간 동안 엘리먼트가
    // 화면상 위치 그대로 고정돼버려서 Spline의 "Enter View" 스크롤 트리거(꽃이
    // 실제 스크롤 위치 변화를 보고 반응)가 전혀 움직임을 감지하지 못해 꽃이 안 폈다 —
    // pin 없이 섹션이 자연스럽게 지나가도록 하고, 텍스트는 화면에 들어올 때 한 번만 페이드인
    gsap.fromTo('.epilogue-desc',
      { opacity: 0, y: 52, filter: 'blur(10px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'power2.out',
        scrollTrigger: {
          trigger: '#epilogue',
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      }
    )

    // About의 Spline 씬(외부 스크립트)이 초기 계산 이후 늦게 로드되면서 문서 높이가
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

  const renderSkillLogo = (s, { compact = false } = {}) => {
    const uses = getSkillUses(s)
    const iconSize = compact ? 26 : 40

    return (
      <span
        key={s.name}
        className="skills-logo-item"
        tabIndex={0}
        aria-label={`${s.name} 상세설명`}
        onMouseEnter={() => { clearTimeout(skillHideTimer.current); setOpenSkill(s.name) }}
        onMouseLeave={() => { skillHideTimer.current = setTimeout(() => setOpenSkill(null), 180) }}
        onClick={() => setOpenSkill(prev => (prev === s.name ? null : s.name))}
      >
        {s.imgSrc ? (
          <img
            src={s.imgSrc}
            alt={s.name}
            width={iconSize}
            height={iconSize}
            style={{ flexShrink: 0, objectFit: 'contain' }}
          />
        ) : (
          <Icon
            icon={s.icon}
            width={iconSize}
            height={iconSize}
            style={{ flexShrink: 0, color: s.color || 'inherit', filter: s.invert ? 'invert(1)' : undefined }}
          />
        )}
        <span className="skills-logo-name">{s.name}</span>
        {openSkill === s.name && (
          <span
            className="skills-logo-tooltip"
            onMouseEnter={() => clearTimeout(skillHideTimer.current)}
            onMouseLeave={() => { skillHideTimer.current = setTimeout(() => setOpenSkill(null), 180) }}
          >
            <strong>{s.name}</strong>
            {s.usage && <span className="skills-logo-tooltip-usage">{s.usage}</span>}
            {uses.length > 0 && (
              <span className="skills-logo-tooltip-projects">
                <span className="skills-logo-tooltip-label">Used in</span>
                <span className="skills-logo-tooltip-list">{uses.map(item => item.title).join(' · ')}</span>
              </span>
            )}
          </span>
        )}
      </span>
    )
  }

  const skillsMarqueeRow = skillLogos.map(renderSkillLogo)

  const skillsByCategory = SKILL_CATEGORY_ORDER.map(name => ({
    name,
    items: skillLogos.filter(s => s.category === name),
  }))

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <header className="site-header">
        <button
          type="button"
          className={`hamburger-btn ${menuOpen ? 'hamburger-btn--open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </header>

      <nav className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`} aria-hidden={!menuOpen}>
        <ul className="site-nav-list">
          {[
            { label: 'About', href: '#about' },
            { label: 'Skills', href: '#skills' },
            { label: 'Projects', href: '#projects' },
            { label: 'Contact', href: '#epilogue' },
          ].map(item => (
            <li className="site-nav-item" key={item.href}>
              <a href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      {!menuOpen && (
        <button
          type="button"
          ref={goTopRef}
          className="go-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="맨 위로"
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </button>
      )}

      {/* Hero */}
      <div className="hero-wrapper">
        <div className="spline-sticky" ref={splineStickyRef}>
          {isHeroCompact && (
            <div className="hero-bloom hero-bloom--secondary">
              <CelestialBloomShader className="hero-bloom-canvas" />
            </div>
          )}
          <div className="hero-bg-fade">
            {isHeroCompact ? (
              <div ref={splineRef} className="hero-bloom">
                <CelestialBloomShader className="hero-bloom-canvas" />
              </div>
            ) : (
              <spline-viewer ref={splineRef} url="https://prod.spline.design/odJVGxy-8nJh1r21/scene.splinecode" />
            )}
            <div className="hero-starfield" aria-hidden="true"><Starfield count={60} /></div>
            <div ref={heroParticlesRef} className="hero-particles">
              <HeroParticles />
            </div>
            <div className="hero-bottom-blend" aria-hidden="true" />
          </div>
          <div ref={heroOverlayRef} className="hero-overlay">
            {isHeroCompact ? (
              <>
                <span className="hero-kicker">PORTFOLIO 2026</span>
                <div ref={heroContentRef} className="hero-content">
                  <div ref={heroTitleRef} className="hero-title-group">
                    <h1 className="hero-headline">
                      <span className="hero-headline-line">Still</span>
                      <span className="hero-headline-line">Blooming.</span>
                    </h1>
                    <p className="hero-desc hero-desc--mono hero-sub-inline">
                      Growing through every project,<br />
                      one step at a time.
                    </p>
                  </div>
                </div>
                <p className="hero-desc hero-desc--mono hero-desc--bottom">
                  Growing through every project,<br />
                  one step at a time.
                </p>
                <div className="hero-manifesto">
                  {heroManifestoLines.map((lines, i) => (
                    <SplitHeroLine
                      key={i}
                      ref={el => (manifestoLineRefs.current[i] = el)}
                      lines={lines}
                      state={manifestoStates[i]}
                      side="down"
                      className="hero-manifesto-line"
                    />
                  ))}
                </div>
              </>
            ) : (
              heroLines.map((lines, i) => (
                <SplitHeroLine
                  key={i}
                  ref={el => (heroLineRefs.current[i] = el)}
                  lines={lines}
                  state={lineStates[i]}
                  side={i % 2 === 0 ? 'left' : 'right'}
                  className={i === 0 ? 'hero-line--first' : undefined}
                />
              ))
            )}
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
              더 나은 사용자 경험을 만들기 위해<br className="br-mobile-only" /> 노력하고 있습니다.
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
        <FlowArt aria-label="Blooming Process">
          {bloomingProcessImages.map(({ src, alt, num, title, subtitle }) => (
            <FlowSection
              key={src}
              aria-label={`${num} — ${title}`}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(11,16,61,0.3), rgba(11,16,61,0.88)), url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fff',
              }}
            >
              <p className="flow-process-label text-xs font-bold uppercase tracking-[0.2em]">{num} — Blooming Process</p>
              <hr className="flow-process-rule flow-process-rule--top my-[2vw] border-none border-t border-white/30" />
              <h2 className="flow-process-title -translate-y-[clamp(1rem,3vw,3rem)] text-white text-[clamp(2.5rem,8.7vw,10.15rem)] font-bold leading-[0.85] uppercase tracking-tight">
                {title}
              </h2>
              <hr className="flow-process-rule flow-process-rule--bottom my-[2vw] border-none border-t border-white/30" />
              <p className="flow-process-subtitle mt-auto max-w-[50ch] whitespace-pre-line text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
                {subtitle}
              </p>
            </FlowSection>
          ))}
        </FlowArt>
      </section>

      <ResumeSchedule />

      {/* Skills — 로고 스크롤 마퀴 */}
      <section id="skills" className="section section--skills">
        <CelestialBloomShader className="skills-bloom" />
        <div className="section-bg-tint"   aria-hidden="true" />
        <div className="section-bg-stars"  aria-hidden="true"><Starfield count={80} sizeScale={1.6} /></div>
        <div className="section-bg-scrim"  aria-hidden="true" />
        <div className="section-bg-petals" aria-hidden="true"><FallingPetals count={8} sizeScale={1.8} /></div>
        {isSkillsCompact ? (
          <div className="skills-static">
            {skillsByCategory.map(group => (
              <div className="skills-static-group" key={group.name}>
                <h3 className="skills-static-title">{group.name}</h3>
                <div className="skills-static-grid">
                  {group.items.map(s => renderSkillLogo(s, { compact: true }))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="skills-velocity-wrap">
            <LogoMarquee items={skillsMarqueeRow} direction={1} speed={50} />
            <LogoMarquee items={skillsMarqueeRow} direction={-1} speed={50} />
          </div>
        )}

      </section>

      {/* Projects_0 — Sticky scroll gallery */}
      <section id="projects_0" className="section--projects_0">
        <CelestialBloomShader className="projects-0-bloom" />
        <StickyScrollGallery
          heading={null}
          leftImages={projectsGalleryLeft}
          stickyImages={projectsGalleryCenter}
          rightImages={projectsGalleryRight}
        />
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
          {isMobile ? (
            <RevealImageList
              label="↓ 클릭해주세요"
              items={[
                {
                  text: 'Web Design',
                  images: [
                    { src: projImg1, alt: 'Web publishing project' },
                    { src: projectBookcoversImage, alt: 'BOOKCOVERS web project' },
                  ],
                  onClick: () => { setProjectFilter([0, 1, 2, 3]); setSelectedProject(0) },
                },
                {
                  text: 'Editorial',
                  images: [
                    { src: projectEditorialImage, alt: 'Editorial poster mockup 1' },
                    { src: projectCatalogImage, alt: 'Seoktaek-ri Mahan special exhibition catalog design' },
                  ],
                  onClick: () => { setProjectFilter([4, 5, 6]); setSelectedProject(4) },
                },
              ]}
            />
          ) : (
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
          )}
        </div>
        <div className="section-bottom-fade" aria-hidden="true" />
      </section>

      {selectedProject !== null && createPortal((() => {
        const p = projectsData[selectedProject]
        const navIndices = projectFilter ?? projectsData.map((_, i) => i)
        const pos = navIndices.indexOf(selectedProject)
        const prevIdx = navIndices[(pos - 1 + navIndices.length) % navIndices.length]
        const nextIdx = navIndices[(pos + 1) % navIndices.length]
        const closeModal = () => { setSelectedProject(null); setProjectFilter(null) }
        return (
          <div className="project-modal-backdrop" onClick={closeModal}>
            <button
              className="project-modal-nav project-modal-nav--prev"
              onClick={e => { e.stopPropagation(); setSelectedProject(prevIdx) }}
              aria-label="이전 작업물"
            >
              <ChevronLeft size={34} strokeWidth={2.25} />
            </button>
            <div className="project-modal" onClick={e => e.stopPropagation()}>
              <button className="project-modal-close" onClick={closeModal} aria-label="닫기">
                <X size={18} strokeWidth={2.25} />
              </button>
              <img
                className="project-modal-img"
                src={p.image}
                alt={p.title}
                style={p.modalImageAspect ? { aspectRatio: p.modalImageAspect } : undefined}
              />
              <div className="project-modal-body">
                <h2 className="project-modal-title">{p.title}</h2>
                <p className="project-modal-desc" style={{ whiteSpace: 'pre-line' }}>{p.desc}</p>
                <div className="project-modal-meta">
                  {p.tags.map(tag => <span key={tag} className="project-modal-tag">{tag}</span>)}
                </div>
                {p.url && (
                  <div className="project-modal-actions">
                    {p.planUrl && (
                      <a href={p.planUrl} target="_blank" rel="noopener" className="project-modal-link project-modal-link--filled">
                        Project Plan →
                      </a>
                    )}
                    {p.designUrl && (
                      <a href={p.designUrl} target="_blank" rel="noopener" className="project-modal-link project-modal-link--outline">
                        Design →
                      </a>
                    )}
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener" className="project-modal-link project-modal-link--outline">
                        GitHub →
                      </a>
                    )}
                    <a href={p.url} target="_blank" rel="noopener" className={`project-modal-link ${p.planUrl || p.designUrl ? 'project-modal-link--outline' : 'project-modal-link--filled'}`}>
                      View Project →
                    </a>
                  </div>
                )}
              </div>
            </div>
            <button
              className="project-modal-nav project-modal-nav--next"
              onClick={e => { e.stopPropagation(); setSelectedProject(nextIdx) }}
              aria-label="다음 작업물"
            >
              <ChevronRight size={34} strokeWidth={2.25} />
            </button>
          </div>
        )
      })(), document.body)}

      <section id="epilogue" className="section section--epilogue">
        <div className="section-top-blend" aria-hidden="true" />
        {isMobile ? (
          <>
            <CelestialBloomShader className="epilogue-bloom" />
            <CelestialBloomShader className="epilogue-bloom epilogue-bloom--secondary" />
            <div className="section-bg-stars" aria-hidden="true"><Starfield count={60} sizeScale={1.4} /></div>
            <div className="section-bg-petals" aria-hidden="true"><FallingPetals count={12} sizeScale={2.0} /></div>
          </>
        ) : (
          <spline-viewer className="epilogue-spline" url="https://prod.spline.design/KjPCCuliIjR2FcSB/scene.splinecode" />
        )}
        <div className="epilogue-copy" aria-label="Epilogue message">
          <BlurIn
            word="아직 피어나는 중입니다."
            className="epilogue-title"
            duration={2.4}
          />
          <p className="epilogue-desc">
            여기까지 제 여정을 함께해 주셔서 감사합니다.<br />
            더 나은 사용자 경험을 만들기 위한<br className="br-mobile-only" /> 도전은 계속됩니다.
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
              <li>GSAP</li>
              <li>ScrollTrigger</li>
              <li className="footer-stack-break" aria-hidden="true" />
              <li>Three.js</li>
              <li>Spline</li>
              <li>CSS3</li>
              <li>Canvas API</li>
            </ul>
          </div>
          <div className="epilogue-footer-contact">
            <p className="epilogue-footer-label">Contact</p>
            <a href="tel:01094054745" className="epilogue-footer-phone">010. 9405. 4745</a>
            <button
              type="button"
              className="epilogue-footer-email"
              onClick={() => {
                navigator.clipboard.writeText('hong4745@gmail.com')
                setEmailCopied(true)
                setTimeout(() => setEmailCopied(false), 1500)
              }}
            >
              {emailCopied ? '복사되었습니다.' : 'hong4745@gmail.com'}
            </button>
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
