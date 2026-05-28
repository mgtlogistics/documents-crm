import PDFDocument from 'pdfkit'
import createPdfList from './createPdfList.js'

/**
 * Escribe un título de sección o cláusula asegurando el control del eje X
 * y previniendo que quede huérfano al final de una página.
 */
function writeSectionTitle(doc, text, contentLeft, contentWidth) {
  if (doc.y > doc.page.height - doc.page.margins.bottom - 60) {
    doc.addPage()
  }
  doc.x = contentLeft
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(text, { width: contentWidth, align: 'left' })
    .moveDown(0.4)
}

/**
 * Escribe un párrafo con alineación justificada controlando estrictamente las coordenadas.
 */
function writeParagraph(doc, text, contentLeft, contentWidth, size = 9) {
  if (doc.y > doc.page.height - doc.page.margins.bottom - 35) {
    doc.addPage()
  }
  doc.x = contentLeft
  doc
    .font('Helvetica')
    .fontSize(size)
    .text(text, { align: 'justify', width: contentWidth })
    .moveDown(0.5)
}

export function generarContratoPrestacionServiciosAgenteAduanal() {
  // 1. CONFIGURACIÓN ESTRUCTURAL (Margen de 60pt óptimo para Letter)
  const doc = new PDFDocument({ size: 'LETTER', margin: 60 })
  const AUTOCOMP = '___________________________'
  
  const contentLeft = doc.page.margins.left
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right

  // 2. ENCABEZADO Y TÍTULO DEL CONTRATO
  doc.x = contentLeft
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('CONTRATO DE PRESTACIÓN DE SERVICIOS PARA EL DESPACHO ADUANAL DE LAS MERCANCÍAS DE COMERCIO EXTERIOR', {
      align: 'center',
      width: contentWidth
    })
    .moveDown(0.4)

  writeParagraph(
    doc,
    'CONTRATO DE PRESTACIÓN DE SERVICIOS PARA EL DESPACHO ADUANAL DE LAS MERCANCÍAS DE COMERCIO EXTERIOR, QUE CELEBRA LA EMPRESA GLOBAL AGENTES ADUANALES Y ASESORES EN COMERCIO EXTERIOR SC, QUE EN ESTE ACTO SERÁ REPRESENTADA POR EL C. LUIS FERNANDO VIÑALS ORTIZ DE LA PEÑA EN SU CARÁCTER DE APODERADO LEGAL Y A QUIEN EN LO SUCESIVO SE LE DENOMINARÁ "EL PRESTADOR", Y POR OTRA PARTE, LA EMPRESA ' + AUTOCOMP + ' REPRESENTADA EN ESTE ACTO POR EL C. ' + AUTOCOMP + ' EN SU CARÁCTER DE APODERADO LEGAL Y A QUIEN EN LO SUCESIVO SE LE DENOMINARÁ "EL PRESTATARIO" AL TENOR DE LAS SIGUIENTES DECLARACIONES Y CLÁUSULAS:',
    contentLeft,
    contentWidth
  )

  // 3. SECCIÓN: DECLARACIONES
  writeSectionTitle(doc, 'DECLARACIONES', contentLeft, contentWidth)

  writeSectionTitle(doc, 'A) "EL PRESTADOR" declara por conducto de su representante legal:', contentLeft, contentWidth)
  
  writeParagraph(
    doc,
    '1. Ser una sociedad civil existente de acuerdo con las leyes de los Estados Unidos Mexicanos, según consta en la escritura pública número 1,156 del 15 de junio 2015, otorgada ante la fe del Notario Público número 89 del municipio de Nuevo Laredo, Tamaulipas.',
    contentLeft,
    contentWidth
  )
  writeParagraph(
    doc,
    '2. Que tiene su domicilio fiscal ubicado en la calle Dr. Mier número 4309, Colonia Hidalgo, Nuevo Laredo, Tamaulipas, Código Postal 88160.',
    contentLeft,
    contentWidth
  )
  writeParagraph(
    doc,
    '3. Que su objeto social principal es la facilitación de la prestación de servicios profesionales de las patentes aduanales que la integran, las cuales cuentan con las autorizaciones correspondientes del Servicio de Administración Tributaria (SAT) para operar en las diversas aduanas del país, siendo las siguientes de manera enunciativa mas no limitativa:',
    contentLeft,
    contentWidth
  )

  // Implementación de la lista de patentes con tu helper modular
  const patentes = [
    'Patente Aduanal número 1657, cuyo titular es el C. Luis Fernando Viñals Ortiz de la Peña.',
    'Patente Aduanal número 1794, cuyo titular es el C. Alejandro Alfonso Viñals Ortiz de la Peña.'
  ]
  createPdfList(doc, patentes, {
    type: 'bullet',
    indent: 20,
    fontSize: 9,
    width: contentWidth,
    align: 'justify',
    moveDown: 0.4
  })
  doc.moveDown(0.3)

  writeSectionTitle(doc, 'B) "EL PRESTATARIO" declara por conducto de su representante legal:', contentLeft, contentWidth)
  
  writeParagraph(
    doc,
    '1. Ser una persona moral debidamente constituida y existente de conformidad con las leyes de la República Mexicana, según consta en el instrumento público que acreditará oportunamente mediante copia simple adjunta al expediente de identificación corporativa.',
    contentLeft,
    contentWidth
  )
  writeParagraph(
    doc,
    '2. Que su representante legal cuenta con las facultades necesarias y suficientes para obligar a su representada en los términos de este contrato, manifestando bajo protesta de decir verdad que dichas facultades no le han sido revocadas, modificadas ni limitadas en forma alguna.',
    contentLeft,
    contentWidth
  )
  writeParagraph(
    doc,
    '3. Que tiene su domicilio fiscal en ' + AUTOCOMP + ' con Registro Federal de Contribuyentes (RFC) ' + AUTOCOMP + ', manifestando que se encuentra inscrito de manera regular ante el padrón de importadores y, en su caso, de sectores específicos.',
    contentLeft,
    contentWidth
  )

  writeSectionTitle(doc, 'C) "LAS PARTES" declaran de manera conjunta:', contentLeft, contentWidth)
  
  writeParagraph(
    doc,
    '1. Que se reconocen mutuamente la personalidad jurídica con la que comparecen a la celebración de este acto y manifiestan que es su libre voluntad celebrar el presente instrumento, sin que medie dolo, error, mala fe, violencia ni ningún otro vicio del consentimiento que pudiera invalidarlo.',
    contentLeft,
    contentWidth
  )

  // 4. SECCIÓN: CLÁUSULAS (Texto legal completo del documento modelo)
  writeSectionTitle(doc, 'CLÁUSULAS', contentLeft, contentWidth)

  const clausulasTexto = [
    {
      title: 'PRIMERA. OBJETO DEL CONTRATO.',
      text: 'El presente contrato tiene por objeto regular la prestación de servicios profesionales que "EL PRESTADOR" brindará a "EL PRESTATARIO" para llevar a cabo el despacho aduanero de sus mercancías de comercio exterior, de conformidad con lo establecido en la Ley Aduanera, su Reglamento, las Reglas Generales de Comercio Exterior vigentes y demás disposiciones legales aplicables en la materia.'
    },
    {
      title: 'SEGUNDA. OBLIGACIONES DE "EL PRESTADOR".',
      text: '"EL PRESTADOR" se obliga a ejecutar las siguientes actividades de forma profesional y con estricto apego a derecho: a) Coordinar el despacho aduanero de las mercancías en los plazos convenidos; b) Revisar meticulosamente la documentación proporcionada por "EL PRESTATARIO" para verificar que cumpla con los requisitos fiscales y aduaneros; c) Elaborar y presentar los pedimentos correspondientes ante la autoridad aduanera; d) Efectuar la digitalización y transmisión electrónica de los documentos que integren el expediente en términos de ley; e) Realizar el reconocimiento previo de las mercancías cuando la naturaleza operativa de las mismas así lo requiera para asegurar la correcta clasificación arancelaria.'
    },
    {
      title: 'TERCERA. OBLIGACIONES DE "EL PRESTATARIO".',
      text: '"EL PRESTATARIO" se obliga firmemente a: a) Entregar oportunamente a "EL PRESTADOR" toda la información, documentos y anexos comerciales requeridos en original o copia digital fidedigna para cada operación, garantizando la veracidad de los mismos; b) Proveer con exactitud los datos relativos a la descripción, valor comercial, origen, peso y cantidad de las mercancías; c) Proporcionar los certificados de origen, permisos de regulación no arancelaria, Normas Oficiales Mexicanas (NOM) y cartas técnicas aplicables; d) Mantener su estatus fiscal activo y regular ante el Servicio de Administración Tributaria (SAT); e) Manifestar bajo protesta de decir verdad la veracidad de las manifestaciones de valor.'
    },
    {
      title: 'CUARTA. CLÁUSULA HABILITANTE.',
      text: '"EL PRESTATARIO" habilita de manera expresa y confiere poder a las patentes aduanales designadas por "EL PRESTADOR" para actuar en su nombre y representación en los trámites aduaneros. Lo anterior no exime a "EL PRESTATARIO" de su responsabilidad solidaria o directa respecto de la veracidad de los datos fiscales y comerciales que provea a la agencia.'
    },
    {
      title: 'QUINTA. AVISOS Y CONTINGENCIAS DEL PRESTATARIO.',
      text: '"EL PRESTATARIO" se obliga a avisar inmediatamente por escrito a "EL PRESTADOR" sobre cualquier cambio en su situación corporativa, facultades de sus representantes, suspensión en el padrón de importadores, inicios de facultades de comprobación por parte de las autoridades fiscales o si se encuentra dentro de los supuestos normativos de listados del artículo 69-B del CFF.'
    },
    {
      title: 'SEXTA. AVISOS DE OPERACIÓN DE "EL PRESTADOR".',
      text: '"EL PRESTADOR" informará periódicamente el estatus de las mercancías sujetas a despacho, los resultados de los reconocimientos aduaneros o las incidencias reportadas en la modulación del mecanismo de selección automatizado a través de los canales de comunicación electrónicos previamente pactados por las partes.'
    },
    {
      title: 'SÉPTIMA. EXCLUSIÓN DE RESPONSABILIDAD.',
      text: '"EL PRESTADOR" no será responsable bajo ninguna circunstancia por las sanciones, multas, créditos fiscales o retención de mercancías que deriven de datos falsos, inexactos, alterados u omitidos proporcionados por "EL PRESTATARIO", incluyendo la subvaluación de mercancías o la falsificación de marcas y derechos de propiedad intelectual.'
    },
    {
      title: 'OCTAVA. CORRESPONSALÍAS.',
      text: 'Para la atención de operaciones en aduanas donde "EL PRESTADOR" no cuente con presencia física directa mediante sus patentes propias, este queda plenamente facultado para coordinar el despacho a través de convenios de corresponsalía aduanal con otros agentes aduanales autorizados, manteniendo la supervisión operativa y los estándares de confidencialidad.'
    },
    {
      title: 'NOVENA. DESPACHO MEDIANTE TERCEROS VINCULADOS.',
      text: 'Las partes acuerdan que "EL PRESTADOR" podrá encomendar actividades accesorias u operaciones específicas de despacho a sociedades mercantiles o patentes vinculadas que formen parte de su mismo grupo corporativo, garantizando en todo momento la correcta ejecución del servicio objeto de este contrato.'
    },
    {
      title: 'DÉCIMA. TARIFAS, HONORARIOS Y CUENTAS DE GASTOS.',
      text: '"EL PRESTATARIO" se obliga a cubrir los honorarios profesionales por los servicios de despacho aduanero y las tarifas por servicios complementarios de conformidad con el Anexo de Tarifas vigente firmado por las partes. Asimismo, reembolsará la totalidad de los gastos comprobables realizados por cuenta de este (tales como maniobras, almacenajes, acarreos y validaciones) contra la entrega de la cuenta de gastos documentada.'
    },
    {
      title: 'DÉCIMA PRIMERA. ACTUALIZACIÓN DE TARIFAS.',
      text: 'Las tarifas estipuladas podrán ser revisadas y modificadas de mutuo acuerdo de forma anual o cuando existan condiciones inflacionarias o modificaciones sustanciales en la infraestructura aduanera. "EL PRESTADOR" notificará los cambios con 15 días naturales de anticipación para la aceptación formal del cliente.'
    },
    {
      title: 'DÉCIMA SEGUNDA. SERVICIOS DE CONSULTORÍA Y ASESORÍA.',
      text: 'Los servicios de consultoría especializada en materia de comercio exterior, auditorías preventivas de expedientes o defensas jurídicas que "EL PRESTATARIO" solicite formalmente, se considerarán servicios independientes y se cotizarán por separado, salvo que estén explícitamente incluidos en los paquetes operativos contratados.'
    },
    {
      title: 'DÉCIMA TERCERA. INTEGRACIÓN DEL EXPEDIENTE ELECTRÓNICO ADUANERO.',
      text: 'De conformidad con el artículo 59, fracción V de la Ley Aduanera, "EL PRESTADOR" integrará y conservará un expediente electrónico de cada una de las operaciones realizadas, mismo que estará a disposición de "EL PRESTATARIO". El cliente está obligado a proveer los documentos corporativos necesarios para integrar su expediente de identificación única.'
    },
    {
      title: 'DÉCIMA CUARTA. PREVENCIÓN DE LAVADO DE DINERO (MERCANCÍA VULNERABLE).',
      text: 'Ambas partes declaran conocer las obligaciones derivadas de la Ley Federal para la Prevención e Identificación de Operaciones con Recursos de Procedencia Ilícita (LFPIORPI). "EL PRESTATARIO" garantiza que los recursos económicos utilizados para sus operaciones provienen de fuentes lícitas y que actúa bajo su propia cuenta en beneficio controlador final.'
    },
    {
      title: 'DÉCIMA QUINTA. HORARIOS ORDINARIOS Y SERVICIOS EXTRAORDINARIOS.',
      text: 'Los servicios se prestarán ordinariamente dentro de los días y horas hábiles de operación de las respectivas aduanas. Las solicitudes de servicios urgentes, despachos en días inhábiles o ampliaciones de horario solicitadas por el cliente devengarán los costos administrativos y operativos extraordinarios previstos.'
    },
    {
      title: 'DÉCIMA SÉPTIMA. CONFIDENCIALIDAD.',
      text: 'Las partes se comprometen a guardar estricta confidencialidad sobre toda la información técnica, comercial, fiscal o financiera que se transmitan con motivo de este contrato. Esta obligación subsistirá de forma indefinida aun después de terminada la relación contractual.'
    },
    {
      title: 'DÉCIMA OCTAVA. AUSENCIA DE CONFLICTOS DE INTERÉS.',
      text: '"EL PRESTADOR" manifiesta bajo protesta de decir verdad que no cuenta con compromisos comerciales, parentescos ni nexos económicos con proveedores o transportistas de "EL PRESTATARIO" que pudiesen comprometer la objetividad de sus clasificaciones arancelarias.'
    },
    {
      title: 'DÉCIMA NOVENA. PROPIEDAD INTELECTUAL DEL CLIENTE.',
      text: 'Las marcas, logotipos, patentes industriales, software y sistemas propiedad de "EL PRESTATARIO" compartidos para la operación aduanera o etiquetado comercial seguirán siendo de su dominio exclusivo, prohibiéndose su explotación por el prestador para fines ajenos al contrato.'
    },
    {
      title: 'VIGÉSIMA. CESIÓN DE DERECHOS PROHIBIDA.',
      text: 'Ninguna de las partes podrá ceder, transferir ni delegar los derechos y obligaciones derivados del presente contrato a favor de un tercero ajeno a su grupo corporativo sin el consentimiento previo, expreso y por escrito de la otra parte.'
    },
    {
      title: 'VIGÉSIMA PRIMERA. NOTIFICACIONES Y DOMICILIOS.',
      text: 'Todos los avisos, requerimientos, notificaciones y demás comunicaciones que las partes deban dirigirse se realizarán por escrito y de forma fehaciente en los domicilios fiscales señalados en el apartado de Declaraciones o en los correos electrónicos operativos autorizados.'
    },
    {
      title: 'VIGÉSIMA SEGUNDA. CLÁUSULA ANTICORRUPCIÓN COMPLETA.',
      text: 'LAS PARTES se obligan recíprocamente a mantener en todo momento los más altos estándares éticos y legales en todas sus actividades relacionadas con el presente contrato. Se prohíbe expresamente cualquier forma de corrupción, incluyendo, pero no limitado a sobornos, sobornos comerciales, lavado de dinero, fraude, extorsión, tráfico de influencias y cualquier otra actividad ilegal o antiética. Esta cláusula anticorrupción constituye una parte integral de este CONTRATO y será vinculante para LAS PARTES, quienes acuerdan que cualquier controversia relacionada con esta cláusula se resolverá de acuerdo con las leyes aplicables.'
    },
    {
      title: 'VIGÉSIMA TERCERA. JURISDICCIÓN Y COMPETENCIA.',
      text: 'Para la interpretación y cumplimiento del presente contrato, así como para todo aquello que no se encuentre expresamente estipulado en el mismo, las partes se someten a la jurisdicción y competencia de los tribunales federales ubicados en la Ciudad de México, renunciando expresamente al fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros.'
    }
  ]

  // Renderizado secuencial e ininterrumpido de las cláusulas
  for (const clausula of clausulasTexto) {
    writeSectionTitle(doc, clausula.title, contentLeft, contentWidth)
    writeParagraph(doc, clausula.text, contentLeft, contentWidth)
  }

  // 5. CIERRE DEL DOCUMENTO Y TRANSICIÓN A FIRMAS
  // Evaluamos espacio necesario para el cierre y los dos bloques de firmas consecutivos (requiere aprox 250pt)
  if (doc.y > doc.page.height - doc.page.margins.bottom - 250) {
    doc.addPage()
  }

  writeParagraph(
    doc,
    'Enterados del contenido y alcance del presente instrumento, las partes lo firman por triplicado en unión de dos testigos en la ciudad de Nuevo Laredo, Tamaulipas.',
    contentLeft,
    contentWidth
  )

  doc.moveDown(1.5)

  // 6. BLOQUE DE FIRMAS CON MATRICES DE COORDENADAS PERFECTAS
  const colWidth = 200
  const leftColX = contentLeft + 15
  const rightColX = contentLeft + contentWidth - colWidth - 15

  // --- PARTE 1: FIRMAS DE LOS APODERADOS LEGALES ---
  let baseSignatureY = doc.y

  doc.font('Helvetica-Bold').fontSize(9)
  doc.text('“EL PRESTADOR”', leftColX, baseSignatureY, { width: colWidth, align: 'center' })
  doc.text('“EL PRESTATARIO”', rightColX, baseSignatureY, { width: colWidth, align: 'center' })

  // Forzamos el espacio en blanco vertical para la rúbrica manual (55 puntos)
  doc.x = contentLeft
  doc.y = baseSignatureY + 55
  baseSignatureY = doc.y

  doc.font('Helvetica').fontSize(9)
  doc.text('__________________________', leftColX, baseSignatureY, { width: colWidth, align: 'center' })
  doc.text('__________________________', rightColX, baseSignatureY, { width: colWidth, align: 'center' })
  
  doc.text('Representante Legal\nNombre y Firma', leftColX, doc.y, { width: colWidth, align: 'center' })
  doc.text('Representante Legal\nNombre y Firma', rightColX, baseSignatureY + 12, { width: colWidth, align: 'center' })

  // Separación fija controlada hacia el bloque de testigos
  doc.x = contentLeft
  doc.y = doc.y + 40

  // --- PARTE 2: FIRMAS DE LOS TESTIGOS ---
  baseSignatureY = doc.y

  doc.font('Helvetica-Bold').fontSize(9)
  doc.text('TESTIGO 1', leftColX, baseSignatureY, { width: colWidth, align: 'center' })
  doc.text('TESTIGO 2', rightColX, baseSignatureY, { width: colWidth, align: 'center' })

  doc.x = contentLeft
  doc.y = baseSignatureY + 55
  baseSignatureY = doc.y

  doc.font('Helvetica').fontSize(9)
  doc.text('__________________________', leftColX, baseSignatureY, { width: colWidth, align: 'center' })
  doc.text('__________________________', rightColX, baseSignatureY, { width: colWidth, align: 'center' })
  
  doc.text('Nombre y Firma', leftColX, doc.y, { width: colWidth, align: 'center' })
  doc.text('Nombre y Firma', rightColX, baseSignatureY + 12, { width: colWidth, align: 'center' })

  doc.end()
  return doc
}