import createStylizedParagraph from './createStylizedParagraph.js'

// Párrafo con fragmentos en negritas (createStylizedParagraph) que además controla
// el salto de página y la coordenada X, igual que writeParagraph.
export default function writeStylizedParagraph(doc, fragments, options = {}) {
  const contentLeft = doc.page.margins.left
  const contentWidth = options.width || (doc.page.width - doc.page.margins.left - doc.page.margins.right)
  const reserved = options.reserved ?? 35

  if (doc.y > doc.page.height - doc.page.margins.bottom - reserved) {
    doc.addPage()
  }

  doc.x = contentLeft
  createStylizedParagraph(doc, fragments, {
    fontSize: options.fontSize || 9,
    width: contentWidth,
    align: options.align || 'justify',
  })
  doc.moveDown(options.spacing ?? 0.5)

  return doc
}
