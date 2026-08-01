import PDFDocument from 'pdfkit'
import createStylizedParagraph from './createStylizedParagraph.js'
import dayjs from 'dayjs'
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

export function generarCartaProtesta(data) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 72 })
  const AUTOCOMP = '(autocompletado)'
  const company = data?.user?.company || {}
  const legalRepresentativeName = getLegalRepresentativeFullName(company)
  const powerOfAttorney = company?.powerOfAttorney || {}
  const powerNotary = powerOfAttorney?.notary || {}
  const publicDeed = company?.publicDeed || {}
  const deedNumber = publicDeed?.number || company?.scripture || 'No llenado'
  const deedVolume = publicDeed?.volume || company?.powerOfAttorneyVolume || 'No llenado'
  const powerNumber = powerOfAttorney?.number || company?.powerOfAttorneyNumber || 'No llenado'
  const powerDate = powerOfAttorney?.date || company?.powerOfAttorneyDate
  const notaryNumber = powerNotary?.number || company?.notaryNumber || 'No llenado'
  const notaryName = powerNotary?.name || company?.notaryName || 'No llenado'
  const notaryCity = powerNotary?.city || company?.notaryCity || 'No llenado'
  const notaryState = powerNotary?.state || company?.notaryState || 'No llenado'

    const powerDateFormatted = powerDate.toDate().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })


  const paragraphOptions = {
    fontSize: 10,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    align: 'justify'
  }



  doc
    .font('Helvetica-Bold')
    .fontSize(13)
    .text('Carta bajo protesta de decir verdad - regla 3.1.42', { align: 'center' })
    .moveDown(0.3)

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('fracciones V, IX de las RGCE 2026', { align: 'center' })
    .moveDown(1)


  drawLetterhead(doc, data)
  drawPlaceOfIssuance(doc, data, { preserveCursor: true })
  
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('A quien corresponda', { align: 'left' })
  doc.text('Presente.', { align: 'left' }).moveDown(0.8)

  const address = data?.user?.address || {}
  const domicilioFiscal = `${address.street || ''} ${address.exteriorNumber || ''} ${address.interiorNumber || ''} ${address.neighborhood || ''} ${address.city || ''} ${address.state || ''} ${address.country || ''} ${address.zipCode || ''}, C.P. ${address.postalCode || ''}`


  const manifestacionParrafos = [
    // Párrafo 1: Datos de presentación y fundamentación
    [
      { text: 'El que suscribe ' },
      { text: legalRepresentativeName, isBold: true },
      { text: ', en mi carácter de ' },
      { text: 'representante legal', isBold: true },
      { text: ' de ' },
      { text: data.user.company.socialReason, isBold: true },
      { text: ', con ' },
      { text: `RFC ${data.user.company.rfc}`, isBold: true },
      { text: ', y con domicilio fiscal en ' },
      { text: domicilioFiscal, isBold: true },
      { text: ', acreditando mi personalidad mediante ' },
      { text: `Poder Notarial ${powerNumber}`, isBold: true },
      { text: ' otorgado mediante ' },
      { text: `escritura pública número ${deedNumber}, volumen ${deedVolume}, `, isBold: true },
      { text: ` de fecha ${powerDateFormatted}, pasada ante la fe del `, isBold: true },
      { text: `Notario Público número ${notaryNumber},`, isBold: true },
      { text: ` Lic. ${notaryName}, de la Ciudad de ${notaryCity}, ${notaryState}, con fundamento en lo dispuesto por la ` },
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
      { text: ' operaciones de comercio exterior solicitadas ', isBold: true },
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
    .text(data?.user?.company?.socialReason || '', { align: 'center' })
    .moveDown(1.8)

  doc
    .text('_________________________________', { align: 'center' })
    .text('Nombre y firma', { align: 'center' })
    .text(legalRepresentativeName, { align: 'center' })
    .text(data.user.company.rfc, { align: 'center' })

  doc.end()
  return doc
}
