import PDFDocument from 'pdfkit'

// ─── Constantes de color y dimensiones ────────────────────────────────────────
const C_BLACK  = '#000000'
const C_ORANGE = '#C45700'
const C_DARK   = '#222222'
const C_SEC_BG = '#E8E8E8'   // fondo fila de título de sección
const C_GRAY   = '#EBEBEB'   // fondo fila de valores del encabezado

// Anchos de columnas para tablas de checklist (suma = 532pt con margin 40 en carta)
const CW   = [20, 412, 33, 33, 34]          // No. | Texto | C | NC | NA
const TW   = CW[0] + CW[1]                  // ancho columnas No.+Texto = 432
const CNW  = CW[2] + CW[3] + CW[4]         // ancho columnas C+NC+NA  = 100

// ─── Cabecera institucional ────────────────────────────────────────────────────
function dibujarCabecera(doc, pagina, totalPaginas) {
  const left = doc.page.margins.left
  const top  = doc.page.margins.top
  const w    = doc.page.width - doc.page.margins.left - doc.page.margins.right

  doc.font('Helvetica-Bold').fontSize(10).fillColor(C_BLACK)
    .text('CUESTIONARIO DE ESTÁNDARES EN SEGURIDAD', left, top, { width: w, align: 'center' })

  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_ORANGE)
    .text('SOCIO COMERCIAL', left, doc.y + 1, { width: w, align: 'center' })

  const tTop = doc.y + 3
  const cols = [130, 85, 42, 76, 47, 47, 105]   // suma = 532
  const hdrs = ['Código', 'Resp. de Proceso', 'Versión', 'Fecha de Emisión', 'Realizó', 'Autorizó', 'No. de Pág.']
  const vals = ['GAA-SGS-04-F3-\nCES-v1', 'Ejecutivo de Trafico', '1', '17/06/2020', 'GSS', 'DG', `${pagina} de ${totalPaginas}`]
  const H1 = 16, H2 = 20

  let x = left
  hdrs.forEach((h, i) => {
    doc.rect(x, tTop, cols[i], H1).strokeColor(C_BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica').fontSize(6.5).fillColor(C_BLACK)
      .text(h, x + 2, tTop + 4, { width: cols[i] - 4, align: 'center', lineBreak: false })
    x += cols[i]
  })

  x = left
  vals.forEach((v, i) => {
    doc.rect(x, tTop + H1, cols[i], H2).fillColor(C_GRAY).fill()
    doc.rect(x, tTop + H1, cols[i], H2).strokeColor(C_BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica-Bold').fontSize(6.5).fillColor(C_BLACK)
      .text(v, x + 2, tTop + H1 + 4, { width: cols[i] - 4, align: 'center' })
    x += cols[i]
  })

  doc.x = left
  doc.y = tTop + H1 + H2 + 5
}

// ─── Pie de página ─────────────────────────────────────────────────────────────
function dibujarPie(doc) {
  const left    = doc.page.margins.left
  const w       = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const footerY = doc.page.height - 28
  const origBot = doc.page.margins.bottom
  doc.page.margins.bottom = 0
  doc.save()
  doc.font('Helvetica').fontSize(6).fillColor('#444444')
    .text('Documento confidencial y para uso exclusivo de la "Global Agentes Aduanales y Asesores en Comercio Exterior, SC".',
      left, footerY, { width: w * 0.58, align: 'left', lineBreak: false })
  doc.font('Helvetica').fontSize(6).fillColor('#444444')
    .text('El documento electrónico prevalece sobre cualquier impresión del mismo.',
      left + w * 0.58, footerY, { width: w * 0.42, align: 'right', lineBreak: false })
  doc.restore()
  doc.page.margins.bottom = origBot
}

// ─── Control de espacio / salto de página ──────────────────────────────────────
function chkPag(doc, alto, estado) {
  const limite = doc.page.height - doc.page.margins.bottom
  if (doc.y + alto > limite) {
    dibujarPie(doc)
    doc.addPage()
    estado.pag++
    dibujarCabecera(doc, estado.pag, estado.total)
    doc.x = doc.page.margins.left
  }
}

// ─── Sección de checklist ──────────────────────────────────────────────────────
function dibujarSeccion(doc, titulo, items, left, estado) {
  const TH = 15   // alto título
  const RH = 13   // alto fila base

  chkPag(doc, TH + RH * 3, estado)

  let y = doc.y
  // Fila de título de sección
  doc.rect(left, y, TW, TH).fillColor(C_SEC_BG).fill()
  doc.rect(left, y, TW, TH).strokeColor(C_BLACK).lineWidth(0.5).stroke()
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_BLACK)
    .text(titulo, left + 4, y + 4, { width: TW - 8, align: 'left', lineBreak: false })

  let x = left + TW
  ;['C', 'NC', 'NA'].forEach((lbl, i) => {
    doc.rect(x, y, CW[i + 2], TH).fillColor(C_SEC_BG).fill()
    doc.rect(x, y, CW[i + 2], TH).strokeColor(C_BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_BLACK)
      .text(lbl, x, y + 4, { width: CW[i + 2], align: 'center', lineBreak: false })
    x += CW[i + 2]
  })
  doc.y = y + TH

  // Filas de ítems
  items.forEach((texto, idx) => {
    doc.font('Helvetica').fontSize(6.5)
    const textH = doc.heightOfString(texto, { width: CW[1] - 6 })
    const rowH  = Math.max(RH, textH + 5)

    chkPag(doc, rowH, estado)
    y = doc.y
    x = left

    doc.rect(x, y, CW[0], rowH).strokeColor(C_BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica').fontSize(6.5).fillColor(C_DARK)
      .text(String(idx + 1), x, y + (rowH - 8) / 2, { width: CW[0], align: 'center', lineBreak: false })
    x += CW[0]

    doc.rect(x, y, CW[1], rowH).strokeColor(C_BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica').fontSize(6.5).fillColor(C_DARK)
      .text(texto, x + 3, y + 3, { width: CW[1] - 6 })
    x += CW[1]

    for (let i = 0; i < 3; i++) {
      doc.rect(x, y, CW[i + 2], rowH).strokeColor(C_BLACK).lineWidth(0.5).stroke()
      x += CW[i + 2]
    }
    doc.y = y + rowH
  })

  // Fila Subtotal
  chkPag(doc, RH, estado)
  y = doc.y
  doc.rect(left, y, TW, RH).strokeColor(C_BLACK).lineWidth(0.5).stroke()
  doc.font('Helvetica-Bold').fontSize(7).fillColor(C_BLACK)
    .text('Subtotal', left + 4, y + 3, { width: TW - 12, align: 'right', lineBreak: false })
  doc.rect(left + TW, y, CNW, RH).strokeColor(C_BLACK).lineWidth(0.5).stroke()
  doc.y = y + RH
}

export function generarCuestionarioEstandaresSeguridad() {
  const doc  = new PDFDocument({ size: 'LETTER', margin: 40 })
  const left = doc.page.margins.left
  const w    = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const TOTAL_PAGS = 3
  const estado = { pag: 1, total: TOTAL_PAGS }

  // ── PÁGINA 1 ──────────────────────────────────────────────────────────────────
  dibujarCabecera(doc, 1, TOTAL_PAGS)

  // Campos generales
  const fY = doc.y
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_BLACK)
    .text('Fecha:', left, fY, { continued: true, lineBreak: false })
    .font('Helvetica').text('  _______________________________________________', { lineBreak: false })
  doc.y += 12
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_BLACK)
    .text('Razon social del Socio Comercial', left, doc.y, { continued: true, lineBreak: false })
    .font('Helvetica').text('  _____________________________________________', { lineBreak: false })
  doc.y += 12
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_BLACK)
    .text('Nombre y firma de la persona que contesta la evaluación:', left, doc.y, { continued: true, lineBreak: false })
    .font('Helvetica').text('  __________________________', { lineBreak: false })
  doc.y += 10

  // Caja INSTRUCCIONES (página 1)
  const iY = doc.y + 3
  const iH = 38
  doc.rect(left, iY, w, iH).fillColor('#F9F9F9').fill()
  doc.rect(left, iY, w, iH).strokeColor(C_BLACK).lineWidth(0.5).stroke()
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C_BLACK)
    .text('INSTRUCCIONES', left, iY + 4, { width: w, align: 'center' })
  doc.font('Helvetica').fontSize(7.5).fillColor('#333333')
    .text('De acuerdo a cada concepto anotar: 1 para C (Cumple), 0 para NC (No Cumple), y X  para NA (No Aplica);',
      left + 6, iY + 17, { width: w - 12, align: 'center' })
    .text('Al termino del llenado, el Gerente Administrativo calificará el cumplimiento de cada sección',
      left + 6, doc.y + 1, { width: w - 12, align: 'center' })
  doc.y = iY + iH + 4

  // Etiqueta "Check List de Auditoria"
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_BLACK)
    .text('Check List de Auditoria', left, doc.y, { width: w, align: 'right' })
  doc.y += 10

  // ── Secciones de checklist ─────────────────────────────────────────────────
  dibujarSeccion(doc, 'Infraestructura (*Obligatorio)', [
    'Cuenta con barra periférica en todo el perímetro',
    'La barra periférica se encuentra sin cuarteaduras o perforaciones',
    'La barra periférica cuenta con apoyo de concertinas y cerco eléctrico',
    'La barra periférica,el cerco eléctrico y la concertina se encuentran libre de obstáculos o ramas',
    'La barra periférica cuenta con anuncios que adviertan que es "propiedad privada" o "no anuncian"',
    'Los portones activos e inactivos están  identificados',
    'El acceso a las instalaciones están controlados con gafetes, tarjetones, personal de seguridad',
    'Las bisagras de puertas y portones se encuentran en buenas condiciones',
    'Las chapas y/o candados de las puertas y portones de acceso se encuentran en condiciones óptimas',
    'Las ventanas se encuentran con protección y completamente cerradas',
    'El sistema de alumbrado cubre todas las infraestructura',
    'Las lámparas del sistema de alumbrado se encuentran funcionando',
    'Las instalaciones cuenta con sistema de circuito cerrado de  televisión y vídeo vigilancia',
    'Las cámaras del CCTV se encuentran distribuidas en las distintas áreas de la agencia (oficina)',
    'El Interfón se encuentra en condiciones de uso',
    'Cuenta con programas de mantenimiento',
    'Zonas o áreas delimitadas y de fácil identificación',
  ], left, estado)

  dibujarSeccion(doc, 'Oficinas (*Obligatorio)', [
    'Las paredes de las oficinas se encuentran sin perforaciones o cuarteaduras',
    'Techos y paredes se encuentran sin cuarteaduras o perforaciones',
    'Cerco eléctrico protege la parte de las oficinas',
    'Las puertas de las áreas restringidas se encuentran con llave',
    'Cuenta con señalamientos en caso de emergencias',
    'Chapas y/o candados de cada oficina se encuentran en óptimas condiciones',
    'Sistema de Alumbrado es el adecuado para ejecutar actividades en el área de las oficinas',
    'Cuenta con CC TV',
    'El sistema de comunicación interna es adecuado y cubre las necesidades de todo el personal',
    'El sistema de radio-comunicación es el óptimo',
    'Las conexiones  y cables eléctricos  se encuentran protegidas',
    'El área de las oficinas cuenta con extintores',
    'Cuenta con procedimiento para asignar llaves',
    'Techos y paredes se encuentran sin cuarteaduras o perforaciones',
  ], left, estado)

  dibujarSeccion(doc, 'Seguridad Electrónica (*Obligatorio)', [
    'Los equipos de cómputo cuentan con claves de seguridad o password',
    'La base de datos de la agencia se encuentra restringida',
    'Los sistemas  que utiliza la agencia para sus operaciones cuentan con password',
    'Cada usuario de los sistemas tiene cuenta con password de acceso',
    'El acceso inalámbrico se encuentra restringido',
    'Cuenta con respaldos diarios de la base de datos',
    'Los equipos de cómputo se encuentran protegidos ante descargas eléctricas',
    'El equipo de cómputo cuentan con programas de  mantenimiento (Hardware y Software)',
    'El disco portátil en el que se guardan los respaldos de la D.D se encuentra en la caja de seguridad',
    'Los servidores se encuentran en áreas restringidas y climatizada',
    'El área de servidores cuenta con extinguidor',
    'Cuenta con manuales sobre el uso del correo electrónico',
  ], left, estado)

  dibujarSeccion(doc, 'Políticas y Procedimientos (*Obligatorio)', [
    'Cuenta con procedimiento para controles de visitantes',
    'Cuenta con procedimiento o registro sobre la entrega de gafete, equipo de trabajo etc.',
    'Cuenta con control de material y equipo de trabajo',
    'Cuenta con procedimiento para la entrega, uso y reporte de pérdida de gafetes oficiales',
    'Cuenta con procedimiento para el análisis de riesgos',
  ], left, estado)

  // ── PÁGINA 2 ──────────────────────────────────────────────────────────────────
  dibujarSeccion(doc, 'Personal de Servicios (Si aplica)', [
    'Cuenta con personal de seguridad suficiente para todos los accesos',
    'El personal de outsourcing cuenta con capacitaciones y concientización sobre la cadena logística de suministros',
    'Cuenta con procedimiento para la selección y adquisición de servicios de outsourcing',
    'Cuenta con expediente completo del personal',
    'El personal usa uniforme e identificación',
    'El personal entrega reportes diarios',
    'El estado de salud de los empleados es bueno',
  ], left, estado)

  dibujarSeccion(doc, 'Personal (*Obligatorio)', [
    'Cuenta con procedimiento para el reclutamiento de personal',
    'Cuenta con expediente del personal',
    'Los empleados son identificados con gafete, lo usan durante la jornada laboral y uniforme',
    'El personal es capacitado de acuerdo a los procedimientos de sus actividades desempeñadas',
    'Ha solicitado exámenes toxicológicos',
    'El personal cuenta con capacitaciones sobre la concientización en la seguridad de la cadena de suministros y drogas',
  ], left, estado)

  dibujarSeccion(doc, 'Emergencias (*Obligatorio)', [
    'Cuenta con manuales o procedimientos a seguir en caso de emergencia natural (inundación, humedad, temblores, etc.)',
    'Cuenta con manuales o procedimientos a seguir en caso de emergencia ocasionada  (amenazas de bombas, sabotaje, delincuencia organizada, terrorismo, etc.)',
    'Cuenta con números telefónicos para solicitar apoyo a las autoridades',
    'El personal esta capacitado para el que hacer en caso de emergencias',
    'El personal esta capacitado para identificar y reportar en caso de contaminación de productos ilícitos  en la cadena de suministros',
    'Se han hecho simulacros para capacitar al personal',
    'El personal esta capacitado en el manejo de extintores',
  ], left, estado)

  dibujarSeccion(doc, 'Estacionamientos (*Solo en caso de contar con estacionamiento)', [
    'El área de estacionamientos  se encuentra identificada y delimitada',
    'Cuenta con controles de acceso al estacionamiento',
    'Son revisados los vehículos por el personal de seguridad al ingreso y la salida',
    'El personal de la agencia cuenta con autorización para el ingreso a estacionamientos',
    'Los vehículos se encuentran estacionados están en reversa',
    'Cuenta con aviso o anuncios de "ESTACIONARSE DE REVERSA"',
    'Cuenta con alumbrado',
    'El área cuenta con sistema de CCTV',
  ], left, estado)

  dibujarSeccion(doc, 'Seguridad Logística (Obligatorio)', [
    'Cuenta con procedimientos que coadyuve  a mitigar e identificar riesgos en la cadena logística',
    'Cuenta con infraestructura que mitigue los riesgos en contra de terrorismo y/o delincuencia',
    'Cuenta con personal capacitado para detectar riesgos',
    'El personal esta capacitado sobre la seguridad en la cadena de suministros',
    'Cuenta con control y manejo de sellos de alta seguridad',
    'Cuenta con procedimientos sobre la identificación de paquetería y actividades sospechosas',
    'Cuenta con la implementación de controles de acceso a sus instalaciones',
    'Áreas de archivos restringidas y se lleva un control de entradas y salidas de expedientes',
    'Cuenta con procedimientos sobre la radio-comunicación y el intercambio de información',
    'Los visitante son anunciados al empleado responsable de atenderlos',
    'Cuenta con procedimientos para analizar los proveedores y/o socios comerciales',
  ], left, estado)

  dibujarSeccion(doc, 'Almacen (*En caso de contar con almacen)', [
    'El almacen cuenta con zonas o lotes  delimitados para mercancía',
    'Zonas delimitada y con señalización para maniobras de los trasportes',
    'Sistema de Alumbrado en funcionamiento',
    'Cuenta con monitoreo de sistema de CCTV',
    'Cuenta con extinguidores en el área de almacén',
    'Cuenta con señalamientos en caso de emergencias',
    'Techo en buen estado',
    'Cuenta con procedimiento para las actividades del almacén',
    'Cuenta con áreas específicas para  tarimas, material de empaque y embalaje y equipo de trabajo',
    'Cuenta con control de entradas y salidas de mercancía',
    'Cuenta con personal capacitado para inspección de embarques y detectar actividades sospechosas',
    'Cuenta con personal capacitado para inspeccionar unidades de transporte y detectar actividades sospechosas',
    'Cuenta con un procedimiento y personal capacitado para realizar previos de mercancía',
    'El personal cuenta con cursos de concientización sobre la seguridad en la cadena de suministros',
    'El personal inspecciona los sellos mediante el método VVTT',
    'Las paredes se encuentran en buen estado y sin cuarteaduras o perforaciones',
  ], left, estado)

  // Fila TOTAL GENERAL
  chkPag(doc, 15, estado)
  const tgY = doc.y
  doc.rect(left, tgY, TW, 15).strokeColor(C_BLACK).lineWidth(0.5).stroke()
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_BLACK)
    .text('TOTAL GENERAL', left + 4, tgY + 4, { width: TW - 8, align: 'right', lineBreak: false })
  doc.rect(left + TW, tgY, CNW, 15).strokeColor(C_BLACK).lineWidth(0.5).stroke()
  doc.y = tgY + 15

  dibujarPie(doc)

  // ── PÁGINA 3: Plan de acciones correctivas ────────────────────────────────────
  doc.addPage()
  estado.pag++
  dibujarCabecera(doc, estado.pag, estado.total)

  // Caja INSTRUCCIONES (página 3 — texto diferente con resaltados en naranja)
  const i3Y = doc.y + 3
  const i3H = 52
  doc.rect(left, i3Y, w, i3H).fillColor('#F9F9F9').fill()
  doc.rect(left, i3Y, w, i3H).strokeColor(C_BLACK).lineWidth(0.5).stroke()
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C_BLACK)
    .text('INSTRUCCIONES', left, i3Y + 4, { width: w, align: 'center' })

  // Párrafo de instrucciones con "SOCIO COMERCIAL" y "EJECUTIVO DE TRAFICO" en naranja
  const txtX = left + 6
  const txtW = w - 12
  const txtY = i3Y + 17
  doc.font('Helvetica').fontSize(7.5).fillColor('#333333')
    .text('Al tener la calificación por sección, identifique los requisitos calificados como NO CUMPLE y determine en conjunto ',
      txtX, txtY, { width: txtW, continued: true })
  doc.font('Helvetica-Bold').fillColor(C_ORANGE)
    .text('SOCIO COMERCIAL', { continued: true })
  doc.font('Helvetica').fillColor('#333333')
    .text(' y ', { continued: true })
  doc.font('Helvetica-Bold').fillColor(C_ORANGE)
    .text('EJECUTIVO DE TRAFICO', { continued: true })
  doc.font('Helvetica').fillColor('#333333')
    .text('  las\nacciones para implementar el cumplimiento, además de establecer en formato libre del socio comercial una carta compromiso de cumplimiento a estos requisitos.', { continued: true })
  doc.font('Helvetica').fillColor('#333333')
    .text('\n', { continued: true })
  doc.font('Helvetica-Bold').fillColor(C_ORANGE)
    .text('EJECUTIVO DE TRAFICO', { continued: true })
  doc.font('Helvetica').fillColor('#333333')
    .text(' , registra la calificación y acuerdo para seguimiento en el formato Seguimiento de Solicitud de Acción.')

  doc.y = i3Y + i3H + 8

  // Tabla de acciones (No. | Acciones a Implementar | Fecha de inicio | Fecha de término)
  const aW = [30, 322, 90, 90]    // suma = 532
  const aH = ['No.', 'Acciones a Implementar', 'Fecha de\ninicio', 'Fecha de\ntérmino']
  const AHDR = 22, AROW = 22

  let ax = left
  const ahY = doc.y
  aH.forEach((h, i) => {
    doc.rect(ax, ahY, aW[i], AHDR).fillColor(C_SEC_BG).fill()
    doc.rect(ax, ahY, aW[i], AHDR).strokeColor(C_BLACK).lineWidth(0.5).stroke()
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_BLACK)
      .text(h, ax + 2, ahY + (i < 2 ? 7 : 4), { width: aW[i] - 4, align: 'center' })
    ax += aW[i]
  })
  doc.y = ahY + AHDR

  for (let r = 0; r < 3; r++) {
    const rY = doc.y
    ax = left
    aW.forEach((cw, i) => {
      doc.rect(ax, rY, cw, AROW).strokeColor(C_BLACK).lineWidth(0.5).stroke()
      ax += cw
    })
    doc.y = rY + AROW
  }

  dibujarPie(doc)

  doc.end()
  return doc
}

