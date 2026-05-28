import PDFDocument from 'pdfkit'
import createStylizedParagraph from './createStylizedParagraph.js'

export function generarCartaDeEncomienda() {
  const doc = new PDFDocument({ size: 'LETTER', margin: 72 })
  const AUTOCOMP = '(autocompletado)'

  const paragraphOptions = {
    fontSize: 10,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    align: 'justify'
  }


  // Title
  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .text('CARTA DE ENCOMIENDA', { align: 'center' })
    .moveDown(0.8)


  // HEADER - Right aligned date
  doc
    .font('Helvetica')
    .fontSize(10.5)
    .text('CIUDAD', { align: 'right' })
    .text('ESTADO', { align: 'right' })
    .text('PAÍS', { align: 'right' })
    .text('FECHA', { align: 'right' })
    .moveDown(0.8)


  // Agent info
  doc
    .font('Helvetica')
    .fontSize(10)
    .text('A.A. Luis Fernando Viñals Ortiz De La Peña', { align: 'left' })
    .text('VIO00A67AD6L590529PQA', { align: 'left' })
    .text('Patente Aduanal número 3448', { align: 'left' })
    .text('Presente.', { align: 'left' })
    .moveDown(0.8)

  // First paragraph - Representante Legal
  doc
    .font('Helvetica')
    .fontSize(9.5)
    .text(
      `En mi carácter de Representante Legal de la empresa ${AUTOCOMP}, con domicilio fiscal en ${AUTOCOMP}, número exterior ${AUTOCOMP}, número interior ${AUTOCOMP}, colonia ${AUTOCOMP}, municipio ${AUTOCOMP}, localidad ${AUTOCOMP}, entidad federativa ${AUTOCOMP}, México, Código Postal ${AUTOCOMP}, con Registro Federal de Contribuyentes ${AUTOCOMP}, personalidad que acredito conforme al Poder Notarial número ${AUTOCOMP}, volumen ${AUTOCOMP}, otorgado ante la fe del Notario Público número ${AUTOCOMP}, Lic. ${AUTOCOMP}, manifiesto lo siguiente:`,
      { align: 'justify' }
    )
    .moveDown(0.8)

  // Second paragraph - Legal compliance
  const paragraph1 = [
    { text: 'A través de este medio y con fundamento en lo dispuesto por ' },
    { text: 'los artículos 10, 18, 19, 102, 103, y 105 fracciones XII y XIII del Código Fiscal de la Federación y en cumplimiento a los artículos 35, 36, 36-A, 37, 37-A, 40, 41, 43, 54, 59 fracción III, 66, 67,  68,  78-A,  78-C, 151,  162  IV,  162  VI,  162  VII  y   164  II de   la Ley Aduanera vigente, y artículos 52, 55, 58 y 65, 83, 91, 93, y 97 del Reglamento de la Ley Aduanera vigente,', isBold: true },
    { text: ' le hago formal ' },
    { text: 'ENCOMIENDA', isBold: true },
    { text: ' para que lleve a cabo en favor de mi mandante el despacho aduanero de sus mercancías en cualquiera de sus regímenes. ' },
  ]
  createStylizedParagraph(doc, paragraph1, paragraphOptions)
  doc.moveDown(0.8)

  // Support patent section
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('Patente de Soporte', { align: 'center' })
    .fontSize(9.5)
    .text('A.A. Sergio Alberto Lujan Ciprés', { align: 'center' })
    .text('Patente 3287', { align: 'center' })
    .moveDown(0.8)

  // Paragraph about appointment
  const paragraph2 = [
    { text: 'En ese sentido, y gozando de las facultades que tengo conferidas, le manifiesto que es voluntad de mi Representada(o), nombrarlo(a) a Usted ' },
    { text: ' LUIS FERNANDO VIÑALS ORTIZ DE LA PEÑA ', isBold: true, isUnderlined: true },
    { text: 'con RFC VIOL590529PQA como mi Agente Aduanal, por la aduana de Nuevo Laredo Tamaulipas, y por todas las que tenga autorizadas ante la Secretaría y que se encuentran amparadas con la Patente Aduanal Número 3448 ' },
    { text: '3448 ', isBold: true, isUnderlined: true },

  ]
  createStylizedParagraph(doc, paragraph2, paragraphOptions)
  doc.moveDown(0.8)

  doc
    .font('Helvetica')
    .fontSize(9.5)
    .text(
      `Esta Carta de Encomienda permanecerá vigente hasta el 31 de Diciembre del año en curso, por lo que en este momento y conforme a la representación legal que detento, le faculto a Usted, así como a las empresas que tenga constituidas para la prestación de sus servicios, para que lleve a cabo todos los trámites y gestiones aduanero-jurídicos que sean necesarios ante la autoridad aduanera o cualquiera otra que competa, así como ante particulares que deban intervenir en el despacho de mis mercancías.`,
      { align: 'justify' }
    )
    .moveDown(0.8)

  // Responsibility section
  doc
    .font('Helvetica')
    .fontSize(9.5)
    .text(
      `Reconozco y acepto expresamente que, conforme a la legislación aduanera vigente y sus reformas, la responsabilidad sobre la veracidad, exactitud, integridad y legalidad de la información y documentación proporcionada corresponde exclusivamente a mi mandante en su calidad de importador, por lo que:`,
      { align: 'justify' }
    )
    .moveDown(0.6)

  // Add new page if needed
  if (doc.y > 700) {
    doc.addPage()
  }

  // Clauses a-l
  const clauses = [
    {
      letter: 'a)',
      text: `Bajo protesta de decir verdad, mi mandante declara que no existe relación de parentesco por consanguinidad en línea recta sin limitación de grado, ni en línea colateral hasta el cuarto grado, ni por afinidad, con el Agente Aduanal, ni con sus socios, accionistas, representantes legales o personal que intervenga directa o indirectamente en el despacho aduanero, por lo que manifiesta no encontrarse en ninguno de los supuestos de vinculación o conflicto de interés previstos en la Ley Aduanera y demás disposiciones aplicables.`,
    },
    {
      letter: 'b)',
      text: `Mi mandante se obliga a proporcionar al Agente Aduanal información completa, veraz, exacta, lícita y comprobable, incluyendo facturas comerciales, contratos, órdenes de compra, documentos de transporte, comprobantes de pago, certificados de origen, permisos, avisos, padrones, registros, cumplimiento de Normas Oficiales Mexicanas, regulaciones y restricciones no arancelarias.`,
    },
    {
      letter: 'c)',
      text: `Mi mandante se obliga a notificar de manera inmediata y por escrito al Agente Aduanal cualquier cambio de domicilio fiscal, razón social, régimen fiscal, socios, accionistas, beneficiario controlador, así como modificaciones en autorizaciones, registros o permisos.`,
    },
    {
      letter: 'd)',
      text: `Reconozco que la descripción de la mercancía, valor en aduana, origen, cantidad, naturaleza, uso y demás elementos declarados en el pedimento derivan de la información proporcionada por mi representada, liberando expresamente al Agente Aduanal de cualquier responsabilidad por errores u omisiones.`,
    },
    {
      letter: 'e)',
      text: `Le solicitamos y facultamos para que realice la transmisión electrónica de la información de la factura a través de la Ventanilla Única de Comercio Exterior Mexicano (VUCEM).`,
    },
    {
      letter: 'f)',
      text: `Autorizo que pueda realizar el envío de documentos que acrediten el cumplimiento de regulaciones, NOMs y demás obligaciones, para lo cual extenderé el Sello Digital correspondiente. Acepto que utilice la Firma Electrónica Avanzada del Agente Aduanal.`,
    },
    {
      letter: 'g)',
      text: `Mi mandante declara bajo protesta de decir verdad que no se encuentra listado en supuestos previstos en artículos 69, 69-B y 69-B Bis del Código Fiscal de la Federación.`,
    },
    {
      letter: 'h)',
      text: `Declaro bajo protesta de decir verdad que mi representada cuenta con existencia real, infraestructura, capacidad operativa, personal, activos y materialidad suficiente, e identificado correctamente al beneficiario controlador.`,
    },
    {
      letter: 'i)',
      text: `Cualquier contingencia relacionada con operaciones inexistentes, simuladas, carentes de materialidad o sin razón de negocios será responsabilidad exclusiva de mi representada.`,
    },
    {
      letter: 'j)',
      text: `Reconozco que el Agente Aduanal actúa única y exclusivamente como auxiliar en el despacho aduanero conforme a la Ley Aduanera, limitando su actuación a la información proporcionada por mi mandante.`,
    },
    {
      letter: 'k)',
      text: `El Agente Aduanal queda expresa y plenamente deslindado de cualquier responsabilidad presente o futura que derive de la falsedad, inexactitud, omisión o insuficiencia de la información proporcionada.`,
    },
    {
      letter: 'l)',
      text: `El Agente Aduanal queda facultado para llevar a cabo la contratación y/o subcontratación de transportistas, maniobristas y sujetos que intervengan en el despacho aduanero, relevándolo de cualquier responsabilidad.`,
    },
  ]

  doc.font('Helvetica').fontSize(9)

  clauses.forEach((clause) => {
    if (doc.y > 700) {
      doc.addPage()
    }

    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(`${clause.letter}`, { continued: true })

    if (clause.letter != 'e)' && clause.letter != 'f)') doc.font('Helvetica')
    // else doc.font('Helvetica')

    doc.fontSize(9)
      .text(` ${clause.text}`, { align: 'justify' })
      .moveDown(0.4)
  })

  if (doc.y > 700) {
    doc.addPage()
  }

  // Final paragraphs
  doc
    .font('Helvetica')
    .fontSize(9)
    .text(
      'Mi mandante se obliga a informar de manera inmediata y por escrito cualquier modificación a las declaraciones anteriores.',
      { align: 'justify' }
    )
    .moveDown(0.4)
    .text(
      'La descripción de la mercancía, la documentación soporte y las instrucciones específicas para cada operación serán proporcionadas al Agente Aduanal de manera expresa y por escrito.',
      { align: 'justify' }
    )
    .moveDown(0.4)
    .text('Sin más por el momento, firmo la presente para los efectos legales a que haya lugar.', {
      align: 'justify',
    })
    .moveDown(0.3)
    .text('Protesto lo necesario.', { align: 'justify' })
    .moveDown(1.2)

  // Signature block
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .text('Atentamente', { align: 'center' })
    .moveDown(2)

  // Signature lines
  doc
    .font('Helvetica')
    .fontSize(10)
    .text('(NOMBRE DEL REPRESENTANTE LEGAL)', { align: 'center' })
    .moveDown(0.3)

  doc
    .text('(RFC DEL REPRESENTANTE LEGAL)', { align: 'center' })
    .moveDown(0.3)

  doc
    .text('(REPRESENTANTE LEGAL DE LA EMPRESA)', { align: 'center' })
    .moveDown(0.3)
    .text('(NOMBRE DE LA EMPRESA)', { align: 'center' })
    .moveDown(0.3)
    .text('(RFC DE LA EMPRESA)', { align: 'center' })

  doc.end()
  return doc
}
