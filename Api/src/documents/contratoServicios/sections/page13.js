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

export default function renderPage13(doc, data = {}, options = {}) {
  writeRich(doc, [
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' asume la responsabilidad de mantener vigentes las autorizaciones y programas a los cuáles se hace referencia en este numeral, en caso, de no encontrarse vigentes los documentos antes señalados ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' podrá negar el servicio a ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', sin ninguna responsabilidad para ' },
    { text: '“EL AGENTE ADUANAL”.', isBold: true },
  ])

  writeRich(doc, [
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' tiene la obligación de notificar a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' dentro de las 24 horas siguientes por escrito o vía electrónica, una vez tenga conocimiento de la perdida, suspensión o cancelación cuando cuente con Programa de Maquila o programas de exportación autorizados por la Secretaría de Economía o Registro en el Esquema de Certificación de Empresas, en la Modalidad que este certificado.' },
  ])

  writeRich(doc, [
    { text: '4.10.- ', isBold: true },
    { text: 'A proporcionar la documentación inherente a la legal identificación de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', documentos que de manera enunciativa más no limitativa deberán consistir en: acta constitutiva de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: '; escrituras públicas donde conste cualquier cambio en la integración societaria de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: '; escrituras públicas donde conste la representación legal de la o las personas que firmen el presente contrato a nombre de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', así como cualquier otro documento donde se manifieste la voluntad de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: '; copia de la identificación oficial vigente del representante o apoderado legal de la empresa que actúa en representación de ésta; documentación relativa a la inscripción al Registro Federal de Contribuyentes de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: '; documentación que acredite cualquier cambio a los datos proporcionados para efectos del precitado registro; constancia de situación fiscal actualizada; opinión de cumplimiento actualizada; comprobantes de domicilio de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' no mayor a tres meses; documentación inherente en caso de cambio de domicilio, como lo es el Acuse de Recibo de la Verificación del nuevo domicilio por parte del Servicio de Administración Tributaria; portada de estado de cuenta bancario, correspondiente a la cuenta de la cual se recibirán las contraprestaciones; evidencia fotográfica o en video que acredite la ubicación de su domicilio fiscal, así como que cuentan con activos, capacidad productiva y capital humano; y en general, cualquier información que así requiera ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ', misma que estará facultada por ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', para realizar la verificación física del domicilio proporcionado.' },
  ])

  writeRich(doc, [
    { text: '4.11.- ', isBold: true },
    { text: 'Que en términos de lo previsto en los artículos 32 B Ter, 32 B Cuater 32, B Quinter, del Código Fiscal de la Federación, ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' deberá entregar a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' toda la documentación necesaria para efecto de la identificación del beneficiario controlador la cual deberá ser veraz y exacta bajo la más estricta responsabilidad de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ', así como el documento denominado “Requerimiento Dueño Beneficiario” manifestando sí tiene conocimiento de la existencia del Dueño Beneficiario, y/o beneficiario final y/o propietario real y, en su caso, exhibirá documentación oficial que permita identificarlo, sí ésta obrare en su poder; en caso contrario, declarará que no cuenta con ella en la “Constancia de Dueño Beneficiario” de conformidad con la fracción III del artículo 18 de la Ley Federal para la Prevención e Identificación de Operaciones con Recursos de' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 13)
}
