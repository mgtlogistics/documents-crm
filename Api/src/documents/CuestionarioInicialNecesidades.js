import PDFDocument from 'pdfkit'
import drawStyledFooter from './drawStyledFooter.js'

const C_GRAY = '#D8D8D8'
const C_BLUE = '#C9D7EE'

function drawTopBrand(doc) {
  const left = doc.page.margins.left
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('"SERVICIO INTEGRAL ADUANERO', left + 8, 26, { width: 180, align: 'left' })
    .text('QUE ABRE FRONTERAS"', left + 24, 37, { width: 140, align: 'left' })

  doc.font('Helvetica-Bold').fontSize(26).fillColor('#183D7A').text('GLOBAL', left + width - 168, 24, {
    width: 150,
    align: 'center',
    lineBreak: false,
  })

  doc
    .moveTo(left + 4, 62)
    .lineTo(left + width - 4, 62)
    .lineWidth(1)
    .strokeColor('#000000')
    .stroke()
  doc
    .moveTo(left + 4, 66)
    .lineTo(left + width - 4, 66)
    .lineWidth(1)
    .strokeColor('#000000')
    .stroke()

  doc.fillColor('#000000')
}

function drawHeaderTable(doc, pageNum, totalPages) {
  const left = doc.page.margins.left
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const cols = [90, 90, 65, 95, 64, 64, 64]
  const headers = ['Código', 'Resp. de\nProceso', 'Versión', 'Fecha de Emisión', 'Realizó', 'Autorizó', 'No. de Pág.']
  const values = ['GAA-SGS-04-\nF1-CIN-v2', 'Ejecutivo de\nTrafico', '2', '17/06/2020', 'GSS', 'DG', `Pág. ${pageNum} de ${totalPages}`]

  doc.font('Helvetica-Bold').fontSize(15).text('CUESTIONARIO INICIAL DE NECESIDADES', left, 72, {
    width,
    align: 'center',
  })

  const y = 110
  let x = left
  headers.forEach((h, i) => {
    doc.rect(x, y, cols[i], 34).strokeColor('#000000').lineWidth(0.6).stroke()
    doc.font('Helvetica').fontSize(8).text(h, x + 2, y + 10, { width: cols[i] - 4, align: 'center' })
    x += cols[i]
  })

  x = left
  values.forEach((v, i) => {
    doc.rect(x, y + 34, cols[i], 34).fillColor(C_GRAY).fill()
    doc.rect(x, y + 34, cols[i], 34).strokeColor('#000000').lineWidth(0.6).stroke()
    doc.fillColor('#000000').font('Helvetica-Bold').fontSize(11).text(v, x + 2, y + 44, {
      width: cols[i] - 4,
      align: 'center',
    })
    x += cols[i]
  })

  doc.y = y + 82
}

