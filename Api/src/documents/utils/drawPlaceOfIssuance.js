import dayjs from 'dayjs'

const drawPlaceOfIssuance = (doc, data, options = {}) => {
  const left = doc.page.margins.left
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right

  const { city, state, country } = data?.user?.address || {}

  // 1. Guardamos exactamente dónde estaba el cursor antes de hacer nada
  const currentY = doc.y

  // 2. Si nos pasan una Y explícita (p. ej. para dibujarla abajo), la usamos. 
  // Si no, usamos doc.y actual.
  const targetY = options.y !== undefined ? options.y : currentY

  // 3. Dibujamos el texto
  doc
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .text(
      `${city}, ${state}, ${country} | ${dayjs().format('DD/MMMM/YYYY')}`,
      left,
      targetY,
      { align: 'right', width }
    )

  // 4. RESTAURACIÓN DEL CURSOR:
  // Si especificamos 'y' o la opción 'preserveCursor: true', devolvemos el cursor a su posición original.
  if (options.y !== undefined || options.preserveCursor) {
    doc.y = currentY
  } else {
    // Modo tradicional (por si en otros lados sí dependías de que bajara 2 líneas)
    doc.moveDown(2)
  }
}

export default drawPlaceOfIssuance