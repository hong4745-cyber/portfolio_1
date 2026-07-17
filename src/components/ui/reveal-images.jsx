function RevealImageListItem({ text, images, onClick }) {
  return (
    <button type="button" className="reveal-item" onClick={onClick}>
      <h3 className="reveal-item-text">{text}</h3>
      <div className="reveal-item-thumb reveal-item-thumb--back">
        <img alt={images[1].alt} src={images[1].src} />
      </div>
      <div className="reveal-item-thumb reveal-item-thumb--front">
        <img alt={images[0].alt} src={images[0].src} />
      </div>
    </button>
  )
}

export function RevealImageList({ label, items }) {
  return (
    <div className="reveal-list">
      {label && <h3 className="reveal-list-label">{label}</h3>}
      {items.map((item, i) => (
        <RevealImageListItem key={i} {...item} />
      ))}
    </div>
  )
}
