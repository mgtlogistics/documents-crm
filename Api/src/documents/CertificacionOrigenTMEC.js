import PDFDocument from 'pdfkit'
import drawDoubleBorder from './utils/drawDoubleBorder.js'
import drawLabeledBox from './utils/drawLabeledBox.js'
import drawWrappedTable from './utils/drawWrappedTable.js'
import formatFullAddress from './utils/formatFullAddress.js'

const CERTIFIER_TYPES = ['importer', 'exporter', 'producer']

function drawFooterPage(doc, pageNumber) {
  // const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  // doc
  //   .font('Helvetica')
  //   .fontSize(9)
  //   .fillColor('#000000')
  //   .text(`pág. ${pageNumber}`, doc.page.margins.left, doc.page.height - doc.page.margins.bottom - 4, {
  //     width: contentWidth,
  //     align: 'right',
  //     lineBreak: false,
  //   })
}

function extractGroup(obj, prefix) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (key.startsWith(prefix)) {
      // Elimina el prefijo del nombre de la propiedad
      const newKey = key.slice(prefix.length);

      // Convierte la primera letra a minúscula (si existe)
      const formattedKey = newKey.charAt(0).toLowerCase() + newKey.slice(1);

      acc[formattedKey] = value;
    }
    return acc;
  }, {});
}

function drawContactBlock(doc, { x, y, width, title, contact = {} }) {
  let cursorY = y

  doc.font('Helvetica-Bold').fontSize(9).fillColor('#000000').text(title, x, cursorY, { width })
  cursorY = doc.y + 4

  cursorY = drawLabeledBox(doc, { x, y: cursorY, width, label: 'Nombre/Name:', value: contact.name })
  cursorY = drawLabeledBox(doc, { x, y: cursorY, width, label: 'Cargo/Title:', value: contact.title })
  cursorY = drawLabeledBox(doc, { x, y: cursorY, width, label: 'Dirección incluido el país/Address including country:', value: contact.address, boxHeight: 20 })
  cursorY = drawLabeledBox(doc, { x, y: cursorY, width, label: 'Teléfono/phone:', value: contact.phone })
  cursorY = drawLabeledBox(doc, { x, y: cursorY, width, label: 'Correo electrónico/e-mail:', value: contact.email })

  return cursorY
}

