/**
 * Renderiza un encabezado corporativo genérico con una tabla de control de cambios.
 * * @param {Object} doc - Instancia del documento PDFKit.
 * @param {number} pageNumber - Número de página actual.
 * @param {number} totalPages - Número total de páginas (opcional, si se usa bufferPages).
 * @param {Object} data - Datos dinámicos del encabezado.
 * @param {string} data.title - Título principal (ej: 'AVISO DE PRIVACIDAD').
 * @param {Array<number>} data.cols - Array con los anchos de las 7 columnas.
 * @param {Array<string>} data.headers - Títulos de las celdas superiores.
 * @param {Array<string>} data.values - Valores de las celdas inferiores (el último elemento se autocalcula para la página).
 */
export default function drawStyledHeader(doc, pageNumber, totalPages = null, data = {}) {
  const left = doc.page.margins.left;
  const top = doc.page.margins.top;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  // 1. Configuración por defecto por si faltan datos
  const title = data.title || 'DOCUMENTO INFORMATIVO';
  const cols = data.cols || [140, 65, 65, 65, 55, 55, 60]; // Suma 505 puntos (ancho ideal para Letter con margen 40)
  const headers = data.headers || ['Código', 'Resp. de Proceso', 'Versión', 'Fecha de Emisión', 'Realizó', 'Autorizó', 'No. de Pág.'];
  const values = [...(data.values || ['N/A', 'N/A', '0', '00/00/0000', 'N/A', 'N/A'])];

  // Forzar que el último valor de la tabla muestre la paginación real dinámicamente
  const textoPagina = totalPages ? `Pág. ${pageNumber} de ${totalPages}` : `Pág. ${pageNumber}`;
  if (values.length >= 7) {
    values[6] = textoPagina;
  } else {
    values.push(textoPagina);
  }

  doc.save();

  // 2. Dibujar las dos líneas paralelas superiores que delimitan el inicio del formato
  doc
    .moveTo(left, top - 15)
    .lineTo(left + width, top - 15)
    .lineWidth(1)
    .strokeColor('#000000')
    .stroke();

  doc
    .moveTo(left, top - 11)
    .lineTo(left + width, top - 11)
    .lineWidth(1)
    .stroke();

  // 3. Renderizar el Título Centralizado
  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .text(title, left, top, { width, align: 'center' });

  // 4. Dibujar la Fila Superior de la Tabla (Encabezados)
  const tableTop = doc.y + 6;
  let x = left;
  
  for (let i = 0; i < cols.length; i += 1) {
    const w = cols[i];
    doc.rect(x, tableTop, w, 22).strokeColor('#000000').lineWidth(0.5).stroke();
    doc
      .font('Helvetica')
      .fontSize(7)
      // Ajustamos verticalmente (+5) para centrar visualmente los textos de múltiples líneas
      .text(headers[i], x + 2, tableTop + 4, { width: w - 4, align: 'center' });
    x += w;
  }

  // 5. Dibujar la Fila Inferior de la Tabla (Valores con fondo gris)
  x = left;
  for (let i = 0; i < cols.length; i += 1) {
    const w = cols[i];
    
    // Dibujamos el fondo gris primero
    doc.rect(x, tableTop + 22, w, 22).fillColor('#EBEBEB').fill();
    // Dibujamos el borde encima del fondo
    doc.rect(x, tableTop + 22, w, 22).strokeColor('#000000').lineWidth(0.5).stroke();
    
    doc
      .font('Helvetica-Bold')
      .fontSize(7)
      .fillColor('#000000')
      .text(values[i], x + 2, tableTop + 26, { width: w - 4, align: 'center' });
    x += w;
  }

  doc.restore();

  // 6. Fijar la posición Y del cursor principal de escritura para que el texto empiece limpio abajo
  doc.x = left;
  doc.y = tableTop + 54; 
}