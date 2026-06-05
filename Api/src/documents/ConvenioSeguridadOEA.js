import PDFDocument from "pdfkit"
import { getFrontendImg } from "../utils/public.utils.js"


export function generarConvenioSeguridad({ nombreRepresentante, nombreEmpresa, dia = "14", mes = "noviembre", anio = "2024" }) {
  const doc = new PDFDocument({ size: "LETTER", margin: 72, bufferPages: true })

  const W = doc.page.width - 144        // ancho útil
  const FONT_NORMAL = "Helvetica"
  const FONT_BOLD = "Helvetica-Bold"
  const SIZE_TITLE = 14
  const SIZE_BODY = 11
  const SIZE_FOOTER = 8
  const INDENT = 20



  // ── Título ──────────────────────────────────────────────────────────────
  doc
    .font(FONT_BOLD)
    .fontSize(SIZE_TITLE)
    .text("CONVENIO DE SEGURIDAD EN LA CADENA DE SUMINISTRO", { align: "center" })
    .moveDown(1)

  // ── Párrafo de apertura ──────────────────────────────────────────────────
  doc
    .font(FONT_BOLD)
    .fontSize(SIZE_BODY)
    .text(
      `Estimado ${nombreRepresentante} representante de la empresa ${nombreEmpresa}, ` +
      "con la finalidad de entender que la Seguridad de la Cadena de Suministro es un concepto que facilitará " +
      "a ambas empresas, el establecimiento de acuerdos y controles necesarios para proteger valores, maquinarias, " +
      "transportación y sistemas de información de riesgo de seguridad existentes tales como: contaminación del " +
      "embarque, hurto, lavado de activos, narcotráfico, fuga de información, adulteración de productos e información " +
      "y personal no confiable, acordamos la presente colaboración de forma conjunta con los siguientes puntos:",
      { align: "justify", width: W }
    )
    .moveDown(0.8)

  // ── Cláusulas principales ────────────────────────────────────────────────
  const clausulas = [
    "Colaborar con CESAR AUGUSTO SAVIÑON RUELAS / SAVIÑON AGENCIA ADUANAL, SC para garantizar la seguridad del Comercio Internacional.",
    "Brindar documentos e información exacta y fidedigna que fuese necesaria la cual será utilizada con fines informativos y se mantendrá bajo total confidencialidad.",
    "Aceptar visitas a sus instalaciones con el objetivo de verificar que las medidas de seguridad en sus procesos e instalaciones están debidamente implementadas en favor de la cadena de suministro.",
    `Proteger la propiedad intelectual de información, en papel y medio electrónico, de ${nombreRepresentante} a la cual tengamos acceso como parte de nuestras negociaciones.`,
    "Establecer controles para prevenir actividades ilícitas por parte de su personal.",
    "Contar con personal capacitado por la cual fue contratado, así como la firma de un convenio de confidencialidad.",
    "No se permite el trabajo con socios comerciales que tengan riesgo de actividades relacionadas con el lavado de dinero y la financiación del terrorismo.",
    "Su empresa adquiera como obligación cumplir con lo indicado en el al amparo del artículo 23.6 del T-MEC y el Acuerdo del Trabajo y Previsión Social, es decir, no se realizará entre sus empleados el trabajo forzoso u obligado incluido el trabajo infantil forzoso u obligado.",
    "Como socio comercial, garantizar que los bienes, insumos o mercancías nacionales e importadas a México para la elaboración de productos o mercancías, no provienen de la extracción, producción o fabricación, total o parcialmente, con formas prohibidas de trabajo, es decir, forzoso u obligado incluido el trabajo infantil forzoso u obligado, al amparo del artículo 23.6 del T-MEC y el Acuerdo del Trabajo y Previsión Social que establece las mercancías cuya importación está sujeta a regulación a cargo de la Secretaría del Trabajo y Previsión Social, publicado en el DOF el 17 de febrero de 2023.",
    "Establecer alianzas estratégicas de seguridad para reforzar la cadena de suministros con clientes y proveedores.",
    "Al no existir una certificación de seguridad en la cadena de suministros que le aplique, deberá de mantener correctamente implementados los siguientes procesos y medidas de seguridad establecidos en el programa OEA para ingreso y permanencia en nuestras instalaciones:",
  ]

  doc.font(FONT_NORMAL).fontSize(SIZE_BODY)
  clausulas.forEach((txt, i) => {
    doc.text(`${i + 1}. ${txt}`, { align: "justify", width: W }).moveDown(0.5)
  })

  // ── Sub-lista de controles ───────────────────────────────────────────────
  const controles = [
    "Firma convenio confidencialidad",
    "Respetar y aplicar las políticas de seguridad",
    "Aplicar los controles de acceso a los cuales estará regido.",
    "Identificarse, registrar sus datos personales y portar gafete de visitante.",
    "En caso de ingresar equipo para el desempeño de su trabajo a la empresa, deberá de registrarlo en la recepción.",
    "Su personal deberá de identificarse, con identificación oficial vigente con fotografía, tales como INE, pasaporte o licencia de conducir.",
    "No ingresar unidades de almacenamiento como discos duros, USB o similares.",
    "El uso de celular está prohibido. Solo en áreas donde se le permita, previa solicitud de uso con seguridad.",
    "Demostrar la ubicación de su domicilio fiscal.",
    "Seguir los protocolos de seguridad.",
    "No ingresar a las áreas críticas, solo bajo supervisión y autorización de seguridad.",
    "No ingresar a las áreas donde se almacena mercancía o productos de nuestra empresa.",
  ]

  controles.forEach((txt) => {
    doc
      .text(`• ${txt}`, doc.page.margins.left + INDENT, doc.y, {
        align: "justify",
        width: W - INDENT,
      })
      .moveDown(0.4)
  })

  doc.x = doc.page.margins.left

  doc.moveDown(0.4)

  // ── Cláusulas de sanción ─────────────────────────────────────────────────
  const sanciones = [
    "Se establece que, en caso de no respetar, seguir, y colaborar con nuestros protocolos de seguridad, será retirado de la empresa e iniciará una investigación para determinar si fue intencional con el objetivo de realizar conspiración para perjudicarnos o fue omisión en la cual sería sancionado, con base a lo que establezca la dirección de nuestra empresa.",
    "La investigación también determinará si se continua con la relación comercial o se da por terminada.",
    "Con la finalización de la relación laboral ya no podrá ser re contratado, aunque cubra las medidas y procesos.",
  ]

  sanciones.forEach((txt) => {
    doc.text(txt, { align: "justify", width: W }).moveDown(0.5)
  })

  // ── Fecha de firma ───────────────────────────────────────────────────────
  doc
    .moveDown(0.5)
    .text(`Se firma el acuerdo a los ${dia} días del mes de ${mes} del año ${anio}`, { align: "left" })
    .moveDown(2)

  // ── Firmas ───────────────────────────────────────────────────────────────
  const lineY = doc.y + 40
  const colGap = 28
  const colWidth = (W - colGap) / 2
  const colLeft = doc.page.margins.left
  const colRight = colLeft + colWidth + colGap

  // Líneas de firma estilizadas para mantener una apariencia limpia y uniforme.
  doc
    .save()
    .lineWidth(1)
    .strokeColor("#4b5563")
    .moveTo(colLeft, lineY)
    .lineTo(colLeft + colWidth, lineY)
    .stroke()
    .moveTo(colRight, lineY)
    .lineTo(colRight + colWidth, lineY)
    .stroke()
    .restore()

  const signatureTextY = lineY + 8

  doc
    .font(FONT_BOLD)
    .fontSize(10)
    .fillColor("#111827")
    .text("A.A. CESAR AUGUSTO SAVIÑON RUELAS", colLeft, signatureTextY, { width: colWidth, align: "center" })
    .font(FONT_NORMAL)
    .text("Saviñon Agencia Aduanal, SC", colLeft, doc.y, { width: colWidth, align: "center" })

  const leftSignatureBottomY = doc.y

  doc
    .font(FONT_BOLD)
    .text(nombreRepresentante || "Representante Socio Comercial", colRight, signatureTextY, { width: colWidth, align: "center" })
    .font(FONT_NORMAL)
    .text(nombreEmpresa || "Socio Comercial", colRight, doc.y, { width: colWidth, align: "center" })

  const rightSignatureBottomY = doc.y
  doc.y = Math.max(leftSignatureBottomY, rightSignatureBottomY) + 14

  // ── Pie de página ────────────────────────────────────────────────────────
  doc
    .moveDown(2)
    .font(FONT_NORMAL)
    .fontSize(SIZE_FOOTER)
    .text("c.c.p. Expediente cliente/proveedor", { align: "left" })


  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i); // Nos movemos a la página 'i'
    doc.image(getFrontendImg('sauvinon.png'), doc.page.margins.left, doc.page.margins.top - 40, { width: 120 }).moveDown(2)
  }

  doc.end()
  return doc
}
