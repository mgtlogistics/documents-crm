import PDFDocument from 'pdfkit'
import writeInlineFormattedText from './utils/writeInlineFormattedText.js'

function drawHeader(doc, pageLabel, data) {
  const contentLeft = doc.page.margins.left
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  doc.x = contentLeft
  writeInlineFormattedText(doc, data.title, { x: contentLeft, width: contentWidth, font: 'Helvetica-Bold', fontSize: 11, align: 'center' })
  doc.moveDown(0.2)

  doc
    .font('Helvetica')
    .fontSize(8)
    .text(`Codigo: ${data.code}`, { continued: true })
    .text(`   Proceso: ${data.process}`, { continued: true })
    .text(`   Version: ${data.version}`, { continued: true })
    .text(`   Fecha de emision: ${data.issueDate}`, { align: 'right' })
    .text(pageLabel, { align: 'right' })
    .moveDown(0.2)

  doc
    .font('Helvetica')
    .fontSize(7)
    .text('Copia Controlada', { align: 'right' })
    .text(
      'Completamente confidencial y para uso exclusivo de Global Agentes Aduanales y Asesores en Comercio Exterior, SC.',
      { align: 'center' }
    )
    .text('El documento electronico prevalece sobre cualquier impresion del mismo.', {
      align: 'center',
    })
    .moveDown(0.5)
}

function drawPolicyItem(doc, number, text) {
  const contentLeft = doc.page.margins.left
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  writeInlineFormattedText(doc, `${number}. ${text}`, {
    x: contentLeft,
    width: contentWidth,
    fontSize: 9,
    align: 'justify',
  })
  doc.moveDown(0.35)
}

export function generarPoliticaSeguridadInformatica(data = {}) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 45 })
  const form = data.formData || data.data || data
  const policyData = {
    title: form.title || form.documentTitle || 'POLITICA DE SEGURIDAD INFORMATICA',
    code: form.code || 'GAA-SGS-9.2-A1-SI-v1',
    process: form.process || form.responsibleProcess || 'Recursos Humanos',
    version: form.version || 'V1',
    issueDate: form.issueDate || form.fechaEmision || '28/10/2020',
    intro: form.intro || form.introduction || 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC establece las directrices siguientes para regular la forma en que previene amenazas informaticas y mantiene la Integridad, Confidencialidad y Disponibilidad de los activos de informacion (equipos de computo y telecomunicaciones).',
    policyTitle: form.policyTitle || 'POLITICA DE SEGURIDAD INFORMATICA',
  }

  const defaultItems = [
    'Los activos de informacion utilizados por los empleados para la conduccion del negocio son propiedad de la empresa.',
    'Los activos de informacion no pueden ser utilizados para propositos ajenos a los asuntos de trabajo.',
    'La informacion digital (correos y archivos) generada y almacenada en equipos de computo de la Agencia Aduanal se considera registro propiedad de la empresa.',
    'Los usuarios deben utilizar su correo electronico unica y exclusivamente para funciones asignadas y facultades conferidas para su cargo o comision.',
    'Todos los usuarios de activos informaticos deben conducirse bajo principios de confidencialidad y uso adecuado de recursos informaticos, con apego a la Carta Compromiso de Buen Uso y Manejo de Confidencialidad (GAA-SGS-03-F9-CCUIC-V1).',
    'Todos los usuarios son responsables de su clave de usuario y contrasena individual; cualquier incumplimiento se sujetara a las sanciones aplicables del Reglamento Interno de Trabajo.',
    'Esta prohibido compartir claves de usuario y contrasenas con personal interno o externo.',
    'Las contrasenas seran cambiadas anualmente por el Responsable de Tecnologias de Informacion de la Agencia Aduanal.',
    'Queda prohibido el envio de cadenas, imagenes obscenas, amenazas, informacion fraudulenta o mensajes que comprometan la imagen de la empresa.',
    'No se permite, sin autorizacion previa, usar los activos de informacion para acceder, descargar o transmitir software/material con derechos de autor o informacion financiera patentada.',
    'La Direccion General, mediante el Responsable de Sistemas de Informacion, se reserva el derecho de monitorear y revisar mensajes y comunicaciones via correo electronico del personal.',
    'El incumplimiento del presente documento podra considerarse causa de responsabilidad administrativa y/o penal segun su naturaleza y gravedad.',
    'Las sanciones derivadas de incumplimientos se aplicaran conforme al Reglamento Interno de Trabajo y normativa vigente.',
  ]
  const items = Array.isArray(form.items || form.policies)
    ? (form.items || form.policies).map((item) => typeof item === 'string' ? item : item?.text || item?.description || '').filter(Boolean)
    : defaultItems
  const firstPageItemCount = Number.isInteger(form.firstPageItemCount)
    ? Math.max(0, Math.min(items.length, form.firstPageItemCount))
    : Math.min(8, items.length)

  drawHeader(doc, 'Pagina 1 de 2', policyData)

  writeInlineFormattedText(doc, policyData.intro, {
    x: doc.page.margins.left,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    fontSize: 9,
    align: 'justify',
  })
  doc.moveDown(0.5)

  writeInlineFormattedText(doc, policyData.policyTitle, {
    x: doc.page.margins.left,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    font: 'Helvetica-Bold',
    fontSize: 9.5,
  })
  doc.moveDown(0.35)

  items.slice(0, firstPageItemCount).forEach((text, idx) => {
    drawPolicyItem(doc, idx + 1, text)
  })

  doc.addPage()
  drawHeader(doc, 'Pagina 2 de 2', policyData)

  items.slice(firstPageItemCount).forEach((text, idx) => {
    drawPolicyItem(doc, idx + firstPageItemCount + 1, text)
  })

  doc.end()
  return doc
}
