// Dibuja una tabla con encabezado sombreado y filas cuya altura se ajusta al texto que contienen.
export default function drawWrappedTable(doc, { columns, rows }, options = {}) {
  const left = doc.page.margins.left
  const startX = options.x ?? left
  const tableWidth = options.width ?? (doc.page.width - doc.page.margins.left - doc.page.margins.right)
  const cellPadding = options.cellPadding ?? 4
  const headerFontSize = options.headerFontSize ?? 9
  const bodyFontSize = options.bodyFontSize ?? 8.5
  const headerFill = options.headerFill ?? '#1E5AA8'
  const headerColor = options.headerColor ?? '#FFFFFF'
  const borderColor = options.borderColor ?? '#000000'
  const minRowHeight = options.minRowHeight ?? 20

  const totalWeight = columns.reduce((acc, col) => acc + (col.width || 1), 0)
  const colWidths = columns.map((col) => (tableWidth * (col.width || 1)) / totalWeight)

  const ensureSpace = (height) => {
    if (doc.y + height > doc.page.height - doc.page.margins.bottom) {
      doc.addPage()
    }
  }

  const drawRow = ({ cells, fontSize, bold, fill, textColor }) => {
    const rowHeight = Math.max(
      minRowHeight,
      ...columns.map((col, i) => doc.heightOfString(String(cells[i] ?? ''), {
        width: colWidths[i] - cellPadding * 2,
        fontSize,
      }) + cellPadding * 2)
    )

    ensureSpace(rowHeight)

    let x = startX
    const y = doc.y
    columns.forEach((col, i) => {
      if (fill) {
        doc.rect(x, y, colWidths[i], rowHeight).fillColor(fill).fill()
      }
      doc.rect(x, y, colWidths[i], rowHeight).strokeColor(borderColor).lineWidth(fill ? 0.75 : 0.5).stroke()
      doc
        .fillColor(textColor)
        .font(bold ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(fontSize)
        .text(String(cells[i] ?? ''), x + cellPadding, y + cellPadding, {
          width: colWidths[i] - cellPadding * 2,
          align: col.align || 'left',
        })
      x += colWidths[i]
    })
    doc.y = y + rowHeight
  }

  doc.x = startX
  drawRow({
    cells: columns.map((col) => col.label),
    fontSize: headerFontSize,
    bold: true,
    fill: headerFill,
    textColor: headerColor,
  })

  rows.forEach((row) => {
    doc.x = startX
    drawRow({
      cells: columns.map((col) => row[col.key]),
      fontSize: bodyFontSize,
      bold: false,
      fill: null,
      textColor: '#000000',
    })
  })

  doc.x = left
  return doc
}
