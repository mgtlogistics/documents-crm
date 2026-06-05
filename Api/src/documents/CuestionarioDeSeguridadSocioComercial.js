import PDFDocument from 'pdfkit'
import dayjs from 'dayjs'
import { getFrontendImg } from '../utils/public.utils.js'

const BLUE = '#0A2B6B'
const TEAL = '#1E5B6B'
const BLACK = '#000000'
const GRAY = '#6B7280'

const PAGE_TOTAL = 2

function contentWidth(doc) {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right
}

function contentBottom(doc) {
  // Reserva espacio para el footer para evitar brincos de pagina inesperados.
  return doc.page.height - doc.page.margins.bottom - 24
}

function drawFooter(doc, pageNumber, totalPages) {
  const left = doc.page.margins.left
  const width = contentWidth(doc)
  const y = doc.page.height - 18
  const originalX = doc.x
  const originalY = doc.y
  const originalBottomMargin = doc.page.margins.bottom

  // Evita que PDFKit fuerce un salto de pagina al escribir en coordenadas absolutas del footer.
  doc.page.margins.bottom = 0

  doc.save()
  doc
    .moveTo(left, y - 5)
    .lineTo(left + width, y - 5)
    .lineWidth(0.6)
    .strokeColor('#d1d5db')
    .stroke()

  doc
    .font('Helvetica')
    .fontSize(7)
    .fillColor(GRAY)
    .text('Documento confidencial y para uso exclusivo de GAA', left, y, {
      width: width * 0.7,
      align: 'left',
      lineBreak: false,
    })
    .text(`Pagina ${pageNumber} de ${totalPages}`, left + width * 0.7, y, {
      width: width * 0.3,
      align: 'right',
      lineBreak: false,
    })
  doc.restore()
  doc.page.margins.bottom = originalBottomMargin

  // Restablece cursor para no afectar el flujo del contenido.
  doc.x = originalX
  doc.y = originalY
}

function drawStaticHeader(doc) {
  const left = doc.page.margins.left
  const width = contentWidth(doc)

  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .fillColor(BLACK)
    .text('Cuestionario de Seguridad para Socio Comercial', left, doc.page.margins.top, {
      width,
      align: 'center',
    })

  doc
    .moveTo(left, doc.page.margins.top + 24)
    .lineTo(left + width, doc.page.margins.top + 24)
    .lineWidth(0.8)
    .strokeColor('#9ca3af')
    .stroke()

  doc.y = doc.page.margins.top + 34
}

function drawCoverHeader(doc, data) {
  const left = doc.page.margins.left
  const width = contentWidth(doc)

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(BLACK)
    .text(`Fecha: ${dayjs().format('DD/MM/YYYY')}`, left + width - 150, doc.page.margins.top + 19, {
      width: 150,
      align: 'right',
    })

  // doc
  //   .moveTo(left + width - 180, doc.page.margins.top + 16)
  //   .lineTo(left + width - 8, doc.page.margins.top + 16)
  //   .lineWidth(0.8)
  //   .strokeColor(BLACK)
  //   .stroke()

  doc
    .font('Helvetica-Bold')
    .fontSize(17)
    .fillColor(BLACK)
    .text('Cuestionario de Seguridad para Socio Comercial', left, doc.page.margins.top + 10, {
      width,
      align: 'center',
    })

  const introY = doc.page.margins.top + 62
  const introH = 70
  doc.rect(left + 42, introY, width - 42, introH).strokeColor(BLACK).lineWidth(0.8).stroke()

  doc
    .font('Helvetica')
    .fontSize(8.6)
    .fillColor(BLACK)
    .text(
      'Como Agente Aduanal certificado en materia de seguridad para la cadena de suministros bajo los requisitos del perfil del agente aduanal OEA que expide el Servicio de Administracion Tributaria y con la finalidad de proporcionar la seguridad que sus operaciones requieren, le solicitamos responder al siguiente cuestionario para obtener conocimiento de las medidas de seguridad implementadas en cada uno de los centros de trabajo. Esperando fortalecer la seguridad de nuestra cadena de suministros, bajo el seguimiento de requerimientos y recomendaciones del programa OEA agradecemos de antemano las facilidades para la verificacion de sus respuestas.',
      left + 56,
      introY + 12,
      { width: width - 70, align: 'center' }
    )

  let y = introY + introH + 10
  const labelX = left + 10
  const valueX = left + 260
  const valueW = width - (valueX - left) - 8

  const toDisplayText = (value) => {
    if (value === null || value === undefined) return 'No aplica'
    const normalized = String(value).trim()
    return normalized.length > 0 ? normalized : 'No aplica'
  }

  const toDisplayDate = (value) => {
    if (!value) return 'No aplica'
    const parsed = dayjs(value)
    return parsed.isValid() ? parsed.format('DD/MM/YYYY') : 'No aplica'
  }

  const drawField = (label, value, topY) => {
    const labelHeight = doc.heightOfString(label, { width: valueX - labelX - 10 })
    const valueHeight = doc.heightOfString(value, { width: valueW - 8 })
    const rowHeight = Math.max(18, Math.max(labelHeight, valueHeight) + 8)

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(BLACK)
      .text(label, labelX, topY + 2, { width: valueX - labelX - 10 })

    doc
      .lineWidth(0.6)
      .strokeColor('#111827')
      .moveTo(valueX, topY + rowHeight)
      .lineTo(valueX + valueW, topY + rowHeight)
      .stroke()

    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor(BLACK)
      .text(value, valueX + 4, topY + 2, { width: valueW - 8 })

    return rowHeight + 6
  }

  y += drawField('Nombre de la persona o empresa', toDisplayText(data?.user?.company?.socialReason), y)
  y += drawField('Nombre representante legal', toDisplayText(data?.user?.company?.legalRepresentativeName), y)
  y += drawField('Nombre quien respondió la verificación', toDisplayText(data?.fillerFormName), y)
  y += drawField('En caso de contar con certificación de seguridad indicar el numero de certificado', toDisplayText(data?.certificationNumber), y)
  y += drawField('Vigencia de la certificación', toDisplayDate(data?.certificationValidity), y)

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(BLACK)
    .text(
      'Instrucciones: Indicar con una X la respuesta. El resultado es medido por personal que aplica y verifica el cuestionario e instalaciones.',
      left + 10,
      y + 4,
      { width: width - 20 }
    )

  doc.y = y + 24
}

