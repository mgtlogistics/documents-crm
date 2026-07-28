import { drawPageNumber } from '../helpers/layout.js'
import { writeLabel, writeParagraph } from '../helpers/writers.js'

export default function renderPage05(doc, data = {}, options = {}) {
  writeParagraph(
    doc,
    'Informacion Confidencial sujeta al presente contrato, incluye, pero no se limita a lo siguiente: aquella divulgada por “EL CLIENTE”, aquella inferida de articulos consignados por “EL CLIENTE” y aquella que se contenga en documentos producidos por “EL CLIENTE”. Toda Informacion proporcionada por “EL CLIENTE” se considerara como ESTRICTAMENTE CONFIDENCIAL ya sea que si se indique o no. Lo anterior, sin perjuicio de lo establecido en la Ley Federal para la Prevencion e Identificacion de Operaciones con Recursos de Procedencia Ilicita.',
    { fontSize: 10.9 }
  )

  writeParagraph(doc, 'En base a lo anterior, las partes convienen en otorgar las siguientes:', {
    fontSize: 10.9,
    moveDown: 1,
  })

  writeLabel(doc, 'C L A U S U L A S', { align: 'center', fontSize: 12.5, moveDown: 1.1 })

  writeLabel(doc, 'PRIMERA. - OBJETO DEL CONTRATO:', { fontSize: 11.5, moveDown: 0.5 })
  writeParagraph(
    doc,
    'El presente contrato tiene por objeto que “EL AGENTE ADUANAL” preste los servicios profesionales de importacion o exportacion de mercancias en los diversos regimenes aduaneros a “EL CLIENTE”, asi como todos aquellos actos que se relacionen con el comercio exterior por las Aduanas de Nogales, Agua Prieta, Naco y Guaymas en el Estado de Sonora, de acuerdo a lo previsto por el articulo 35 de la Ley Aduanera, en el entendido de que la actuacion de “EL AGENTE ADUANAL” en todo momento sera a nombre de “EL CLIENTE”.',
    { fontSize: 10.9 }
  )

  writeLabel(doc, 'SEGUNDA. - OTORGAMIENTO DE MANDATO Y CARTA ENCOMIENDA.', { fontSize: 11.5, moveDown: 0.5 })
  writeParagraph(
    doc,
    'En este acto “EL CLIENTE” otorga a favor de “EL AGENTE ADUANAL” y este ultimo acepta, un mandato expreso para que realice el despacho aduanal en los diferentes regimenes aduaneros por cuenta de “EL CLIENTE” sea consignatario, destinatario, propietario, poseedor o remitente, segun corresponda y estas entren o salgan de cualquiera de las Aduanas en que “EL AGENTE ADUANAL” se encuentre autorizado para tramitar el despacho aduanero de las mercancias por cuenta de “EL CLIENTE”.',
    { fontSize: 10.9 }
  )

  writeParagraph(
    doc,
    'En el entendido anterior, con forme lo establece “EL CLIENTE” debera dirigir en cada una de las operaciones que realice a “EL AGENTE ADUANAL” mediante escrito donde se precise de forma explicita y haga referencia a los pormenores de la operacion de comercio exterior que pretende llevar acabo, facultandolo para que “EL AGENTE ADUANAL” ejerza exclusivamente el conjunto de actos y actividades para lograr el desaduanamiento de la mercancia que le fue encomendada en terminos del articulo 35 de la Ley Aduanera.',
    { fontSize: 10.9 }
  )

  writeLabel(doc, 'TERCERO. - OBLIGACIONES DEL AGENTE ADUANAL.', { fontSize: 11.5, moveDown: 0.5 })
  writeParagraph(
    doc,
    'Son obligaciones del Agente Aduanal sin menoscabo de las demas obligaciones contenidas en el presente contrato, las siguientes:',
    { fontSize: 10.9 }
  )

  drawPageNumber(doc, options.pageNumber || 5)
}
