import PDFDocument from 'pdfkit'
import createStylizedParagraph from './utils/createStylizedParagraph.js'
import drawLetterhead from './utils/drawLetterhead.js'
import drawPlaceOfIssuance from './utils/drawPlaceOfIssuance.js'

const getLegalRepresentativeFullName = (company = {}) => {
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

export function generarCartaEncomiendaLeonel(data) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 60 })
  const company = data?.user?.company || {}
  const address = data?.user?.address || {}
  const powerOfAttorney = company?.powerOfAttorney || {}
  const powerNotary = powerOfAttorney?.notary || {}
  const legalRepresentativeName = getLegalRepresentativeFullName(company)
  const powerNumber = powerOfAttorney?.number || company?.powerOfAttorneyNumber || 'No llenado'
  const powerVolume = powerOfAttorney?.volume || company?.powerOfAttorneyVolume || 'No llenado'
  const notaryNumber = powerNotary?.number || company?.notaryNumber || 'No llenado'
  const notaryName = powerNotary?.name || company?.notaryName || 'No llenado'
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const paragraphOptions = {
    fontSize: 9.5,
    width: contentWidth,
    align: 'justify',
  }
  const paragraphSpacing = 0.55

  drawLetterhead(doc, data)
  drawPlaceOfIssuance(doc, data, {
    preserveCursor: true,
    y: 165 + doc.currentLineHeight(),
  })

  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .text('CARTA DE ENCOMIENDA', { align: 'center', width: contentWidth })
    .moveDown(3)

  doc
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .text('A.A. LEONEL ERNESTO CANTU LOZANO.')
    .text('Patente 1615')
    .text('Presente.')
    .moveDown(1.35)

  const introduction = [
    { text: 'En mi carácter de ' },
    { text: 'Representante Legal', isBold: true },
    { text: ' de la empresa ' },
    { text: company.socialReason || 'No llenado', isBold: true },
    { text: ', con domicilio fiscal en ' },
    { text: address.street || 'No llenado', isBold: true },
    { text: ', número exterior ' },
    { text: address.exteriorNumber || 'No llenado', isBold: true },
    { text: ', número interior ' },
    { text: address.interiorNumber || 'S/N', isBold: true },
    { text: ', colonia ' },
    { text: address.neighborhood || 'No llenado', isBold: true },
    { text: ', municipio ' },
    { text: address.city || 'No llenado', isBold: true },
    { text: ', localidad ' },
    { text: address.locality || 'No llenado', isBold: true },
    { text: ', entidad federativa ' },
    { text: address.state || 'No llenado', isBold: true },
    { text: ', México, Código Postal ' },
    { text: address.postalCode || 'No llenado', isBold: true },
    { text: ', con Registro Federal de Contribuyentes ' },
    { text: company.rfc || 'No llenado', isBold: true },
    { text: ', personalidad que acredito conforme al Poder Notarial número ' },
    { text: powerNumber, isBold: true },
    { text: ', volumen ' },
    { text: powerVolume, isBold: true },
    { text: ', otorgado ante la fe del Notario Público número ' },
    { text: notaryNumber, isBold: true },
    { text: ', Lic. ' },
    { text: notaryName, isBold: true },
    { text: ', manifiesto lo siguiente:' },
  ]
  createStylizedParagraph(doc, introduction, paragraphOptions)
  doc.moveDown(paragraphSpacing)

  const appointment = [
    { text: 'Por medio de la presente, ' },
    { text: 'ENCOMIENDO y CONFIERO EL ENCARGO ', isBold: true },
    { text: 'a su favor, en su carácter de titular de la Patente Aduanal número ' },
    { text: '1615', isBold: true },
    { text: ', para que, a nombre y por cuenta exclusiva de mi representada, realice el ' },
    { text: 'despacho aduanero ', isBold: true },
    { text: 'de las mercancías de ' },
    { text: 'importación y/o exportación ', isBold: true },
    { text: 'que se efectúen por las aduanas de ' },
    { text: 'REYNOSA', isBold: true },
    { text: ', así como por sus respectivas Secciones Aduaneras.' },
  ]
  createStylizedParagraph(doc, appointment, paragraphOptions)
  doc.moveDown(paragraphSpacing)

  createStylizedParagraph(doc, [
    { text: 'El presente mandato se otorga con ' },
    { text: 'vigencia indefinida, ', isBold: true },
    { text: 'a partir de la fecha de su firma, y permanecerá vigente hasta en tanto no sea revocada expresamente por escrito por mi representada.' },
  ], paragraphOptions)
  doc.moveDown(paragraphSpacing)

  createStylizedParagraph(doc, [
    { text: 'Reconozco y acepto expresamente que, conforme a la legislación aduanera vigente y sus reformas, la ' },
    { text: 'responsabilidad sobre la veracidad, exactitud, integridad y legalidad ', isBold: true },
    { text: 'de la información y documentación proporcionada corresponde ' },
    { text: 'exclusivamente a mi mandante en su calidad de importador, ', isBold: true },
    { text: 'por lo que:' },
  ], paragraphOptions)
  doc.moveDown(paragraphSpacing)

  const clauses = [
    [
      { text: 'a) ', isBold: true },
      { text: 'Bajo protesta de decir verdad, mi mandante declara que ' },
      { text: 'no existe relación de parentesco ', isBold: true },
      { text: 'por consanguinidad en línea recta sin limitación de grado, ni en línea colateral hasta el cuarto grado, ni por afinidad, con el Agente Aduanal, ni con sus socios, accionistas, representantes legales o personal que intervenga directa o indirectamente en el despacho aduanero, por lo que manifiesta no encontrarse en ninguno de los supuestos de ' },
      { text: 'vinculación o conflicto de interés ', isBold: true },
      { text: 'previstos en la Ley Aduanera y demás disposiciones aplicables.' },
    ],
    [
      { text: 'b) ', isBold: true },
      { text: 'Mi mandante se obliga a proporcionar al Agente Aduanal ' },
      { text: 'información completa, veraz, exacta, lícita y comprobable, ', isBold: true },
      { text: 'incluyendo de manera enunciativa más no limitativa: facturas comerciales, contratos, órdenes de compra, documentos de transporte, comprobantes de pago, certificados de origen, permisos, avisos, padrones, registros, cumplimiento de ' },
      { text: 'NOM, ', isBold: true },
      { text: 'regulaciones y restricciones no arancelarias, así como cualquier otro documento exigido por la legislación fiscal y aduanera.' },
    ],
    [
      { text: 'c) ', isBold: true },
      { text: 'Mi mandante se obliga a notificar de manera inmediata y por escrito al Agente Aduanal cualquier ' },
      { text: 'cambio de domicilio fiscal, razón social, régimen fiscal, socios, accionistas, beneficiario controlador, ', isBold: true },
      { text: 'así como modificaciones en autorizaciones, registros o permisos emitidos por el ' },
      { text: 'SAT, la Agencia Nacional de Aduanas de México, la Secretaría de Economía ', isBold: true },
      { text: 'o cualquier otra autoridad competente, reconociendo que cualquier omisión será responsabilidad exclusiva de mi representada, eximiendo al Agente Aduanal de cualquier consecuencia fiscal o aduanera derivada.' },
    ],
    [
      { text: 'd) ', isBold: true },
      { text: 'Reconozco que la ' },
      { text: 'descripción de la mercancía, valor en aduana, origen, cantidad, naturaleza, uso y demás elementos declarados en el pedimento ', isBold: true },
      { text: 'derivan de la información proporcionada por mi representada, liberando expresamente al Agente Aduanal de cualquier responsabilidad por errores u omisiones derivadas de información incorrecta o incompleta.' },
    ],
    [
      { text: 'e) ', isBold: true },
      { text: 'Mi mandante se compromete a proporcionar oportunamente la ' },
      { text: 'Manifestación de Valor Electrónica ', isBold: true },
      { text: 'y sus anexos, reconociendo que la elaboración, firma, transmisión y veracidad de dicha manifestación es ' },
      { text: 'obligación exclusiva del importador, ', isBold: true },
      { text: 'deslindando al Agente Aduanal de cualquier contingencia derivada de su contenido.' },
    ],
    [
      { text: 'f) ', isBold: true },
      { text: 'Manifiesto que es responsabilidad exclusiva de mi representada el cumplimiento de las ' },
      { text: 'regulaciones y restricciones no arancelarias, ', isBold: true },
      { text: 'incluyendo Normas Oficiales Mexicanas, permisos, avisos, certificaciones, dictámenes, autorizaciones o resoluciones emitidas por autoridades competentes, obligándome a entregar la documentación soporte correspondiente y liberando al Agente Aduanal de cualquier responsabilidad por incumplimiento.' },
    ],
    [
      { text: 'g) ', isBold: true },
      { text: 'Mi mandante declara bajo protesta de decir verdad que ' },
      { text: 'no se encuentra listado en los supuestos previstos en los artículos 69, 69-B y 69-B Bis del Código Fiscal de la Federación, ', isBold: true },
      { text: 'ni mantiene relación con contribuyentes incluidos en dichos listados, obligándose a mantener ' },
      { text: 'indemne ', isBold: true },
      { text: 'al Agente Aduanal frente a cualquier contingencia que derive del incumplimiento de esta declaración.' },
    ],
    [
      { text: 'h) ', isBold: true },
      { text: 'Declaro bajo protesta de decir verdad que mi representada cuenta con ' },
      { text: 'existencia real, infraestructura, capacidad operativa, personal, activos y materialidad suficiente, ', isBold: true },
      { text: 'y que ha identificado correctamente al ' },
      { text: 'beneficiario controlador, ', isBold: true },
      { text: 'conforme a la normativa vigente.' },
    ],
    [
      { text: 'i) ', isBold: true },
      { text: 'En consecuencia, cualquier contingencia relacionada con ' },
      { text: 'operaciones inexistentes, simuladas, carentes de materialidad o sin razón de negocios ', isBold: true },
      { text: 'será responsabilidad exclusiva de mi representada, deslindando totalmente al Agente Aduanal de cualquier responsabilidad administrativa, fiscal, aduanera, penal o de cualquier otra índole.' },
    ],
    [
      { text: 'j) ', isBold: true },
      { text: 'Reconozco que el Agente Aduanal actúa única y exclusivamente como ' },
      { text: 'auxiliar en el despacho aduanero, ', isBold: true },
      { text: 'conforme a la Ley Aduanera, limitando su actuación a la información proporcionada por mi mandante.' },
    ],
    [
      { text: 'k) ', isBold: true },
      { text: 'En consecuencia, el Agente Aduanal queda ' },
      { text: 'expresa y plenamente deslindado ', isBold: true },
      { text: 'de cualquier responsabilidad presente o futura que derive de la falsedad, inexactitud, omisión o insuficiencia de la información proporcionada.' },
    ],
    [
      { text: 'Mi mandante se obliga a informar de manera inmediata y por escrito cualquier modificación a las declaraciones anteriores.' },
    ],
    [
      { text: 'La ' },
      { text: 'descripción de la mercancía, ', isBold: true },
      { text: 'la documentación soporte y las instrucciones específicas para cada operación serán proporcionadas al Agente Aduanal ' },
      { text: 'de manera expresa y por escrito.', isBold: true },
    ],
    [
      { text: 'Sin más por el momento, firmo la presente para los efectos legales a que haya lugar.' },
    ],
  ]

  clauses.forEach((clause) => {
    if (doc.y > 680) {
      doc.addPage()
    }
    createStylizedParagraph(doc, clause, paragraphOptions)
    doc.moveDown(paragraphSpacing)
  })

  if (doc.y > 650) {
    doc.addPage()
  }

  doc
    .font('Helvetica')
    .fontSize(9.5)
    .text('Protesto lo necesario.')
    .moveDown(4.5)
    .text('______________________________', { align: 'center' })
    .font('Helvetica-Bold')
    .text(legalRepresentativeName, { align: 'center' })

  doc.end()
  return doc
}
