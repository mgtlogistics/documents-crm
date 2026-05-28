import PDFDocument from 'pdfkit'

function drawHeader(doc, pageLabel) {
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('POLITICA DE SEGURIDAD INFORMATICA', { align: 'center' })
    .moveDown(0.2)

  doc
    .font('Helvetica')
    .fontSize(8)
    .text('Codigo: GAA-SGS-9.2-A1-SI-v1', { continued: true })
    .text('   Proceso: Recursos Humanos', { continued: true })
    .text('   Version: V1', { continued: true })
    .text('   Fecha de emision: 28/10/2020', { align: 'right' })
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
  doc
    .font('Helvetica')
    .fontSize(9)
    .text(`${number}. `, { continued: true })
    .text(text, { align: 'justify' })
    .moveDown(0.35)
}

export function generarPoliticaSeguridadInformatica() {
  const doc = new PDFDocument({ size: 'LETTER', margin: 45 })

  drawHeader(doc, 'Pagina 1 de 2')

  doc
    .font('Helvetica')
    .fontSize(9)
    .text(
      'Global Agentes Aduanales y Asesores en Comercio Exterior, SC establece las directrices siguientes para regular la forma en que previene amenazas informaticas y mantiene la Integridad, Confidencialidad y Disponibilidad de los activos de informacion (equipos de computo y telecomunicaciones).',
      { align: 'justify' }
    )
    .moveDown(0.5)

  doc.font('Helvetica-Bold').fontSize(9.5).text('POLITICA DE SEGURIDAD INFORMATICA').moveDown(0.35)

  const items = [
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

  items.slice(0, 8).forEach((text, idx) => {
    drawPolicyItem(doc, idx + 1, text)
  })

  doc.addPage()
  drawHeader(doc, 'Pagina 2 de 2')

  items.slice(8).forEach((text, idx) => {
    drawPolicyItem(doc, idx + 9, text)
  })

  doc.end()
  return doc
}
