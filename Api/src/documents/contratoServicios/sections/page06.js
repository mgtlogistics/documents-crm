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
    .moveDown(0.35)
}

export default function renderPage06(doc, data = {}, options = {}) {
  writeRich(doc, [
    { text: '3.1.- ' , isBold: true },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', se obliga a llevar a cabo todos los actos inherentes al despacho aduanero de las mercancías en los distintos regímenes aduaneros a favor y en nombre de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', cumpliendo con las instrucciones que éste le proporcionó; operaciones que única y exclusivamente se podrán llevar a cabo por las aduanas de Nogales, Agua Prieta, Naco y Guaymas en el Estado de Sonora; para lo cual deberá realizar su trabajo con la mayor rapidez y diligencia, cumpliendo lo que la Ley Aduanera, su Reglamento y demás leyes aplicables a su función como agente aduanal.' },
  ])

  writeRich(doc, [
    { text: '3.2. ', isBold: true },
    { text: 'Elaborar y presentar los pedimentos de importación o exportación, debidamente requisitados de conformidad con la documentación proporcionada a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' por ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', determinando la base gravable y el pago de los impuestos correspondientes, de acuerdo a la clasificación arancelaria y en su caso, deberá aplicar las preferencias arancelarias siempre y cuando ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' llene correctamente el certificado de origen de las mercancías.' },
  ])

  writeRich(doc, [
    { text: '3.3. ', isBold: true },
    { text: 'Conforme al artículo 36-A de la Ley Aduanera ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' tendrá la obligación de transmitir en documento electrónico o digital como anexos al pedimento, el valor de las mercancías, información contenida en el conocimiento de embarque, lista de empaque, guía aérea o demás documentos de transporte, documentación comprobatoria del cumplimiento de regulación y restricción no arancelaria en caso de importación, documentación para determinar la procedencia y el origen de las mercancías, el documento digital en que conste la garantía efectuada en la cuenta aduanera de garantía, el peso, volumen u otras características inherentes a las mercancías.' },
  ])

  writeRich(doc, [
    { text: '3.4. ', isBold: true },
    { text: 'Contratar los servicios de corresponsalía en caso de que ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' solicite tales servicios, para realizar operaciones de comercio exterior por una aduana distinta a las de Nogales, Agua Prieta, Naco y Guaymas en el Estado de Sonora.' },
  ])

  writeRich(doc, [
    { text: 'En ese sentido, ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' podrá contratar los servicios de un Agente o Agencia Aduanal para que realice el despacho aduanero de las mercancías por aduana distinta a las mencionadas líneas arriba; en el entendido de que si existe un acuerdo de crédito entre ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' y ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', este no se extiende a los gastos que se generen por la contratación de un agente o agencia aduanal para que proporcione los servicios de corresponsalía, por lo que tales gastos se deberán de cubrir por parte de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' realizando los anticipos correspondientes antes de realizar la operación de comercio exterior.' },
  ])

  writeRich(doc, [
    { text: '3.5. ', isBold: true },
    { text: 'Cumplir con las instrucciones que ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', le realice mediante el documento denominado carta de instrucciones, documento que como mínimo deberá de contar con los siguientes datos:' },
  ], { moveDown: 0.45 })

  writeRomanItem(doc, 'I', 'Régimen aduanero al cual se destinará la mercancía sujeta a la operación de comercio exterior.')

  drawPageNumber(doc, options.pageNumber || 6)
}
