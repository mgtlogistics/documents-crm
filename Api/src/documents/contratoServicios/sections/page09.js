import createStylizedParagraph from '../../createStylizedParagraph.js'
import { drawPageNumber, getContentWidth } from '../helpers/layout.js'
import { writeLabel } from '../helpers/writers.js'

function writeRich(doc, fragments, options = {}) {
  const paragraphOptions = {
    fontSize: options.fontSize || 10.9,
    width: getContentWidth(doc),
    align: options.align || 'justify',
  }

  createStylizedParagraph(doc, fragments, paragraphOptions)
  doc.moveDown(options.moveDown !== undefined ? options.moveDown : 0.75)
}

export default function renderPage09(doc, data = {}, options = {}) {
  writeRich(doc, [
    { text: 'con el artículo 81 del Reglamento de la Ley Aduanera y demás disposiciones jurídicas aplicables.' },
  ])

  writeRich(doc, [
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' conservara como parte integrante de su contabilidad, el expediente electrónico de las operaciones de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', manteniendo un respaldo integro durante un plazo de cinco años de conformidad con lo establecido en el código fiscal de la federación.' },
  ])

  writeRich(doc, [
    { text: 'e) Presentar la garantía por cuenta de los importadores de la posible diferencia de contribuciones y sus accesorios, en los términos previstos en esta Ley, a que pudiera dar lugar por declarar en el pedimento un valor inferior al precio estimado que establezca la Secretaría para mercancías que sean objeto de subvaluación.' },
  ])

  writeRich(doc, [
    { text: 'Esta obligación solo se acota a la presentación de la garantía, por lo que la tramitación de la misma y los costos que deriven de ella correrán a cargo de “EL CLIENTE”.' },
  ])

  writeLabel(doc, 'CUARTA. - OBLIGACIONES DEL CLIENTE:', { fontSize: 11.5, moveDown: 0.5 })

  writeRich(doc, [
    { text: 'Para tal efecto ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' se obliga a cumplir en tiempo y forma lo siguiente:' },
  ], { moveDown: 0.65 })

  writeRich(doc, [
    { text: '4.1. ', isBold: true },
    { text: 'Deberá de proporcionar a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' bajo su estricta responsabilidad, toda la información y documentación necesaria para el cumplimiento del presente contrato, es decir, para la operación de comercio exterior, así como para el cumplimiento de las obligaciones a cargo de ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' derivadas de la Ley Federal para la Prevención e Identificación de Operaciones con Recursos de Procedencia Ilícita.' },
  ])

  writeRich(doc, [
    { text: 'Documentación que deberá ser proporcionada por ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', con rasgos de autenticidad, completa y la información vertida en ella sea real. En caso de que no se cumpla con lo anterior y como consecuencia de su presentación ante cualquier autoridad se genere una conducta de naturaleza ilícita ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', será el único responsable de cualquier consecuencia civil, penal, administrativa o fiscal comprometiéndose en este acto a sacar a salvo los intereses de ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: '.' },
  ])

  writeRich(doc, [
    { text: 'Para el caso, de que ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' se negara a proporcionar la información y/o documentación necesaria para que ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' realice las operaciones de comercio exterior, sin responsabilidad alguna para ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', éste se abstendrá de llevar a cabo el trámite u operación de que se trate.' },
  ])

  writeRich(doc, [
    { text: '4.2. ', isBold: true },
    { text: 'Expedir a nombre de ' },
    { text: '“El AGENTE ADUANAL”', isBold: true },
    { text: ' carta de encomienda, signada por el representante legal de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' mediante la cual exprese su conformidad y deseo que' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 9)
}
