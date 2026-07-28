import createStylizedParagraph from '../../createStylizedParagraph.js'
import { drawPageNumber, getContentLeft, getContentWidth } from '../helpers/layout.js'
import { writeLabel } from '../helpers/writers.js'

function writeRich(doc, fragments, options = {}) {
  createStylizedParagraph(doc, fragments, {
    fontSize: options.fontSize || 10.9,
    width: getContentWidth(doc),
    align: options.align || 'justify',
  })

  doc.moveDown(options.moveDown !== undefined ? options.moveDown : 0.72)
}

function writeBullet(doc, text) {
  const left = getContentLeft(doc)
  const width = getContentWidth(doc)

  doc
    .font('Helvetica')
    .fontSize(10.9)
    .text('•', left + 22, doc.y, {
      width: 14,
      align: 'left',
      lineBreak: false,
    })
    .text(text, left + 46, doc.y - 1, {
      width: width - 46,
      align: 'justify',
    })
    .moveDown(0.34)
}

export default function renderPage17(doc, data = {}, options = {}) {
  writeRich(doc, [
    { text: '“EL CLIENTE” libera de toda responsabilidad civil, aduanera, fiscal, penal multas, recargos, impuestos omitidos, cuotas compensatorias a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' cuando por virtud del despacho aduanero de mercancías de difícil identificación se proporciona a la autoridad un dato inexacto, o bien, se omite o se presenta un dato falso que genere como consecuencia una incorrecta clasificación arancelaria, de tal forma que ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' asumirá la responsabilidad total, incluyendo los honorarios legales y gastos que deba realizar ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' para su defensa en caso de que enfrente un procedimiento jurisdiccional de cualquier índole.' },
  ])

  writeRich(doc, [
    { text: '4.18.- ', isBold: true },
    { text: '“EL CLIENTE” se obliga a formar y mantener actualizado, un expediente electrónico de cada uno de los pedimentos, avisos consolidados o documento aduanero de que se trate, el cual deberá contener el propio pedimento en el formato en que se haya transmitido, así como sus anexos, junto con sus acuses electrónicos, y deberá conservarse como parte de la contabilidad por los plazos establecidos en el Código Fiscal de la Federación.' },
  ])

  writeRich(doc, [
    { text: 'Adicionalmente, el expediente electrónico que ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' forme, deberá contener la información y documentación que acredite los recursos empleados para efectuar la operación de comercio exterior. Entre dicha documentación se incluirán, de manera enunciativa mas no limitativa:' },
  ], { moveDown: 0.5 })

  writeBullet(doc, 'La garantía efectuada en la cuenta aduanera de garantía (conforme al artículo 84-A de la Ley Aduanera) cuando el valor declarado sea inferior al precio estimado que establezca la Secretaría de Hacienda y Crédito Público.')
  writeBullet(doc, 'Los comprobantes fiscales digitales por Internet;')
  writeBullet(doc, 'Las facturas comerciales o documentos equivalentes;')
  writeBullet(doc, 'Las transferencias electrónicas del pago o cartas de crédito;')
  writeBullet(doc, 'Los gastos de transporte, seguros y servicios conexos;')
  writeBullet(doc, 'Los contratos relacionados con la transacción de la mercancía;')
  writeBullet(doc, 'La documentación que sustente los conceptos que se suman al valor de transacción de las mercancías importadas y aquellos que no se comprendan en dicho valor.')
  writeBullet(doc, 'Cualquier otro documento o registro que demuestre la efectiva realización de la operación de comercio exterior.')

  doc.moveDown(0.3)

  writeRich(doc, [
    { text: 'Así mismo, “EL CLIENTE” se obliga a notificar a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' de la integración del expediente electrónico, así como de cualquier actualización del mismo.' },
  ])

  writeLabel(doc, 'QUINTA. - CONTRAPRESTACIÓN.', { fontSize: 11.8, moveDown: 0.55 })

  writeRich(doc, [
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' se compromete a pagar a ' },
    { text: '“EL AGENTE ADUANAL”:', isBold: true },
  ], { moveDown: 0.65 })

  writeRich(doc, [
    { text: '5.1.- ', isBold: true },
    { text: 'La cantidad que manifieste la factura (cuenta de gastos) correspondiente a cada operación de comercio exterior que ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' realice por cada uno de los' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 17)
}
