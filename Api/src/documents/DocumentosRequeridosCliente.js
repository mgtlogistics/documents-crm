import PDFDocument from 'pdfkit'

function drawTitle(doc, text) {
  doc.font('Helvetica-Bold').fontSize(12).text(text, { align: 'center' }).moveDown(0.6)
}

function drawSectionTitle(doc, text) {
  doc.font('Helvetica-Bold').fontSize(10).text(text).moveDown(0.25)
}

function drawChecklistItems(doc, items) {
  items.forEach((item) => {
    if (doc.y > doc.page.height - doc.page.margins.bottom - 28) {
      doc.addPage()
    }

    doc
      .font('Helvetica')
      .fontSize(9)
      .text('[ ]', { continued: true })
      .text(` ${item}`)
      .moveDown(0.12)
  })
}

export function generarDocumentosRequeridosCliente() {
  const doc = new PDFDocument({ size: 'LETTER', margin: 50 })

  drawTitle(doc, 'Check List Expediente Clientes')

  drawSectionTitle(doc, 'Documentacion')
  drawChecklistItems(doc, [
    'CARTA ENCOMIENDA',
    'SELLOS VUCEM',
    'CONTRATO DE PRESTACIONES DE SERVICIOS DE AA',
    'CONTRATO MVE',
    'SELLOS (EN CASO QUE APLIQUE)',
    'ENCARGO CONFERIDO',
    'CEDULA RFC / CONSTANCIA DE SITUACION FISCAL',
    'ACTA CONSTITUTIVA (COPIA CERTIFICADA PREFERENTEMENTE)',
    'PODER NOTARIAL',
    'OPINION DE CUMPLIMIENTO DE OBLIGACIONES FISCALES (POSITIVO)',
    'FOTOGRAFIA DE LA FACHADA DE SUS INSTALACIONES (PREFERENTEMENTE)',
    'COMPROBANTE DE DOMICILIO RECIENTE (TELEFONO, LUZ, EDO. CTA BANCARIO)',
    'ENCABEZADO DE ESTADO DE CUENTA BANCARIO AL QUE SE LE PAGA',
    'CERTIFICADO DE CALIDAD Y/O SEGURIDAD / ISO PARA CANDADOS FISCALES (PREFERENTEMENTE)',
    'CUENTA CON PROGRAMA DE SEGURIDAD EN LA CADENA DE SUMINISTROS POR EJ. CTPAT/PROGRAMA OEA',
  ])

  doc.moveDown(0.3)
  drawSectionTitle(doc, 'Representante Legal')
  drawChecklistItems(doc, [
    'IDENTIFICACION (INE, CEDULA, PASAPORTE)',
    'CEDULA RFC',
    'CURP (SOLO PARA SOCIOS COMERCIALES CON OPERACIONES VINCULADAS CON LA LEY LFPIORPI)',
    'COMPROBANTE DE DOMICILIO RECIENTE (TELMEX, LUZ, EDO. DE CTA. BANCARIO) (SOLO PARA SOCIOS COMERCIALES CON OPERACIONES VINCULADAS CON LA LEY LFPIORPI)',
  ])

  doc.moveDown(0.3)
  drawSectionTitle(doc, 'Formatos Anexos')
  drawChecklistItems(doc, [
    'AVISO DE PRIVACIDAD',
    'ACUERDO SOCIOS COMERCIALES',
    'POLITICA TFO ART-23.6 T-MEC',
    'POLITICA DE SEGURIDAD INFORMATICA',
    'CUESTIONARIO INICIAL DE NECESIDADES (SI APLICA)',
    'CUESTIONARIO DE ESTANDARES EN SEGURIDAD (APLICA SOLO EN CASO DE REALIZAR ACTIVIDADES VULNERABLES)',
  ])

  doc.end()
  return doc
}
