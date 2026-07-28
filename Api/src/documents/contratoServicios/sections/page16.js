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

export default function renderPage16(doc, data = {}, options = {}) {
  writeRich(doc, [
    { text: 'circulación por parte del Instituto Mexicano de la Propiedad Industrial o bien se inicia una carpeta de Investigación por parte de la Fiscalía General de la República, ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' asume tal responsabilidad, comprometiéndose a sacar en paz y a salvo ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', frente a cualquier conflicto, de naturaleza penal, civil, administrativa, fiscal y en general cualquier sanción que se pretenda imponer a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' como consecuencia de la omisión de presentar la carta de autorización del titular de los derechos marcarios.' },
  ])

  writeRich(doc, [
    { text: '4.16. ', isBold: true },
    { text: 'En caso de que, en un embarque encomendado por ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', ya sea a la importación o exportación, posterior a la revisión física y documental por las autoridades aduaneras o bien de investigación en materia de delitos, encuentren que el referido embarque en forma oculta mercancías de las denominadas prohibidas e ilícitas tales como: drogas, armas, pornografía infantil, productos falsificados, ciertos animales/plantas, ropa usada, sin que se pueda comprobar con la documentación atinente la legal importación o exportación de tales productos, ante tal supuesto ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' asume la responsabilidad ante cualquier conflicto, de naturaleza penal, civil, administrativa, fiscal y en general cualquier sanción que se pretenda imponer a ' },
    { text: '“El AGENTE ADUANAL”', isBold: true },
    { text: ', por el hallazgo de sustancias prohibidas encontradas por las autoridades competentes comprometiéndose a sacar en paz y a salvo a “EL AGENTE ADUANAL”.' },
  ])

  writeRich(doc, [
    { text: '4.17. ', isBold: true },
    { text: '“EL CLIENTE” es consciente y reconoce, en el caso de operaciones de comercio exterior en la cual se someterá a despacho aduanero ' },
    { text: 'mercancía de difícil identificación', isBold: true },
    { text: ', tal es el caso, por citar algunos ejemplos agroquímicos, polvos, tela, aceros, hilo-hilado, líquidos, gases, u otras características, que por su composición requiera la práctica de análisis químicos, técnicos o de laboratorio para determinar su composición, naturaleza, origen, usos para efecto de que ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' realice una correcta clasificación arancelaria, será su exclusiva responsabilidad proporcionar a la ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' con la antelación suficiente, toda la información técnica, fichas técnicas, factura comercial, certificados de origen, composición porcentual, análisis químico y cualquier otro documento o dato necesario para la correcta identificación y clasificación de dichas mercancías.' },
  ])

  writeRich(doc, [
    { text: 'En caso de que se torne necesario la práctica de análisis de laboratorio a la mercancía que se pretenda importar o exportar como consecuencia que su difícil identificación ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' queda facultado para solicitar a los laboratorios correspondientes oficiales tales análisis, quedando obligado ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' a sufragar los costos asociados, la realización de análisis de laboratorio en comento.' },
  ])

  writeRich(doc, [
    { text: 'Tales análisis pueden ser practicados por virtud de que así lo requiera la autoridad aduanera o bien ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' lo considere indispensable para el correcto despacho aduanero de la mercancía.' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 16)
}
