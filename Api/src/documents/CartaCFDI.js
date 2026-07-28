import PDFDocument from 'pdfkit'
import createStylizedParagraph from './createStylizedParagraph.js'
import createSignatureBox from './createSignatureBox.js'

import dayjs from 'dayjs'
import drawLetterhead from './utils/drawLetterhead.js'
import drawPlaceOfIssuance from './utils/drawPlaceOfIssuance.js'

const getLegalRepresentativeFullName = (company = {}) => {
  const representative = company?.legalRepresentative || {}
  const fullName = [
    representative.firstName,
    representative.paternalLastName,
    representative.maternalLastName,
  ]
    .filter((part) => typeof part === 'string' && part.trim().length > 0)
    .join(' ')
    .trim()

  return fullName || company?.legalRepresentativeName || 'No llenado'
}

export function generarCartaCFDI(data) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 72 })
  const left = doc.page.margins.left
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const AUTOCOMP = '(autocompletado)'
  const company = data?.user?.company || {}
  const legalRepresentativeFullName = getLegalRepresentativeFullName(company)




  drawPlaceOfIssuance(doc, data)
  drawLetterhead(doc, data)

  doc
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .text('L.A.E. CESAR AUGUSTO SAVIÑON RUELAS')
    .text('AGENTE ADUANAL PATENTE 1623')
    .text('ACCESO AL ITN No. 22, Int.')
    .text('COLONIA UNIDAD DEPORTIVA, C.P. 84063')
    .text('NOGALES, SONORA.')
    .moveDown(0.8)

  const paragraphOptions = {
    fontSize: 10,
    width,
    align: 'justify'
  }

  const paragraph1 = [
    { text: 'En los términos de las ' },
    { text: 'reglas 3.1.38' },
    { text: ' y ' },
    { text: '3.1.39' },
    { text: ' de las ' },
    { text: 'Reglas Generales de Comercio Exterior ' },
    { text: ' para 2026, bajo protesta de decir verdad manifiesto que el (los) CFDI que le fueron otorgados para hacer el despacho de las mercancías consignadas para su exportación en nuestra Carta Encomienda vigente del 01 de enero de 2026 al 31 de diciembre de 2026, se encuentran vigentes, las cuales, de acuerdo con las leyes fiscales, son responsabilidad única de generar y cancelar por parte de mi representada, motivo por el cual en caso de una cancelación de dichos CFDI antes de pagar y modular el pedimento, le será informado directamente a usted como Agente Aduanal.' },
  ]

  createStylizedParagraph(doc, paragraph1, paragraphOptions)
  doc.moveDown(1.5)

  const paragraph2 = [
    { text: 'Agradeciendo su atención para la presente y esperando un apoyo eficaz en nuestras operaciones de Comercio Exterior, le reiteramos las seguridades de nuestra atenta y distinguida consideración.' }
  ]

  createStylizedParagraph(doc, paragraph2, paragraphOptions)
  doc.moveDown(2)


  doc
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .text(' A T E N T A M E N T E.', { align: 'center' })
    .moveDown(0.5)
  doc
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .text(data.user?.company.socialReason || 'No llenado', { align: 'center' })
    .moveDown(1.6)

  const leftPos = left
  const rightPos = doc.page.width / 2

  createSignatureBox(doc, {
    width: 280,
    height: 100,
    barHeight: 26,
    text: legalRepresentativeFullName,
  })

  doc.end()
  return doc
}
