import { useEffect, useState } from 'react'

const CHARSETS = {
  blocks: ['█', '▓', '▒', '░', ' '],
  ascii:  ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.', ' '],
  simple: ['#', '+', '-', '.', ' '],
}

export function AsciiArt({
  src,
  resolution = 80,
  charset = 'blocks',
  color = '#fff',
  inverted = false,
  animated = false,
  className = '',
}) {
  const [lines, setLines] = useState([])

  useEffect(() => {
    const chars = CHARSETS[charset] ?? CHARSETS.blocks
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const cols = resolution
      // monospace 글자는 높이가 더 길어서 0.45 보정
      const rows = Math.floor(cols * (img.height / img.width) * 0.45)

      const canvas = document.createElement('canvas')
      canvas.width  = cols
      canvas.height = rows
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, cols, rows)

      const { data } = ctx.getImageData(0, 0, cols, rows)
      const result = []

      for (let y = 0; y < rows; y++) {
        let line = ''
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4
          const brightness = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255
          const norm   = inverted ? 1 - brightness : brightness
          const charIdx = Math.min(Math.floor(norm * chars.length), chars.length - 1)
          line += chars[charIdx]
        }
        result.push(line)
      }
      setLines(result)
    }

    img.src = src
  }, [src, resolution, charset, inverted])

  return (
    <div className={className} style={{ overflow: 'hidden' }}>
      <pre
        style={{
          color,
          fontFamily: 'monospace',
          fontSize: `${Math.max(4, Math.floor(500 / resolution))}px`,
          lineHeight: 1,
          letterSpacing: 0,
          margin: 0,
          whiteSpace: 'pre',
        }}
      >
        {lines.join('\n')}
      </pre>
    </div>
  )
}
