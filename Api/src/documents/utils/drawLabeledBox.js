// Etiqueta en negritas seguida de una caja rellena (gris) para el valor del campo; posición explícita.
export default function drawLabeledBox(doc, { x, y, width = 220, label = '', value = '', fontSize = 8, boxHeight = 14, spacing = 6, fill = '#EBEBEB' }) {
  let cursorY = y

  if (label) {
    doc.font('Helvetica-Bold').fontSize(fontSize).fillColor('#000000').text(label, x, cursorY, { width })
    cursorY = doc.y - 2
  }

  doc.rect(x, cursorY, width, boxHeight).fillColor(fill).fill()
  doc.rect(x, cursorY, width, boxHeight).strokeColor('#000000').lineWidth(0.4).stroke()

  if (value) {
    doc
      .fillColor('#000000')
      .font('Helvetica')
      .fontSize(fontSize)
      .text(String(value), x + 3, cursorY + 3, { width: width - 6, height: boxHeight - 4, ellipsis: true })
  }

  doc.fillColor('#000000')
  return cursorY + boxHeight + spacing
}
