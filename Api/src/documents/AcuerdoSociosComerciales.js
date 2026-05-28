import PDFDocument from 'pdfkit'
import dayjs from 'dayjs'

import createStylizedParagraph from './createStylizedParagraph.js'
import createPdfList from './createPdfList.js'
import drawStyledHeader from './drawStyledHeader.js'
import drawStyledFooter from './drawStyledFooter.js'
import createSignatureBox from './createSignatureBox.js'

function drawHeader(doc, pageNumber) {
  const left = doc.page.margins.left
  const top = doc.page.margins.top
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right



  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .text('ACUERDO SOCIOS COMERCIALES', left, top, { width, align: 'center' })

  const tableTop = doc.y + 8
  const cols = [150, 65, 75, 60, 60, 80]
  const headers = ['Proceso', 'Resp. de Proceso', 'Version', 'Fecha de Emisión', 'Realizó', 'Autorizó', 'No. de Pag.']
  const values = ['GAA-SGS-04-A4-ASC-v3', 'Ejecutivo de tráfico', '3', '17/06/2020', 'GSS', 'DG', `Pag. ${pageNumber} de 2`]

  let x = left
  for (let i = 0; i < cols.length; i += 1) {
    const w = cols[i]
    doc.rect(x, tableTop, w, 22).stroke()
    doc
      .font('Helvetica')
      .fontSize(7)
      .text(headers[i], x + 3, tableTop + 4, { width: w - 6, align: 'center' })
    x += w
  }

  x = left
  for (let i = 0; i < cols.length; i += 1) {
    const w = cols[i]
    doc.rect(x, tableTop + 22, w, 22).stroke()
    doc
      .font('Helvetica-Bold')
      .fontSize(7)
      .text(values[i], x + 3, tableTop + 26, { width: w - 6, align: 'center' })
    x += w
  }

  doc
    .font('Helvetica')
    .fontSize(7)
    .text(`Pagina ${pageNumber}  Copia Controlada`, left, tableTop + 48)

  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .text(
      'Completamente confidencial y para uso exclusivo de "Global Agentes Aduanales y Asesores en Comercio Exterior, SC".',
      left,
      tableTop + 64,
      { width, align: 'left' }
    )
    .text('El documento electrónico prevalece sobre cualquier impresión del mismo.', left, tableTop + 77, {
      width,
      align: 'left',
    })

  doc.y = tableTop + 98
}

