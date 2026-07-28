import { getContentLeft, getContentWidth } from './layout.js'

export function writeCenteredHeading(doc, text, options = {}) {
  const fontSize = options.fontSize || 15
  const moveDown = options.moveDown !== undefined ? options.moveDown : 1

  doc
    .font('Helvetica-Bold')
    .fontSize(fontSize)
    .text(text, {
      align: 'center',
      width: getContentWidth(doc),
    })
    .moveDown(moveDown)
}

export function writeParagraph(doc, text, options = {}) {
  const fontSize = options.fontSize || 11.2
  const moveDown = options.moveDown !== undefined ? options.moveDown : 0.75
  const align = options.align || 'justify'
  const left = options.left !== undefined ? options.left : getContentLeft(doc)
  const width = options.width !== undefined ? options.width : getContentWidth(doc)

  doc
    .font(options.font || 'Helvetica')
    .fontSize(fontSize)
    .text(text, left, doc.y, {
      width,
      align,
    })
    .moveDown(moveDown)
}

export function writeLabel(doc, text, options = {}) {
  const fontSize = options.fontSize || 12
  const moveDown = options.moveDown !== undefined ? options.moveDown : 0.8

  doc
    .font('Helvetica-Bold')
    .fontSize(fontSize)
    .text(text, {
      align: options.align || 'left',
      width: getContentWidth(doc),
    })
    .moveDown(moveDown)
}
