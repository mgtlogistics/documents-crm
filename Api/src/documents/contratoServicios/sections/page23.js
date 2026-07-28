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

export default function renderPage23(doc, data = {}, options = {}) {
  writeRich(doc, [
    { text: 'cuando este último haya sido publicado en la lista que pública de manera periódica el Servicio de Administración Tributaria cuando un contribuyente actualiza el supuesto normativo del artículo 69, 69b del Código Fiscal de la Federación, esto es, tal empresa lleve a cabo operaciones inexiste o bien simuladas, también cuando es vinculada en delincuencia organizada y se encuentre en investigación por parte de la Fiscalía General de la República.' },
  ])

  writeLabel(doc, 'DECIMA TERCERA. EFECTOS DE LA TERMINACIÓN.', {
    fontSize: 11.8,
    moveDown: 0.55,
  })

  writeRich(doc, [
    { text: 'Sin menoscabo de los derechos y acciones que asisten a las partes conforme al presente contrato, las mismas acuerdan que una vez rescindido y/o terminado este contrato por cualquier motivo, todos los derechos y obligaciones de las partes bajo este contrato se darán por terminados, quedando previsto, sin embargo, que “EL AGENTE ADUANAL” tendrá derecho a recibir el pago de los Servicios ya prestados, sí “EL AGENTE ADUANAL” no ha incurrido en incumplimiento. “EL AGENTE ADUANAL” deberá devolver dentro de ' },
    { text: 'DIEZ', isBold: true },
    { text: ' días naturales a la solicitud presentada por escrito por “EL CLIENTE”, todos los documentos, diseños industriales, diseños de mercadotecnia, folletos, ideas creativas, modelos de utilidad, patentes, desarrollos de mercadotecnia, materiales, utensilios, maquinaria, activos y/o información confidencial que haya recibido de “EL CLIENTE” para dar cumplimiento al objeto de este contrato. Las cláusulas que deban sobrevivir a la terminación de este contrato seguirán vigentes, incluyendo, pero sin limitarse, las cláusulas sobre confidencialidad, esta cláusula y demás disposiciones generales.' },
  ])

  writeLabel(doc, 'DECIMA CUARTA. - RESPONSABILIDAD LABORAL', {
    fontSize: 11.8,
    moveDown: 0.55,
  })

  writeRich(doc, [
    { text: '14.1. ', isBold: true },
    { text: 'No se considerará que este contrato establece relación laboral alguna entre las partes del mismo ni entre sus empleados y subcontratistas, quienes actuarán como partes independientes. Las partes son independientes una de otra y ninguna de las estipulaciones del presente instrumento será consideradas como una coinversión (Joint Venture) o relación de agente, mandatario, patrón o empleado entre “EL CLIENTE” y “EL AGENTE ADUANAL”.' },
  ], { moveDown: 0.62 })

  writeRich(doc, [
    { text: '14.2. ', isBold: true },
    { text: '“EL AGENTE ADUANAL” empleará personal competente bajo su supervisión, subordinación y dirección para llevar a cabo el encargo objeto del presente convenio. Asimismo, “EL CLIENTE” autoriza a “EL AGENTE ADUANAL” para que se auxilie de sus empleados para efectuar la recepción, custodia, despacho aduanero y entrega de las mercancías que al efecto le sean encomendadas por “EL CLIENTE”.' },
  ], { moveDown: 0.62 })

  writeRich(doc, [
    { text: '14.3. ', isBold: true },
    { text: '“EL AGENTE ADUANAL”, en su carácter de patrón, es responsable único de las obligaciones que la ley establece a su cargo con dicho carácter y de las prestaciones con relación a sus empleados y trabajadores que utiliza para el desempeño de los Servicios objeto de este contrato.' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 23)
}