function ensureSpace(doc, requiredHeight, state) {
  if (doc.y + requiredHeight <= contentBottom(doc)) {
    return
  }

  drawFooter(doc, state.page, state.totalPages)
  doc.addPage()
  state.page += 1
  drawStaticHeader(doc)
}

function drawMainTableHeader(doc, title, widths) {
  const left = doc.page.margins.left
  const y = doc.y
  const labels = ['No.', 'Valor', title, 'Si', 'No', 'Observaciones']

  let x = left
  labels.forEach((label, i) => {
    doc.rect(x, y, widths[i], 18).fillColor(BLUE).fill()
    doc.rect(x, y, widths[i], 18).strokeColor(BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#ffffff').text(label, x + 2, y + 5, {
      width: widths[i] - 4,
      align: 'center',
      lineBreak: false,
    })
    x += widths[i]
  })

  doc.y = y + 18
}

function drawMainSection(doc, title, rows, resultText, state) {
  const left = doc.page.margins.left
  const widths = [30, 42, 340, 34, 34, 160]
  const tableWidth = widths.reduce((a, b) => a + b, 0)

  ensureSpace(doc, 60, state)
  drawMainTableHeader(doc, title, widths)

  rows.forEach((row) => {
    doc.font('Helvetica').fontSize(7.2)
    const rowTextHeight = doc.heightOfString(row.pregunta, { width: widths[2] - 6 })
    const rowH = Math.max(18, rowTextHeight + 7)
    ensureSpace(doc, rowH + 2, state)

    let x = left
    const y = doc.y

    doc.rect(x, y, widths[0], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica').fontSize(8).fillColor(BLACK).text(String(row.no), x + 1, y + 4, {
      width: widths[0] - 2,
      align: 'center',
      lineBreak: false,
    })
    x += widths[0]

    doc.rect(x, y, widths[1], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica').fontSize(8).fillColor(BLACK).text(String(row.valor), x + 1, y + 4, {
      width: widths[1] - 2,
      align: 'center',
      lineBreak: false,
    })
    x += widths[1]

    doc.rect(x, y, widths[2], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica').fontSize(7.2).fillColor(BLACK).text(row.pregunta, x + 3, y + 3, {
      width: widths[2] - 6,
      align: 'left',
    })
    x += widths[2]

    doc.rect(x, y, widths[3], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()
    x += widths[3]
    doc.rect(x, y, widths[4], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()
    x += widths[4]
    doc.rect(x, y, widths[5], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()

    doc.y = y + rowH
  })

  ensureSpace(doc, 24, state)
  doc.rect(left, doc.y, tableWidth - 120, 20).strokeColor(BLACK).lineWidth(0.5).stroke()
  doc.rect(left + tableWidth - 120, doc.y, 120, 20).strokeColor(BLACK).lineWidth(0.5).stroke()
  doc.font('Helvetica-Bold').fontSize(8).fillColor(BLACK).text('Resultado', left + tableWidth - 116, doc.y + 6, {
    width: 54,
    align: 'left',
    lineBreak: false,
  })
  doc.font('Helvetica').fontSize(10).text(resultText, left + tableWidth - 58, doc.y + 5, {
    width: 50,
    align: 'right',
    lineBreak: false,
  })

  doc.y += 26
}

