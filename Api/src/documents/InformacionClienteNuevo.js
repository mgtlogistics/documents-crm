import PDFDocument from 'pdfkit'
import drawDoubleBorder from './utils/drawDoubleBorder.js'
import writeFormField from './utils/writeFormField.js'

const FORM_CODE = 'F-15 INFORMACIÓN DE CLIENTE NUEVO (EXPEDIENTE)- OPERACIÓN'

export function generarInformacionClienteNuevo(data = {}) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 70 })
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  console.log(data)
  const user = data?.user || {}
  const company = user?.company || {}
  const legalRepresentative = company?.legalRepresentative || {}
  const legalRepresentativeName = `${legalRepresentative?.firstName || ''} ${legalRepresentative?.paternalLastName || ''} ${legalRepresentative?.maternalLastName || ''}`.trim()

  drawDoubleBorder(doc)
  doc.on('pageAdded', () => drawDoubleBorder(doc))

  doc.x = doc.page.margins.left
  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .text('SERVICIOS ADUANALES RM', { align: 'center', width: contentWidth })
    .font('Helvetica')
    .fontSize(9)
    .text('RFC: SAR160415LV0', { align: 'center', width: contentWidth })
    .text('601 - General de Ley Personas Morales', { align: 'center', width: contentWidth })
    .moveDown(1.5)

  doc.x = doc.page.margins.left
  doc
    .font('Helvetica-Bold')
    .fontSize(15)
    .text('INFORMACIÓN DE CLIENTE NUEVO PARA EL ÁREA', { align: 'center', width: contentWidth })
    .moveDown(0.4)
    .text('DE CUENTAS', { align: 'center', width: contentWidth })
    .moveDown(2.5)

  writeFormField(doc, 'NOMBRE DE LA EMPRESA', company?.socialReason, { lineWidth: 240 })
  doc.moveDown(1.5)

  doc.x = doc.page.margins.left
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('NOMBRE DE LA PERSONA RESPONSABLE O')
    .moveDown(0.6)
  writeFormField(doc, 'ENCARGADO DEL AREA', legalRepresentativeName, { lineWidth: 200 })
  doc.moveDown(1.5)

  writeFormField(doc, 'TELÉFONO', user?.profile?.phone, { lineWidth: 200 })
  doc.moveDown(1.5)

  writeFormField(doc, 'CORREO', user?.email, { lineWidth: 200 })

  const footerY = doc.page.height - doc.page.margins.bottom - 10
  doc
    .font('Helvetica')
    .fontSize(8)
    .text(FORM_CODE, doc.page.margins.left, footerY, { width: contentWidth, align: 'left', lineBreak: false })

  doc.end()
  return doc
}
