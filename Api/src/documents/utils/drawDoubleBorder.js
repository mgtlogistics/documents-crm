// Dibuja un marco doble (borde exterior grueso + interior delgado) alrededor de la página actual.
export default function drawDoubleBorder(doc, options = {}) {
  const color = options.color || '#1E5AA8'
  const margin = options.margin ?? 14
  const gap = options.gap ?? 4

  const outerX = margin
  const outerY = margin
  const outerWidth = doc.page.width - margin * 2
  const outerHeight = doc.page.height - margin * 2

  doc.save()
  doc.lineWidth(2.5).strokeColor(color)
  doc.rect(outerX, outerY, outerWidth, outerHeight).stroke()
  doc.lineWidth(1).strokeColor(color)
  doc.rect(outerX + gap, outerY + gap, outerWidth - gap * 2, outerHeight - gap * 2).stroke()
  doc.restore()

  return doc
}