export function generarAcuerdoSociosComerciales(data) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 40 })
  const left = doc.page.margins.left
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const AUTOCOMP = '(revisar)'

  const fechaActual = dayjs().format('DD/MM/YYYY').toString()

  const paragraphOptions = {
    fontSize: 10,
    width,
    align: 'justify'
  }

  const headerOptions = {
    title: 'ACUERDO SOCIOS COMERCIALES',
    cols: [150, 75, 45, 65, 50, 50, 70], // Puedes cambiar los anchos si un código es más largo
    headers: ['Código', 'Resp. de Proceso', 'Versión', 'Fecha de Emisión', 'Realizó', 'Autorizó', 'No. de Pág.'],
    values: ['GAA-SGS-04-F9-AP-v1', 'Ejecutivo de Trafico', '1', fechaActual, 'GSS', 'DG']
    // Nota: El 7mo valor ("Pág. X de Y") se omite aquí porque la función lo calcula sola
  };


  drawStyledHeader(doc, 1, null, headerOptions)

  const paragraph1 = [
    { text: 'Una vez leído el Aviso de Privacidad, el suscrito conviene expresamente por este medio a proporcionar datos personales, incluso de carácter sensible a la Agencia ' },
    { text: '"Global Agentes Aduanales y Asesores en Comercio Exterior, SC"', isBold: true },
    { text: ', con domicilio en ' },
    { text: '"Dr. Mier #4309 Col. Hidalgo"', isUnderlined: true },
    { text: ', así como proporcionarle actualizaciones periódicas para identificación, operación y administración.' }
  ]

  createStylizedParagraph(doc, paragraph1, paragraphOptions)
  doc.moveDown(0.8)

  const paragraph2 = [
    { text: 'De igual modo, autorizo expresamente por medio de la presente a la Agencia ' },
    { text: '"Global Agentes Aduanales y Asesores en Comercio Exterior, SC"', isBold: true },
    { text: ', para recabar, utilizar, almacenar y transferir mis datos personales en la medida en que las leyes aplicables lo permiten, para llevar a cabo lo siguiente:' },
  ]
  createStylizedParagraph(doc, paragraph2, paragraphOptions)
  doc.moveDown(0.7)



  const puntos = [
    'Cumplir con obligaciones de carácter legal de conformidad con la relación comercial.',
    'Conformar expediente como socio comercial para control y trámites internos, mismo que serán auditados para verificar la conformidad del Sistema de Gestión con fines de certificación.',
    'Poder llevar a cabo la prestación de los servicios requeridos.',
    'Reconocer que la seguridad en la cadena de suministro es fundamental para garantizar operaciones eficientes, confiables y en cumplimiento con las normativas vigentes.',
    'Implementar y mantener controles de seguridad en instalaciones, procesos y manejo de información para prevenir accesos no autorizados.',
    'Establecer mecanismos de identificación y validación de empleados, proveedores y visitantes en las áreas operativas.',
    'Cumplir con los procedimientos de seguridad en el traslado, almacenamiento y manipulación de mercancías.',
    'Reportar de manera inmediata cualquier incidente o vulnerabilidad que pudiera afectar la seguridad de las operaciones.',
    'Cooperar con Global Agentes Aduanales y Asesores en Comercio Exterior, SC en auditorías y revisiones para verificar el cumplimiento de estos criterios.',
  ]

  createPdfList(doc, puntos, {
    type: 'alphabetical-lower',
    indent: 20,
    width,
    align: 'justify',
    fontSize: 10,
    moveDown: 0.45
  })

  const paragraph3 = [
    { text: 'La Agencia "Global Agentes Aduanales y Asesores en Comercio Exterior, SC"', isBold: true },
    { text: ', podrá hacer uso de mis datos personales para otras finalidades, siempre y cuando dichas finalidades sean compatibles y puedan considerarse análogas a las anteriores, en el entendido de que mis datos personales serán tratados únicamente por el tiempo necesario a fin de cumplir con las finalidades descritas y/o de conformidad con lo que establezcan las disposiciones legales aplicables.' },
  ]
  createStylizedParagraph(doc, paragraph3, paragraphOptions)
  doc.moveDown(0.6)

  const paragraph4 = [
    { text: 'La Agencia "Global Agentes Aduanales y Asesores en Comercio Exterior, SC"', isBold: true },
    { text: ', se obliga a mantener estricta confidencialidad y a no darle un uso distinto a mis datos personales al descrito en el Aviso de Privacidad.' },
  ]
  createStylizedParagraph(doc, paragraph4, paragraphOptions)
  doc.moveDown(0.6)


  const paragraph5 = [
    { text: 'Cualquier trámite sobre los derechos (autocompletado) deben ser canalizados a través del correo electrónico ' },
    { text: '“info@aaglobal.net”', isBold: true },
    { text: ' o en las oficinas de ' },
    { text: '“Global Agentes Aduanales y Asesores en Comercio Exterior”', isBold: true },
    { text: ' con el ' },
    { text: 'Director General y/o Gerente General', isBold: true },
    { text: ' quien le indicará el procedimiento a seguir.' }
  ]

  createSignatureBox(doc, {
    width: 280,
    height: 100,
    barHeight: 26,
    text: `${data.name} ${fechaActual} \n FIRMA`
  })
  drawStyledFooter(doc, 1, 2)

  doc.end()
  return doc
}
