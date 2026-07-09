import { useImperativeHandle, useRef, forwardRef } from 'react'
import kimyogaImg from '@/assets/images/kimyoga_1.JPG'
import exhibitionImg from '@/assets/images/Digital Cultural Heritage Exhibition_2.jpg'
import instaImg from '@/assets/images/insta.png'
import onepageImg from '@/assets/images/onepage.png'
import nightTripImg from '@/assets/images/night trip.jpg'
import hemilygroupImg from '@/assets/images/hemilygroup.png'
import posterImg from '@/assets/images/poster_2.jpg'
import poster1Img from '@/assets/images/poster_1.jpg'

const galleryImages = [
  onepageImg,
  posterImg,
  kimyogaImg,
  exhibitionImg,
  nightTripImg,
  hemilygroupImg,
  poster1Img,
  instaImg,
]

// #about_1의 pin ScrollTrigger(App.jsx)가 onUpdate로 progress(0~1)를 넘겨주면 그리드 전체를
// 그만큼 확대(scale)한다. Flip 대신 단순 transform이라 항상 예측 가능하게 동작한다.
export const BentoGallery = forwardRef(function BentoGallery(_, ref) {
  const galleryRef = useRef(null)

  useImperativeHandle(ref, () => ({
    setProgress(p) {
      if (!galleryRef.current) return
      const scale = 1 + p * 2.4
      galleryRef.current.style.transform = `scale(${scale})`
    },
  }))

  return (
    <div className="gallery-wrap">
      <div className="gallery gallery--bento" id="gallery-8" ref={galleryRef}>
        {galleryImages.map((src, i) => (
          <div className="gallery__item" key={i}>
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </div>
  )
})
