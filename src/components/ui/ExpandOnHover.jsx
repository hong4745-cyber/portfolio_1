import { useState } from 'react'
import './ExpandOnHover.css'

const ExpandOnHover = ({ items = [], defaultExpanded = 0 }) => {
  const [expandedIndex, setExpandedIndex] = useState(defaultExpanded)

  return (
    <div className="eoh-wrapper">
      <div className="eoh-track">
        {items.map((item, idx) => {
          const isExpanded = expandedIndex === idx
          return (
            <div
              key={idx}
              className={`eoh-panel${isExpanded ? ' eoh-panel--expanded' : ''}`}
              style={{ '--accent': item.accent || '#06b6d4' }}
              onMouseEnter={() => setExpandedIndex(idx)}
            >
              {/* 접힌 상태: 번호 + 세로 제목 */}
              <div className="eoh-collapsed">
                <span className="eoh-num">{item.num}</span>
                <span className="eoh-title-vertical">{item.title}</span>
              </div>

              {/* 펼친 상태: 전체 콘텐츠 */}
              <div className="eoh-expanded-content">
                <span className="eoh-num-lg">{item.num}</span>
                <h3 className="eoh-title">{item.title}</h3>
                <ul className="eoh-tags">
                  {item.tags.map(tag => (
                    <li key={tag} className="eoh-tag">{tag}</li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExpandOnHover
