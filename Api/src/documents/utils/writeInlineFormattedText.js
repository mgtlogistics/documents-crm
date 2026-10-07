const DELIMITERS = ['**', '__', '++', '==', '~~', '*']

function parseInlineFormatting(value) {
  const text = String(value ?? '')
  const matches = []

  for (let index = 0; index < text.length;) {
    const delimiter = DELIMITERS.find((item) => text.startsWith(item, index))
    if (delimiter) {
      matches.push({ delimiter, start: index, end: index + delimiter.length })
      index += delimiter.length
    } else {
      index += 1
    }
  }

  const paired = new Map()
  const unmatched = new Map()
  for (const match of matches) {
    const opening = unmatched.get(match.delimiter)
    if (opening) {
      paired.set(opening.start, match.delimiter)
      paired.set(match.start, match.delimiter)
      unmatched.delete(match.delimiter)
    } else {
      unmatched.set(match.delimiter, match)
    }
  }

  const runs = []
  const active = new Set()
  let currentText = ''
  let currentStyle = ''
  const flush = () => {
    if (currentText) runs.push({ text: currentText, style: currentStyle })
    currentText = ''
  }

  for (let index = 0; index < text.length;) {
    const marker = matches.find((match) => match.start === index)
    if (marker && paired.has(index)) {
      flush()
      if (active.has(marker.delimiter)) active.delete(marker.delimiter)
      else active.add(marker.delimiter)
      currentStyle = [...active].sort().join('')
      index = marker.end
      continue
    }

    const nextMarker = matches.find((match) => match.start === index)
    const length = nextMarker ? nextMarker.end - index : 1
    currentText += text.slice(index, index + length)
    index += length
  }
  flush()

  return runs
}

function getRunFont(style, baseFont) {
  const bold = style.includes('**')
  const italic = style.includes('__') || (style.includes('*') && !style.includes('**'))
  if (bold && italic) return baseFont === 'Helvetica-Bold' ? 'Helvetica-BoldOblique' : 'Helvetica-BoldOblique'
  if (bold) return 'Helvetica-Bold'
  if (italic) return 'Helvetica-Oblique'
  return baseFont
}

function tokenizeRuns(runs, doc, fontSize, baseFont) {
  const tokens = []
  for (const run of runs) {
    const font = getRunFont(run.style, baseFont)
    const pieces = run.text.match(/\n|[^\S\n]+|[^\s]+/g) ?? []
    for (const text of pieces) {
      doc.font(font).fontSize(fontSize)
      tokens.push({
        text,
        font,
        style: run.style,
        width: text === '\n' ? 0 : doc.widthOfString(text),
      })
    }
  }
  return tokens
}

export default function writeInlineFormattedText(doc, value, options = {}) {
  const contentLeft = options.x ?? doc.x ?? doc.page.margins.left
  const width = options.width ?? doc.page.width - doc.page.margins.left - doc.page.margins.right
  const fontSize = options.fontSize ?? 9
  const baseFont = options.font ?? 'Helvetica'
  const lineHeight = options.lineHeight ?? fontSize * 1.25
  const bottom = doc.page.height - doc.page.margins.bottom
  const tokens = tokenizeRuns(parseInlineFormatting(value), doc, fontSize, baseFont)
  let lines = []
  let line = []
  let lineWidth = 0

  const pushLine = () => {
    while (line.length && /^\s+$/.test(line[line.length - 1].text)) {
      lineWidth -= line.pop().width
    }
    lines.push({ tokens: line, width: lineWidth })
    line = []
    lineWidth = 0
  }

  for (const token of tokens) {
    if (token.text === '\n') {
      pushLine()
      continue
    }

    if (/^\s+$/.test(token.text) && line.length === 0) continue
    if (!/^\s+$/.test(token.text) && lineWidth + token.width > width && line.length > 0) {
      pushLine()
    }
    line.push(token)
    lineWidth += token.width
  }
  if (line.length || lines.length === 0) pushLine()

  let y = doc.y
  lines.forEach((currentLine, lineIndex) => {
    if (y + lineHeight > bottom) {
      doc.addPage()
      y = doc.page.margins.top
    }

    const spaces = currentLine.tokens.filter((token) => /^\s+$/.test(token.text))
    const extraSpace = options.align === 'justify' && lineIndex < lines.length - 1 && spaces.length
      ? Math.max(0, width - currentLine.width) / spaces.length
      : 0
    let x = contentLeft

    for (const token of currentLine.tokens) {
      if (/^\s+$/.test(token.text)) {
        const spaceWidth = token.width + extraSpace
        if (token.style.includes('==')) {
          doc.save().fillColor('#FFF2A8').rect(x, y + 1, spaceWidth, lineHeight - 2).fill().restore()
        }
        if (token.style.includes('++')) {
          doc.save().lineWidth(0.5).moveTo(x, y + lineHeight - 2).lineTo(x + spaceWidth, y + lineHeight - 2).stroke().restore()
        }
        if (token.style.includes('~~')) {
          doc.save().lineWidth(0.5).moveTo(x, y + lineHeight * 0.58).lineTo(x + spaceWidth, y + lineHeight * 0.58).stroke().restore()
        }
        x += spaceWidth
        continue
      }

      if (token.style.includes('==')) {
        doc.save().fillColor('#FFF2A8').rect(x, y + 1, token.width, lineHeight - 2).fill().restore()
      }
      doc
        .font(token.font)
        .fontSize(fontSize)
        .fillColor('#000000')
        .text(token.text, x, y, { lineBreak: false })

      if (token.style.includes('++')) {
        doc.save().lineWidth(0.5).moveTo(x, y + lineHeight - 2).lineTo(x + token.width, y + lineHeight - 2).stroke().restore()
      }
      if (token.style.includes('~~')) {
        doc.save().lineWidth(0.5).moveTo(x, y + lineHeight * 0.58).lineTo(x + token.width, y + lineHeight * 0.58).stroke().restore()
      }
      x += token.width
    }

    y += lineHeight
  })

  doc.x = contentLeft
  doc.y = y
  return doc
}