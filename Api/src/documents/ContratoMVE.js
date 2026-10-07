import PDFDocument from 'pdfkit'
import writeInlineFormattedText from './utils/writeInlineFormattedText.js'

function writeContractText(doc, text, options = {}) {
  const fontSize = options.fontSize ?? 9.2
  const bottom = doc.page.height - doc.page.margins.bottom
  if (doc.y > bottom - 35) doc.addPage()

  writeInlineFormattedText(doc, text, {
    x: doc.page.margins.left + (options.indent || 0),
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right - (options.indent || 0),
    font: options.bold ? 'Helvetica-Bold' : 'Helvetica',
    fontSize,
    align: options.align || 'justify',
  })
  doc.moveDown(options.spacing ?? 0.35)
}

const getTextValue = (...values) => values.find((value) => typeof value === 'string' && value.trim())?.trim()

function formatAddress(value) {
  if (typeof value === 'string') return value.trim()
  if (!value || typeof value !== 'object') return ''

  return [
    value.street,
    value.exteriorNumber && `número exterior ${value.exteriorNumber}`,
    value.interiorNumber && `interior ${value.interiorNumber}`,
    value.neighborhood && `colonia ${value.neighborhood}`,
    value.locality,
    value.city,
    value.state,
    value.postalCode && `C.P. ${value.postalCode}`,
    value.country,
  ].filter((part) => typeof part === 'string' && part.trim()).join(', ')
}

function addTitle(doc, text) {
  writeContractText(doc, text, { bold: true, fontSize: 11, align: 'left', spacing: 0.4 })
}

function addParagraph(doc, text, size = 9.2) {
  writeContractText(doc, text, { fontSize: size, spacing: 0.35 })
}

function addBullet(doc, text) {
  writeContractText(doc, `- ${text}`, { fontSize: 9.1, indent: 12, spacing: 0.25 })
}

