/**
 * Renderiza una lista con viñetas personalizadas en un documento PDFKit.
 * 
 * @param {Object} doc - Instancia del documento PDFKit.
 * @param {Array<string>} items - Array de textos a renderizar.
 * @param {Object} opciones - Configuración de la lista.
 * @param {string} opciones.type - Tipo de viñeta: 'bullet', 'numbered', 'alphabetical-lower', 'alphabetical-upper'.
 * @param {number} opciones.indent - Espacio de indentación en puntos desde el margen actual (por defecto 20).
 * @param {number} opciones.fontSize - Tamaño de fuente para la lista (por defecto 10).
 * @param {number} opciones.moveDown - Espacio vertical entre elementos (por defecto 0.45).
 * @param {number} opciones.width - Ancho máximo disponible para el texto.
 * @param {string} opciones.align - Alineación del texto ('left', 'center', 'right', 'justify').
 *
 * Notas:
 * - En listas alfabéticas, después de z/Z continúa como aa/AA, ab/AB, etc.
 * - Lanza error si `doc` no es compatible o si `items` no es un arreglo.
 */
export default function createPdfList(doc, items, opciones = {}) {
  if (!doc || typeof doc.text !== 'function' || typeof doc.moveDown !== 'function') {
    throw new Error('createPdfList requiere una instancia valida de PDFDocument.')
  }

  if (!Array.isArray(items)) {
    throw new Error('createPdfList requiere que "items" sea un arreglo.')
  }

  const type = opciones.type || 'bullet';
  const indent = opciones.indent !== undefined ? opciones.indent : 20;
  const fontSize = opciones.fontSize || 10;
  const spaceBetween = opciones.moveDown !== undefined ? opciones.moveDown : 0.45;
  const align = opciones.align || 'justify';

  // Guardamos el margen X original para restaurarlo al finalizar la lista
  const originalX = doc.x;
  const pageRight = doc.page.width - doc.page.margins.right;
  const remainingWidth = pageRight - originalX;
  const baseWidth = opciones.width !== undefined ? opciones.width : remainingWidth;
  const safeWidth = Math.max(1, baseWidth - indent);

  function toAlphabetical(index, upper = false) {
    let n = index + 1;
    let result = '';

    while (n > 0) {
      const remainder = (n - 1) % 26;
      const code = (upper ? 65 : 97) + remainder;
      result = String.fromCharCode(code) + result;
      n = Math.floor((n - 1) / 26);
    }

    return result;
  }
  
  // Establecemos el tamaño de fuente
  doc.fontSize(fontSize);

  items.forEach((item, index) => {
    let prefix = '';

    // 1. Determinar el prefijo según el tipo de lista seleccionado
    switch (type) {
      case 'numbered':
        prefix = `${index + 1}. `;
        break;
      case 'alphabetical-lower':
        // Convierte el índice en letras minúsculas (0 -> a, 25 -> z, 26 -> aa)
        prefix = `${toAlphabetical(index)}) `;
        break;
      case 'alphabetical-upper':
        // Convierte el índice en letras mayúsculas (0 -> A, 25 -> Z, 26 -> AA)
        prefix = `${toAlphabetical(index, true)}) `;
        break;
      case 'bullet':
      default:
        prefix = '• ';
        break;
    }

    // 2. Concatenamos el prefijo con el texto del elemento
    const textoCompleto = `${prefix}${String(item)}`;

    // 3. Renderizamos el texto aplicando la indentación a la coordenada X
    // Restamos el 'indent' al 'width' para que el texto justificado respete el nuevo margen derecho
    doc.text(textoCompleto, originalX + indent, doc.y, {
      width: safeWidth,
      align
    });

    // Añadimos el espacio de separación con el siguiente elemento
    doc.moveDown(spaceBetween);
  });

  // 4. Restauramos la coordenada X original del documento para no afectar los siguientes párrafos
  doc.x = originalX;

  return doc;
}