import PDFDocument from 'pdfkit'
import createStylizedParagraph from './utils/createStylizedParagraph.js'
import formatLongDate from './utils/formatLongDate.js'
import drawLetterhead from './utils/drawLetterhead.js'

const DEFAULTS = {
  companyName: '[RAZÓN SOCIAL]',
  rfc: '[RFC]',
  address: '[DOMICILIO FISCAL]',
  city: '[CIUDAD]',
  state: '[ESTADO]',
  country: '[PAÍS]',
  invoiceNumber: '[NÚMERO DE FACTURA]',
  agentName: 'Lic. Cesar Augusto Saviñón',
  patent: '1623',
  representativeName: '[NOMBRE DEL REPRESENTANTE LEGAL]',
  representativeTitle: '[CARGO]',
}

function getData(data = {}) {
  const company = data?.user?.company || {}
  const address = data?.user?.address || {}
  const representative = company?.legalRepresentative || {}
  const representativeName = [
    representative.firstName,
    representative.paternalLastName,
    representative.maternalLastName,
  ].filter(Boolean).join(' ').trim()

  const addressText = [
    address.street,
    address.exteriorNumber && `NO. ${address.exteriorNumber}`,
    address.interiorNumber && `INT. ${address.interiorNumber}`,
    address.neighborhood,
    address.locality,
    address.city,
    address.state,
    address.country,
    address.postalCode && `CP ${address.postalCode}`,
  ].filter(Boolean).join(', ')

  return {
    ...DEFAULTS,
    companyName: data.companyName || company.socialReason || DEFAULTS.companyName,
    rfc: data.rfc || company.rfc || DEFAULTS.rfc,
    address: data.address || addressText || DEFAULTS.address,
    invoiceNumber: data.invoiceNumber || DEFAULTS.invoiceNumber,
    agentName: data.agentName || DEFAULTS.agentName,
    patent: data.patent || DEFAULTS.patent,
    representativeName: data.representativeName || representativeName || DEFAULTS.representativeName,
    representativeTitle: data.representativeTitle || representative.position || DEFAULTS.representativeTitle,
    issuePlace: data.issuePlace || [address.city, address.state, address.country].filter(Boolean).join(', ') || `${DEFAULTS.city}, ${DEFAULTS.state}, ${DEFAULTS.country}`,
    issueDate: data.issueDate || new Date(),
    logoPath: data.logoPath,
    code: data.code || '2620',
    phone: data.phone || data.user?.profile?.phone || '[TELÉFONO]',
    email: data.email || company.email || data.user?.email || '[CORREO ELECTRÓNICO]',
    footerAddress: data.footerAddress || addressText || DEFAULTS.address,
    footerCompanyName: data.footerCompanyName || company.socialReason || DEFAULTS.companyName,
  }
}

