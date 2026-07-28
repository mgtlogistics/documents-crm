import createStylizedParagraph from '../../createStylizedParagraph.js'
import { drawPageNumber, getContentLeft, getContentWidth } from '../helpers/layout.js'

function writeRich(doc, fragments, options = {}) {
  const paragraphOptions = {
    fontSize: options.fontSize || 10.9,
    width: getContentWidth(doc),
    align: options.align || 'justify',
  }

  createStylizedParagraph(doc, fragments, paragraphOptions)
  doc.moveDown(options.moveDown !== undefined ? options.moveDown : 0.72)
}

function writeIndentedRich(doc, fragments, options = {}) {
  const indent = options.indent || 44

  createStylizedParagraph(doc, fragments, {
    fontSize: options.fontSize || 10.9,
    width: getContentWidth(doc) - indent,
    align: options.align || 'justify',
    left: getContentLeft(doc) + indent,
    top: doc.y,
  })

  doc.moveDown(options.moveDown !== undefined ? options.moveDown : 0.55)
}

export default function renderPage11(doc, data = {}, options = {}) {
  writeRich(doc, [
    { text: 'través del servidor institucional de la empresa; obligándose a hacerla llegar físicamente con firma autógrafa y copia simple del documento en donde se acredite la personalidad y facultades del firmante, dentro de las 24 horas siguientes.' },
  ])

  writeRich(doc, [
    { text: '4.4.- ', isBold: true },
    { text: 'Dar el aviso electrónico correspondiente al Servicio de Administración Tributaria en términos de lo previsto en la fracción III del artículo 59 de la Ley Aduanera Vigente y la Regla 1.2.6 de las Reglas Generales de Comercio Exterior vigentes, informando que ya contrató los servicios profesionales de ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' para que éste efectúe a su nombre el despacho de mercancías, así como informar a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' de haber cumplido con tal obligación para que este último acepte el encargo conferido.' },
  ])

  writeRich(doc, [
    { text: '4.5.- ', isBold: true },
    { text: 'Entregar a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' el documento que compruebe el encargo conferido, para que actúe en representación legal de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: ' en el despacho aduanero de las mercancías; representación misma que se limitará a los actos establecidos en el artículo 41 de la Ley Aduanera.' },
  ])

  writeRich(doc, [
    { text: '4.6.- ', isBold: true },
    { text: 'Realizar los pagos a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' que, por concepto de honorarios, maniobras, pago de impuestos, almacenajes y cualquier otro concepto necesario para la tramitación de la operación de comercio exterior sea necesario erogar.' },
  ])

  writeRich(doc, [
    { text: '4.7.- ', isBold: true },
    { text: 'Entregar en tiempo y forma a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' el documento denominado “manifestación de valor electrónica (MVE)” prevista en los artículos 59 fracción III, 59-A y 81 del Reglamento de la Ley Aduanera, así como las disposiciones aplicables de la Ley Aduanera vigente a partir del día 01 de enero de 2026.' },
  ])

  writeRich(doc, [
    { text: 'La elaboración, firma, transmisión, veracidad, congruencia y exactitud de los datos asentados en la Manifestación de Valor Electrónica son ', isBold: false },
    { text: 'RESPONSABILIDAD EXCLUSIVA', isBold: true },
    { text: ' de ' },
    { text: '“EL CLIENTE”', isBold: true },
    { text: '; por tanto, ambas partes aceptan expresamente que:' },
  ], { moveDown: 0.45 })

  writeIndentedRich(doc, [
    { text: 'a) ' },
    { text: '“El AGENTE ADUANAL”', isBold: true },
    { text: ' no genera, emite, valida, determina, califica ni garantiza los valores declarados por el importador.' },
  ])

  writeIndentedRich(doc, [
    { text: 'b) ' },
    { text: 'La responsabilidad de integrar, conservar y proporcionar los documentos soporte del valor en aduana incluyendo los relacionados con vinculaciones, precios, pagos, incrementables, regalías, asistencia técnica, licencias y cualquier otro elemento ', isBold: false },
    { text: 'corresponde únicamente a “EL CLIENTE”.', isBold: true },
  ])

  writeIndentedRich(doc, [
    { text: 'c) ' },
    { text: 'Cualquier discrepancia, omisión, falta de congruencia documental, inexactitud o falsedad en la información proporcionada ', isBold: false },
    { text: 'será imputable exclusivamente a “EL CLIENTE”', isBold: true },
    { text: ', deslindando a ' },
    { text: '“EL AGENTE ADUANAL”', isBold: true },
    { text: ' de cualquier consecuencia fiscal, aduanera, administrativa, penal, responsabilidad civil, o de cualquier otra naturaleza iniciada por cualquier autoridad.' },
  ], { moveDown: 0 })

  drawPageNumber(doc, options.pageNumber || 11)
}
