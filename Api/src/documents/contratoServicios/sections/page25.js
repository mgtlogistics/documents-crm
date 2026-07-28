import dayjs from 'dayjs'
import { drawPageNumber, getContentLeft, getContentWidth } from '../helpers/layout.js'
import { writeLabel, writeParagraph } from '../helpers/writers.js'

function drawSignatureLine(doc, x, y, width) {
  doc
    .save()
    .lineWidth(0.8)
    .strokeColor('#111111')
    .moveTo(x, y)
    .lineTo(x + width, y)
    .stroke()
    .restore()
}

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

export default function renderPage25(doc, data = {}, options = {}) {
  const left = getContentLeft(doc)
  const width = getContentWidth(doc)
  const company = data?.user?.company || {}
  const { city, state, country } = data?.user?.address || {}
  const now = dayjs()
  const currentDateText = now.toDate().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })


  writeLabel(doc, 'DÉCIMA NOVENA.  LEGISLACIÓN APLICABLE. JURISDICCIÓN', {
    fontSize: 11.8,
    moveDown: 0.55,
  })

  writeParagraph(
    doc,
    'Para la interpretación, cumplimiento y ejecución del presente Contrato, las partes se someten a la jurisdicción y competencia de los tribunales competentes de Nogales, Sonora, renunciando expresamente a cualquier otra jurisdicción que les pudiera corresponder por razón de sus domicilios presentes o futuros, o por cualquier otra causa.',
    {
      fontSize: 10.9,
      moveDown: 0.72,
    }
  )

  writeParagraph(
    doc,
    `Leído el presente Contrato y enteradas las partes del contenido, valor, alcance y fuerza legal de todas y cada una de las Declaraciones y Cláusulas contenidas en el Contrato, y toda vez que la manifestación de su voluntad contenida en el mismo no se vio influenciada por violencia, error, dolo o mala fe o por cualquier otro vicio que pudiera nulificarlo en todo o en parte, “EL CLIENTE” y “EL AGENTE ADUANAL” lo ratifican y firman de conformidad, por duplicado, en la Ciudad de ${city}, ${state}, ${country} a ${currentDateText}.`,
    {
      fontSize: 10.9,
      moveDown: 1.2,
    }
  )

  const colGap = 10
  const colWidth = (width - colGap) / 2
  const leftColX = left
  const rightColX = left + colWidth + colGap

  doc
    .font('Helvetica-Bold')
    .fontSize(10.7)
    .text('POR', leftColX, doc.y, { width: colWidth, align: 'left' })
    .text('POR', rightColX, doc.y - 13, { width: colWidth, align: 'left' })

  doc
    .font('Helvetica-Bold')
    .fontSize(10.7)
    .text(company.socialReason, leftColX + 8, doc.y + 2, { width: colWidth, align: 'left' })
    .text('EL AGENTE ADUANAL', rightColX, doc.y - 12, { width: colWidth, align: 'left' })

  const lineY = doc.y + 66
  drawSignatureLine(doc, leftColX + 6, lineY, colWidth - 16)
  drawSignatureLine(doc, rightColX, lineY, colWidth - 6)

  doc
    .font('Helvetica-Bold')
    .fontSize(10.8)
    .text(getLegalRepresentativeFullName(company), leftColX + 6, lineY + 10, {
      width: colWidth - 16,
      align: 'center',
    })

  doc
    .font('Helvetica-Bold')
    .fontSize(10.8)
    .text('A.A. CESAR AUGUSTO SAVIÑON RUELAS', rightColX, lineY + 10, {
      width: colWidth - 6,
      align: 'center',
    })

  doc
    .font('Helvetica-Bold')
    .fontSize(10.6)
    .text('Representante Legal', leftColX + 6, lineY + 29, {
      width: colWidth - 16,
      align: 'center',
    })

  drawPageNumber(doc, options.pageNumber || 25)
}