export function generarContratoMVE(data = {}) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 60 })
  const user = data.user || {}
  const company = user.company || data.company || {}
  const representative = company.legalRepresentative || {}
  const blankField = '___________________________'
  const clientName = getTextValue(data.clientName, data.companyName, data.socialReason, company.socialReason) || blankField
  const representativeName = getTextValue(
    data.representativeName,
    data.legalRepresentativeName,
    [representative.firstName, representative.paternalLastName, representative.maternalLastName].filter(Boolean).join(' '),
    company.legalRepresentativeName
  ) || blankField
  const clientRfc = getTextValue(data.clientRfc, data.companyRfc, data.rfc, company.rfc) || blankField
  const clientAddress = formatAddress(user.address || data.fiscalAddress || data.address) || blankField
  const signingPlace = getTextValue(data.signingPlace, data.city, user.address?.city) || blankField
  const signingDay = getTextValue(data.signingDay, data.day) || blankField
  const signingMonth = getTextValue(data.signingMonth, data.month) || blankField
  const signingYear = getTextValue(data.signingYear, data.year) || blankField

  doc
    .font('Helvetica-Bold')
    .fontSize(11.5)
    .text(
      'CONTRATO DE PRESTACION DE SERVICIOS DE ASESORIA Y SOPORTE TECNICO EN LA ELABORACION, TRANSMISION Y VALIDACION DE LA MANIFESTACION DE VALOR ELECTRONICA (MVE)',
      { align: 'center' }
    )
    .moveDown(0.6)

  addParagraph(
    doc,
    `Contrato celebrado entre Global Agentes Aduanales y Asesores en Comercio Exterior S.C. (EL PRESTADOR DE SERVICIOS) y **${clientName}** (EL CLIENTE), representado por ${representativeName}, RFC ${clientRfc}, con domicilio en ${clientAddress}, para la asesoria y soporte tecnico de MVE en VUCEM.`
  )

  addTitle(doc, 'DECLARACIONES')
  addParagraph(
    doc,
    'EL PRESTADOR DE SERVICIOS declara contar con constitucion legal, facultades de representacion, capacidad tecnica y experiencia suficiente para prestar los servicios materia del presente instrumento.'
  )
  addParagraph(
    doc,
    `EL CLIENTE ${clientName} declara estar legalmente constituido, contar con representante con facultades y requerir asesoria para la correcta elaboracion y transmision de la MVE conforme al articulo 59 fraccion III de la Ley Aduanera, articulo 81 de su Reglamento y Regla 1.5.1 RGCE 2026. Su domicilio fiscal es ${clientAddress} y su RFC es ${clientRfc}.`
  )
  addParagraph(
    doc,
    'LAS PARTES declaran que celebran el contrato libremente, sin vicios del consentimiento, y aceptan obligaciones, responsabilidades y limitaciones aqui establecidas.'
  )

  addTitle(doc, 'PRIMERA. OBJETO')
  addParagraph(
    doc,
    'Prestacion de servicios profesionales de asesoria y soporte tecnico para elaboracion, transmision, validacion y generacion de acuses de MVE en VUCEM, vinculada al despacho aduanero de mercancias.'
  )

  addTitle(doc, 'SEGUNDA. ALCANCE DEL SERVICIO')
  addParagraph(
    doc,
    'El servicio se limita a la correcta asesoria y gestion tecnica de MVE. EL PRESTADOR DE SERVICIOS no se subroga en obligaciones legales del importador; su ejecucion depende de que EL CLIENTE entregue informacion completa y oportuna.'
  )

  addTitle(doc, 'TERCERA. OBLIGACIONES')
  addParagraph(doc, 'EL PRESTADOR DE SERVICIOS se obliga a:')
  addBullet(doc, 'Brindar asesoria y soporte tecnico para elaboracion y transmision de MVE.')
  addBullet(doc, 'Actuar con diligencia profesional en gestion y validacion de la informacion.')
  addBullet(doc, 'Resguardar confidencialidad e integridad de la informacion del cliente.')

  addParagraph(doc, 'EL CLIENTE se obliga a:')
  addBullet(doc, 'Entregar informacion y documentos del articulo 81 del Reglamento de la Ley Aduanera.')
  addBullet(doc, 'Cubrir honorarios pactados por cada MVE efectivamente transmitida.')
  addBullet(doc, 'Asumir responsabilidad por veracidad, suficiencia y oportunidad documental.')

  addTitle(doc, 'CUARTA. RESPONSABILIDAD')
  addParagraph(
    doc,
    'EL CLIENTE sera responsable por datos inexactos u omisiones. EL PRESTADOR DE SERVICIOS respondera solo por danos directos derivados de incumplimiento comprobado; no respondera por danos indirectos o lucro cesante. Si hay retraso injustificado o negligencia tecnica del prestador, aplica pena convencional del 20% de los honorarios de la operacion afectada.'
  )

  addTitle(doc, 'QUINTA. HONORARIOS Y FORMA DE PAGO')
  addParagraph(
    doc,
    'Honorario pactado de referencia: $1,000.00 MXN por cada MVE efectivamente transmitida con servicio de asesoria y soporte tecnico. El pago se efectua por operacion, conforme a cuenta de gastos y validacion previa acordada entre las partes.'
  )

  addTitle(doc, 'SEXTA. RECTIFICACION DE MVE')
  addParagraph(
    doc,
    'La rectificacion se realizara conforme a normativa aplicable. Si la rectificacion deriva de error del prestador, se realizara sin costo para EL CLIENTE y aplicara la pena convencional prevista en la clausula de responsabilidad.'
  )

  addTitle(doc, 'SEPTIMA. VIGENCIA')
  addParagraph(
    doc,
    'Vigencia inicial de un ano a partir de la firma, con renovacion automatica por periodos iguales salvo oposicion expresa de cualquiera de LAS PARTES antes del vencimiento.'
  )

  addTitle(doc, 'OCTAVA. TERMINACION ANTICIPADA')
  addParagraph(
    doc,
    'El contrato podra terminar por mutuo acuerdo o por incumplimiento esencial. La terminacion no libera al cliente de cubrir honorarios y obligaciones pendientes a la fecha efectiva de terminacion.'
  )

  addTitle(doc, 'NOVENA. FUERZA MAYOR, NOTIFICACIONES Y JURISDICCION')
  addParagraph(
    doc,
    'Ninguna parte sera responsable por incumplimientos derivados de caso fortuito o fuerza mayor, con deber de aviso por escrito. Las notificaciones se realizaran por escrito en domicilios o correos designados. Para interpretacion y cumplimiento, LAS PARTES se someten a tribunales competentes de Nuevo Laredo, Tamaulipas.'
  )

  if (doc.y > 640) doc.addPage()

  addParagraph(
    doc,
    `Leido integramente el contrato, LAS PARTES lo firman en ${signingPlace}, a los ${signingDay} dias del mes de ${signingMonth} de ${signingYear}.`
  )

  doc.moveDown(1.4)

  doc
    .font('Helvetica-Bold')
    .fontSize(9.5)
    .text('EL PRESTADOR DE SERVICIOS', 70, doc.y, { width: 220, align: 'center' })
    .text(`EL CLIENTE\n${clientName}`, 325, doc.y - 12, { width: 220, align: 'center' })

  doc.moveDown(2.4)

  doc
    .font('Helvetica')
    .fontSize(9)
    .text('____________________________', 70, doc.y, { width: 220, align: 'center' })
    .text('____________________________', 325, doc.y - 10, { width: 220, align: 'center' })
    .text('Nombre y firma', 70, doc.y + 4, { width: 220, align: 'center' })
    .text(`${representativeName}\nNombre y firma`, 325, doc.y - 8, { width: 220, align: 'center' })

  doc.end()
  return doc
}
