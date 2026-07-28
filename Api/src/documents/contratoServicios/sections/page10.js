import createStylizedParagraph from '../../createStylizedParagraph.js'
import { drawPageNumber, getContentLeft, getContentWidth } from '../helpers/layout.js'

function writeRich(doc, fragments, options = {}) {
  const paragraphOptions = {
    fontSize: options.fontSize || 10.9,
    width: getContentWidth(doc),
    align: options.align || 'justify',
  }

  createStylizedParagraph(doc, fragments, paragraphOptions)
  doc.moveDown(options.moveDown !== undefined ? options.moveDown : 0.75)
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

export default function renderPage10(doc, data = {}, options = {}) {
  writeRich(doc, [
    { text: '“EL AGENTE ADUANAL” realice a su nombre el despacho de las mercancías por el periodo de un año contado a partir de la fecha de su expedición.' },
  ])

  writeRich(doc, [
    { text: '4.3.- A entregar a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', previamente a la elaboración de los pedimentos, una carta de instrucciones por cada operación, por lo menos un día antes de que arribe el embarque. En la cual deberá especificar los siguientes datos:' },
  ], { moveDown: 0.45 })

  const items = [
    ['I', 'Régimen aduanero al cual se destinará la mercancía sujeta a la operación d comercio exterior.'],
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
    { text: 'En caso de que la carta de Instrucciones contenga datos falsos o bien incorrectos y como consecuencia de ello se genere una incidencia que ocasione discrepancia entre lo declarado y lo encontrado físicamente, ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' asume cualquier responsabilidad de naturaleza, penal, fiscal, administrativa y civil, dejando a salvo a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', de cualquier responsabilidad que se pudiese imputar por cualquier autoridad por presentación de datos falsos o inexactos.' },
  ])

  writeRich(doc, [
    { text: 'Cuando, en razón a la distancia entre ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' y ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', la carta de Instrucciones no pueda ser entregada a la agencia en original, el cliente podrá enviarla a' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 10)
}
