import { drawPageNumber } from '../helpers/layout.js'
import { writeLabel, writeParagraph } from '../helpers/writers.js'
import createStylizedParagraph from '../../createStylizedParagraph.js'

function writeRichParagraph(doc, fragmentos, opciones = {}) {
  const paragraphOptions = {
    fontSize: 10.9,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    align: 'justify',
    ...opciones,
  }

  createStylizedParagraph(doc, fragmentos, paragraphOptions)
  doc.moveDown(0.75)
}

function safeText(value, fallback) {
  if (value === undefined || value === null) return fallback
  const text = String(value).trim()
  return text.length > 0 ? text : fallback
}

function formatDateToSpanishText(value, fallback) {
  if (!value) return fallback

  const parsedDate = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return fallback
  }

  return parsedDate.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

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

  return fullName || company?.legalRepresentativeName || ''
}

export default function renderPage02(doc, data = {}, options = {}) {
  const company = data?.user?.company || {}
  const address = data?.user?.address || {}
  const publicDeed = company?.publicDeed || {}
  const deedNotary = publicDeed?.notary || {}

  const scripture = safeText(publicDeed?.number || company.scripture, '5,025')
  const volume = safeText(publicDeed?.volume || company.powerOfAttorneyVolume, '078')
  const constitutionDate = formatDateToSpanishText(publicDeed?.date || company.constitutionDate, '22 de junio de 2017')
  const notaryNumber = safeText(deedNotary?.number || company.notaryNumber, '95')
  const notaryCity = safeText(deedNotary?.city || company.notaryCity, 'Hermosillo')
  const notaryState = safeText(deedNotary?.state || company.notaryState, 'Sonora')
  const mercantileFolio = safeText(publicDeed?.publicRegistry?.mercantileFolio || company.mercantileFolio, 'N-2017053946')
  const mercantileDate = formatDateToSpanishText(publicDeed?.registrationDate || company.mercantileDate, '30 de junio de 2017')
  const legalRepresentativeName = safeText(getLegalRepresentativeFullName(company), 'YURI ADALBERTO GOMEZ UNGER')
  const legalEmail = safeText(company.email, 'ungerboner@icloud.com')

  const hasAddressData = [
    address.street,
    address.exteriorNumber,
    address.neighborhood,
    address.postalCode,
    address.zipCode,
    address.city,
    address.state,
    address.country,
  ].some((value) => value !== undefined && value !== null && String(value).trim().length > 0)

  const addressString = hasAddressData
    ? `${safeText(address.street, 'No llenado')} numero ${safeText(address.exteriorNumber, 'S/N')}, colonia ${safeText(address.neighborhood, 'No llenado')}, C.P. ${safeText(address.postalCode || address.zipCode, 'No llenado')}, ${safeText(address.city, 'No llenado')}, ${safeText(address.state, 'No llenado')}, ${safeText(address.country, 'México')}`
    : 'SIN DIRECCIÓN FISCAL REGISTRADA'

  writeLabel(doc, 'II.- DECLARA EL CLIENTE:', { fontSize: 11.8, moveDown: 0.8 })

  writeRichParagraph(doc, [
    { text: 'a) ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' manifiesta su interés de solicitar los servicios en materia de comercio exterior para importación y/o exportación de mercancías de ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: '.' },
  ])

  writeRichParagraph(doc, [
    { text: 'b) Que es una sociedad constituida de acuerdo con las leyes mexicanas, según consta en el testimonio de la escritura pública número ' },
    { text: `${scripture} Volumen ${volume}`, isBold: true },
    { text: ', de fecha ' },
    { text: constitutionDate, isBold: true },
    { text: ', pasada ante el fedatario público número ' },
    { text: notaryNumber, isBold: true },
    { text: ', de la Ciudad de ' },
    { text: `${notaryCity}, ${notaryState}, México`, isBold: true },
    { text: ', misma que quedó debidamente inscrita en el Registro Público de la Propiedad y Comercio con el folio mercantil número ' },
    { text: mercantileFolio, isBold: true },
    { text: ' de fecha ' },
    { text: mercantileDate, isBold: true },
    { text: '.' },
  ])

  writeRichParagraph(doc, [
    { text: 'c) Que, para los fines del presente contrato, ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' se encuentra representado por el C. ' },
    { text: legalRepresentativeName, isBold: true },
    { text: ', quien cuenta con facultades amplias, cumplidas y bastantes las cuales no le han sido limitadas ni revocadas a la firma del presente contrato. Asi mismo manifiesta que le han sido otorgadas las facultades que la Ley exige para otorgar y suscribir este contrato a nombre y representación de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', obligándola en los términos y condiciones del mismo, según consta en la Escritura Pública número ' },
    { text:  `${scripture} Volumen ${volume}`, isBold: true },
    { text: ', de fecha ' },
    { text: constitutionDate, isBold: true },
    { text: ', pasada ante el fedatario público número ' },
    { text: notaryNumber, isBold: true },
    { text: ', de la Ciudad de ' },
    { text: `${notaryCity}, ${notaryState}, México`, isBold: true },
    { text: '.' },
  ])
  writeRichParagraph(doc, [
    { text: 'd) Que, para efectos del presente contrato, y a fin de realizar cualquier tipo de notificación inherente al mismo señala el domicilio ubicado en: ' },
    { text: addressString, isBold: true },
    { text: '; o bien el correo electrónico siguiente: ' },
    { text: legalEmail, isBold: true },
  ])

  writeRichParagraph(doc, [
    { text: 'e) Que su objeto social se encuentra vinculado con el comercio exterior, según acta constitutiva que consta en la Escritura Pública número ' },
    { text: `${scripture} Volumen ${volume}`, isBold: true },
    { text: ', de fecha ' },
    { text: constitutionDate, isBold: true },
    { text: ', pasada ante el fedatario público número ' },
    { text: notaryNumber, isBold: true },
    { text: ', de la Ciudad de ' },
    { text: `${notaryCity}, ${notaryState}, México`, isBold: true },
    { text: '. Por lo que declara contar con los programas, permisos y autorizaciones que legalmente se requieren en las operaciones de comercio exterior, y que son exigibles por las autoridades aduaneras.' },
  ])

  writeParagraph(
    doc,
    'f) Que se su representada se encuentra al corriente en el cumplimiento de sus obligaciones fiscales e inscrita en el Registro Federal de Contribuyentes de conformidad a lo establecido por el Articulo 59 fracción IV de la Ley Aduanera.',
    { fontSize: 10.9 }
  )

  drawPageNumber(doc, options.pageNumber || 2)
}
