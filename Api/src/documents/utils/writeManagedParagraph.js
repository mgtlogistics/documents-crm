// Título de sección/cláusula que evita quedar huérfano al final de una página.
export function writeSectionTitle(doc, text, options = {}) {
  const contentLeft = doc.page.margins.left
  const contentWidth = options.width || (doc.page.width - doc.page.margins.left - doc.page.margins.right)
  const reserved = options.reserved ?? 60

  if (doc.y > doc.page.height - doc.page.margins.bottom - reserved) {
    doc.addPage()
  }

  doc.x = contentLeft
  doc
    .font('Helvetica-Bold')
    .fontSize(options.fontSize || 10)
    .text(text, { width: contentWidth, align: options.align || 'left' })
    .moveDown(options.spacing ?? 0.4)

  return doc
}

// Párrafo justificado con control estricto de coordenadas y salto de página automático.
export function writeParagraph(doc, text, options = {}) {
  const contentLeft = doc.page.margins.left
  const contentWidth = options.width || (doc.page.width - doc.page.margins.left - doc.page.margins.right)
  const reserved = options.reserved ?? 35

  if (doc.y > doc.page.height - doc.page.margins.bottom - reserved) {
    doc.addPage()
  }

  doc.x = contentLeft
  doc
    .font(options.bold ? 'Helvetica-Bold' : 'Helvetica')
    .fontSize(options.fontSize || 9)
    .text(text, { align: options.align || 'justify', width: contentWidth })
    .moveDown(options.spacing ?? 0.5)

  return doc
}
