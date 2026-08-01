import PDFDocument from 'pdfkit'
import dayjs from 'dayjs'
import { getFrontendImg } from '../utils/public.utils.js'

const BLUE = '#0A2B6B'
const TEAL = '#1E5B6B'
const BLACK = '#000000'
const GRAY = '#6B7280'

const PAGE_TOTAL = 4

function getLegalRepresentativeFullName(company = {}) {
  const representative = company?.legalRepresentative || {}
  const fullName = [
    representative.firstName,
    representative.paternalLastName,
    representative.maternalLastName,
  ]
    .filter((part) => typeof part === 'string' && part.trim().length > 0)
    .join(' ')
    .trim()

  return fullName || company?.legalRepresentativeName || 'No aplica'
}

function contentWidth(doc) {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right
}

function contentBottom(doc) {
  // Reserva espacio para el footer para evitar brincos de pagina inesperados.
  return doc.page.height - doc.page.margins.bottom - 14
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
    .fontSize(13)
    .fillColor(BLACK)
    .text('Cuestionario de Seguridad para Socio Comercial', left, doc.page.margins.top, {
      width,
      align: 'center',
    })

  doc
    .moveTo(left, doc.page.margins.top + 20)
    .lineTo(left + width, doc.page.margins.top + 20)
    .lineWidth(0.8)
    .strokeColor('#9ca3af')
    .stroke()

  doc.y = doc.page.margins.top + 28
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


  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .fillColor(BLACK)
    .text('Cuestionario de Seguridad para Socio Comercial', left, doc.page.margins.top + 10, {
      width,
      align: 'center',
    })

  const introY = doc.page.margins.top + 52
  const introH = 58
  doc.rect(left + 42, introY, width - 42, introH).strokeColor(BLACK).lineWidth(0.8).stroke()

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(BLACK)
    .text(
      'Como Agente Aduanal certificado en materia de seguridad para la cadena de suministros bajo los requisitos del perfil del agente aduanal OEA que expide el Servicio de Administración Tributaria y con la finalidad de proporcionar la seguridad que sus operaciones requieren, le solicitamos responder al siguiente cuestionario para obtener conocimiento de las medidas de seguridad implementadas en cada uno de los centros de trabajo. Esperando fortalecer la seguridad de nuestra cadena de suministros, bajo el seguimiento de requerimientos y recomendaciones del programa OEA agradecemos de antemano las facilidades para la verificación de sus respuestas.',
      left + 56,
      introY + 8,
      { width: width - 70, align: 'center' }
    )

  let y = introY + introH + 6
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
    const rowHeight = Math.max(14, Math.max(labelHeight, valueHeight) + 5)

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(BLACK)
      .text(label, labelX, topY + 1, { width: valueX - labelX - 10 })

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
      .text(value, valueX + 4, topY + 1, { width: valueW - 8 })

    return rowHeight + 2
  }

  y += drawField('Nombre de la persona o empresa', toDisplayText(data?.companyName), y)
  y += drawField('Nombre representante legal', toDisplayText(data?.legalRepresentativeName), y)
  y += drawField('Nombre quien respondió la verificación', toDisplayText(data?.formFillerName), y)
  y += drawField('En caso de contar con certificación de seguridad indicar el numero de certificado', toDisplayText(data?.certificationNumber), y)
  y += drawField('Vigencia de la certificación', toDisplayDate(data?.certificationValidity), y)
  y += drawField('Emitido por', toDisplayText(data?.certificationIssuer), y)

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(BLACK)
    .text(
      'Instrucciones: Indicar con una X la respuesta. El resultado es medido por personal que aplica y verifica el cuestionario e instalaciones.',
      left + 10,
      y + 2,
      { width: width - 20 }
    )

  doc.y = y + 14
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
    doc.rect(x, y, widths[i], 16).fillColor(BLUE).fill()
    doc.rect(x, y, widths[i], 16).strokeColor(BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica-Bold').fontSize(7.6).fillColor('#ffffff').text(label, x + 2, y + 4, {
      width: widths[i] - 4,
      align: 'center',
      lineBreak: false,
    })
    x += widths[i]
  })

  doc.y = y + 16
}

