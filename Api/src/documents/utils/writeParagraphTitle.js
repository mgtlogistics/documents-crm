export default function writeParagraphTitle(doc, title, opciones = {}) {

  const fontSize = opciones.fontSize || 15;
  const align = opciones.align || 'center';

    doc
    .font('Helvetica')
    .fontSize(fontSize)
    .text(title, { align: align })
    .moveDown(0.5)

  return doc

}
