import React from 'react'

export interface StickyGalleryImage {
  src: string
  alt: string
}

interface StickyScrollGalleryProps {
  heading?: React.ReactNode
  leftImages: StickyGalleryImage[]
  stickyImages: StickyGalleryImage[]
  rightImages: StickyGalleryImage[]
}

export function StickyScrollGallery({ heading, leftImages, stickyImages, rightImages }: StickyScrollGalleryProps) {
  return (
    <div className="relative z-10">
      {heading && (
        <div className="h-screen w-full grid place-content-center sticky top-0 text-center px-6">
          {heading}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 px-2 pb-2">
        <div className="grid gap-2 md:col-span-4">
          {leftImages.map((img) => (
            <figure className="w-full" key={img.src}>
              <img src={img.src} alt={img.alt} className="w-full h-96 object-cover rounded-md align-bottom" />
            </figure>
          ))}
        </div>

        <div className="static md:sticky md:top-0 w-full md:h-screen md:col-span-4 gap-2 grid md:grid-rows-3">
          {stickyImages.map((img) => (
            <figure className="w-full h-96 md:h-full" key={img.src}>
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover rounded-md align-bottom" />
            </figure>
          ))}
        </div>

        <div className="grid gap-2 md:col-span-4">
          {rightImages.map((img) => (
            <figure className="w-full" key={img.src}>
              <img src={img.src} alt={img.alt} className="w-full h-96 object-cover rounded-md align-bottom" />
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