function normalizeAnswer(answer) {
  const normalized = String(answer || '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (normalized === 'SI') return 'SI'
  if (normalized === 'NO') return 'NO'
  return ''
}

function formatValue(value) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return '0'
  return Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(2)
}

function drawMainSection(doc, title, rows, state) {
  const left = doc.page.margins.left
  const widths = [30, 42, 340, 34, 34, 160]
  const tableWidth = widths.reduce((a, b) => a + b, 0)
  let sectionScore = 0
  let sectionMaxScore = 0

  ensureSpace(doc, 60, state)
  drawMainTableHeader(doc, title, widths)

  rows.forEach((row) => {
    const answer = normalizeAnswer(row?.data?.answer)
    const comment = String(row?.data?.comment || '').trim()
    const valorNumerico = Number(row?.valor)
    const valor = Number.isFinite(valorNumerico) ? valorNumerico : 0

    sectionMaxScore += valor
    if (answer === 'SI') {
      sectionScore += valor
    }

    doc.font('Helvetica').fontSize(7)
    const rowTextHeight = doc.heightOfString(row.pregunta, { width: widths[2] - 6 })
    const obsTextHeight = doc.heightOfString(comment, { width: widths[5] - 6 })
    const rowH = Math.max(15, Math.max(rowTextHeight + 5, obsTextHeight + 5))
    ensureSpace(doc, rowH + 2, state)

    let x = left
    const y = doc.y

    doc.rect(x, y, widths[0], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica').fontSize(7.6).fillColor(BLACK).text(String(row.no), x + 1, y + 3, {
      width: widths[0] - 2,
      align: 'center',
      lineBreak: false,
    })
    x += widths[0]

    doc.rect(x, y, widths[1], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica').fontSize(7.6).fillColor(BLACK).text(formatValue(row.valor), x + 1, y + 3, {
      width: widths[1] - 2,
      align: 'center',
      lineBreak: false,
    })
    x += widths[1]

    doc.rect(x, y, widths[2], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica').fontSize(7).fillColor(BLACK).text(row.pregunta, x + 3, y + 2, {
      width: widths[2] - 6,
      align: 'left',
    })
    x += widths[2]

    doc.rect(x, y, widths[3], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(BLACK)
      .text(answer === 'SI' ? 'X' : '', x + 1, y + 3, {
        width: widths[3] - 2,
        align: 'center',
        lineBreak: false,
      })
    x += widths[3]

    doc.rect(x, y, widths[4], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(BLACK)
      .text(answer === 'NO' ? 'X' : '', x + 1, y + 3, {
        width: widths[4] - 2,
        align: 'center',
        lineBreak: false,
      })
    x += widths[4]

    doc.rect(x, y, widths[5], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica').fontSize(7).fillColor(BLACK).text(comment, x + 3, y + 2, {
      width: widths[5] - 6,
      align: 'left',
    })

    doc.y = y + rowH
  })

  if (!state.mainScore) {
    state.mainScore = { earned: 0, max: 0 }
  }
  state.mainScore.earned += sectionScore
  state.mainScore.max += sectionMaxScore

  ensureSpace(doc, 20, state)
  doc.rect(left, doc.y, tableWidth - 120, 18).strokeColor(BLACK).lineWidth(0.5).stroke()
  doc.rect(left + tableWidth - 120, doc.y, 120, 18).strokeColor(BLACK).lineWidth(0.5).stroke()
  doc.font('Helvetica-Bold').fontSize(7.6).fillColor(BLACK).text('Resultado', left + tableWidth - 116, doc.y + 5, {
    width: 54,
    align: 'left',
    lineBreak: false,
  })
  doc.font('Helvetica').fontSize(9).text(`${formatValue(sectionScore)} de ${formatValue(sectionMaxScore)}`, left + tableWidth - 58, doc.y - 8, {
    width: 50,
    align: 'right',
    lineBreak: false,
  })

  doc.y += 22
}

