import createStylizedParagraph from '../../createStylizedParagraph.js'
import { drawPageNumber, getContentWidth } from '../helpers/layout.js'

function writeRich(doc, fragments, options = {}) {
  createStylizedParagraph(doc, fragments, {
    fontSize: options.fontSize || 10.9,
    width: getContentWidth(doc),
    align: options.align || 'justify',
  })

  doc.moveDown(options.moveDown !== undefined ? options.moveDown : 0.72)
}

export default function renderPage18(doc, data = {}, options = {}) {
  writeRich(doc, [
    { text: 'despachos y trámites realizados, así como todas y cada una de las cantidades que por concepto de impuestos que se determinen y deriven de la importación y/o exportación del despacho de mercancías que sean encomendadas.' },
  ])

  writeRich(doc, [
    { text: '“EL CLIENTE” se obliga a pagar a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' el importe correspondiente conforme a la tarifa de honorarios, más los impuestos y los gastos comprobados.' },
  ])

  writeRich(doc, [
    { text: '5.2. ', isBold: true },
    { text: 'Cualquier otro gasto relacionado con los servicios prestados por ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' deberá ser presentado en cuenta de gastos con los comprobantes del mismo.' },
  ])

  writeRich(doc, [
    { text: '5.3. ', isBold: true },
    { text: '“EL CLIENTE” podrá solicitar a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', bajo los términos y condiciones del presente Contrato, servicios adicionales a los originalmente pactados, quien, en caso de aceptarlos, deberá entregar una cotización por escrito a “EL CLIENTE” para su aprobación.' },
  ])

  writeRich(doc, [
    { text: '5.4. ', isBold: true },
    { text: '“EL CLIENTE” efectuará el pago de la remuneración y de los gastos indicados en los comprobantes que expida ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' dentro de los ', isBold: false },
    { text: 'TRES', isBold: true },
    { text: ' días naturales siguientes a se le entregue la factura correspondiente que contenga todos y cada uno de los requisitos fiscales de ley, esto mediante depósito en cuenta que ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' manifieste por escrito a ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', en caso de que no se cumpla con lo anterior, la demora en el pago ocasionará un interés legal mensual vigente en la época de los hechos el cual puede “EL CLIENTE” está de acuerdo y lo acepta.' },
  ])

  writeRich(doc, [
    { text: '5.5. “EL AGENTE ADUANAL” se obliga a expedir los comprobantes correspondientes que reúnan los requisitos establecidos en las disposiciones fiscales, por las cantidades que deberá cubrir “EL CLIENTE” por concepto de remuneración por los trabajos encomendados a “EL AGENTE ADUANAL” de conformidad con el presente convenio, así como los gastos que deban ser reembolsados o las cantidades del depósito que haya dispuesto.' },
  ])

  writeRich(doc, [
    { text: 'La falta de cumplimiento de esta obligación por parte de “EL AGENTE ADUANAL” exime a “EL CLIENTE” de pagar a “EL AGENTE ADUANAL” las cantidades por concepto de remuneración y por los gastos incurridos que deban ser reembolsados, así como entregar en depósito el monto de las cantidades que haya dispuesto, hasta el momento en que “EL AGENTE ADUANAL” expida los comprobantes a que se refiere esta cláusula.' },
  ])

  writeRich(doc, [
    { text: '5.6. “EL CLIENTE” efectuará el pago de la remuneración y de los gastos indicados en los comprobantes que expida “EL AGENTE ADUANAL”, mediante depósito en cuenta que “EL AGENTE ADUANAL” manifieste por escrito a “EL CLIENTE”.' },
  ])

  writeRich(doc, [
    { text: '5.7. ', isBold: true },
    { text: 'Una vez que “EL CLIENTE” haya efectuado el depósito respectivo para cubrir la remuneración y los gastos erogados por ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', quedará aquél liberada de toda responsabilidad respecto a dichos conceptos, por lo que solamente tendrá la obligación de entregar una copia del comprobante del depósito respectivo a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' o bien, a su personal autorizado.' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 18)
}
