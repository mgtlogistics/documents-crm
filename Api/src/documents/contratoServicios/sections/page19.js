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

function writeAlpha(doc, letter, fragments) {
  const left = getContentLeft(doc)
  const width = getContentWidth(doc)
  const prefixWidth = 26

  doc
    .font('Helvetica-Bold')
    .fontSize(10.9)
    .text(`${letter})`, left + 44, doc.y, {
      width: prefixWidth,
      align: 'left',
      lineBreak: false,
    })

  createStylizedParagraph(doc, fragments, {
    fontSize: 10.9,
    width: width - prefixWidth - 60,
    align: 'justify',
    left: left + 44 + prefixWidth + 8,
    top: doc.y - 12,
  })

  doc.moveDown(0.5)
}

export default function renderPage19(doc, data = {}, options = {}) {
  writeLabel(doc, 'SEXTA.- EXCLUSIÓN DE RESPONSABILIDAD POR PARTE DEL AGENTE ADUANAL.', {
    fontSize: 11.8,
    moveDown: 0.55,
  })

  writeRich(doc, [
    { text: '“EL CLIENTE” asume toda la responsabilidad por el contenido de su carga desde la salida del almacén de su proveedor y durante todo el trayecto del transporte hasta su destino final en caso de:' },
  ], { moveDown: 0.55 })

  writeAlpha(doc, 'A', [{ text: 'Carga contaminada;' }])

  writeAlpha(doc, 'B', [{ text: 'Alteración o manipulación no autorizada de las mercancías antes, durante o después del despacho aduanero;' }])

  writeAlpha(doc, 'C', [
    { text: 'Controversias en materia de propiedad intelectual o derechos de autor respecto de mercancías que debieron cumplir con contratos de licencia o permisos específicos de los titulares de estos derechos, y que tal situación haya sido ocultada o no reportada oportunamente a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: '.' },
  ])

  writeAlpha(doc, 'D', [{ text: 'Cualquier revisión, acto de fiscalización, requerimiento o procedimiento iniciado por la autoridad respecto de la mercancía de la cual se solicitó el despacho.' }])

  writeRich(doc, [
    { text: 'Así mismo, “LAS PARTES” acuerdan que “EL CLIENTE” no iniciará ningún procedimiento de responsabilidad en contra de “EL AGENTE ADUANAL”, ni la hará responsable ante alguna Autoridad, por el pago de las diferencias de contribuciones, cuotas compensatorias, multas y recargos que se determinen, así como por el incumplimiento de regulaciones y restricciones no arancelarias, cuando éstos provienen de la inexactitud, falsedad, discrepancias, omisiones, o falta de congruencia de cualquier dato o documento que el “EL CLIENTE” le hubiera proporcionado a “EL AGENTE ADUANAL”.' },
  ], { moveDown: 0.55 })

  writeAlpha(doc, 'E', [{ text: 'Responsabilidad en materia fiscal, administrativa, aduanera, penal, civil, y/o cualquier otra sanción como consecuencia de la incorrecta clasificación arancelaria cuando se trate de mercancías de difícil identificación y la fracción arancelaria derive de los documentos proporcionados por “EL CLIENTE” al “AGENTE ADUANAL”.' }])

  writeAlpha(doc, 'F', [
    { text: 'Las partes acuerdan que ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', no será responsable del extravío, robo o pérdida total o parcial, que por caso fortuito o de fuerza mayor, pueda sufrir la mercancía propiedad de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', por lo que será responsabilidad de este último, asegurar previamente su mercancía o en su caso, sufrir la pérdida.' },
  ])

  writeRich(doc, [
    { text: '“EL CLIENTE”, expresamente manifiesta que toda la documentación que haga llegar a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' con motivo de los servicios contratados en este instrumento, ' },
    { text: 'es veraz, auténtica, fiel y exacta', isBold: true },
    { text: ', tanto en la forma, como en cuanto a su contenido; mismo que refleja la realidad de la información que en él se contiene.' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 19)
}
