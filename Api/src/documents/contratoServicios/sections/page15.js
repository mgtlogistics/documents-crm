import createStylizedParagraph from '../../createStylizedParagraph.js'
import { drawPageNumber, getContentWidth } from '../helpers/layout.js'

function writeRich(doc, fragments, options = {}) {
  createStylizedParagraph(doc, fragments, {
    fontSize: options.fontSize || 10.9,
    width: getContentWidth(doc),
    align: options.align || 'justify',
  })

  doc.moveDown(options.moveDown !== undefined ? options.moveDown : 0.72)
}

export default function renderPage15(doc, data = {}, options = {}) {
  writeRich(doc, [
    { text: 'las medidas de seguridad administrativas, técnicas y físicas que permitan proteger el uso, acceso o tratamiento no autorizado de los datos proporcionados. En caso de cambio de la persona designada ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' deberá dar aviso por escrito o vía electrónica a ' },
    { text: '“EL AGENTE ADUANAL”.', isBold: true },
  ])

  writeRich(doc, [
    { text: '4.13.- ', isBold: true },
    { text: '“EL CLIENTE”, se obliga a cerciorarse de la identidad del proveedor de las mercancías de las que se solicite su despacho, en cuanto a la existencia jurídica de la persona moral o física, capacidad de sus representantes para contratar, domicilio, corroborar que cuentan con los recursos humanos y materiales necesarios para producir los bienes enajenados, que se rijan en estricto apego a la ley, y contar con manifestación de la licitud de sus recursos económicos.' },
  ])

  writeRich(doc, [
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' se obliga a sacar en paz y a salvo a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' y al Agente Aduanal, frente a cualquier conflicto o controversia de carácter civil, penal, fiscal o administrativa, en relación con sus proveedores e inherente a su relación contractual, así como a la naturaleza y uso de las mercancías adquiridas.' },
  ])

  writeRich(doc, [
    { text: '4.14.- ', isBold: true },
    { text: '“EL CLIENTE” se obliga a contratar el servicio de transporte de las mercancías a despachar, comprometiéndose a sacar en paz y a salvo a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', frente a cualquier conflicto, controversia, o siniestro, ocurrido con la mercancía durante su transportación, así como con su proveedor de servicios de transporte.' },
  ])

  writeRich(doc, [
    { text: '4.15. ', isBold: true },
    { text: 'Tratándose de operaciones de comercio exterior mediante las cuales se importen al país mercancías que ostenten marcas registradas ante el Instituto Mexicano de la Propiedad Industrial, ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' tiene la obligación de hacer llegar a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' carta de autorización para comercializar, importar, transportar en territorio mexicano, distribuir la marca, la cual deberá estar signada por el titular exclusivo (o licenciatario autorizado) de las marcas registradas asociadas a los Productos.' },
  ])

  writeRich(doc, [
    { text: 'En el supuesto de que ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' no presente las cartas de autorización del dueño o titular de la marca a importar ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' podrá negar el servicio de la operación de comercio exterior sin ningún tipo de responsabilidad para ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', ya que la misma es considerada por la Ley como riesgosa, aludiendo al principio jurídico del deber de cuidado que se debe de tener en la operación de comercio exterior encomendada.' },
  ])

  writeRich(doc, [
    { text: 'Para el caso, de que ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' no cumpla con lo anterior y no le comunique a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' que la mercancía sujeta a despacho aduanero ostenta marcas registradas y en caso de verificación de las autoridades fiscalizadoras Agencia Nacional de Aduanas o de investigación Fiscalía General de la República el embarque es detenido y se inician facultades de comprobación, se aplica a la mercancía una suspensión de libre' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 15)
}