export function generarCuestionarioInicialNecesidades() {
  const doc = new PDFDocument({ size: 'LETTER', margin: 40 })

  // PAGINA 1
  drawTopBrand(doc)
  drawHeaderTable(doc, 1, 3)

  const left = doc.page.margins.left
  const contentW = doc.page.width - doc.page.margins.left - doc.page.margins.right

  doc.font('Helvetica-Bold').fontSize(10.5).text('Indicaciones:', left, doc.y, { continued: true })
  doc.font('Helvetica').fontSize(9.8).text(
    ' Favor de contestar las siguientes preguntas de preferencia no omitas ninguna ya que la información proporcionada servirá para que podamos brindarte un mejor servicio. En caso de alguna duda escríbenos al correo: ',
    { continued: true }
  )
  doc.font('Helvetica-Bold').fontSize(9.8).text('info@aaglobal.net')

  doc.y += 10

  const tableX = left
  const tableW = contentW
  const splitX = tableX + 270

  let y = doc.y
  doc.rect(tableX, y, tableW, 18).fillColor(C_GRAY).fill()
  doc.rect(tableX, y, tableW, 18).strokeColor('#000000').lineWidth(0.6).stroke()
  doc.fillColor('#000000').font('Helvetica-Bold').fontSize(12).text('Datos Generales:', tableX + 8, y + 3)
  y += 18

  const generalRows = [
    'Nombre de la empresa:',
    'Tipo de empresa:',
    'Giro de la empresa:',
    'No. de teléfono:',
    'Nombre del Representante Legal:',
    'Nombre de la persona encargada de Comercio\nExterior:',
    'Dirección de Correo Electrónico:',
  ]

  generalRows.forEach((label) => {
    const rowH = label.includes('\\n') ? 26 : 22
    doc.rect(tableX, y, splitX - tableX, rowH).fillColor(C_BLUE).fill()
    doc.rect(tableX, y, splitX - tableX, rowH).strokeColor('#000000').lineWidth(0.6).stroke()
    doc.rect(splitX, y, tableW - (splitX - tableX), rowH).strokeColor('#000000').lineWidth(0.6).stroke()
    doc.fillColor('#000000').font('Helvetica').fontSize(9.5).text(label, tableX + 6, y + 4, { width: splitX - tableX - 10 })
    y += rowH
  })

  y += 10
  doc.rect(tableX, y, tableW, 18).fillColor(C_GRAY).fill()
  doc.rect(tableX, y, tableW, 18).strokeColor('#000000').lineWidth(0.6).stroke()
  doc.fillColor('#000000').font('Helvetica-Bold').fontSize(12).text('Datos Específicos:', tableX + 8, y + 3)
  y += 18

  const specHeaderH = 198
  doc.rect(tableX, y, splitX - tableX, specHeaderH).fillColor(C_BLUE).fill()
  doc.rect(tableX, y, splitX - tableX, specHeaderH).strokeColor('#000000').lineWidth(0.6).stroke()
  doc.rect(splitX, y, tableW - (splitX - tableX), specHeaderH).strokeColor('#000000').lineWidth(0.6).stroke()

  doc.font('Helvetica').fontSize(9.6).fillColor('#000000').text(
    'La mercancía que usted importa/ exporta es\nconsiderada vulnerable como las siguientes:',
    tableX + 6,
    y + 8,
    { width: splitX - tableX - 12 }
  )

  const listY = y + 38
  const vulnerables = [
    { text: 'a)    Vehículos      terrestres,      aéreos      y\n       marítimos, nuevos y usados', step: 23 },
    { text: 'b)    Máquinas para juegos de apuesta y\n       sorteos, nuevas y usadas', step: 23 },
    { text: 'c)    Equipos  y  materiales  para  la\n       elaboración de tarjetas de pago', step: 23 },
    { text: 'd)    Joyas, relojes, Piedras Preciosas y\n       Metales Preciosos', step: 23 },
    { text: 'e)    Obras de arte', step: 15 },
    { text: 'f)    Materiales de resistencia balística\n       para la prestación de servicios de\n       blindaje de vehículos.', step: 10 },
  ]

  let listCursor = listY
  vulnerables.forEach((v) => {
    doc.font('Helvetica').fontSize(8.8).text(v.text, tableX + 24, listCursor, { width: splitX - tableX - 24 })
    listCursor += v.step
  })

  y += specHeaderH - 20
  const bottomRows = [
    'En caso de llevar a cabo estas actividades favor de\nespecificar.',
    'Tipo de mercancía que importan:',
    'Tipo de mercancía que exportan:',
    'Número aproximado de operaciones',
    'Valor estimado de las operaciones',
  ]
  bottomRows.forEach((label) => {
    const rowH = label.includes('actividades') ? 30 : 18
    doc.rect(tableX, y, splitX - tableX, rowH).fillColor(C_BLUE).fill()
    doc.rect(tableX, y, splitX - tableX, rowH).strokeColor('#000000').lineWidth(0.6).stroke()
    doc.rect(splitX, y, tableW - (splitX - tableX), rowH).strokeColor('#000000').lineWidth(0.6).stroke()
    doc.fillColor('#000000').font('Helvetica').fontSize(9.5).text(label, tableX + 6, y + 4, { width: splitX - tableX - 10 })
    y += rowH
  })

  drawStyledFooter(doc, 1, 3)

  // PAGINA 2
  doc.addPage()
  drawTopBrand(doc)
  drawHeaderTable(doc, 2, 3)

  let p2y = doc.y + 8
  const qRows = [
    'Se encuentra dado de  alta  en  el  padrón   de\nimportadores:',
    'Lugares a donde será enviada la mercancía:',
    'Por el tipo de mercancías requiere descarga a mano o\nmaniobras especiales:',
    'Requiere bodega en USA:',
    'Favor de proporcionarnos el contacto de las personas\nencargadas de comercio exterior',
  ]

  qRows.forEach((q) => {
    const rowH = q.includes('\\n') ? 38 : 27
    doc.rect(tableX, p2y, splitX - tableX, rowH).fillColor(C_BLUE).fill()
    doc.rect(tableX, p2y, splitX - tableX, rowH).strokeColor('#000000').lineWidth(0.6).stroke()
    doc.rect(splitX, p2y, tableW - (splitX - tableX), rowH).strokeColor('#000000').lineWidth(0.6).stroke()
    doc.fillColor('#000000').font('Helvetica').fontSize(10).text(q, tableX + 6, p2y + 5, { width: splitX - tableX - 10 })
    p2y += rowH
  })

  p2y += 24
  doc.font('Helvetica').fontSize(11).text('Con base a lo anterior usted requiere la cotización de las tarifas de servicios:', tableX, p2y)
  p2y += 18

  const boxW = 40
  doc.rect(tableX + 228, p2y - 6, boxW, 28).strokeColor('#000000').lineWidth(0.6).stroke()
  doc.rect(tableX + 292, p2y - 6, boxW, 28).strokeColor('#000000').lineWidth(0.6).stroke()
  doc.font('Helvetica').fontSize(14).text('Si', tableX + 244, p2y + 1, { lineBreak: false })
  doc.font('Helvetica').fontSize(14).text('No', tableX + 305, p2y + 1, { lineBreak: false })

  p2y += 38
  doc.font('Helvetica').fontSize(11).text('Documentación que deberá entregar antes de efectuar el primer cruce:', tableX, p2y)
  p2y += 20

  const docs = [
    '1.   Cuestionario Inicial de Necesidades',
    '2.   Aviso de actualización Situación Fiscal',
    '3.   Cedula de identificación fiscal',
    '4.   Acta constitutiva',
    '5.   Poder del Representante Legal',
    '6.   Carta Encomienda',
    '7.   Comprobante de domicilio',
    '8.   Permiso de maquila',
    '9.   Documentos en materia de seguridad en la cadena de suministro',
    '    •   Check List. Expediente de clientes (GAA-SGS-04-F2-CLC-v1)',
    '    •   Cuestionario de Estándares de Seguridad (GAA-SGS-04-F3-CES-v1)',
    '    •   Carta compromiso de Confidencialidad para socios comerciales (GAA-SGS-04-A3-CCSC-v1)',
    '    •   Aviso de Privacidad (GAA-SGS-04-F9-AP)',
    '    •   Consentimiento Socios Comerciales (GAA-SGS-04-A4-CSC-v1)',
    '    •   Política sobre la prohibición del trabajo forzoso u obligatorio de los colaboradores conforme los acuerdo',
    '      del artículo 23.6 T-MEC.',
  ]
  docs.forEach((line) => {
    doc.font('Helvetica').fontSize(8.8).text(line, tableX + 18, p2y)
    p2y += 15
  })

  drawStyledFooter(doc, 2, 3)

  // PAGINA 3
  doc.addPage()
  drawTopBrand(doc)
  drawHeaderTable(doc, 3, 3)

  let p3y = doc.y + 14
  doc.font('Helvetica').fontSize(10.5).text(
    'Conoce que documentos son requeridos por la Ley  Aduanera, marque con una “X” donde requiera\nasesoría para conocerlos y la manera de obtenerlos.',
    tableX,
    p3y
  )

  p3y += 38
  const p3Split = tableX + 365
  const reqDocs = [
    'Carta encomienda',
    'Manifestación de valor',
    'Certificado de origen',
    'Permisos (en su caso)',
    'Otros',
    'Hoja de Cálculo',
    'Factura comercial con todos sus requisitos',
    'NOM de calidad (en su caso)',
    'Autorizaciones de otras secretarias',
  ]

  reqDocs.forEach((d) => {
    doc.rect(tableX + 140, p3y, p3Split - (tableX + 140), 22).fillColor(C_BLUE).fill()
    doc.rect(tableX + 140, p3y, p3Split - (tableX + 140), 22).strokeColor('#000000').lineWidth(0.6).stroke()
    doc.rect(p3Split, p3y, 45, 22).strokeColor('#000000').lineWidth(0.6).stroke()
    doc.fillColor('#000000').font('Helvetica').fontSize(10.5).text(d, tableX + 146, p3y + 4)
    p3y += 22
  })

  p3y += 38
  doc.font('Helvetica-Bold').fontSize(14).fillColor('#B61717').text('ATENCIÓN', tableX, p3y, { width: contentW, align: 'center' })
  p3y += 28

  doc.font('Helvetica').fontSize(10.5).fillColor('#000000').text(
    'ESTIMADO CLIENTE A CONTINUACIÓN LES DAMOS A CONOCER CUALES SON LOS MOTIVOS\nQUE CAUSAN DEMORAS EN EL CRUCE DE SUS MERCANCÍAS, FAVOR DE TOMAR NOTA Y\nCOMUNIQUE CUALQUIER COMENTARIO O NECESIDAD QUE TENGA PARA COMUNICARNOS\nCUALQUIER SITUACIÓN REFERENTE A SUS OPERACIONES SIGA EL MECANISMO DE\nRETROALIMENTACIÓN',
    tableX,
    p3y,
    { width: contentW, align: 'justify' }
  )

  p3y += 82
  const motivos = [
    'a)   Falta de depósito para el pago de impuestos.',
    'b)   Falta de documentos para realizar el despacho aduanal, como son:  (Facturas, certificados de\n      origen, programas IMEX, cartas de importación “restricción o regulación no arancelaria aplicable\n      a su cruce”).',
    'c)   Falta de documentos legales del importador, como son: Copia del acta constitutiva, identificación\n      del representante legal, carta encomienda, manifestación de valor, registro del padrón de\n      importadores, etc).',
    'd)   Caída de sistemas en aduanas o bancos.',
    'e)   Falta de instrucciones por parte del importador para el cruce de mercancía.',
  ]
  motivos.forEach((m) => {
    doc.font('Helvetica').fontSize(10).text(m, tableX + 18, p3y, { width: contentW - 30 })
    p3y += m.includes('b)'||'c)') ? 44 : 22
  })

  drawStyledFooter(doc, 3, 3)

  doc.end()
  return doc
}
