import createStylizedParagraph from '../../createStylizedParagraph.js'
import { drawPageNumber, getContentLeft, getContentWidth } from '../helpers/layout.js'

function writeRich(doc, fragments, options = {}) {
  createStylizedParagraph(doc, fragments, {
    fontSize: options.fontSize || 10.9,
    width: getContentWidth(doc),
    align: options.align || 'justify',
  })

  doc.moveDown(options.moveDown !== undefined ? options.moveDown : 0.72)
}

function writeBullet(doc, text, options = {}) {
  const left = getContentLeft(doc)
  const width = getContentWidth(doc)

  doc
    .font('Helvetica')
    .fontSize(options.fontSize || 10.9)
    .text('•', left + 22, doc.y, {
      width: 14,
      align: 'left',
      lineBreak: false,
    })
    .text(text, left + 46, doc.y - 1, {
      width: width - 46,
      align: 'justify',
    })
    .moveDown(0.4)
}

export default function renderPage14(doc, data = {}, options = {}) {
  writeRich(doc, [
    { text: 'Procedencia Ilícita, así como del Anexo 3 y Anexo 4 de las Reglas de Carácter General a que se refiere la Ley Federal para la Prevención e Identificación de Operaciones con Recursos de Procedencia Ilícita, entendiéndose por esto como operaciones vulnerables:' },
  ])

  writeRich(doc, [
    { text: 'Para el cumplimiento de las obligaciones señaladas en la presente cláusula ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' deberá hacer llegar la documentación siguiente:' },
  ], { moveDown: 0.55 })

  writeBullet(doc, 'Copia certificada Acta constitutiva, así como las modificaciones de la empresa que requiere los servicios de la Agencia.')
  writeBullet(doc, 'Copia certificada del Poder Notarial del Representante Legal')
  writeBullet(doc, 'Copia de la identificación de los socios de la empresa que encomienda el servicio.')
  writeBullet(doc, 'Copia de la clave única del Registro de Población.')
  writeBullet(doc, 'Copia de la Cedula de Identificación Fiscal.')
  writeBullet(doc, 'Copia del Comprobante de domicilio de donde se encuentre el principal asentamiento de su negocio.')
  writeBullet(doc, 'Opinión de cumplimiento favorable por parte del Servicio de Administración Tributaria.')

  doc.moveDown(0.35)

  writeRich(doc, [
    { text: 'En caso de que hubiere un cambio de composición accionaria en la empresa que solicitó el servicio, ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' deberá de forma inmediata dar aviso por escrito a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' y hacer llegar la documentación que soporte tales cambios, para efecto de que de ser el caso se generen los avisos al Servicio de Administración Tributaria. En caso de no cumplir con tal circunstancia ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' asume cualquier responsabilidad que pudiese general el incumplimiento de los avisos en caso de que hubiese cambio de beneficiario controlador.' },
  ])

  writeRich(doc, [
    { text: 'Que la información proporcionada con el fin de identificar al beneficiario controlador podrá suministrarse a las autoridades fiscales extranjeras, previa solicitud y al amparo de un tratado internacional en vigor del que México sea parte, que contenga disposiciones de intercambio recíproco de información, en términos del artículo 69, sexto párrafo del Código Fiscal de la Federación.' },
  ])

  writeRich(doc, [
    { text: '4.12.- ', isBold: true },
    { text: 'A informar a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' la designación de una persona con facultades específicas, para que en nombre de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', proporcione y requiera la documentación e información mencionada en cláusulas anteriores. Así mismo se compromete a mantener' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 14)
}
