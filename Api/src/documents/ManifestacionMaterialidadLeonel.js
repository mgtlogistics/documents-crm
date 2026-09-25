import fs from 'fs'
import PDFDocument from 'pdfkit'
import createStylizedParagraph from './utils/createStylizedParagraph.js'
import drawWrappedTable from './utils/drawWrappedTable.js'
import getLegalRepresentativeFullName from './utils/getLegalRepresentativeFullName.js'
import formatFullAddress from './utils/formatFullAddress.js'
import formatLongDate from './utils/formatLongDate.js'
import { resolvePublicFilePath } from '../utils/public.utils.js'

const DEFAULT_GOODS = [
  { type: 'Inmueble', description: '[Dirección exacta, metros cuadrados, uso del suelo]', document: '[Ej. Escritura pública / Contrato de arrendamiento]' },
  { type: 'Maquinaria', description: '[Marca, modelo, número de serie, capacidad]', document: '[Ej. Factura / Pedimento de importación]' },
  { type: 'Equipo de Oficina', description: '[Computadoras, mobiliario, servidores]', document: '[Ej. Factura / Factura de activo fijo]' },
  { type: 'Medios de Transporte', description: '[Placas, VIN, tipo de vehículo]', document: '[Ej. Tarjeta de circulación / Factura]' },
  { type: 'Otros', description: '[Describir otros medios empleados]', document: '[Ej. Documento legal correspondiente]' },
]

// El campo file de cada bien puede llegar como string url o como { fileUrl, fileName }
function resolveGoodImagePath(file) {
  if (!file) return null

  const fileUrl = typeof file === 'string' ? file : file.fileUrl || file.url || file.path || null
  if (!fileUrl) return null

  const localPath = resolvePublicFilePath(fileUrl)
  return localPath && fs.existsSync(localPath) ? localPath : null
}

function drawGoodsPhotosAnnex(doc, goods) {
  const photos = goods
    .map((item) => ({ item, imagePath: resolveGoodImagePath(item.file) }))
    .filter(({ imagePath }) => Boolean(imagePath))

  if (photos.length === 0) return

  doc.addPage()
  doc.x = doc.page.margins.left

  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('ANEXO FOTOGRÁFICO DE BIENES', { align: 'center' })
    .moveDown(1)

  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const columnGap = 20
  const columnWidth = (contentWidth - columnGap) / 2
  const imageHeight = 160
  const captionGap = 6
  const rowGap = 18
  const estimatedRowHeight = imageHeight + captionGap + 28 + rowGap

  let rowTop = doc.y
  let rowMaxBottom = doc.y

  photos.forEach(({ item, imagePath }, index) => {
    const columnIndex = index % 2

    if (columnIndex === 0) {
      if (rowTop + estimatedRowHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage()
        rowTop = doc.page.margins.top
      }
      rowMaxBottom = rowTop
    }

    const x = doc.page.margins.left + columnIndex * (columnWidth + columnGap)

    try {
      doc.image(imagePath, x, rowTop, { fit: [columnWidth, imageHeight], align: 'center', valign: 'center' })
    } catch {
      // imagen inválida o ilegible, se omite
    }

    doc.x = x
    doc.y = rowTop + imageHeight + captionGap
    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .text(item.type || '', x, doc.y, { width: columnWidth, align: 'center' })
      .font('Helvetica')
      .fontSize(8)
      .text(item.description || '', x, doc.y, { width: columnWidth, align: 'center' })

    rowMaxBottom = Math.max(rowMaxBottom, doc.y)

    if (columnIndex === 1 || index === photos.length - 1) {
      doc.x = doc.page.margins.left
      doc.y = rowMaxBottom + rowGap
      rowTop = doc.y
    }
  })
}

