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

export default function renderPage20(doc, data = {}, options = {}) {
  writeRich(doc, [
    { text: 'Cualquier discrepancia, omisión, falta de congruencia, inexactitud, falsedad, manipulación, o simulación en la información proporcionada, será imputable exclusivamente a ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: '.' },
  ])

  writeRich(doc, [
    { text: '“EL CLIENTE” expresamente deslinda de responsabilidad administrativa, fiscal, penal, civil o de cualquier naturaleza a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: '; quien, en caso de encontrarse relacionado en una controversia en relación a la carga encomendada por el cliente, se reserva su derecho a reclamar la indemnización por los gastos, costas, daños y perjuicios que se generen en su agravio.' },
  ])

  writeLabel(doc, 'SEPTIMA. CONFIDENCIALIDAD.', {
    fontSize: 11.8,
    moveDown: 0.55,
  })

  writeRich(doc, [
    { text: 'En este acto se reconoce que para satisfacer por entero el propósito de este Contrato, el Mandatario tendrá acceso a información confidencial relacionada con las actividades de negocios de “EL CLIENTE”.' },
  ])

  writeRich(doc, [
    { text: 'En consecuencia, ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' en términos de la Ley ' },
    { text: 'Federal de Protección de Datos Personales en Posesión de los Particulares', isBold: true },
    { text: ' se obliga a mantener en secreto, indefinidamente, toda la información confidencial que por cualquier medio o motivo obtenga o le sea provista por ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' en el entendido que esto no aplica ante la solicitud manifiesta de la autoridad competente para los fines marcados en la Regulación, esto es, si tal documentación es requerida por alguna autoridad ya sea en nuestro país o en el extranjero con competencia debida ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' deberá atender tal requerimiento para lo cual deberá hacerlo del conocimiento de “EL CLIENTE”, salvo que la autoridad determine lo contrario.' },
  ])

  writeRich(doc, [
    { text: 'La obligación a que se refiere el párrafo inmediato anterior será extensiva a los empleados y/o agentes de ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', por lo que ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' se asegurará que este convenio sea respetado por los mismos, y asume ante ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' cualquier responsabilidad de la inobservancia de esta obligación por parte de sus empleados.' },
  ])

  writeRich(doc, [
    { text: 'Asimismo, ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' se obliga a mantener en un lugar seguro y fuera del alcance de terceras personas, la información confidencial obtenida por cualquier medio o motivo, o que le sea provista por ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', salvo el material destinado a terceros.' },
  ])

  writeRich(doc, [
    { text: 'Llegado el vencimiento del presente Contrato o su terminación por cualquier motivo que fuere, ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' y sus trabajadores se obligan a mantener los expedientes a buen resguardo para los fines expresados en el segundo párrafo y devolver a ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', por medio de sus representantes legales, toda la información obtenida y/o proporcionada para el cumplimiento del mismo.' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 20)
}
