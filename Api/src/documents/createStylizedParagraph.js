// createStylizedParagraph.js
export default function createStylizedParagraph(doc, fragmentos, opcionesParrafo = {}) {
  // Asignar tamaño de fuente si se especifica (ej. 10)
  if (opcionesParrafo.fontSize) {
    doc.fontSize(opcionesParrafo.fontSize);
  }

  fragmentos.forEach((fragmento, indice) => {
    const esElUltimo = indice === fragmentos.length - 1;

    // Configurar la variante de la fuente
    const fuente = fragmento.isBold ? 'Helvetica-Bold' : 'Helvetica';
    doc.font(fuente);

    // Combinar las opciones de estilo individuales con las de estructura del párrafo
    const opcionesConfiguradas = {
      ...opcionesParrafo,                  // Hereda width y align en cada fragmento
      underline: !!fragmento.isUnderlined,
      continued: !esElUltimo               // Obligatorio para hilvanar el texto
    };

    // Si es el primer fragmento, respetamos la coordenada X e Y iniciales si vienen dadas
    if (indice === 0 && opcionesParrafo.left && opcionesParrafo.top) {
      doc.text(fragmento.text, opcionesParrafo.left, opcionesParrafo.top, opcionesConfiguradas);
    } else {
      doc.text(fragmento.text, opcionesConfiguradas);
    }
  });

  return doc;
}