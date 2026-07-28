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

function writeAlphaItem(doc, letter, text) {
  const left = getContentLeft(doc)
  const width = getContentWidth(doc)
  const prefixWidth = 26

  doc
    .font('Helvetica')
    .fontSize(10.9)
    .text(`${letter})`, left + 44, doc.y, {
      width: prefixWidth,
      align: 'left',
      lineBreak: false,
    })
    .text(text, left + 44 + prefixWidth + 8, doc.y - 1, {
      width: width - prefixWidth - 60,
      align: 'justify',
    })
    .moveDown(0.48)
}

export default function renderPage08(doc, data = {}, options = {}) {
  writeRich(doc, [
    { text: 'documentación proporcionada por ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', de tal forma, que en caso de que la mercancía no fuera clasificada de manera correcta ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' asumirá la total responsabilidad, del pago de diferencias en las contribuciones al comercio exterior, cuotas compensatorias, multas y recargos que se determinen por la incorrecta clasificación arancelaria.' },
  ])

  writeRich(doc, [
    { text: '3.9. ', isBold: true },
    { text: 'Verificar la veracidad y exactitud de los datos e información suministrados a las autoridades aduaneras, siempre y cuando estos datos sean materialmente verificables; haciendo hincapié que tal información es proporcionada por ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' y en caso de que la misma sea falsa o incorrecta ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' asume la total responsabilidad comprometiéndose sacar a salvo al ' },
    { text: '“AGENTE ADUANAL”', isBold: true },
    { text: ' de cualquier responsabilidad de carácter fiscal, administrativa, penal o civil.' },
  ])

  writeRich(doc, [
    { text: '3.10. ', isBold: true },
    { text: 'Aplicar correctamente el régimen aduanero a la operación de comercio exterior encomendada, ello a solicitud de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: '.' },
  ])

  writeRich(doc, [
    { text: '3.11. ', isBold: true },
    { text: 'Informar a ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' de las demás obligaciones en materia de regulaciones y restricciones no arancelarias que rijan para las mercancías que importe o exporte, de conformidad con lo dispuesto por la Ley Aduanera y demás leyes y disposiciones aplicables.' },
  ])

  writeRich(doc, [
    { text: '3.12. ', isBold: true },
    { text: 'Ceñir su actuar conforme a las obligaciones establecidas en el artículo 162 de la Ley Aduanera vigente en la fecha de la operación de comercio exterior, destacando las siguientes obligaciones:' },
  ], { moveDown: 0.45 })

  writeAlphaItem(doc, 'a', 'En los trámites o gestiones aduanales, actuar siempre con su carácter de agente aduanal.')
  writeAlphaItem(doc, 'b', 'Cumplir el encargo que se le hubiera conferido, por lo que no podrá transferirlo ni endosar documentos que estén a su favor o a su nombre, sin autorización expresa y por escrito de quién lo otorgó.')
  writeAlphaItem(doc, 'c', 'Declarar bajo protesta de decir verdad, el nombre y domicilio fiscal del destinatario o del remitente de las mercancías, la clave del Registro Federal de Contribuyentes de aquellos y el propio, la naturaleza y características de las mercancías y los demás datos relativos a la operación de comercio exterior en que intervenga, en las formas oficiales y documentos que se requieran o, en su caso, en el sistema mecanizado.')
  writeAlphaItem(doc, 'd', 'Formar un expediente electrónico de cada uno de los pedimentos o documentos aduaneros que correspondan, con la información transmitida y presentada en mensaje o documento electrónico o digital como parte de sus anexos, conforme a los artículos 6to., 36, 36-A, 37, 37-A, y 59 de la Ley Aduanera en vigor en relación')

  drawPageNumber(doc, options.pageNumber || 8)
}
