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

export default function renderPage24(doc, data = {}, options = {}) {
  writeLabel(doc, 'DÉCIMA QUINTA. MODIFICACIONES Y ENMIENDAS.', {
    fontSize: 11.8,
    moveDown: 0.55,
  })

  writeRich(doc, [
    { text: 'Cualquier modificación o enmienda en los términos y condiciones del presente contrato, únicamente tendrá validez y surtirá sus efectos en la medida en que ambas partes acuerden por escrito dicha modificación o enmienda.' },
  ])

  writeLabel(doc, 'DÉCIMA SEXTA. CESIÓN', {
    fontSize: 11.8,
    moveDown: 0.55,
  })

  writeRich(doc, [
    { text: 'Las partes convienen en que los derechos y obligaciones que a su favor y a su cargo se deriven del presente Contrato, no podrán cederse ni transmitirse en forma alguna, sino mediante previa autorización por escrito de su contraparte, pactándose al respecto que la parte que pretenda realizar dicha cesión, lo comunicará por escrito a la otra, quien deberá contestar dicha comunicación en un plazo de 15 (quince) días naturales y en caso contrario se tendrá por no autorizada dicha cesión.' },
  ])

  writeLabel(doc, 'DÉCIMA SEPTIMA.  DOMICILIOS, AVISOS Y NOTIFICACIONES', {
    fontSize: 11.8,
    moveDown: 0.55,
  })

  writeRich(doc, [
    { text: '17.1. ', isBold: true },
    { text: 'Todas las notificaciones y avisos que deban otorgarse de conformidad con el presente contrato deberán hacerse por escrito, debiendo obtener la parte que la realice, evidencia de que la comunicación ha sido recibida por la otra parte. Para los efectos anteriores y hasta tanto no se notifiquen nuevos domicilios en la forma antes indicada, las partes señalan como sus domicilios los señalados en las declaraciones de este contrato.' },
  ], { moveDown: 0.62 })

  writeRich(doc, [
    { text: '17.2. ', isBold: true },
    { text: 'En caso de que cualquiera de las partes cambie su domicilio, deberá notificarlo por escrito a la otra, dentro de las 24 (veinticuatro) horas siguientes a que esto suceda, conforme a lo establecido en esta cláusula, de lo contrario, las notificaciones hechas a los anteriores domicilios, serán consideradas como válidas, sin la necesidad de evidencia.' },
  ])

  writeLabel(doc, 'DÉCIMA OCTAVA. AUDITORIA', {
    fontSize: 11.8,
    moveDown: 0.55,
  })

  writeRich(doc, [
    { text: '“EL AGENTE ADUANAL” acuerda mantener registros exactos y completos de los contratos, documentos, correspondencia, libros contables, facturas y cualquier información relacionada con el presente contrato. Dichos registros serán mantenidos de acuerdo con las prácticas contables y conservados por un período de 5 (cinco) años posteriores a la terminación del presente contrato. “EL AGENTE ADUANAL” acuerda permitir a “EL CLIENTE” o quien ésta autorice, examine y audite la mencionada documentación, por cuenta y costo de “EL CLIENTE”, notificando por escrito y por anticipado a “EL AGENTE ADUANAL” con cuando menos 2 (dos) días hábiles de anticipación a la fecha en que deseen llevar a cabo dicha revisión.' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 24)
}
