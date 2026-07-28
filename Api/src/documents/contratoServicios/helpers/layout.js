import PDFDocument from 'pdfkit'

const DEFAULT_LAYOUT = {
  size: 'LETTER',
  margin: 39,
  bottomMargin: 60,
}

export function createContractDocument(options = {}) {
  const layout = {
    ...DEFAULT_LAYOUT,
    ...options,
  }

  return new PDFDocument({
    size: layout.size,
    margin: layout.margin,
    bottomMargin: layout.bottomMargin,
  })
}

export function getContentLeft(doc) {
  return doc.page.margins.left
}

export function getContentWidth(doc) {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right
}

export function drawPageNumber(doc, pageNumber, options = {}) {
  const bottomOffset = options.bottomOffset || 36
  const fontSize = options.fontSize || 11
  const text = String(pageNumber)

  const originalX = doc.x
  const originalY = doc.y
  const originalBottomMargin = doc.page.margins.bottom

  doc.page.margins.bottom = 0
  doc
    .font('Helvetica')
    .fontSize(fontSize)
    .fillColor('#000000')
    .text(text, 0, doc.page.height - bottomOffset, {
      width: doc.page.width,
      align: 'center',
      lineBreak: false,
    })

  doc.page.margins.bottom = originalBottomMargin
  doc.x = originalX
  doc.y = originalY
}