export function generarManifestacionMaterialidadLeonel(data = {}) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 60 })
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right

  const company = data?.user?.company || {}
  const address = data?.user?.address || {}
  const companyName = company.socialReason || '[Nombre de la Empresa o Persona Física]'
  const rfc = company.rfc || '[RFC]'
  const representativeFullName = getLegalRepresentativeFullName(company)
  const notificationAddress = data.notificationAddress || formatFullAddress(address, '[Calle, Número, Colonia, Ciudad, Código Postal]')
  const authorizedPersonName = data.authorizedPersonName || representativeFullName
  const issuanceDate = formatLongDate(data.issuanceDate || new Date())
  const goods = Array.isArray(data.goods) && data.goods.length > 0 ? data.goods : DEFAULT_GOODS

  const paragraphOptions = {
    fontSize: 10,
    width: contentWidth,
    align: 'justify',
  }

  doc.x = doc.page.margins.left
  doc
    .font('Helvetica')
    .fontSize(10)
    .text(`Ciudad de México, a ${issuanceDate}.`, { align: 'right', width: contentWidth })
    .moveDown(1.2)

  doc
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .text('A.A. LEONEL ERNESTO CANTU LOZANO.')
    .text('Patente 1615')
    .moveDown(1)

  createStylizedParagraph(doc, [
    { text: companyName, isBold: true },
    { text: ', con Registro Federal de Contribuyentes ' },
    { text: rfc, isBold: true },
    { text: ', señalando como domicilio para oír y recibir notificaciones el ubicado en ' },
    { text: notificationAddress, isBold: true },
    { text: ', y autorizando para tales efectos a ' },
    { text: authorizedPersonName, isBold: true },
    { text: ', ante usted comparezco para exponer:' },
  ], paragraphOptions)
  doc.moveDown(0.8)

  createStylizedParagraph(doc, [
    { text: 'Por medio del presente, y con fundamento en lo establecido en la ' },
    { text: 'Regla 1.4.14 fracción VII', isBold: true },
    { text: ' de las Reglas Generales de Comercio Exterior vigente al 23 de abril de 2026, manifiesto bajo protesta de decir verdad lo siguiente:' },
  ], paragraphOptions)
  doc.moveDown(1)

  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('I. DESCRIPCIÓN DE BIENES Y FACILIDADES (INCISO A)')
    .moveDown(0.5)

  createStylizedParagraph(doc, [
    { text: 'Para dar cumplimiento a lo requerido respecto a las actividades relacionadas con la operación de comercio exterior, declaro que cuento con el siguiente equipamiento e inmuebles:' },
  ], paragraphOptions)
  doc.moveDown(0.6)

  drawWrappedTable(doc, {
    columns: [
      { key: 'type', label: 'Tipo de Bien', width: 1.1 },
      { key: 'description', label: 'Descripción / Características', width: 1.6 },
      { key: 'document', label: 'Documento que acredita la propiedad o posesión', width: 1.6 },
    ],
    rows: goods.map((item) => ({
      type: item.type,
      description: item.description,
      document: item.document,
    })),
  })
  doc.moveDown(0.6)

  doc
    .font('Helvetica-Bold')
    .fontSize(9.5)
    .text('Las fotografías de cada uno de los bienes descritos arriba se incluyen en el anexo fotográfico al final del presente documento.', {
      width: contentWidth,
    })
    .moveDown(1)

  if (doc.y > doc.page.height - doc.page.margins.bottom - 120) {
    doc.addPage()
  }

  createStylizedParagraph(doc, [
    { text: 'DECLARACIÓN DE ACREDITACIÓN: ', isBold: true },
    { text: 'Manifiesto expresamente que cuento con la documentación idónea que acredita legalmente la propiedad o la posesión de la totalidad de los bienes descritos en la tabla anterior, la cual se encuentra a disposición de la autoridad competente para su cotejo en caso de ser requerida.' },
  ], paragraphOptions)
  doc.moveDown(0.8)

  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('II. NO VINCULACIÓN (INCISO B)')
    .moveDown(0.5)

  createStylizedParagraph(doc, [
    { text: 'Declaro bajo protesta de decir verdad que esta empresa (o persona) ' },
    { text: 'NO tiene vinculación', isBold: true },
    { text: ', en términos del artículo 68 de la Ley Aduanera, con contribuyentes que se encuentren en el listado a que se refiere el artículo 69-B, cuarto párrafo del Código Fiscal de la Federación (CFF).' },
  ], paragraphOptions)
  doc.moveDown(0.8)

  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('III. NO EMISIÓN DE COMPROBANTES FISCALES FALSOS (INCISO C)')
    .moveDown(0.5)

  createStylizedParagraph(doc, [
    { text: 'Declaro bajo protesta de decir verdad que, a la fecha de la presente solicitud, ' },
    { text: 'NO se me ha emitido ni notificado resolución alguna', isBold: true },
    { text: ' que determine que emito falsos comprobantes fiscales, en términos de lo dispuesto por el artículo 49 Bis del Código Fiscal de la Federación.' },
  ], paragraphOptions)
  doc.moveDown(0.8)

  createStylizedParagraph(doc, [
    { text: 'Manifiesto lo anterior con pleno conocimiento de las sanciones en las que incurren quienes declaran con falsedad ante la autoridad, en términos de la normatividad aplicable.' },
  ], paragraphOptions)
  doc.moveDown(1.5)

  if (doc.y > doc.page.height - doc.page.margins.bottom - 130) {
    doc.addPage()
  }

  doc
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .text('ATENTAMENTE')
    .moveDown(2.5)

  doc.x = doc.page.margins.left
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.margins.left + 260, doc.y)
    .lineWidth(0.75)
    .strokeColor('#000000')
    .stroke()
  doc.moveDown(0.4)

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(representativeFullName)
    .font('Helvetica')
    .fontSize(9.5)
    .text(company?.legalRepresentative?.position || '[Cargo]')
    .text(companyName)
    .text(rfc)

  drawGoodsPhotosAnnex(doc, goods)

  doc.end()
  return doc
}
