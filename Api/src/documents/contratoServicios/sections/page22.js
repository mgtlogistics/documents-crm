import createStylizedParagraph from '../../createStylizedParagraph.js'
import { drawPageNumber, getContentWidth } from '../helpers/layout.js'
import { writeLabel } from '../helpers/writers.js'

function writeRich(doc, fragments, options = {}) {
  createStylizedParagraph(doc, fragments, {
    fontSize: options.fontSize || 10.9,
    width: getContentWidth(doc),
    align: options.align || 'justify',
  })

  doc.moveDown(options.moveDown !== undefined ? options.moveDown : 0.72)
}

export default function renderPage22(doc, data = {}, options = {}) {
  writeLabel(doc, 'DÉCIMA PRIMERA. TERMINACIÓN ANTICIPADA.', {
    fontSize: 11.8,
    moveDown: 0.55,
  })

  writeRich(doc, [
    { text: 'No obstante, lo estipulado en la cláusula anterior, cualquiera de las partes lo podrán dar por terminado, mediante un aviso por escrito firmado por el representante legal de cada una de las partes que tenga suficientes facultades para ello, otorgado a la otra parte con 30 (treinta) días naturales de anticipación. Queda entendido y acordado por las partes, que en el caso de terminación anticipada de este contrato conforme lo establecido en este párrafo, ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' no tendrá derecho alguno a ningún tipo de indemnización de ninguna naturaleza ni por ningún tipo de razón, debiendo cubrir “EL CLIENTE” a “EL AGENTE ADUANAL” únicamente las cantidades correspondientes al trabajo que se haya generado. En caso de incumplimiento por parte de ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' de las obligaciones surgidas del presente Contrato, ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', a su juicio, podrá exigir el cumplimiento forzoso del presente instrumento, o bien, darlo por terminado de inmediato y sin que medie aviso previo o resolución judicial alguna.' },
  ])

  writeRich(doc, [
    { text: 'En caso de que el presente Contrato sea terminado por cualquier motivo, ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' se obliga a devolver a “EL CLIENTE” todas y cada una de las cantidades que “EL AGENTE ADUANAL” hubiere recibido de “EL CLIENTE”, con el propósito de dar cumplimiento a las obligaciones plasmadas en el presente instrumento, en el entendido de que “EL AGENTE ADUANAL” no hubiere dispuesto de dichas cantidades para efectuar su encargo.' },
  ])

  writeRich(doc, [
    { text: 'Asimismo, “EL CLIENTE” queda obligada a la liquidación de los servicios prestados hasta el momento de la terminación en los términos y tiempos definidos en el presente contrato.' },
  ])

  writeLabel(doc, 'DECIMO SEGUNDA. CAUSALES DE RESCISIÓN', {
    fontSize: 11.8,
    moveDown: 0.55,
  })

  writeRich(doc, [
    { text: '“EL CLIENTE” podrá rescindir sin responsabilidad para él, mediando únicamente notificación por escrito, cuando:' },
  ], { moveDown: 0.6 })

  writeRich(doc, [
    { text: '12.1. ', isBold: true },
    { text: '“EL AGENTE ADUANAL” incumpla cualquiera de sus obligaciones conforme al presente contrato y no remedie su incumplimiento.' },
  ], { moveDown: 0.55 })

  writeRich(doc, [
    { text: '12.2. ', isBold: true },
    { text: 'Si “EL AGENTE ADUANAL” resultare insolvente o cede ya sea a sus acreedores, a cualquier fiduciario o a cualquier tercero, la totalidad o una parcialidad substancial de sus activos, o en caso de que una demanda de concurso mercantil sea presentada por o en contra de “EL AGENTE ADUANAL”.' },
  ], { moveDown: 0.55 })

  writeRich(doc, [
    { text: '12.3. ', isBold: true },
    { text: 'En caso de ceder, transferir, negociar o afectar, total o parcialmente el presente contrato, sin autorización escrita de “EL CLIENTE”.' },
  ], { moveDown: 0.55 })

  writeRich(doc, [
    { text: '12.4. ', isBold: true },
    { text: '“EL AGENTE ADUANAL”, podrá, rescindir sin responsabilidad alguna de manera unilateral el presente contrato mediando solamente aviso por escrito a “EL CLIENTE”,' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 22)
}
