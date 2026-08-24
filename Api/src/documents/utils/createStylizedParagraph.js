// createStylizedParagraph.js
export default function createStylizedParagraph(doc, fragmentos, opcionesParrafo = {}) {
  // Asignar tamaño de fuente si se especifica (ej. 10)
  if (opcionesParrafo.fontSize) {
    doc.fontSize(opcionesParrafo.fontSize);
  }

  const { left, top, ...opcionesDeParrafo } = opcionesParrafo;

  fragmentos.forEach((fragmento, indice) => {
    const esElUltimo = indice === fragmentos.length - 1;

    // Configurar la variante de la fuente
    const fuente = fragmento.isBold ? 'Helvetica-Bold' : 'Helvetica';
    doc.font(fuente);

    // Evita recalcular la justificacion en cada fragmento cuando continued es true.
    // PDFKit mantiene las opciones de layout del primer fragmento para los siguientes.
    const opcionesConfiguradas = indice === 0
      ? {
        ...opcionesDeParrafo,
        underline: !!fragmento.isUnderlined,
        continued: !esElUltimo,
      }
      : {
        underline: !!fragmento.isUnderlined,
        continued: !esElUltimo,
      };

    // Si es el primer fragmento, respetamos la coordenada X e Y iniciales si vienen dadas
    if (indice === 0 && Number.isFinite(left) && Number.isFinite(top)) {
      doc.text(fragmento.text, left, top, opcionesConfiguradas);
    } else {
      doc.text(fragmento.text, opcionesConfiguradas);
    }
  });

  return doc;
}