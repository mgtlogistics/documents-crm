// Escribe una etiqueta en negritas seguida de una línea para llenar a mano (o el valor si ya se conoce).
export default function writeFormField(doc, label, value = '', options = {}) {
  const contentLeft = doc.page.margins.left
  const lineWidth = options.lineWidth ?? 220
  const fontSize = options.fontSize ?? 11
  const spacing = options.spacing ?? 1.2

  doc.x = contentLeft
  doc
    .font('Helvetica-Bold')
    .fontSize(fontSize)
    .text(`${label}: `, { continued: true })

  const labelWidth = doc.widthOfString(`${label}: `)
  const lineStartX = contentLeft + labelWidth
  const textBaselineY = doc.y

  doc.font('Helvetica').fontSize(fontSize).text(value ? String(value) : '', { continued: false })

  const lineY = textBaselineY + doc.currentLineHeight() 
  doc
    .moveTo(lineStartX, lineY)
    .lineTo(lineStartX + lineWidth, lineY)
    .lineWidth(0.75)
    .strokeColor('#000000')
    .stroke()

  doc.x = contentLeft
  doc.moveDown(spacing)

  return doc
}