function drawMainTotalResult(doc, state) {
  if (!state.mainScore) {
    return
  }

  const left = doc.page.margins.left
  const width = contentWidth(doc)
  const resultW = 150

  ensureSpace(doc, 24, state)

  doc.rect(left, doc.y, width - resultW, 20).strokeColor(BLACK).lineWidth(0.8).stroke()
  doc.rect(left + width - resultW, doc.y, resultW, 20).strokeColor(BLACK).lineWidth(0.8).stroke()

  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(BLACK).text('Resultado final del cuestionario', left + 6, doc.y + 6, {
    width: width - resultW - 12,
    align: 'left',
    lineBreak: false,
  })

  doc.font('Helvetica-Bold').fontSize(9).fillColor(BLACK).text(
    `${formatValue(state.mainScore.earned)} de ${formatValue(state.mainScore.max)}`,
    left + width - resultW + 6,
    doc.y + 5,
    {
      width: resultW - 12,
      align: 'right',
      lineBreak: false,
    }
  )

  doc.y += 24
}

function drawVerificationHeader(doc, title, widths) {
  const left = doc.page.margins.left
  const totalW = widths.reduce((a, b) => a + b, 0)
  const y = doc.y
  const headerHeight = 24
  const labelRowHeight = 22

  doc.rect(left, y, totalW, headerHeight).fillColor(TEAL).fill()
  doc.rect(left, y, totalW, headerHeight).strokeColor(BLACK).lineWidth(0.5).stroke()
  doc.font('Helvetica').fontSize(7.6).fillColor('#ffffff').text(title, left + 4, y + 6, {
    width: totalW - 8,
    align: 'center',
  })

  let x = left
  const labels = ['Item', 'Si', 'No', 'Observaciones']
  labels.forEach((label, i) => {
    doc.rect(x, y + headerHeight, widths[i], labelRowHeight).fillColor(TEAL).fill()
    doc.rect(x, y + headerHeight, widths[i], labelRowHeight).strokeColor(BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica').fontSize(7.6).fillColor('#ffffff').text(label, x + 2, y + headerHeight + 5, {
      width: widths[i] - 4,
      align: 'center',
      lineBreak: false,
    })
    x += widths[i]
  })

  doc.y = y + headerHeight + labelRowHeight
}

