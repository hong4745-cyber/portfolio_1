import { motion } from 'framer-motion'
import { FiMapPin } from 'react-icons/fi'
import { Starfield } from '@/components/ui/starfield'
import { FallingPetals } from '@/components/ui/falling-petals'
import CelestialBloomShader from '@/components/ui/celestial-bloom-shader'

const resumeSections = [
  {
    label: '학력',
    items: [
      {
        title: '청양여자정보고등학교',
        period: '1999.03 - 2001.02',
        location: '청양',
      },
      {
        title: '우송정보대학 비주얼패키지디자인과',
        period: '2013.03 - 2015.02',
        location: '대전',
      },
    ],
  },
  {
    label: '경력',
    items: [
      {
        title: '디자인핏',
        period: '2017.05 - 2025.12',
        location: '대전',
        details: [
          '공주야행 포스터 디자인 및 홍보물 제작',
          '충남문화재단 브로슈어, 리플렛 디자인',
          '관공서 브로슈어, 리플렛 편집디자인',
          '전시 홍보물 및 각종 편집디자인 전반 담당',
        ],
      },
      {
        title: '케이씽킹',
        period: '2016.07 - 2016.11',
        location: '대전',
        details: [
          '기업 홍보 브로슈어 및 광고 디자인',
          '리플렛 등 인쇄 홍보물 디자인',
          '굿즈 기획 및 디자인 제작',
        ],
      },
      {
        title: '크리시드 [인턴]',
        period: '2016.03 - 2016.05',
        location: '대전',
        details: [
          '관공서 홍보 패널 디자인 및 편집 제작',
          '브로슈어, 리플렛, 포스터 등 인쇄물 편집디자인 및 출력 데이터 제작',
          '프랜차이즈 브랜드 브랜딩 디자인 보조 및 디자인 시안 제작',
          '다양한 편집디자인 실무 및 디자인 수정, 운영 업무 수행',
        ],
      },
      {
        title: '우송정보대학',
        period: '2015.03 - 2016.03',
        location: '대전',
        details: [
          '학과 행정 및 행사 운영 지원',
          '학과 행정업무 및 조교 업무 수행',
        ],
      },
    ],
  },
  {
    label: '교육',
    items: [
      {
        title: '그린컴퓨터아트학원',
        period: '2026.04 - 2026.07',
        location: '대전',
        details: [
          '[AI Worker] 취업을 위한 AI 바이브코딩 웹비즈니스 구축 및 마케팅 실전 과정',
          '실습 프로젝트: 요가필라테스 학원 홈페이지 리뉴얼',
          '실습 프로젝트: 기업 홈페이지 클론코딩',
          'AI 도구를 활용해 기획부터 웹 제작, 마케팅 콘텐츠까지 구축',
        ],
      },
      {
        title: '(주)모두의연구소',
        period: '2026.04 - 2026.05',
        location: '온라인',
        details: [
          '생성형 AI를 활용한 15초 광고 만들기 과정',
          '실습 프로젝트: 화장품 광고 영상 제작',
          '콘셉트 기획부터 이미지 생성, 영상 편집까지 전 과정 수행',
        ],
      },
      {
        title: '그린컴퓨터학원',
        period: '2026.03 - 2026.04',
        location: '대전',
        details: [
          '영상편집 과정: Premiere Pro, After Effects',
          '실습 프로젝트: 15초 요가 호흡법 숏폼 콘텐츠 제작',
          '실습 프로젝트: 3분 여행 영상 편집',
          '기획부터 편집, 자막, 출력까지 전 과정 수행',
        ],
      },
    ],
  },
]

export function ResumeSchedule() {
  return (
    <section id="resume-schedule" className="resume-schedule" aria-labelledby="resume-schedule-title">
      <CelestialBloomShader className="resume-schedule-bloom" />
      <CelestialBloomShader className="resume-schedule-side-bloom" />
      <div className="section-bg-tint" aria-hidden="true" />
      <div className="section-bg-stars" aria-hidden="true"><Starfield count={80} sizeScale={1.6} /></div>
      <div className="section-bg-scrim" aria-hidden="true" />
      <div className="section-bg-petals" aria-hidden="true"><FallingPetals count={8} sizeScale={1.8} /></div>
      <div className="resume-schedule-inner">
        <motion.p
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ease: 'easeOut', duration: 0.55 }}
          className="resume-schedule-kicker"
        >
          Education / Career / Training
        </motion.p>
        <motion.h2
          id="resume-schedule-title"
          initial={{ y: 36, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ease: 'easeOut', duration: 0.65 }}
          className="resume-schedule-title"
        >
          Resume
        </motion.h2>

        {resumeSections.map((section, sectionIndex) => (
          <div className="resume-schedule-group" key={section.label}>
            <motion.h3
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ ease: 'easeOut', duration: 0.5 }}
              className="resume-schedule-section-title"
            >
              {section.label}
            </motion.h3>

            <div className="resume-schedule-list">
              {section.items.map((item, index) => (
                <motion.article
                  key={`${section.label}-${item.title}`}
                  initial={{ y: 44, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    ease: 'easeOut',
                    duration: 0.55,
                    delay: (sectionIndex + index) * 0.04,
                  }}
                  className="resume-schedule-item"
                >
                  <div className="resume-schedule-row">
                    <span className="resume-schedule-main">
                      <span className="resume-schedule-name">{item.title}</span>
                      <span className="resume-schedule-period">{item.period}</span>
                    </span>
                    <span className="resume-schedule-category">
                      {item.location}
                      <FiMapPin aria-hidden="true" />
                    </span>
                  </div>

                  {item.details?.length > 0 && (
                    <div className="resume-schedule-panel resume-schedule-panel--open">
                      <ul>
                        {item.details.map(detail => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
