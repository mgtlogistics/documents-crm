/**
 * Renderiza un recuadro de firma centrado horizontal y verticalmente 
 * en el espacio restante de la página actual.
 * * @param {Object} doc - Instancia del documento PDFKit.
 * @param {Object} opciones - Configuración del recuadro.
 * @param {number} opciones.width - Ancho fijo del recuadro (por defecto 280 para una firma estándar).
 * @param {number} opciones.height - Alto fijo del recuadro (por defecto 100).
 * @param {number} opciones.barHeight - Alto de la franja gris (por defecto 26).
 * @param {string} opciones.text - Texto de la franja gris (por defecto 'NOMBRE, FECHA Y FIRMA.').
 */
export default function createSignatureBox(doc, opciones = {}) {
  const boxWidth = opciones.width || 280;   // Ancho fijo ideal para que quepa una firma normal
  const boxHeight = opciones.height || 100; // Alto fijo
  const barHeight = opciones.barHeight || 26;
  const text = opciones.text || 'NOMBRE, FECHA Y FIRMA.';

  // 1. CALCULAR CENTRADO HORIZONTAL
  const pageWidth = doc.page.width;
  const x = (pageWidth - boxWidth) / 2;

  // 2. CALCULAR CENTRADO VERTICAL EN EL ESPACIO RESTANTE
  const yActual = doc.y; // Coordenada Y justo abajo de tu último párrafo
  const yLimiteInferior = doc.page.height - doc.page.margins.bottom; // Límite antes de saltar de página
  const espacioDisponibleVertical = yLimiteInferior - yActual;

  // Si por alguna razón el recuadro no cabe en el espacio restante, 
  // dejamos que PDFKit use la posición actual por defecto para evitar que se desborde
  let y = yActual;
  if (espacioDisponibleVertical > boxHeight) {
    // Calculamos el punto medio exacto del espacio que sobra al fondo de la hoja
    y = yActual + (espacioDisponibleVertical - boxHeight) / 2;
  } else {
    // Si el espacio es muy justo, dejamos un pequeño espacio de separación manual
    y = yActual + 15;
  }

  doc.save(); // Guardamos estilos

  // 3. Dibujar el recuadro exterior principal
  doc
    .rect(x, y, boxWidth, boxHeight)
    .lineWidth(1)
    .strokeColor('#000000')
    .fillColor('#FFFFFF')
    .fillAndStroke();

  // 4. Dibujar la barra gris inferior
  const barY = y + (boxHeight - barHeight);
  doc
    .rect(x, barY, boxWidth, barHeight)
    .fillColor('#EBEBEB') // Gris claro limpio
    .fillAndStroke();

  // 5. Añadir el texto centrado en la barra gris
  const fontSize = 9;
  const textPaddingTop = (barHeight - fontSize) / 2 - 1; 

  doc
    .font('Helvetica-Bold')
    .fontSize(fontSize)
    .fillColor('#000000')
    .text(text, x, barY + textPaddingTop, {
      width: boxWidth,
      align: 'center'
    });

  doc.restore(); // Restauramos estilos previos

  // 6. Actualizamos el cursor 'y' de PDFKit al final del recuadro por si sigues escribiendo abajo
  doc.y = y + boxHeight;

  return doc;
}