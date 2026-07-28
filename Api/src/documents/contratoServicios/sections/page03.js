import { drawPageNumber } from '../helpers/layout.js'
import { writeLabel, writeParagraph } from '../helpers/writers.js'

export default function renderPage03(doc, data = {}, options = {}) {
  writeParagraph(
    doc,
    'g) Que la documentacion que acredita lo antes expuesto se entrego en copia simple, cuyo original se puso a la vista de las partes a la firma del presente contrato, y queda a disposicion de "EL AGENTE ADUANAL" como parte integrante del expediente de identificacion del cliente en los terminos que la requiera y para los efectos administrativos y legales que se llegasen a necesitar a consecuencia del presente contrato, documentacion que podra ser proporcionada por "EL AGENTE ADUANAL", en caso de ser requerida por alguna autoridad y que la misma puede ser resguardada por la "EL AGENTE ADUANAL" por cinco anos posteriores de haber concluido las operaciones de comercio exterior solicitadas por "EL CLIENTE".',
    { fontSize: 10.9 }
  )

  writeParagraph(
    doc,
    'h) Declara bajo protesta de decir verdad que su representada que no se encuentra listado en los supuestos previstos en los articulos 49 Bis fraccion X, 69 con excepcion de la fraccion IV, 69-B cuarto parrafo y 69-B Bis noveno parrafo del Codigo Fiscal de la Federacion vigente, ni mantiene relacion con contribuyentes incluidos en dichos listados, obligandose a mantener indemne al Agente Aduanal frente a cualquier contingencia que derive del incumplimiento de esta declaracion.',
    { fontSize: 10.9 }
  )

  writeParagraph(
    doc,
    'i) Que el "CLIENTE" manifiesta bajo protesta de decir verdad, que los recursos utilizados para cumplir con las obligaciones pactadas en el presente contrato son de procedencia licita, reconociendo que "EL AGENTE ADUANAL", se encuentra obligado al cumplimiento de lo dispuesto en la Ley Federal para la Prevencion e Identificacion de Operaciones con Recursos de Procedencia Ilicita, su Reglamento y las demas Leyes relacionadas con la materia, por lo que debera prevenir, detectar, y reportar los actos, omisiones u operaciones que pudieran favorecer, auxiliar o cooperar para la comision del delito de Operaciones con recursos de procedencia ilicita previsto por el Codigo Penal Federal en su articulo 400 Bis y demas delitos relacionados con estas.',
    { fontSize: 10.9 }
  )

  writeParagraph(
    doc,
    'j) Que no existe conflicto de intereses entre "EL AGENTE ADUANAL", y "EL CLIENTE" derivado de la prestacion de servicios de despacho aduanero, ni negocios personales en virtud de los cuales hubiera proporcionado algun beneficio economico a los socios y empleados de "EL CLIENTE", sus subsidiarias, filiales, controladas o controladoras con los que tenga tratos en virtud de la celebracion de este Contrato, y que no hay ninguna relacion de socios, accionistas, amistad ni de parentesco entre ellos.',
    { fontSize: 10.9 }
  )

  writeLabel(doc, 'III.- DECLARAN AMBAS PARTES:', { fontSize: 11.8, moveDown: 0.8 })

  writeParagraph(
    doc,
    'a) Haber definido libremente, por conducto de sus representantes legales debidamente acreditados y por su propio derecho, los terminos y condiciones de este Contrato, con pleno conocimiento de sus implicaciones juridicas.',
    { fontSize: 10.9 }
  )

  writeParagraph(
    doc,
    'b) Que en este acto comparecen con la intencion de quedar legalmente obligados bajo los terminos del presente instrumento, y por lo tanto proceden a celebrar el presente Contrato de Mandato de conformidad con las clausulas que a continuacion se enuncian.',
    { fontSize: 10.9 }
  )

  drawPageNumber(doc, options.pageNumber || 3)
}