export function generarCertificacionOrigenTMEC(data = {}) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 40 })
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const left = doc.page.margins.left

  drawDoubleBorder(doc, { margin: 18 })
  doc.on('pageAdded', () => drawDoubleBorder(doc, { margin: 18 }))

  const certifierType = CERTIFIER_TYPES.includes(data.certifierType) ? data.certifierType : null
  const certifier = extractGroup(data, 'certifier')
  const exporter = extractGroup(data, 'exporter')
  const importer = extractGroup(data, 'importer')
  const producerText = data.producerText
    || (data.producer && formatFullAddress(data.producer))
    || 'AVAILABLE UPON REQUEST BY THE IMPORTING AUTHORITIES'
  const goods = [{ description:data.description, hsCode: data.hsCode, originCriteria: 'A', countryOfOrigin: 'MEX' }]
  const blanketFrom = data.blanketPeriodFrom || '01 / 01 / 2026'
  const blanketTo = data.blanketPeriodTo || '31 / 12 / 2026'
  const signatureDate = data.signatureDate || '01 / 01 / 2026'
  const signatureName = data.signatureName || ''
  const signatureTitle = data.signatureTitle || ''

  // ENCABEZADO
  doc.x = left
  doc
    .font('Helvetica-Bold')
    .fontSize(13)
    .text('Tratado entre México, Estados Unidos y Canadá o T-MEC', { align: 'center', width: contentWidth })
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('Certificación de Origen / Certification of Origin', { align: 'center', width: contentWidth })
    .moveDown(0.8)

  // 1. CERTIFICADOR
  doc.x = left
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .text('1.- Indique quien certifica el origen/ Indicate who certifies the origin:')
    .moveDown(0.3)

  const checkboxLabels = [
    { key: 'importer', label: 'Importador / Importer' },
    { key: 'exporter', label: 'Exportador / Exporter' },
    { key: 'producer', label: 'Productor / Producer' },
  ]
  let checkboxX = left
  const checkboxY = doc.y
  checkboxLabels.forEach(({ key, label }) => {
    doc.rect(checkboxX, checkboxY - 2, 9, 9).strokeColor('#000000').lineWidth(0.6).stroke()
    if (certifierType === key) {
      //Revisar
      doc.font('Helvetica-Bold').fontSize(8).text('X', checkboxX + 1.5, checkboxY)
    }
    doc.font('Helvetica').fontSize(9).text(label, checkboxX + 13, checkboxY - 1)
    checkboxX += 13 + doc.widthOfString(label) + 18
  })
  doc.y = checkboxY + 18
  doc.x = left

  // 2 y 3. CERTIFICADOR / EXPORTADOR (dos columnas)
  const colGap = 20
  const colWidth = (contentWidth - colGap) / 2
  const rightColX = left + colWidth + colGap

  let y = doc.y
  const yAfterCol1 = drawContactBlock(doc, { x: left, y: y, width: colWidth, title: '2.- Certificador/Certifier:', contact: certifier })
  const yAfterCol2 = drawContactBlock(doc, { x: rightColX, y: y, width: colWidth, title: '3.- Exportador/Exporter:', contact: exporter })
  doc.y = Math.max(yAfterCol1, yAfterCol2) + 4
  doc.x = left

  // 4 y 5. PRODUCTOR / IMPORTADOR
  const rowStartY = doc.y
  doc.font('Helvetica-Bold').fontSize(9).text('4.- Productor/Producer:', left, rowStartY, { width: colWidth })
  doc.rect(left, doc.y + 4, colWidth, 34).fillColor('#EBEBEB').fill()
  doc.rect(left, doc.y + 4, colWidth, 34).strokeColor('#000000').lineWidth(0.4).stroke()
  doc.fillColor('#000000').font('Helvetica').fontSize(8.5).text(producerText, left + 4, doc.y + 8, { width: colWidth - 8 })

  const yAfterCol4 = doc.y + 4 + 34 + 6
  const yAfterCol5 = drawContactBlock(doc, { x: rightColX, y: rowStartY, width: colWidth, title: '5.- Importador/Importer:', contact: importer })
  doc.y = Math.max(yAfterCol4, yAfterCol5) + 4
  doc.x = left

  // 6, 6(a), 7 y 8 (PAIS DE ORIGEN). TABLA DE MERCANCIAS
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .text('6.- Descripción/Description, 6(a) Clasificación arancelaria (6 dígitos)/HS classification, 7.- Criterios de Origen/Origin Criteria, PAIS DE ORIGEN')
    .moveDown(0.4)

  drawWrappedTable(doc, {
    columns: [
      { key: 'description', label: 'Descripción/Description', width: 2.2 },
      { key: 'hsCode', label: '6(a) Clasificación arancelaria (6 dígitos)/HS classification (6 digits)', width: 1.1, align: 'center' },
      { key: 'originCriteria', label: '7.- Criterios de Origen/Origin Criteria', width: 1, align: 'center' },
      { key: 'countryOfOrigin', label: 'PAIS DE ORIGEN', width: 0.8, align: 'center' },
    ],
    rows: goods,
  }, { headerFontSize: 7.5, bodyFontSize: 8.5, minRowHeight: 22 })
  doc.moveDown(0.6)
  doc.x = left

  // 8. PERIODO GLOBAL
  const periodLabelY = doc.y
  doc.font('Helvetica-Bold').fontSize(9).text('8.- Periodo Global/Blanket period:', left, periodLabelY, { width: colWidth })
  let periodY = drawLabeledBox(doc, { x: rightColX, y: periodLabelY, width: colWidth, label: 'De/from:', value: blanketFrom, spacing: 4 })
  periodY = drawLabeledBox(doc, { x: rightColX, y: periodY, width: colWidth, label: 'A/to:', value: blanketTo })
  doc.y = Math.max(doc.y, periodY) + 4
  doc.x = left

  // DECLARACIÓN DE CERTIFICACIÓN
  doc
    .font('Helvetica')
    .fontSize(8)
    .text(
      '"Certifico que las mercancías descritas en este documento califican como originarias y que la información contenida en este documento es verdadera ' +
      'y exacta. Asumo la responsabilidad de comprobar lo aquí declarado y me comprometo a conservar y presentar en caso de ser requerido o a poner a ' +
      'disposición durante una visita de verificación, la documentación necesaria que soporte esta certificación". /"I certify that the goods described in this ' +
      'document qualify as originating and the information contained in this document is true and accurate. I assume responsibility for proving such ' +
      'representations and agree to maintain and present upon request or to make available during a verification visit, documentation necessary to support ' +
      'this certification."',
      { align: 'justify', width: contentWidth }
    )
    .moveDown(0.8)

  // FIRMA AUTORIZADA Y FECHA
  const signRowY = doc.y
  const yAfterSignCol = drawLabeledBox(doc, { x: left, y: signRowY, width: colWidth, label: 'Firma Autorizada/Authorized Signature:', value: '', boxHeight: 22 })
  const yAfterDateCol = drawLabeledBox(doc, { x: rightColX, y: signRowY, width: colWidth, label: 'Fecha/Date:', value: signatureDate })
  doc.y = Math.max(yAfterSignCol, yAfterDateCol)
  doc.x = left

  doc.y = drawLabeledBox(doc, { x: left, y: doc.y, width: colWidth, label: 'Nombre/Name:', value: signatureName })
  doc.y = drawLabeledBox(doc, { x: left, y: doc.y, width: colWidth, label: 'Cargo/Title:', value: signatureTitle })

  doc.end()
  return doc
}
