import PDFDocument from 'pdfkit'
import drawDoubleBorder from './utils/drawDoubleBorder.js'
import drawLabeledBox from './utils/drawLabeledBox.js'
import drawWrappedTable from './utils/drawWrappedTable.js'
import formatFullAddress from './utils/formatFullAddress.js'

const CERTIFIER_TYPES = ['importer', 'exporter', 'producer']

function drawFooterPage(doc, pageNumber) {
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor('#000000')
    .text(`pág. ${pageNumber}`, doc.page.margins.left, doc.page.height - doc.page.margins.bottom - 4, {
      width: contentWidth,
      align: 'right',
      lineBreak: false,
    })
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
  const certifier = data.certifier || {}
  const exporter = data.exporter || {}
  const importer = data.importer || {}
  const producerText = data.producerText
    || (data.producer && formatFullAddress(data.producer))
    || 'AVAILABLE UPON REQUEST BY THE IMPORTING AUTHORITIES'
  const goods = Array.isArray(data.goods) && data.goods.length > 0
    ? data.goods
    : [{ description: '', hsCode: '', originCriteria: 'A', countryOfOrigin: 'MEX' }]
  const blanketFrom = data.blanketPeriod?.from || '01 / 01 / 2026'
  const blanketTo = data.blanketPeriod?.to || '31 / 12 / 2026'
  const signatureDate = data.signature?.date || '01 / 01 / 2026'
  const signatureName = data.signature?.name || ''
  const signatureTitle = data.signature?.title || ''

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
    doc.rect(checkboxX, checkboxY, 9, 9).strokeColor('#000000').lineWidth(0.6).stroke()
    if (certifierType === key) {
      doc.font('Helvetica-Bold').fontSize(8).text('X', checkboxX + 1.5, checkboxY - 0.5)
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

  const yAfterCol1 = drawContactBlock(doc, { x: left, y: doc.y, width: colWidth, title: '2.- Certificador/Certifier:', contact: certifier })
  const yAfterCol2 = drawContactBlock(doc, { x: rightColX, y: doc.y, width: colWidth, title: '3.- Exportador/Exporter:', contact: exporter })
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

  drawFooterPage(doc, 1)

  // PÁGINA 2: INSTRUCCIONES (ESPAÑOL)
  doc.addPage()
  doc.x = left
  doc.font('Helvetica-Bold').fontSize(11).text('Indicaciones para su de llenado').moveDown(0.6)

  const instruccionesEs = [
    { title: '1. Certificación de Origen por el Importador, Exportador o Productor', text: 'Indique si el certificador es el exportador, productor o importador de conformidad con el Artículo 5.2 (Solicitudes de Trato Arancelario Preferencial).' },
    { title: '2. Certificador', text: 'Proporcione el nombre, cargo, dirección (incluido el país), número telefónico y dirección de correo electrónico del certificador.' },
    { title: '3. Exportador', text: 'Proporcione el nombre, dirección (incluido el país), dirección de correo electrónico y número telefónico del exportador, de ser distinto del certificador. Esta información no será requerida si el productor está llenando la certificación de origen y desconoce la identidad del exportador. La dirección del exportador será el lugar de exportación de la mercancía en el territorio de una de las Partes.' },
    { title: '4. Productor', text: 'Proporcione el nombre, dirección (incluido el país), dirección de correo electrónico y, número telefónico del productor, de ser distinto del certificador o exportador o, si hay múltiples productores, indique "Varios" o proporcione una lista de productores. Una persona que desea que esta información se mantenga confidencial podrá indicar "Disponible a solicitud de las autoridades importadoras". La dirección del productor será el lugar de producción de la mercancía en el territorio de una de las Partes.' },
    { title: '5. Importador', text: 'Proporcione, de conocerse, el nombre, dirección, dirección de correo electrónico y número telefónico del importador. La dirección del importador será en el territorio de una de las Partes.' },
    { title: '6. Descripción y Clasificación Arancelaria de la Mercancía en el SA 5-A-2', text: '(a) Proporcione una descripción de la mercancía y la clasificación arancelaria en el SA de la mercancía a nivel de 6 dígitos. La descripción debería ser suficiente para relacionarla con la mercancía amparada por la certificación; y (b) Si la certificación de origen ampara un solo embarque de una mercancía, indique, de conocerse, el número de la factura relacionada con la exportación.' },
    { title: '7. Criterio de Origen', text: 'Especifique la regla de origen conforme a la cual la mercancía califica, según se establece en el Artículo 4.2 (Mercancías Originarias). (a) Totalmente obtenida o producida enteramente en el territorio de una o más Partes, (b) producida enteramente en el territorio de una o más de las Partes utilizando materiales no originarios, (c) producida enteramente en el territorio de una o más de las Partes, exclusivamente de materiales originarios; (d) salvo para una mercancía comprendida en los Capítulos 61 al 63 del Sistema Armonizado' },
    { title: '8. Período Global', text: 'Incluya el período si la certificación ampara múltiples embarques de mercancías idénticas para un plazo especificado de hasta 12 meses según se establece en el Artículo 5.2 (Solicitudes de Trato Arancelario Preferencial).' },
    { title: '9. Firma Autorizada y Fecha', text: 'La certificación debe ser firmada y fechada por el certificador e ir acompañada de la siguiente declaración: Certifico que las mercancías descritas en este documento califican como originarias y que la información contenida en este documento es verdadera y exacta. Asumo la responsabilidad de comprobar lo aquí declarado y me comprometo a conservar y presentar en caso de ser requerido o a poner a disposición durante una visita de verificación, la documentación necesaria que soporte esta certificación.' },
  ]

  instruccionesEs.forEach(({ title, text }) => {
    if (doc.y > doc.page.height - doc.page.margins.bottom - 60) {
      doc.addPage()
    }
    doc.x = left
    doc.font('Helvetica-Bold').fontSize(9.5).text(title, { width: contentWidth }).moveDown(0.15)
    doc.font('Helvetica').fontSize(9).text(text, { width: contentWidth, align: 'justify' }).moveDown(0.5)
  })

  drawFooterPage(doc, 2)

  // PÁGINA 3: CERTIFICATION OF ORIGIN INSTRUCTIONS (INGLÉS)
  doc.addPage()
  doc.x = left
  doc.font('Helvetica-Bold').fontSize(11).text('Certification of Origin Instructions').moveDown(0.6)

  const instructionsEn = [
    { title: '1. Certification of origin by the Importer, Exporter or Producer', text: 'Indicate whether the certifier is the exporter, producer, or importer in accordance with Article 5.2 (Claims for Preferential Treatment).' },
    { title: '2. Certifier', text: "Provide the certifier's legal name, title, address (including country), telephone number, and e-mail address." },
    { title: '3. Exporter', text: "Provide the exporter's name, address (including country), e-mail address, and telephone number if different from the certifier. This information is not required if the producer is completing the certification of origin and does not know the identity of the exporter. The address of the exporter shall be the place of export of the good in a Party's territory." },
    { title: '4. Producer', text: 'Provide the producer\'s name, address (including country), e-mail address, and telephone number, if different from the certifier or exporter or, if there are multiple producers, state "Various" or provide a list of producers. A person that wishes for this information to remain confidential may state "Available upon request by the importing authorities". The address of a producer shall be the place of production of the good in a Party\'s territory.' },
    { title: '5. Importer', text: "Provide, if known, the importer's name, address, e-mail address, and telephone number. The address of the importer shall be in a Party's territory." },
    { title: '6. Description and Tariff Classification of each Good on HS 5-A-2', text: '(a) Provide a full description of each good and tariff classification according to the HS to a 6-digit level. The description should be sufficient to relate it to the invoice description and to the Harmonized System (HS) description of the good; and (b) If the Certificate covers a single shipment of a good, include the invoice number as shown on the commercial invoice, if known.' },
    { title: '7. Origin Criteria', text: 'Specify the rule of origin according to which the merchandise qualifies, as established in Article 4.2 (Original Merchandise). (a) Wholly obtained or produced entirely in the territory of one or more Parties, (b) produced entirely in the territory of one or more of the Parties using non-originating materials, (c) produced entirely in the territory of one or more of the Parties, exclusively from originating materials; (d) except for the goods provided for in Chapters 61 to 63 of the Harmonized System.' },
    { title: '8. Blanket Period', text: 'Include the blanket period, if the certification covers multiple shipments of identical goods for a specified period of up to 12 months as set out in Article 5.2 (Claims for Preferential Treatment).' },
    { title: '9. Authorized signature and Date', text: 'The certification must be signed and dated by the certifier and accompanied by the following statement: I certify that the goods described in this document qualify as originating and the information contained in this document is true and accurate. I assume responsibility for proving such representations and agree to maintain and present upon request or to make available during a verification visit, documentation necessary to support this certification.' },
  ]

  instructionsEn.forEach(({ title, text }) => {
    if (doc.y > doc.page.height - doc.page.margins.bottom - 60) {
      doc.addPage()
    }
    doc.x = left
    doc.font('Helvetica-Bold').fontSize(9.5).text(title, { width: contentWidth }).moveDown(0.15)
    doc.font('Helvetica').fontSize(9).text(text, { width: contentWidth, align: 'justify' }).moveDown(0.5)
  })

  drawFooterPage(doc, 3)

  doc.end()
  return doc
}
