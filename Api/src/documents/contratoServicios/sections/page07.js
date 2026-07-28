import createStylizedParagraph from '../../createStylizedParagraph.js'
import { drawPageNumber, getContentLeft, getContentWidth } from '../helpers/layout.js'

function writeRich(doc, fragments, options = {}) {
  const paragraphOptions = {
    fontSize: options.fontSize || 10.9,
    width: getContentWidth(doc),
    align: options.align || 'justify',
  }

  createStylizedParagraph(doc, fragments, paragraphOptions)
  doc.moveDown(options.moveDown !== undefined ? options.moveDown : 0.35)
}

function writeRomanItem(doc, numeral, text) {
  const left = getContentLeft(doc)
  const width = getContentWidth(doc)
  const numeralWidth = 36

  doc
    .font('Helvetica')
    .fontSize(10.9)
    .text(`${numeral}.`, left + 24, doc.y, {
      width: numeralWidth,
      align: 'left',
      lineBreak: false,
    })
    .text(text, left + 24 + numeralWidth + 10, doc.y - 1, {
      width: width - numeralWidth - 34,
      align: 'justify',
    })
    .moveDown(0.32)
}

export default function renderPage07(doc, data = {}, options = {}) {
  const items = [
    ['II', 'Descripción de las mercancías, detallando la cantidad, valor y demás datos que permitan su identificación, así como las marcas y el número total de bultos que contienen las mercancías.'],
    ['III', 'Datos y Relación de todas las facturas que serán amparadas en el pedimento correspondiente, indicando las fechas de cada una y datos completos de los proveedores.'],
    ['IV', 'Origen de las mercancías.'],
    ['V', 'Documentos con base en los cuales se determine el origen de las mercancías (Certificado de Origen).'],
    ['VI', 'Conceptos de incrementables, indicando los gastos.'],
    ['VII', 'Datos del conocimiento de embarque en tráfico marítimo o guía en tráfico aéreo.'],
    ['VIII', 'Proporcionar la Manifestación de Valor de las Mercancías, de conformidad con los parámetros que se detallarán en el punto 4.7 de la presente cláusula.'],
    ['IX', 'Proporcionar documento el que conste el pago de las Mercancías tales como la transferencia electrónica del pago o carta de crédito.'],
    ['X', 'Si requiere el transporte terrestre para la entrega en su destino final o no es necesario, de igual manera, si requiere servicios de custodia.'],
    ['XI', 'Si tales mercancías ostentan marca registradas ante el Instituto Mexicano de la Propiedad Industrial.'],
    ['XII', 'Si la mercancía sujeta a la operación de comercio exterior es de las clasificadas como mercancías de difícil identificación.'],
  ]

  items.forEach(([numeral, text]) => writeRomanItem(doc, numeral, text))

  doc.moveDown(0.35)

  writeRich(doc, [
    { text: '3.6. ', isBold: true },
    { text: 'Contar con personal capacitado en materia aduanera, así como los recursos técnicos, humanos y económicos y experiencia necesaria para realizar oportuna y cabalmente todos y cada uno de los actos que se requieran conforme al presente Contrato.' },
  ], { moveDown: 0.75 })

  writeRich(doc, [
    { text: '3.7. ', isBold: true },
    { text: 'Responder de los daños y perjuicios a ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' derivados específicamente de la tramitación de la operación de comercio exterior, cuando se acredite fehacientemente ante la instancia legal correspondiente que esos daños y perjuicios fueron causados como consecuencia de la impericia de la función de ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: '.' },
  ], { moveDown: 0.7 })

  writeRich(doc, [
    { text: 'Tal responsabilidad por parte de ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' únicamente podrá ser exigible por actos llevados a cabo dentro de la Aduana de despacho y previo agotar la instancia legal correspondiente que mediante resolución determine que efectivamente los daños y perjuicios causados a ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' se ocasionaron como consecuencia directa de la función incorrecta por parte de ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: '.' },
  ], { moveDown: 0.75 })

  writeRich(doc, [
    { text: '3.8. ', isBold: true },
    { text: 'Realizar la clasificación arancelaria de las mercancías de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' que serán sujetas a la operación de comercio exterior por parte de ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', de acuerdo a la tarifa arancelaria vigente en la época en que se llevará a cabo la operación de comercio exterior; haciendo hincapié que tal clasificación se efectuará en base a la información y' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 7)
}