function drawVerificationBlock(doc, title, rows, state) {
  const widths = [430, 60, 60, 170]
  ensureSpace(doc, 70, state)
  drawVerificationHeader(doc, title, widths)

  rows.forEach((text) => {
    const rowTextHeight = doc.heightOfString(text, { width: widths[0] - 6 })
    const rowH = Math.max(16, rowTextHeight + 5)
    ensureSpace(doc, rowH + 2, state)

    let x = doc.page.margins.left
    const y = doc.y

    doc.rect(x, y, widths[0], rowH).strokeColor(BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica').fontSize(7.6).fillColor(BLACK).text(text, x + 3, y + 3, {
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

  doc.y += 3
}

function drawConvenio(doc, data, state) {
  const left = doc.page.margins.left
  const width = contentWidth(doc)

  ensureSpace(doc, 180, state)

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor(BLACK)
    .text('Convenio entre Empresa y Socio Comercial', left, doc.y, { width })
  doc.y += 3

  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor(BLACK)
    .text(
      'Nos comprometemos a mantener y seguir los estándares de seguridad en conjunto con la empresa para lograr la salvaguarda e integridad de la cadena de suministro. Asi mismo, a implementar las medidas con las que nuestra empresa no cuente para cumplir con los requisitos de seguridad.',
      left,
      doc.y,
      { width, align: 'left' }
    )
  doc.y += 4

  const compromisos = [
    '1. Análisis de riesgo.',
    '2. Seguridad física.',
    '3. Controles de acceso físico.',
    '4. Socios comerciales.',
    '5. Seguridad de procesos.',
    '6. Gestión aduanera.',
    '7. Seguridad de vehículos de carga, contenedores, remolques y semirremolques.',
    '8. Seguridad del personal.',
    '9. Seguridad de la información y documentación.',
    '10. Capacitación en seguridad y concienciación.',
    '11. Manejo e investigación de incidentes.',
  ]

  compromisos.forEach((item) => {
    doc.font('Helvetica').fontSize(8.5).fillColor(BLACK).text(item, left + 12, doc.y, { width: width - 20 })
    doc.y += 1
  })

  ensureSpace(doc, 46, state)
  const signY = doc.y + 36
  const lineWidth = 250
  const rightX = left + width - lineWidth

  // doc
  //   .moveTo(left + 40, signY)
  //   .lineTo(left + 40 + lineWidth, signY)
  //   .lineWidth(0.8)
  //   .strokeColor(BLACK)
  //   .stroke()
  // doc
  //   .moveTo(rightX, signY)
  //   .lineTo(rightX + lineWidth, signY)
  //   .lineWidth(0.8)
  //   .strokeColor(BLACK)
  //   .stroke()

  doc.font('Helvetica').fontSize(9).fillColor(BLACK)
  doc.text(data.fillerFormName, left + 40, signY + 6, {
    width: lineWidth,
    align: 'center',
  })
  doc.text(data.verifierName, rightX, signY + 6, {
    width: lineWidth,
    align: 'center',
  })

  doc.y = signY + 16
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
    'Seguridad del traslado de mercancías',
    [
      { no: 1, valor: 10, data: data.s1p1, pregunta: '¿Utiliza transportista con medidas de seguridad o certificación en C-TPAT u OEA?' },
      { no: 2, valor: 10, data: data.s1p2, pregunta: '¿Se asegura de dar seguimiento o monitorear su recorrido por algún sistema GPS o algún otro mecanismo?' },
      { no: 3, valor: 10, data: data.s1p3, pregunta: '¿Se cerciora de que su transportista utilice candados de seguridad bajo la Norma ISO 17712?' },
      { no: 4, valor: 10, data: data.s1p4, pregunta: '¿Conoce o designa la ruta de recorrido desde su origen al destino al transportista?' },
      { no: 5, valor: 10, data: data.s1p5, pregunta: '¿En caso de desvío de la ruta, tiene comunicación con el transporte para conocer el motivo?' },
      { no: 6, valor: 10, data: data.s1p6, pregunta: '¿Cuenta con plan de contingencia en caso de contaminación de la carga?' },
    ],
    state
  )

  drawMainSection(
    doc,
    'Información de la carga',
    [
      { no: 7, valor: 5, data: data.s2p1, pregunta: '¿Cuenta con procedimientos para identificar, reportar y tratar las discrepancias de la carga y descarga de mercancía?' },
      { no: 8, valor: 5, data: data.s2p2, pregunta: '¿Cuenta con procedimientos para asegurar que tanto la información electrónica y/o documental que es enviada por sus socios comerciales a partir de su solicitud de servicio durante el movimiento y el despacho del traslado de mercancía de la carga como la generada por cuenta propia sea legible, completa, exacta, oportuna y protegida contra cambios, perdidas o introducción de información errónea?' },
      { no: 9, valor: 5, data: data.s2p3, pregunta: '¿Se asegura de tener controlado el material de empaque y embalaje?' },
      { no: 10, valor: 5, data: data.s2p4, pregunta: '¿Utiliza revisión K9 para asegurar el contenido de la carga libre de contaminación?' },
      { no: 11, valor: 5, data: data.s2p5, pregunta: '¿Se asegura de verificar el contenido de cada paquete que envía?' },
    ],
    state
  )

  drawMainSection(
    doc,
    'Seguridad de la informacion',
    [
      { no: 12, valor: 5, data: data.s3p1, pregunta: '¿La información generada de nuestra relación comercial es resguardada bajo llave?' },
      { no: 13, valor: 5, data: data.s3p2, pregunta: '¿La información digital que se genera de nuestra relación comercial es respaldada con copia de seguridad?' },
      { no: 14, valor: 5, data: data.s3p3, pregunta: '¿Cuenta con programas antivirus y cortafuegos?' },
    ],
    state
  )

  drawVerificationBlock(
    doc,
    'Verificación de indicadores de trabajo forzoso.  La siguiente sección no se cuestiona al socio comercial. Solo se responde por observación. ',
    [
      'Abuso de la vulnerabilidad',
      'Engaño',
      'Restricción de movimiento',
      'Aislamiento',
      'Violencia física y sexual',
      'Intimidación y amenazas',
      'Retención de documentos de identificación',
      'Retención de salarios',
      'Servidumbre por deudas',
      'Exceso de horas extras',
      'Condiciones de vida y trabajo abusivas',
    ],
    state
  )

  doc.y += 6

  drawVerificationBlock(
    doc,
    'Verificación indicadores para detectar clientes o proveedores que podrían no ser legítimos.  La siguiente sección no se cuestiona al socio comercial. Se verifica con responsable de socios comerciales y Documentadores o en su caso personal que tiene contacto con la empresa.',
    [
      'Realiza pagos en efectivo o solicita realizarlo',
      'Realiza pagos por encima de la tarifa estándar',
      'Tiene poco conocimiento de la mercancía o no proporciona información técnica',
      'Es evasivo',
      'No proporciona información de contacto',
      'Empresa de reciente creación (menor a 1 mes)',
      'Se localiza su domicilio',
      'Autoriza revisar mercancía para el previo',
    ],
    state
  )

  drawConvenio(doc, data, state)

  const W = doc.page.width - 144        // ancho útil
  const FONT_NORMAL = "Helvetica"
  const FONT_BOLD = "Helvetica-Bold"
  const SIZE_TITLE = 14
  const SIZE_BODY = 11
  const SIZE_FOOTER = 8
  const INDENT = 20
  const lineY = doc.y + 18
  const colGap = 28
  const colWidth = (W - colGap) / 2
  const colLeft = doc.page.margins.left
  const colRight = colLeft + colWidth + colGap

  // Líneas de firma estilizadas para mantener una apariencia limpia y uniforme.
  doc
    .save()
    .lineWidth(1)
    .strokeColor("#4b5563")
    .moveTo(colLeft, lineY)
    .lineTo(colLeft + colWidth, lineY)
    .stroke()
    .moveTo(colRight, lineY)
    .lineTo(colRight + colWidth, lineY)
    .stroke()
    .restore()

  const signatureTextY = lineY + 8

  doc
    .font(FONT_BOLD)
    .fontSize(10)
    .fillColor("#111827")
    .text("Nombre y firma de quien responde visita", colLeft, signatureTextY, { width: colWidth, align: "center" })

  const leftSignatureBottomY = doc.y

  doc
    .font(FONT_BOLD)
    .text("Nombre y forma de verificador", colRight, signatureTextY, { width: colWidth, align: "center" })

  const rightSignatureBottomY = doc.y
  doc.y = Math.max(leftSignatureBottomY, rightSignatureBottomY) + 8



  drawFooter(doc, state.page, state.totalPages)

  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i); // Nos movemos a la página 'i'
    doc.image(getFrontendImg('sauvinon.png'), doc.page.margins.left, doc.page.margins.top, { width: 120 }).moveDown(2)
  }

  return doc
}