export function generarCartaDeclaracionDeslindePCST(input = {}) {
  const data = getData(input)
  const doc = new PDFDocument({ size: 'LETTER', margin: 45, bufferPages: true })
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const paragraphOptions = { fontSize: 10.5, width, align: 'justify' }

  drawLetterhead(doc, input)
  doc.x = doc.page.margins.left
  doc.moveDown(0.4)

  doc
    .font('Helvetica')
    .fontSize(10)
    .text(`${data.issuePlace} a ${formatLongDate(data.issueDate)}.`, { align: 'right', width })
    .moveDown(1.1)
  doc.x = doc.page.margins.left

  doc.font('Helvetica').fontSize(10.5).text('A quién corresponda:').moveDown(1.2).text('Presente').moveDown(1.2)
  doc.x = doc.page.margins.left

  createStylizedParagraph(doc, [
    { text: 'Por medio de la presente, ' },
    { text: data.representativeName, isBold: true },
    { text: ' en mi carácter de representante legal de la empresa ' },
    { text: data.companyName, isBold: true },
    { text: ', con Registro Federal de Contribuyentes ' },
    { text: data.rfc, isBold: true },
    { text: ', y domicilio fiscal ubicado ' },
    { text: data.address, isBold: true },
    { text: ', manifiesto bajo protesta de decir verdad lo siguiente:' },
  ], paragraphOptions)
  doc.moveDown(0.7)

  const statements = [
    [
      { text: '1.    Que la mercancía correspondiente a la factura número (' },
      { text: data.invoiceNumber, isBold: true },
      { text: '), tramitado ante la aduana de Nogales, Sonora, fue embalada, revisada y sellada bajo nuestra total responsabilidad, cumpliendo con las disposiciones legales aplicables.' },
    ],
    [
      { text: '2.    Que dicha mercancía no contiene sustancias, materiales u objetos prohibidos o restringidos, ni ninguna clase de mercancía ilícita que contravenga las leyes mexicanas o internacionales.' },
    ],
    [
      { text: '3.    Que el agente aduanal ' },
      { text: data.agentName, isBold: true },
      { text: ' con Patente Aduanal ' },
      { text: data.patent, isBold: true },
      { text: ' y su personal no han tenido participación alguna en la revisión, carga, embalaje, transporte o supervisión física directa de dicha mercancía.' },
    ],
    [
      { text: '4.    Que liberamos expresamente al agente aduanal y a su equipo de cualquier responsabilidad administrativa, fiscal o penal derivada de la posible contaminación, alteración o manipulación no autorizada de la carga antes, durante o después del despacho aduanero, cuando esta haya sido realizada por terceros ajenos a su control.' },
    ],
    [
      { text: '5.    Que, en caso de detectarse cualquier irregularidad legal relacionada con esta carga, nos comprometemos a asumir las responsabilidades y consecuencias legales correspondientes.' },
    ],
  ]

  statements.forEach((statement) => {
    doc.x = doc.page.margins.left
    createStylizedParagraph(doc, statement, paragraphOptions)
    doc.moveDown(0.75)
  })

  doc.x = doc.page.margins.left
  doc.font('Helvetica').fontSize(10.5).text('Sin otro particular, firmo la presente para los fines legales a que haya lugar.').moveDown(1.4)
  doc.font('Helvetica-Bold').fontSize(10.5).text('Atentamente', { align: 'center', width }).moveDown(2.6)

  const signatureWidth = 230
  const signatureX = doc.page.margins.left + (width - signatureWidth) / 2
  const signatureY = doc.y
  doc
    .moveTo(signatureX, signatureY)
    .lineTo(signatureX + signatureWidth, signatureY)
    .lineWidth(0.8)
    .strokeColor('#000000')
    .stroke()
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .text(data.representativeName, signatureX, signatureY + 8, { width: signatureWidth, align: 'center' })
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(data.representativeTitle, signatureX, signatureY + 24, { width: signatureWidth, align: 'center' })

  const footerWidth = 280
  const footerHeight = 76
  const footerX = doc.page.width - doc.page.margins.right - footerWidth
  const footerY = doc.page.height - doc.page.margins.bottom - footerHeight
  doc
    .save()
    .fillColor('#165844')
    .rect(footerX, footerY, footerWidth, footerHeight)
    .fill()
    .fillColor('#FFFFFF')
    .font('Helvetica-Oblique')
    .fontSize(7.5)
    .text(data.footerCompanyName, footerX + 8, footerY + 7, { width: footerWidth - 16, align: 'center' })
    .text(`RFC: ${data.rfc}`, footerX + 8, footerY + 20, { width: footerWidth - 16, align: 'center' })
    .text(data.footerAddress, footerX + 8, footerY + 33, { width: footerWidth - 16, align: 'center' })
    .text(`${data.phone} | ${data.email}`, footerX + 8, footerY + 56, { width: footerWidth - 16, align: 'center' })
    .restore()

  doc.end()
  return doc
}

export default generarCartaDeclaracionDeslindePCST
