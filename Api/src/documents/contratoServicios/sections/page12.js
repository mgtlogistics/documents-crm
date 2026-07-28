import createStylizedParagraph from '../../createStylizedParagraph.js'
import { drawPageNumber, getContentLeft, getContentWidth } from '../helpers/layout.js'

function writeRich(doc, fragments, options = {}) {
  createStylizedParagraph(doc, fragments, {
    fontSize: options.fontSize || 10.9,
    width: getContentWidth(doc),
    align: options.align || 'justify',
  })

  doc.moveDown(options.moveDown !== undefined ? options.moveDown : 0.72)
}

function writeIndentedRich(doc, fragments, options = {}) {
  const indent = options.indent || 44

  createStylizedParagraph(doc, fragments, {
    fontSize: options.fontSize || 10.9,
    width: getContentWidth(doc) - indent,
    align: options.align || 'justify',
    left: getContentLeft(doc) + indent,
    top: doc.y,
  })

  doc.moveDown(options.moveDown !== undefined ? options.moveDown : 0.55)
}

export default function renderPage12(doc, data = {}, options = {}) {
  writeIndentedRich(doc, [
    { text: 'd) ' },
    { text: '“El AGENTE ADUANAL”', isBold: true },
    { text: ' se limita a transmitir en el pedimento en los términos y con los datos proporcionados por el importador, por lo cual no asume responsabilidad alguna por los datos que le fueron proporcionados por ' },
    { text: '“EL CLIENTE”.', isBold: true },
  ])

  writeIndentedRich(doc, [
    { text: 'e) ' },
    { text: '“El AGENTE ADUANAL”', isBold: true },
    { text: ' actúa de conformidad con su deber de cuidado, sin que dicho deber implique asumir responsabilidades que correspondan legalmente al importador o exportador, tal es el caso, de los valores de las mercancías que serán sometidas a despacho aduanero.' },
  ])

  writeIndentedRich(doc, [
    { text: 'f) ' },
    { text: 'Cualquier revisión, acto de fiscalización, requerimiento o procedimiento iniciado por la autoridad respecto del valor en aduana, precios, incrementables, vinculaciones, o documentación soporte, deberá atenderse por ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', quien se compromete a sacar en paz y a salvo a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', frente a cualquier consecuencia derivada de la información proporcionada.' },
  ])

  writeRich(doc, [
    { text: '4.8.- ', isBold: true },
    { text: 'A proporcionar a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' la documentación que se requiera de acuerdo a lo señalado en el artículo 36-A, en relación con los numerales 6 y 36, todos de la Ley Aduanera vigente, conforme al régimen aduanero al cual se promoverá el despacho aduanero de las mercancías; la cual deberá ser veraz, exacta, completa y suficiente para que ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' se encuentre en condiciones de realizar la correcta determinación del pago de las contribuciones, la determinación del régimen aduanero de las mercancías, la correcta clasificación arancelaria y de la exacta determinación del número de identificación comercial.' },
  ])

  writeRich(doc, [
    { text: 'Además de lo anterior, ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' expresamente se compromete a proporcionar a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', todos los permisos, certificados, avisos, y cualquier otra documentación que le sea requerida, para acreditar el cumplimiento de regulaciones y restricciones no arancelarias, así como de cuotas compensatorias, respecto de la mercancía a despachar.' },
  ])

  writeRich(doc, [
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' analizará sí la documentación enviada por ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' es correcta, precisa y suficiente, antes de tramitar los pedimentos correspondientes.' },
  ])

  writeRich(doc, [
    { text: 'En caso de que ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' no envíe la documentación correspondiente, o bien, ésta sea insuficiente o incorrecta, ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' no realizará el despacho de la mercancía, sin responsabilidad para la última de las mencionadas.' },
  ])

  writeRich(doc, [
    { text: '4.9.- ', isBold: true },
    { text: 'A entregar en documento electrónico o digital (cuando se generen de manera electrónica, o cuando así se requiera) de los programas que emitan las diferentes Secretarías y organismos vinculados con el comercio exterior, aplicable en los despachos encomendados, según sea el caso.' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 12)
}
