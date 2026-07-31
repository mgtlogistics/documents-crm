import PDFDocument from 'pdfkit'
import dayjs from 'dayjs'
import createStylizedParagraph from './createStylizedParagraph.js'

import fs from "fs"
import { getFrontendImg } from '../utils/public.utils.js'
import drawLetterhead from './utils/drawLetterhead.js'
import drawPlaceOfIssuance from './utils/drawPlaceOfIssuance.js'
import toRoman from './utils/toRoman.js'

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

export function generarCartaProtestaPersonaMoral(data) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 72 })
  const pageBottom = () => doc.page.height - doc.page.margins.bottom
  const contentLeft = doc.page.margins.left
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const company = data?.user?.company || {}
  const legalRepresentativeName = getLegalRepresentativeFullName(company)
  const powerOfAttorney = company?.powerOfAttorney || {}
  const powerNotary = powerOfAttorney?.notary || {}
  const publicDeed = company?.publicDeed || {}
  const deedNumber = publicDeed?.number || company?.scripture || 'No llenado'
  const deedVolume = publicDeed?.volume || company?.powerOfAttorneyVolume || 'No llenado'
  const powerNumber = powerOfAttorney?.number || company?.powerOfAttorneyNumber || 'No llenado'
  const powerDate = powerOfAttorney?.date || company?.powerOfAttorneyDate
  const notaryNumber = powerNotary?.number || company?.notaryNumber || 'No llenado'
  const notaryName = powerNotary?.name || company?.notaryName || 'No llenado'
  const notaryCity = powerNotary?.city || company?.notaryCity || 'No llenado'
  const notaryState = powerNotary?.state || company?.notaryState || 'No llenado'

  console.log(data)

  const ensureSpace = (requiredHeight = 40) => {
    if (doc.y + requiredHeight > pageBottom()) {
      doc.addPage()
    }
  }

  const drawLine = (x, y, width) => {
    doc
      .moveTo(x, y)
      .lineTo(x + width, y)
      .lineWidth(0.6)
      .strokeColor('#444444')
      .stroke()
  }

  const drawInmuebleLines = () => {
    for (let i = 0; i < 4; i++) {
      ensureSpace(22)
      drawLine(contentLeft + 8, doc.y + 12, contentWidth - 16)
      doc.moveDown(1.05)
    }

    ensureSpace(18)
    drawLine(contentLeft + 8, doc.y + 12, 110)
    doc.moveDown(1.05)
  }

  const drawRomanAssetsLines = () => {
    const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi']

    romanNumerals.forEach((roman) => {
      ensureSpace(36)
      const topY = doc.y

      doc.font('Helvetica').fontSize(12).text(`${roman}.`, contentLeft + 8, topY, { lineBreak: false })

      drawLine(contentLeft + 42, topY + 12, contentWidth - 50)
      drawLine(contentLeft + 42, topY + 29, 38)

      doc.y = topY + 34
    })
  }

  doc.x = contentLeft
  doc.y = doc.page.margins.top

  const headerRightX = contentLeft + 175
  const headerRightWidth = contentWidth - 175

  drawLetterhead(doc, data)
  doc
    .font('Helvetica-Bold')
    .fontSize(13.5)
    .text('Manifestación bajo protesta de decir verdad,', headerRightX, doc.y, { width: headerRightWidth, align: 'right' })
    .text('conforme la Regla 1.4.14 fracción VII de las', { width: headerRightWidth, align: 'right' })
    .text('RGCE para 2026.', { width: headerRightWidth, align: 'right' })

  drawPlaceOfIssuance(doc, data)
  doc.moveDown(0.6)

  doc.x = contentLeft
  doc.font('Helvetica').fontSize(13).text('A quien corresponda', {
    align: 'left',
    width: contentWidth
  }).moveDown(0.45)

  doc.x = contentLeft
  doc.font('Helvetica').fontSize(13).text('Presente.', {
    align: 'left',
    width: contentWidth
  }).moveDown(0.85)

  // Párrafo Inicial Estilizado
  doc.x = contentLeft
  const address = data?.user?.address || {}
  const domicilioFiscal = `${address.street || ''} NO. ${address.exteriorNumber || ''} ${address.neighborhood || ''} ${address.city || ''} ${address.state || ''} ${address.country || ''} ${address.zipCode || ''}, C.P. ${address.postalCode || ''}`

  createStylizedParagraph(
    doc,
    [
      { text: 'El que suscribe ' },
      { text: legalRepresentativeName, isBold: true },
      { text: ', en mi carácter de ' },
      { text: 'representante legal', isBold: true },
      { text: ' de ' },
      { text: data.user.company.socialReason, isBold: true },
      { text: ', con ' },
      { text: `RFC ${data.user.company.rfc}`, isBold: true },
      { text: ', y con domicilio fiscal en ' },
      { text: domicilioFiscal, isBold: true },
      { text: ', acreditando mi personalidad mediante ' },
      { text: `Poder Notarial `, isBold: true },
      { text: ' otorgado mediante ' },
      { text: `escritura pública número ${deedNumber}, volumen ${deedVolume}, `, isBold: true },
      { text: ` de fecha ${dayjs(powerDate).format('DD/MM/YYYY')}, pasada ante la fe del `, isBold: true },
      { text: `Notario Público número ${notaryNumber},`, isBold: true },
      { text: ` Lic. ${notaryName}, de la Ciudad de ${notaryCity}, ${notaryState}, con fundamento en lo dispuesto por la ` },
      { text: 'regla 1.4.14, fracción VII de las Reglas Generales de Comercio Exterior para 2026, manifiesto bajo protesta de decir verdad en nombre de mi representada', isBold: true },
      { text: ' lo siguiente:' }
    ],
    { fontSize: 12.5, align: 'justify', width: contentWidth, left: contentLeft, top: doc.y }
  )

  doc.x = contentLeft
  doc.moveDown(0.95)

  // Inciso A
  ensureSpace(190)
  doc
    .font('Helvetica')
    .fontSize(13)
    .text(
      'a)   La descripción y características del inmueble donde mi representada realiza sus actividades relacionadas con el comercio exterior son:',
      contentLeft + 20,
      doc.y,
      { width: contentWidth - 20, align: 'justify' }
    )
    .moveDown(0.3)

  doc
  .font('Helvetica-Bold')
  .fontSize(12.5)
  .text(data.place_description)
    .moveDown(0.5)

  // Reseteamos X tras salir de las líneas de inmueble
  doc.x = contentLeft
  ensureSpace(40)
  doc
    .font('Helvetica')
    .fontSize(12.5)
    .text(
      'Que mi representada cuenta con la documentación que acredita la legal propiedad o posesión del inmueble antes descrito, así mismo se anexan fotografías del inmueble.',
      { align: 'justify', width: contentWidth }
    )
    .moveDown(1.15)


  doc
    .font('Helvetica')
    .fontSize(13)
    .text(
      'b)   Que mi representada cuenta con maquinaria, equipo de oficina, medios de transporte y demás medios empleados para la realización de sus actividades, los cuales se describen a continuación:',
      contentLeft + 20,
      doc.y,
      { width: contentWidth - 20, align: 'justify' }
    )
    .moveDown(0.35)

  data?.material.forEach((element, i) => {
    const text = toRoman(i + 1) + ". " + element
    doc.font('Helvetica-Bold').fontSize(12).text(text, contentLeft + 20, doc.y, { width: contentWidth - 20, align: 'justify' }).moveDown(0.35)
  })

  // Reseteamos X tras las líneas romanas
  doc.x = contentLeft
  doc.moveDown(0.5)

  ensureSpace(130)
  doc
    .font('Helvetica')
    .fontSize(12.5)
    .text(
      'Que mi representada cuenta con la documentación que acredita la legal propiedad o posesión de los bienes antes descritos, asimismo se anexan fotografías de cada uno de los bienes.',
      { align: 'justify', width: contentWidth }
    )
    .moveDown(1)

  // Inciso C
  ensureSpace(150)
  doc.x = contentLeft
  createStylizedParagraph(
    doc,
    [
      { text: 'c)   No tiene vinculación, en términos de lo establecido en el ' },
      { text: 'artículo 68 de la Ley Aduanera,', isBold: true },
      { text: ' con contribuyentes que se encuentren en el listado a que se refiere el ' },
      { text: 'artículo 69-B, cuarto párrafo del Código Fiscal de la Federación.', isBold: true }
    ],
    { fontSize: 12.5, align: 'justify', width: contentWidth, left: contentLeft, top: doc.y }
  )

  doc.x = contentLeft
  doc.moveDown(0.9)

  // Inciso D
  ensureSpace(120)
  doc.x = contentLeft
  createStylizedParagraph(
    doc,
    [
      { text: 'd)   No se ha emitido ni notificado resolución alguna que determine que mi representada emite comprobantes fiscales que amparan operaciones inexistentes, falsas o actos jurídicos simulados, en términos de lo dispuesto por el ' },
      { text: 'artículo 49 Bis del Código Fiscal de la Federación.', isBold: true }
    ],
    { fontSize: 12.5, align: 'justify', width: contentWidth, left: contentLeft, top: doc.y }
  )

  doc.x = contentLeft
  doc.moveDown(1.5)

  // Cierre y Firmas
  ensureSpace(240)
  doc
    .font('Helvetica')
    .fontSize(13)
    .text('Lo anterior para los efectos legales y administrativos procedentes.', {
      align: 'justify',
      width: contentWidth
    })
    .moveDown(2.1)

  doc.font('Helvetica').fontSize(13).text('Atentamente,', { align: 'center', width: contentWidth }).moveDown(0.8)

  doc
    .font('Helvetica-Bold')
    .fontSize(15)
    .text(data.user.company.socialReason, { align: 'center', width: contentWidth })
    .moveDown(2.8)

  doc.font('Helvetica').text('_________________________________', { align: 'center', width: contentWidth }).moveDown(0.7)

  doc.font('Helvetica-Bold').fontSize(12.5).text(legalRepresentativeName, { align: 'center', width: contentWidth }).moveDown(0.35)
  doc.font('Helvetica-Bold').fontSize(12.5).text(`RFC ${data.user.company.rfc}`, { align: 'center', width: contentWidth }).moveDown(0.35)
  doc.font('Helvetica-Bold').fontSize(12.5).text('Representante Legal', { align: 'center', width: contentWidth })

  doc.end()
  return doc
}