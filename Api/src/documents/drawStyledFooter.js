/**
 * Renderiza el pie de página de forma manual calculando el espacio de forma absoluta.
 * @param {Object} doc - Instancia de PDFKit.
 * @param {number} pageNumber - Número de la página actual.
 * @param {number} totalPages - Total de páginas.
 */
export default function drawStyledFooter(doc, pageNumber, totalPages = 3) {
  // 1. Guardar el estado de la página y el cursor actual
  const originalY = doc.y;
  const originalBottomMargin = doc.page.margins.bottom;

  const left = doc.page.margins.left;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const footerTop = doc.page.height - 45; // Coordenada Y exacta del footer

  // 2. TRUCO MATEMÁTICO: Bajamos temporalmente el margen de la página a 0.
  // Esto le demuestra matemáticamente a PDFKit que escribir a 'height - 45'
  // está completamente dentro de los límites permitidos y NO debe saltar de página.
  doc.page.margins.bottom = 0;

  const textLeft = 'Documento confidencial y para uso exclusivo de GAA';
  const textRightUpper = 'Copia Controlada';
  const textRightLower = 'El documento electrónico prevalece sobre cualquier impresión del mismo.';
  const pageText = `Página ${pageNumber} de ${totalPages}`;

  doc.save();

  // 3. Dibujar las líneas decorativas
  const centerPoint = left + (width / 2);
  const gap = 45; 

  doc.lineWidth(0.5).strokeColor('#ccc');
  doc.moveTo(left, footerTop).lineTo(centerPoint - gap, footerTop).stroke();
  doc.moveTo(centerPoint + gap, footerTop).lineTo(left + width, footerTop).stroke();

  // 4. Renderizar texto izquierdo
  doc
    .font('Helvetica')
    .fontSize(7)
    .fillColor('#333333')
    .text(textLeft, left, footerTop + 6, { 
      width: (width / 2) - gap, 
      align: 'left',
      lineBreak: false // Evita que un salto de línea accidental ejecute un page break
    });

  // 5. Renderizar paginación central
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor('#000000')
    .text(pageText, centerPoint - gap, footerTop - 4, { 
      width: gap * 2, 
      align: 'center',
      lineBreak: false 
    });

  // 6. Renderizar bloque derecho
  const startXRight = centerPoint + gap;
  const widthRight = (width / 2) - gap;

  doc
    .font('Helvetica')
    .fontSize(7)
    .fillColor('#333333')
    .text(textRightUpper, startXRight, footerTop - 12, { 
      width: widthRight, 
      align: 'center',
      lineBreak: false 
    });

  doc.text(textRightLower, startXRight, footerTop + 6, { 
    width: widthRight, 
    align: 'center',
    lineBreak: false 
  });

  doc.restore();

  // 7. RESTAURACIÓN ABSOLUTA: Devolvemos los márgenes y el cursor a la normalidad
  doc.page.margins.bottom = originalBottomMargin;
  doc.y = originalY;
}