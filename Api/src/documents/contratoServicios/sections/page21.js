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

export default function renderPage21(doc, data = {}, options = {}) {
  writeRich(doc, [
    { text: '“EL AGENTE ADUANAL” se obliga a no divulgar la información confidencial que por virtud de su relación contractual haya obtenido de “EL CLIENTE” aún después de la terminación o rescisión del presente contrato.' },
  ])

  writeRich(doc, [
    { text: '“EL AGENTE ADUANAL” se obliga a dar uso responsable y confidencial al Sello Digital que sea otorgado por ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' para la elaboración de las operaciones de Comercio Exterior por medio del portal de Ventanilla Única, siendo responsables de la información transmitida por el personal de ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' en nombre de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' y se obliga a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' a garantizar que solo el ejecutivo de cuenta y el Gerente de Operaciones puedan tener acceso a esta información, siendo responsables directos de la correcta utilización del Sello Digital de “EL CLIENTE” UNICAMENTE para operaciones de Comercio Exterior.' },
  ])

  writeRich(doc, [
    { text: 'De manera recíproca por motivo de la prestación de servicios profesionales precisados en este contrato “EL CLIENTE” se obliga a mantener en resguardo y bajo confidencialidad la información a la que pudiese tener acceso inherente al “AGENTE ADUANAL”, vinculada con la prestación del servicio motivo de este contrato, esto es, no dar a conocer pormenores de la operación de comercio exterior a terceras personas.' },
  ])

  writeLabel(doc, 'OCTAVA. - EXCLUSIÓN DE INFORMACIÓN CONFIDENCIAL SENSIBLE Y SECRETOS INDUSTRIALES', {
    fontSize: 11.8,
    moveDown: 0.6,
  })

  writeRich(doc, [
    { text: '“EL CLIENTE” no estará obligado a proporcionar a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' documentación, datos o información que constituya secretos industriales, know-how, fórmulas, procesos productivos, métodos de fabricación, listas de materiales (bill of materials), estrategias comerciales, información financiera reservada, ni cualquier otro elemento cuya revelación pueda comprometer su operación, competitividad o integridad empresarial.' },
  ])

  writeLabel(doc, 'NOVENA.- AVISO DE PRIVACIDAD.', {
    fontSize: 11.8,
    moveDown: 0.55,
  })

  writeRich(doc, [
    { text: 'Para el debido despacho aduanero de la mercancía, “EL CLIENTE” proporcionará toda la información que requiera “EL AGENTE ADUANAL”, acordándose preservar la privacidad y la seguridad de su información en términos del ' },
    { text: 'Aviso de Privacidad', isBold: true },
    { text: ' contenido en el ' },
    { text: 'ANEXO', isBold: true },
    { text: ' I del presente contrato.' },
  ])

  writeLabel(doc, 'DÉCIMA. VIGENCIA.', {
    fontSize: 11.8,
    moveDown: 0.55,
  })

  writeRich(doc, [
    { text: 'Las partes convienen en que la vigencia del presente contrato será por tiempo definido contando a partir del día ' },
    { text: '10 de mayo de 2026 al 31 de diciembre de 2026', isBold: true },
    { text: ' plazo en el cual “EL AGENTE ADUANAL” deberá cumplir con los servicios a los que se obligó como consecuencia del presente contrato, de conformidad con las condiciones que se especifican en el mismo y con las cartas de encomienda correspondientes, y sólo podrá ser renovado mediante acuerdo escrito celebrado entre los representantes legales de las partes.' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 21)
}
