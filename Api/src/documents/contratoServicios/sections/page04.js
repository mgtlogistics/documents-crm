import { drawPageNumber } from '../helpers/layout.js'
import { writeLabel, writeParagraph } from '../helpers/writers.js'

export default function renderPage04(doc, data = {}, options = {}) {
  writeLabel(doc, 'D E F I N I C I O N E S', { align: 'center', fontSize: 12.5, moveDown: 1.1 })

  writeLabel(doc, 'a) Servicios profesionales:', { fontSize: 11.4, moveDown: 0.5 })
  writeParagraph(
    doc,
    'Son todos aquellos tramites, gestiones ante la Aduana de despacho de las mercancias a nombre siempre del "EL CLIENTE" y en los cuales "EL AGENTE ADUANAL" participe y que se vinculen con el despacho aduanal de mercancias en donde "EL CLIENTE" sea consignatario, destinatario, propietario, poseedor o remitente, segun corresponda de conformidad con el objeto del presente contrato.',
    { fontSize: 10.9 }
  )

  writeLabel(doc, 'b) Pedimentos:', { fontSize: 11.4, moveDown: 0.5 })
  writeParagraph(
    doc,
    'Es la forma oficial aprobada por la Secretaria de Hacienda y Credito Publico indispensable que se presenta por conducto de un agente o apoderado aduanal ante las aduanas mexicanas, en representacion de quienes importen o exporten mercancias de comercio exterior.',
    { fontSize: 10.9 }
  )

  writeLabel(doc, 'c) Despacho de Mercancias:', { fontSize: 11.4, moveDown: 0.5 })
  writeParagraph(
    doc,
    'Es el conjunto de actos y formalidades relativos a la entrada de mercancias al territorio nacional y a su salida del mismo, que, de acuerdo con los diferentes traficos y regimenes aduaneros establecidos en los ordenamientos aplicables, deben realizar en la aduana las autoridades aduaneras y los consignatarios, destinatarios, propietarios, poseedores o tenedores en las importaciones y los remitentes en las exportaciones, asi como los agentes o apoderados aduanales.',
    { fontSize: 10.9 }
  )

  writeLabel(doc, 'D) Mercancias:', { fontSize: 11.4, moveDown: 0.5 })
  writeParagraph(
    doc,
    'Las listadas en la fraccion XIV, del articulo 17 de la Ley Federal para la Prevencion e Identificacion de Operaciones con Recursos de Procedencia Ilicita, cuyas fracciones arancelarias se encuentran identificadas en el Anexo “A” de la Resolucion por la que se expiden los formatos oficiales de los avisos e informes que deben presentar quienes realicen actividades vulnerables.',
    { fontSize: 10.9 }
  )

  writeLabel(doc, 'E) Informacion Confidencial', { fontSize: 11.4, moveDown: 0.5 })
  writeParagraph(
    doc,
    'Significa toda informacion dada a conocer a “EL AGENTE ADUANAL” por “EL CLIENTE” y que se relacione con los negocios pasados, presentes o futuros de “EL CLIENTE” la',
    { fontSize: 10.9, moveDown: 0 }
  )

  drawPageNumber(doc, options.pageNumber || 4)
}
