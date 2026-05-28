import PDFDocument from 'pdfkit'
import createStylizedParagraph from './createStylizedParagraph.js'

export function generarCartaProtesta() {
  const doc = new PDFDocument({ size: 'LETTER', margin: 72 })
  const AUTOCOMP = '(autocompletado)'


  const paragraphOptions = {
    fontSize: 10,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    align: 'justify'
  }

  doc
    .font('Helvetica-Bold')
    .fontSize(13)
    .text('Carta bajo protesta de decir verdad – regla 3.1.42', { align: 'center' })
    .moveDown(0.3)

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('fracciones V, IX de las RGCE 2026', { align: 'center' })
    .moveDown(1)

  doc
    .font('Helvetica')
    .fontSize(9.5)
    .text(`[Lugar y fecha]: ${AUTOCOMP}`, { align: 'right' })
    .moveDown(1)

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('A quien corresponda', { align: 'left' })
  doc.text('Presente.', { align: 'left' }).moveDown(0.8)

  const manifestacionParrafos = [
    // Párrafo 1: Datos de presentación y fundamentación
    [
      { text: 'El que suscribe ' },
      { text: '[NOMBRE COMPLETO DEL USUARIO],', isBold: true },
      { text: ' en mi carácter de ' },
      { text: '[representante legal / persona física]', isBold: true },
      { text: ' de ' },
      { text: '[NOMBRE O RAZÓN SOCIAL DEL CLIENTE],', isBold: true },
      { text: ' con RFC ' },
      { text: '[RFC],', isBold: true },
      { text: ' y con domicilio fiscal en ' },
      { text: '[DOMICILIO FISCAL COMPLETO],', isBold: true },
      { text: ' acreditando mi personalidad mediante ' },
      { text: 'Poder Notarial', isBold: true },
      { text: ' otorgado mediante ' },
      { text: 'escritura publica número', isBold: true },
      { text: ' ' },
      { text: '(preguntar)', isUnderlined: true },
      { text: ', ' },
      { text: 'volumen', isBold: true },
      { text: ' ' },
      { text: '(preguntar)', isUnderlined: true },
      { text: ', de fecha ' },
      { text: '(preguntar)', isUnderlined: true },
      { text: ', pasada ante la fe del ' },
      { text: 'Notario Público número', isBold: true },
      { text: ' ' },
      { text: '(preguntar)', isUnderlined: true },
      { text: ', Lic. ' },
      { text: '(preguntar)', isUnderlined: true },
      { text: ', de la Ciudad de ' },
      { text: '(preguntar)', isUnderlined: true },
      { text: ', con fundamento en lo dispuesto por la ' },
      { text: 'regla la regla 3.1.42, fracciones V y IX de las Reglas Generales de Comercio Exterior, manifiesto bajo protesta de decir verdad en nombre de mi representada', isBold: true },
      { text: ' lo siguiente:' }
    ],

    // Párrafo 2: Objeto / Listados de trabajadores y CFDI
    [
      { text: 'Pongo a su disposición, así como de la Autoridad Fiscal y Aduanera los listados de los trabajadores que participaron en las operaciones de comercio exterior y los CFDI con complemento de nómina respectivos que amparen la fecha en la que se efectuaron las operaciones de mi representada, así como los documentos y registros que acreditan el método de control de inventarios utilizado por mi representada.' }
    ],

    // Párrafo 3: Vigencia de la manifestación
    [
      { text: 'La presente manifestación se realiza para los efectos legales y administrativos a que haya lugar, relacionada con las ' },
      { text: 'operaciones de comercio exterior solicitadas', isBold: true },
      { text: ' por el suscrito dentro del periodo del ' },
      { text: '01 de enero de 2026 al 31 de diciembre de 2026.', isBold: true }
    ],

    // Párrafo 4: Cierre del documento
    [
      { text: 'Sin otro particular, reitero que la información proporcionada es veraz y comprobable.' }
    ]
  ];

  manifestacionParrafos.forEach(parrafo => {
    if (doc.y > 700) {
      doc.addPage()
    }
    createStylizedParagraph(doc, parrafo, paragraphOptions);
    doc.moveDown(0.8); // Espaciado controlado entre cada inciso
  })

  doc.moveDown(2)

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('Atentamente,', { align: 'center' })

  doc
    .font('Helvetica')
    .fontSize(9.5)
    .text('(NOMBRE DE LA EMPRESA)', { align: 'center' })
    .moveDown(1.8)

  doc
    .text('_________________________________', { align: 'center' })
    .text('Nombre y firma', { align: 'center' })
    .text('Representante Legal', { align: 'center' })
    .text('RFC', { align: 'center' })

  doc.end()
  return doc
}