function drawVerificationHeader(doc, title, widths) {
  const left = doc.page.margins.left
  const totalW = widths.reduce((a, b) => a + b, 0)
  const y = doc.y

  doc.rect(left, y, totalW, 19).fillColor(TEAL).fill()
  doc.rect(left, y, totalW, 19).strokeColor(BLACK).lineWidth(0.5).stroke()
  doc.font('Helvetica').fontSize(8).fillColor('#ffffff').text(title, left + 4, y + 5, {
    width: totalW - 8,
    align: 'center',
  })

  let x = left
  const labels = ['Item', 'Si', 'No', 'Observaciones']
  labels.forEach((label, i) => {
    doc.rect(x, y + 19, widths[i], 18).fillColor(TEAL).fill()
    doc.rect(x, y + 19, widths[i], 18).strokeColor(BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica').fontSize(8).fillColor('#ffffff').text(label, x + 2, y + 24, {
      width: widths[i] - 4,
      align: 'center',
      lineBreak: false,
    })
    x += widths[i]
  })

  doc.y = y + 37
}

function drawVerificationBlock(doc, title, rows, state) {
  const widths = [430, 60, 60, 170]
  ensureSpace(doc, 70, state)
  drawVerificationHeader(doc, title, widths)

  rows.forEach((text) => {
    const rowTextHeight = doc.heightOfString(text, { width: widths[0] - 6 })
    const rowH = Math.max(20, rowTextHeight + 8)
    ensureSpace(doc, rowH + 2, state)

    let x = doc.page.margins.left
    const y = doc.y

    doc.rect(x, y, widths[0], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica').fontSize(8).fillColor(BLACK).text(text, x + 3, y + 5, {
      width: widths[0] - 6,
    })
    x += widths[0]

    doc.rect(x, y, widths[1], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()
    x += widths[1]
    doc.rect(x, y, widths[2], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()
    x += widths[2]
    doc.rect(x, y, widths[3], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()

    doc.y = y + rowH
  })

  doc.y += 6
}

function drawConvenio(doc, data, state) {
  const left = doc.page.margins.left
  const width = contentWidth(doc)

  ensureSpace(doc, 230, state)

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor(BLACK)
    .text('Convenio entre Empresa y Socio Comercial', left, doc.y, { width })
  doc.y += 6

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor(BLACK)
    .text(
      'Nos comprometemos a mantener y seguir los estandares de seguridad en conjunto con la empresa para lograr la salvaguarda e integridad de la cadena de suministro. Asi mismo, a implementar las medidas con las que nuestra empresa no cuente para cumplir con los requisitos de seguridad.',
      left,
      doc.y,
      { width, align: 'left' }
    )
  doc.y += 8

  const compromisos = [
    '1. Analisis de riesgo.',
    '2. Seguridad fisica.',
    '3. Controles de acceso fisico.',
    '4. Socios comerciales.',
    '5. Seguridad de procesos.',
    '6. Gestion aduanera.',
    '7. Seguridad de vehiculos de carga, contenedores, remolques y semirremolques.',
    '8. Seguridad del personal.',
    '9. Seguridad de la informacion y documentacion.',
    '10. Capacitacion en seguridad y concientizacion.',
    '11. Manejo e investigacion de incidentes.',
  ]

  compromisos.forEach((item) => {
    doc.font('Helvetica').fontSize(9).fillColor(BLACK).text(item, left + 12, doc.y, { width: width - 20 })
    doc.y += 2
  })

  ensureSpace(doc, 56, state)
  const signY = doc.y + 70
  const lineWidth = 250
  const rightX = left + width - lineWidth

  doc
    .moveTo(left + 40, signY)
    .lineTo(left + 40 + lineWidth, signY)
    .lineWidth(0.8)
    .strokeColor(BLACK)
    .stroke()
  doc
    .moveTo(rightX, signY)
    .lineTo(rightX + lineWidth, signY)
    .lineWidth(0.8)
    .strokeColor(BLACK)
    .stroke()

  doc.font('Helvetica').fontSize(9).fillColor(BLACK)
  doc.text(data.fillerFormName, left + 40, signY + 6, {
    width: lineWidth,
    align: 'center',
  })
  doc.text(data.verifierName, rightX, signY + 6, {
    width: lineWidth,
    align: 'center',
  })

  doc.y = signY + 30
}

export function generarCuestionarioSeguridadSocioComercial(data) {
  const doc = new PDFDocument({
    size: 'LETTER',
    layout: 'landscape',
    margin: 36,
    bufferPages: true,
  })

  const state = { page: 1, totalPages: PAGE_TOTAL }

  drawCoverHeader(doc, data)

  drawMainSection(
    doc,
    'Seguridad del traslado de mercancias',
    [
      { no: 1, valor: '10%', pregunta: 'Utiliza transportista con medidas de seguridad o certificacion en C-TPAT u OEA?' },
      { no: 2, valor: '10%', pregunta: 'Se asegura de dar seguimiento o monitorear su recorrido por algun sistema GPS u otro mecanismo?' },
      { no: 3, valor: '10%', pregunta: 'Se cerciora de que su transportista utilice candados de seguridad bajo la norma ISO 17712?' },
      { no: 4, valor: '10%', pregunta: 'Conoce o designa la ruta de recorrido desde su origen al destino al transportista?' },
      { no: 5, valor: '10%', pregunta: 'En caso de desvio de la ruta, tiene comunicacion con el transporte para conocer el motivo?' },
      { no: 6, valor: '10%', pregunta: 'Cuenta con plan de contingencia en caso de contaminacion de la carga?' },
    ],
    '___ de 60',
    state
  )

  drawMainSection(
    doc,
    'Informacion de la carga',
    [
      { no: 7, valor: '5%', pregunta: 'Cuenta con procedimientos para identificar, reportar y tratar discrepancias en carga y descarga de mercancia?' },
      { no: 8, valor: '5%', pregunta: 'Asegura que la informacion electronica y documental del traslado y despacho sea legible, completa, exacta y protegida contra cambios o perdidas?' },
      { no: 9, valor: '5%', pregunta: 'Se asegura de tener controlado el material de empaque y embalaje?' },
      { no: 10, valor: '5%', pregunta: 'Utiliza revision K9 para asegurar el contenido de la carga libre de contaminacion?' },
      { no: 11, valor: '5%', pregunta: 'Se asegura de verificar el contenido de cada paquete que envia?' },
    ],
    '___ de 25',
    state
  )

  drawMainSection(
    doc,
    'Seguridad de la informacion',
    [
      { no: 12, valor: '5%', pregunta: 'La informacion generada de la relacion comercial es resguardada bajo llave?' },
      { no: 13, valor: '5%', pregunta: 'La informacion digital de la relacion comercial es respaldada con copia de seguridad?' },
      { no: 14, valor: '5%', pregunta: 'Cuenta con programas antivirus y cortafuegos?' },
    ],
    '___ de 15',
    state
  )

  drawVerificationBlock(
    doc,
    'Verificacion de indicadores de trabajo forzoso (observacion interna)',
    [
      'Abuso de la vulnerabilidad',
      'Engano',
      'Restriccion de movimiento',
      'Aislamiento',
      'Violencia fisica y sexual',
      'Intimidacion y amenazas',
      'Retencion de documentos de identificacion',
      'Retencion de salarios',
      'Servidumbre por deudas',
      'Exceso de horas extras',
      'Condiciones de vida y trabajo abusivas',
    ],
    state
  )

  drawVerificationBlock(
    doc,
    'Verificacion de indicadores para detectar clientes o proveedores no legitimos',
    [
      'Realiza pagos en efectivo o solicita realizarlo',
      'Realiza pagos por encima de la tarifa estandar',
      'Tiene poco conocimiento de la mercancia o no proporciona informacion tecnica',
      'Es evasivo',
      'No proporciona informacion de contacto',
      'Empresa de reciente creacion (menor a 1 mes)',
      'Se localiza su domicilio',
      'Autoriza revisar mercancia para el previo',
    ],
    state
  )

  drawConvenio(doc, data, state)

  drawFooter(doc, state.page, state.totalPages)

  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i); // Nos movemos a la página 'i'
    doc.image(getFrontendImg('sauvinon.png'), doc.page.margins.left, doc.page.margins.top, { width: 120 }).moveDown(2)
  }

  doc.end()
  return doc
}
