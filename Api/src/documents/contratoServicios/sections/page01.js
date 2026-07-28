import { drawPageNumber } from '../helpers/layout.js'
import { writeCenteredHeading, writeLabel, writeParagraph } from '../helpers/writers.js'

function getLegalRepresentativeFullName(company = {}) {
  const representative = company?.legalRepresentative || {}
  const fullName = [
    representative.firstName,
    representative.paternalLastName,
    representative.maternalLastName,
  ]
    .filter((part) => typeof part === 'string' && part.trim().length > 0)
    .join(' ')
    .trim()

  return fullName || company?.legalRepresentativeName || 'No llenado'
}

export default function renderPage01(doc, data = {}, options = {}) {
  const company = data?.user?.company || {}
  const legalRepresentativeName = getLegalRepresentativeFullName(company)
  writeCenteredHeading(
    doc,
    `CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES QUE CELEBRAN POR UNA PARTE EL AGENTE ADUANAL CESAR AUGUSTO SAVINON RUELAS, (EN LO SUCESIVO "EL AGENTE ADUANAL") Y POR LA OTRA PARTE ${company.socialReason}, REPRESENTADA EN ESTE ACTO POR ${legalRepresentativeName} (EN LO SUCESIVO "EL CLIENTE"), AL TENOR DE LO SIGUIENTE:`,
    { fontSize: 10.8, moveDown: 1 }
  )

  writeLabel(doc, 'D E C L A R A C I O N E S', { align: 'center', fontSize: 12.5, moveDown: 1.2 })

  writeLabel(doc, 'I. DECLARA EL AGENTE ADUANAL:', { fontSize: 11.3 })

  writeParagraph(
    doc,
    'a) Que mediante acuerdo 800-02-00-00-00-2012-101, dictado por la H. Administracion General de Aduanas dependiente de la Secretaria de Hacienda y Credito Publico, una vez que cumpli con los requisitos previstos en el articulo 159 de la Ley Aduanera me fue otorgada la patente nacional 1623 con adscripcion a la Aduana de Nogales Sonora, cuya publicacion fue realizada en el Diario Oficial de la Federacion el 14 de marzo de 2012.',
    { fontSize: 10.7 }
  )

  writeParagraph(
    doc,
    'b) Que la funcion del Agente Aduanal consiste en realizar por cuenta y encargo de terceros, los tramites relacionados con el despacho aduanero de las mercancias a la importacion y/o exportacion, en sus diversos regimenes aduaneros, segun lo mandata la Ley Aduanera y su Reglamento, mercancias que son propiedad de los importadores y/o exportadores.',
    { fontSize: 10.7 }
  )

  writeParagraph(
    doc,
    'c) Que, a efecto de llevar a cabo las operaciones de comercio exterior, "EL AGENTE ADUANAL" en terminos del articulo 36 de la Ley Aduanera solicita y obtiene de los importadores y/o exportadores la documentacion soporte de la mercancia a importar o exportar.',
    { fontSize: 10.7 }
  )

  writeParagraph(
    doc,
    'd) Que, para los efectos legales del presente contrato, senala como domicilio para recibir cualquier tipo de notificacion, el ubicado en Acceso al ITN no. 22 interior, Colonia Unidad Deportiva, C.P. 84063, Nogales, Sonora; o bien, el correo electronico siguiente: daniel.savinon@aasavinon.com .',
    { fontSize: 10.7 }
  )

  writeParagraph(
    doc,
    'e) Que cuenta con los conocimientos, aptitudes y experiencia necesaria, asi como con la capacidad economica, activos propios y capital humano para dar cabal cumplimiento al objeto del presente contrato, mismo que consiste en la prestacion de servicios, asesoria y realizacion de todo tipo de actos y actividades que se relacionen con servicios de comercio exterior, conexos y relacionados con las actividades propias del agente aduanal en la tramitacion del despacho aduanero de mercancias para su importacion y/o exportacion, de conformidad con los articulos 159 y 162 de la Ley Aduanera.',
    { fontSize: 10.7 }
  )

  writeParagraph(
    doc,
    'f) Que no existe conflicto de intereses entre "EL AGENTE ADUANAL", y "EL CLIENTE" derivado de la prestacion de servicios de despacho aduanero, ni negocios personales en virtud de los cuales hubiera proporcionado algun beneficio economico a los socios y empleados de "EL CLIENTE", sus subsidiarias, filiales, controladas o controladoras con los que tenga tratos en virtud de la celebracion de este Contrato, y que no hay ninguna relacion de socios, accionistas, amistad ni de parentesco entre ellos.',
    { fontSize: 10.7 }
  )

  drawPageNumber(doc, options.pageNumber || 1)
}
