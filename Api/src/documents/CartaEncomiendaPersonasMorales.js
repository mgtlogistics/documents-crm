import PDFDocument from 'pdfkit'
import dayjs from 'dayjs'
import createStylizedParagraph from './createStylizedParagraph.js'
import fs from "fs"
import { getFrontendImg } from '../utils/public.utils.js'

export function generarCartaEncomiendaPersonasMorales(data) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 72 })
  const AUTOCOMP = '(autocompletado)'

  const paragraphOptions = {
    fontSize: 10,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    align: 'justify'
  }

  const left = doc.page.margins.left
  if (data.user?.letterhead && fs.existsSync(getFrontendImg(data.user?.letterhead))) {
    doc.image(getFrontendImg(data.user?.letterhead), left, doc.page.margins.top - 30, { height: 25 })
  }

  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .text('CARTA ENCOMIENDA', { align: 'center' })
    .moveDown(0.6)

  // HEADER - Right aligned date
  doc
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .text(` ${data.city}, ${data.state}, ${data.country}  | ${dayjs().format('DD/MMMM/YYYY')}`, { align: 'right' })
    .moveDown(0.8)

  doc
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .text('L.A.E. CESAR AUGUSTO SAVIÑON RUELAS')
    .text('AGENTE ADUANAL PATENTE 1623')
    .text('ACCESO AL ITN No. 22, Int.')
    .text('COLONIA UNIDAD DEPORTIVA, C.P. 84063')
    .text('NOGALES, SONORA.')

  doc.font('Helvetica').fontSize(10).text('Presente.').moveDown(0.8)

  const encomiendaParagraph1 = [
    { text: 'En mi carácter de ' },
    { text: 'Representante Legal', isBold: true },
    { text: ' de la empresa ' },
    { text: data.user.company.socialReason || 'No llenado', isUnderlined: true },
    { text: ', con domicilio fiscal en ' },
    { text: data.user.address.street || 'No llenado', isUnderlined: true },
    { text: ', número exterior ' },
    { text: data.user.address.exteriorNumber || 'No llenado', isUnderlined: true },
    { text: ', número interior ' },
    { text: data.user.address.interiorNumber || 'No llenado', isUnderlined: true },
    { text: ', colonia ' },
    { text: data.user.address.neighborhood || 'No llenado', isUnderlined: true },
    { text: ', municipio ' },
    { text: data.user.address.city || 'No llenado', isUnderlined: true },
    { text: ', localidad ' },
    { text: data.user.address.locality || 'No llenado', isUnderlined: true },
    { text: ', entidad federativa ' },
    { text: data.user.address.state || 'No llenado', isUnderlined: true },
    { text: ', México, Código Postal ' },
    { text: data.user.address.postalCode || 'No llenado', isUnderlined: true },
    { text: ', con Registro Federal de Contribuyentes ' },
    { text: data.user.company.rfc || 'No llenado', isUnderlined: true },
    { text: ', personalidad que acredito conforme al ' },
    { text: 'Poder Notarial número', isBold: true },
    { text: ' ' },
    { text: data.user.company.powerOfAttorneyNumber || 'No llenado', isUnderlined: true },
    { text: ', ' },
    { text: 'volumen', isBold: true },
    { text: ' ' },
    { text: data.user.company.powerOfAttorneyVolume || 'No llenado', isUnderlined: true },
    { text: ', de fecha ' },
    { text: dayjs(data.user.company.powerOfAttorneyDate).format('DD/MM/YYYY') || 'No llenado', isUnderlined: true },
    { text: ', otorgado ante la fe del ' },
    { text: 'Notario Público número', isBold: true },
    { text: ' ' },
    { text: data.user.company.notaryNumber || 'No llenado', isUnderlined: true },
    { text: ', Lic. ' },
    { text: data.user.company.notaryName || 'No llenado', isUnderlined: true },
    { text: ', de la Ciudad de ' },
    { text: `${data.user.company.notaryCity || 'No llenado'}, ${data.user.company.notaryState || 'No llenado'}`, isUnderlined: true },
    { text: ', manifiesto lo siguiente:' }
  ];

  createStylizedParagraph(doc, encomiendaParagraph1, paragraphOptions)
  doc.moveDown(0.8)

  const encomiendaParagraph2 = [
    { text: 'En términos de los Artículos 40, 59, fracción III, segundo párrafo y 81 de la Ley Aduanera vigente, en relación con el artículo 81 del Reglamento de la Ley Aduanera en vigor, procedo encomendar y conferir el encargo a su favor, en su carácter de ' },
    { text: 'titular de la Patente Aduanal número 1623,', isBold: true },
    { text: ' para que a nombre y por cuenta exclusiva de mi representada, realice el ' },
    { text: 'despacho aduanero', isBold: true },
    { text: ' de las mercancías de ' },
    { text: 'importación y/o exportación', isBold: true },
    { text: ' que se efectúen por las aduanas de ' },
    { text: 'Nogales, Agua Prieta, Naco y Guaymas,', isBold: true },
    { text: ' en el entendido que este mandato estará vigente a partir del ' },
    { text: '01 de enero de 2026 al 31 de diciembre de 2026.', isBold: true }
  ];
  createStylizedParagraph(doc, encomiendaParagraph2, paragraphOptions)
  doc.moveDown(0.8)

  const encomiendaParagraph3 = [
    { text: 'Reconozco y acepto expresamente que, conforme a la legislación aduanera vigente y sus reformas, la ' },
    { text: 'responsabilidad sobre la veracidad, exactitud, integridad y legalidad', isBold: true },
    { text: ' de la información y documentación proporcionada corresponde ' },
    { text: 'exclusivamente a mi mandante en su calidad de importador,', isBold: true },
    { text: ' por lo que:' }
  ];
  createStylizedParagraph(doc, encomiendaParagraph3, paragraphOptions)
  doc.moveDown(0.8)

  const encomiendaIncisos = [
    // Inciso a)
    [
      { text: 'a)', isBold: true },
      { text: ' Bajo protesta de decir verdad, mi mandante declara que ' },
      { text: 'no existe relación de parentesco', isBold: true },
      { text: ' por consanguinidad en línea recta sin limitación de grado, ni en línea colateral hasta el cuarto grado, ni por afinidad, con el Agente Aduanal, ni con sus socios, accionistas, representantes legales o personal que intervenga directa o indirectamente en el despacho aduanero, por lo que manifiesta no encontrarse en ninguno de los supuestos de ' },
      { text: 'vinculación o conflicto de interés', isBold: true },
      { text: ' previstos en la Ley Aduanera y demás disposiciones aplicables.' },

    ],
    // Inciso b)
    [
      { text: 'b) ', isBold: true },
      { text: 'Mi mandante se obliga a proporcionar al Agente Aduanal ' },
      { text: 'información completa, veraz, exacta, lícita y comprobable,', isBold: true },
      { text: ' incluyendo de manera enunciativa más no limitativa: facturas comerciales, contratos, órdenes de compra, documentos de transporte, comprobantes de pago, certificados de origen, permisos, avisos, padrones, registros, cumplimiento de NOM, regulaciones y restricciones no arancelarias, así como cualquier otro documento exigido por la legislación fiscal y aduanera.' }
    ],

    // Inciso c)
    [
      { text: 'c) ', isBold: true },
      { text: 'Mi mandante se obliga a notificar de manera inmediata y por escrito al Agente Aduanal cualquier ' },
      { text: 'cambio de domicilio fiscal, razón social, régimen fiscal, socios, accionistas, beneficiario controlador,', isBold: true },
      { text: ' así como modificaciones en autorizaciones, registros o permisos emitidos por el ' },
      { text: 'SAT, la Agencia Nacional de Aduanas de México, la Secretaría de Economía', isBold: true },
      { text: ' o cualquier otra autoridad competente, reconociendo que cualquier omisión será responsabilidad exclusiva de mi representada, eximiendo al Agente Aduanal de cualquier consecuencia fiscal o aduanera derivada.' }
    ],

    // Inciso d)
    [
      { text: 'd) ', isBold: true },
      { text: 'Reconozco que la ' },
      { text: 'descripción de la mercancía, valor en aduana, origen, cantidad, naturaleza, uso y demás elementos declarados en el pedimento', isBold: true },
      { text: ' derivan de la información proporcionada por mi representada, liberando expresamente al Agente Aduanal de cualquier responsabilidad por errores u omisiones derivadas de información incorrecta o incompleta.' }
    ],

    // Inciso e)
    [
      { text: 'e) ', isBold: true },
      { text: 'Mi mandante se compromete a proporcionar oportunamente la ' },
      { text: 'Manifestación de Valor Electrónica', isBold: true },
      { text: ' y sus anexos, reconociendo que la elaboración, firma, transmisión y veracidad de dicha manifestación es ' },
      { text: 'obligación exclusiva del importador,', isBold: true },
      { text: ' deslindando al Agente Aduanal de cualquier contingencia derivada de su contenido.' }
    ],

    // Inciso f)
    [
      { text: 'f) ', isBold: true },
      { text: 'Manifiesto que es responsabilidad exclusiva de mi representada el cumplimiento de las ' },
      { text: 'regulaciones y restricciones no arancelarias,', isBold: true },
      { text: ' incluyendo Normas Oficiales Mexicanas, permisos, avisos, certificaciones, dictámenes, autorizaciones o resoluciones emitidas por autoridades competentes, obligándome a entregar la documentación soporte correspondiente y liberando al Agente Aduanal de cualquier responsabilidad por incumplimiento.' }
    ],

    // Inciso g)
    [
      { text: 'g) ', isBold: true },
      { text: 'Mi mandante declara bajo protesta de decir verdad que ' },
      { text: 'no se encuentra listado', isBold: true },
      { text: ' en los supuestos previstos en los artículos ' },
      { text: '49 Bis fracción X, 69 con excepción de la fracción IV, 69-B cuarto párrafo y 69-B Bis noveno párrafo del Código Fiscal de la Federación vigente,', isBold: true },
      { text: ' ni mantiene relación con contribuyentes incluidos en dichos listados, obligándose a mantener ' },
      { text: 'indemne', isBold: true },
      { text: ' al Agente Aduanal frente a cualquier contingencia que derive del incumplimiento de esta declaración.' }
    ],

    // Inciso h)
    [
      { text: 'h) ', isBold: true },
      { text: 'Declaro bajo protesta de decir verdad que mi representada cuenta con ' },
      { text: 'existencia real, infraestructura, capacidad operativa, personal, activos y materialidad suficiente,', isBold: true },
      { text: ' y que ha identificado correctamente al ' },
      { text: 'beneficiario controlador,', isBold: true },
      { text: ' conforme a la normativa vigente.' }
    ],
    [
      { text: 'i) ', isBold: true },
      { text: 'En consecuencia, cualquier contingencia relacionada con ' },
      { text: 'operaciones inexistentes, simuladas, carentes de materialidad o sin razón de negocios', isBold: true },
      { text: ' será responsabilidad exclusiva de mi representada, deslindando totalmente al Agente Aduanal de cualquier responsabilidad administrativa, fiscal, aduanera, penal o de cualquier otra índole.' }
    ],

    // Inciso j)
    [
      { text: 'j) ', isBold: true },
      { text: 'Reconozco que el Agente Aduanal actúa única y exclusivamente como ' },
      { text: 'auxiliar en el despacho aduanero,', isBold: true },
      { text: ' conforme a la Ley Aduanera, limitando su actuación a la información proporcionada por mi mandante.' }
    ],

    // Inciso k)
    [
      { text: 'k) ', isBold: true },
      { text: 'En consecuencia, el Agente Aduanal queda ' },
      { text: 'expresa y plenamente deslindado', isBold: true },
      { text: ' de cualquier responsabilidad presente o futura que derive de la falsedad, inexactitud, omisión o insuficiencia de la información proporcionada.' }
    ],

    // Párrafo de notificación
    [
      { text: 'Mi mandante se obliga a informar de manera inmediata y por escrito cualquier modificación a las declaraciones anteriores.' }
    ],

    // Párrafo de descripción de mercancía
    [
      { text: 'La ' },
      { text: 'descripción de la mercancía,', isBold: true },
      { text: ' la documentación soporte y las instrucciones específicas para cada operación serán proporcionadas al Agente Aduanal ' },
      { text: 'de manera expresa y por escrito.', isBold: true }
    ],

    // Párrafo de cierre
    [
      { text: 'Sin más por el momento, firmo la presente para los efectos legales a que haya lugar.' }
    ]
  ];

  encomiendaIncisos.forEach((inciso) => {
    if (doc.y > 700) {
      doc.addPage()
    }
    createStylizedParagraph(doc, inciso, paragraphOptions);
    doc.moveDown(0.8); // Espaciado controlado entre cada inciso
  });

  doc.moveDown(2)


  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('A T E N T A M E N T E.', { align: 'center' })

  doc.font('Helvetica')
    .text(data.user.company.socialReason, { align: 'center' })
    .moveDown(2)

  doc
    .font('Helvetica')
    .text(data.user.company.legalRepresentativeName, { align: 'center' })

  doc.end()
  return doc
}
