import PDFDocument from 'pdfkit'
import createPdfList from './utils/createPdfList.js'
import getLegalRepresentativeFullName from './utils/getLegalRepresentativeFullName.js'
import formatLongDate from './utils/formatLongDate.js'
import formatFullAddress from './utils/formatFullAddress.js'
import { writeSectionTitle, writeParagraph } from './utils/writeManagedParagraph.js'
import writeStylizedParagraph from './utils/writeStylizedParagraph.js'

export function generarContratoPrestacionServiciosAgenteAduanalLeonel(data) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 60 })
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right

  const company = data?.user?.company || {}
  const address = data?.user?.address || {}
  const publicDeed = company?.publicDeed || {}
  const deedNotary = publicDeed?.notary || {}
  const powerOfAttorney = company?.powerOfAttorney || {}
  const powerNotary = powerOfAttorney?.notary || {}

  const socialReason = company.socialReason || 'No llenado'
  const rfc = company.rfc || 'No llenado'
  const representativeFullName = getLegalRepresentativeFullName(company)
  const clientAddressText = formatFullAddress(address)

  const publicDeedNumber = publicDeed.number || 'No llenado'
  const publicDeedDateText = formatLongDate(publicDeed.date)
  const deedNotaryNumber = deedNotary.number || 'No llenado'
  const deedNotaryCity = deedNotary.city || 'No llenado'
  const deedNotaryState = deedNotary.state || 'No llenado'
  const deedNotaryName = deedNotary.name || 'No llenado'
  const mercantileFolio = publicDeed?.publicRegistry?.mercantileFolio || 'No llenado'
  const registrationDateText = publicDeed?.registrationDate
    ? formatLongDate(publicDeed.registrationDate)
    : 'No llenado'

  
  const powerNumber = powerOfAttorney.number || 'No llenado'
  const powerDateText = formatLongDate(powerOfAttorney.date)
  const powerNotaryNumber = powerNotary.number || 'No llenado'
  const powerNotaryCity = powerNotary.city || 'No llenado'
  const powerNotaryState = powerNotary.state || 'No llenado'

  const today = new Date()
  const signatureDay = today.getDate()
  const signatureMonth = today.toLocaleString('es-MX', { month: 'long' })
  const signatureYear = today.getFullYear()

  const paragraphOptions = { width: contentWidth }

  // TÍTULO
  doc.x = doc.page.margins.left
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .text(
      'CONTRATO DE PRESTACIÓN DE SERVICIOS QUE CELEBRAN POR UNA PARTE LA SOCIEDAD MERCANTIL DENOMINADA "' +
      socialReason.toUpperCase() +
      '." REPRESENTADA POR ' +
      representativeFullName.toUpperCase() +
      ', EN LO SUCESIVO DENOMINADA "EL CLIENTE", Y POR LA OTRA, LEONEL ERNESTO CANTU LOZANO, EN SU CARÁCTER DE AGENTE ADUANAL, QUIENES EN CONJUNTO SE LES DENOMINARÁ "LAS PARTES", AL TENOR DE LAS SIGUIENTES DECLARACIONES Y CLAUSULAS:',
      { align: 'justify', width: contentWidth }
    )
    .moveDown(0.8)

  // DECLARACIONES
  writeSectionTitle(doc, 'DECLARACIONES', paragraphOptions)
  writeParagraph(doc, 'I.- Declara "EL CLIENTE" por conducto de su representante legal:', { ...paragraphOptions, bold: false })

  writeStylizedParagraph(doc, [
    { text: 'A) Ser una sociedad mercantil legalmente constituida conforme a las leyes mexicanas, según consta en la escritura pública número ' },
    { text: publicDeedNumber, isBold: true },
    { text: ' de fecha ' },
    { text: publicDeedDateText, isBold: true },
    { text: ', otorgada ante la fe del notario público número ' },
    { text: deedNotaryNumber, isBold: true },
    { text: ' de ' },
    { text: `${deedNotaryCity}, ${deedNotaryState}`, isBold: true },
    { text: ', licenciado ' },
    { text: deedNotaryName, isBold: true },
    { text: ', y debidamente inscrita en el Registro Público de Comercio de ' },
    { text: deedNotaryCity, isBold: true },
    { text: ', en el folio mercantil no. ' },
    { text: mercantileFolio, isBold: true },
    { text: ' con fecha ' },
    { text: registrationDateText, isBold: true },
    { text: '.' },
  ], paragraphOptions)

  writeStylizedParagraph(doc, [
    { text: 'B) Tener su domicilio en ' },
    { text: clientAddressText, isBold: true },
    { text: ', y estar debidamente inscrita ante la Secretaria de Hacienda y Crédito Público, bajo el Registro Federal de Contribuyentes número ' },
    { text: rfc, isBold: true },
    { text: '.' },
  ], paragraphOptions)

  writeStylizedParagraph(doc, [
    { text: 'C) Que su representante, ' },
    { text: representativeFullName, isBold: true },
    { text: ' cuenta con facultades suficientes para suscribir este instrumento, las cuales no le han sido limitadas o revocadas, acreditando tal carácter con la escritura pública número ' },
    { text: powerNumber, isBold: true },
    { text: ' otorgada ante la fe del notario público número ' },
    { text: powerNotaryNumber, isBold: true },
    { text: ' de ' },
    { text: powerNotaryCity, isBold: true },
    { text: ', Estado de ' },
    { text: powerNotaryState, isBold: true },
    { text: ' con fecha ' },
    { text: powerDateText, isBold: true },
    { text: '.' },
  ], paragraphOptions)

  writeParagraph(
    doc,
    'D) Que, bajo protesta de decir verdad: (a) no tiene vinculación, en términos de lo previsto en el artículo 68 de la Ley Aduanera, con contribuyentes que se encuentren en el listado a que se refiere el artículo 69-B, cuarto párrafo del Código Fiscal de la Federación; y (b) no se le ha emitido ni notificado resolución que determine que emite falsos comprobantes fiscales, en términos del artículo 49 Bis del Código Fiscal de la Federación.',
    paragraphOptions
  )

  writeStylizedParagraph(doc, [
    { text: 'E) Que se obliga a proporcionar a ' },
    { text: '"EL AGENTE ADUANAL" ', isBold: true },
    { text: 'la información y documentación necesaria para integrar y mantener actualizado el expediente electrónico del usuario y de las operaciones de comercio exterior, así como a permitir y facilitar las verificaciones que ' },
    { text: '"LA AGENCIA ADUANAL" ', isBold: true },
    { text: 'deba realizar conforme a la Ley Aduanera, el Código Fiscal de la Federación y las Reglas Generales de Comercio Exterior vigentes (incluyendo consultas a padrones, listados y sistemas oficiales).' },
  ], paragraphOptions)

  writeParagraph(doc, 'F) Que a la fecha de firma del presente cumple con sus obligaciones fiscales, aduaneras y de comercio exterior.', { ...paragraphOptions, bold: true })

  writeParagraph(
    doc,
    'G) Que las mercancías objeto de las operaciones del presente contrato corresponden del programa de exportación autorizado por la Secretaría de Economía y, en su caso, al registro otorgado al importador, en términos de los artículos 28-A, primer párrafo de la Ley del Impuesto al Valor Agregado y 15-A, primer párrafo de la Ley del Impuesto Especial sobre Producción y Servicios y 100-A de la Ley Aduanera.',
    { ...paragraphOptions, bold: true }
  )

  writeParagraph(
    doc,
    'H) Que tratándose del régimen de importación temporal de mercancías para retornar al extranjero después de haberse destinado a un proceso de elaboración, transformación o reparación a un proceso de elaboración las mercancías importadas temporalmente, la mercancía objeto de despacho aduanera será únicamente la que se encuentra autorizada como insumos para los referidos procesos.',
    { ...paragraphOptions, bold: true }
  )

  writeParagraph(
    doc,
    'I) Que desea contratar los servicios en materia de comercio exterior que ofrece la Agencia Aduanal relativos al despacho aduanero y todos los actos y formalidades inherentes al mismo; incluyendo, sin limitación, el correspondiente pago de los impuestos y demás derechos y aprovechamientos que, en su caso, se generen.',
    paragraphOptions
  )

  writeStylizedParagraph(doc, [
    { text: 'II.- Declara ' },
    { text: '"EL AGENTE ADUANAL":', isBold: true },
  ], { ...paragraphOptions, reserved: 60 })

  writeParagraph(
    doc,
    'A) Tener su domicilio en Calle Avenida Álvaro Obregón, número 101-C, Colonia Medardo González, Código Postal 88550, Ciudad Reynosa Tamaulipas.',
    paragraphOptions
  )
  writeParagraph(
    doc,
    'B) Que cuenta con la Patente 1615 autorizada por la Secretaria de Hacienda y Crédito Público para operar por la Aduana de Reynosa Tamaulipas.',
    paragraphOptions
  )
  writeParagraph(
    doc,
    'C) Que cuenta con los medios de cómputo y transmisión de datos enlazados con el sistema electrónico aduanero del Servicio de Administración Tributaria, así como que lleva un registro simultáneo de las operaciones de comercio exterior.',
    paragraphOptions
  )
  writeParagraph(
    doc,
    'D) Que en la fecha de firma del presente contrato, se encuentra al corriente en el cumplimiento de las obligaciones fiscales que le corresponden, así como con aquellas que resulten aplicables en materia de comercio exterior.',
    paragraphOptions
  )

  writeStylizedParagraph(doc, [
    { text: 'III.- Declaran ' },
    { text: '"LAS PARTES":', isBold: true },
  ], { ...paragraphOptions, reserved: 60 })

  writeParagraph(
    doc,
    'A) Que reconocen la personalidad jurídica entre ellos y se encuentran conformes en obligarse al contenido del presente contrato, para lo cual no hubo ningún vicio que pudiera afectar o restar eficacia al consentimiento otorgado por cada una de ellas, por lo que expresamente renuncian a invocarlos en cualquier tiempo.',
    paragraphOptions
  )
  writeParagraph(
    doc,
    'B) Que intercambiarán comunicaciones por cualquier medio electrónico, de manera enunciativa más no limitativa, como correo electrónico, WhatsApp, mensajes de texto, etc.',
    paragraphOptions
  )

  // CLÁUSULAS
  writeSectionTitle(doc, 'CLÁUSULAS', paragraphOptions)

  const clausulas = [
    {
      title: 'PRIMERA. - OBJETO.',
      text: 'El objeto del presente contrato consiste en que "EL AGENTE ADUANAL" preste los servicios profesionales incluyendo, sin limitación, servicios de asesoría, apoyo, trámite, gestión, revisión y todos aquellos servicios inherentes al despacho aduanero de mercancías que le encomiende "EL CLIENTE", así como otros servicios relacionados con la importación y exportación de mercancías.\n\nLa solicitud expresa de "EL CLIENTE" a "EL AGENTE ADUANAL" para la prestación de un servicio podrá hacerse de manera verbal y escrita, ya sea en papel, electrónicamente, y será expresada o firmada únicamente por el personal autorizado de "EL CLIENTE".',
    },
    {
      title: 'SEGUNDA. - TÉRMINO Y TERMINACIÓN.',
      text: 'El término del presente contrato será por un año a partir de la fecha de su firma. Previo a su vencimiento, y con una anticipación de quince (15) días naturales, las partes acuerdan que revisarán tanto las tarifas y gastos de servicio previstas en la cotización correspondiente, cuanto las cláusulas del mismo para que éste pueda ser renovado, cancelado o sustituido por uno nuevo.\n\n"EL CLIENTE" podrá dar por terminado el presente contrato en el momento que así lo decida, notificando por escrito a "EL AGENTE ADUANAL" con diez (10) días naturales de anticipación a la fecha efectiva de terminación. Si existiera dolo, mala fe o negligencia en los servicios que la agencia proporciona, o cualquier otra situación que "EL CLIENTE" considere que pueda poner en riesgo su operación, imagen o intereses, podrá dar por terminado el presente contrato de forma inmediata.\n\n"EL AGENTE ADUANAL" podrá dar por terminado el presente contrato en el momento que así lo decida, notificando por escrito al representante legal de "EL CLIENTE" con al menos díez (10) días naturales de anticipación a la fecha efectiva de terminación.\n\nSin perjuicio de lo anterior, "EL AGENTE ADUANAL" podrá suspender de inmediato la prestación de los servicios y/o dar por terminado el presente contrato, sin responsabilidad, cuando: (i) "EL CLIENTE" incumpla con la entrega o actualización del Expediente del Usuario; (ii) se detecte información o documentación falsa, alterada, incompleta o inconsistente; (iii) "EL CLIENTE" sea publicado en listados a que se refiere el artículo 69-B, 69-B Bis, 69 o 49 Bis del Código Fiscal de la Federación, o se le determine emisión de falsos comprobantes fiscales; (iv) se soliciten instrucciones contrarias a derecho; o (v) cualquier hecho que, a juicio razonable de "EL AGENTE ADUANAL", implique riesgo de responsabilidad, sanción o afectación a su patente o autorizaciones. En estos supuestos, "EL CLIENTE" cubrirá los servicios efectivamente prestados y los gastos devengados.\n\n"LAS PARTES" se comprometen a finiquitar cualquier obligación derivada de este contrato, que se encuentre pendiente al momento de rescindir, cancelar o dar por terminado el presente contrato.\n\nEl contrato también se dará por terminado cuando se cancele el encargo conferido por parte de "EL CLIENTE", y se le deberá dar aviso a "EL AGENTE ADUANAL".\n\nSi la patente que permite a "EL AGENTE ADUANAL" operar con tal carácter, fuera suspendida, deberá garantizar la continuidad de todos y cada uno de los servicios contratados en calidad y costo, mediante el servicio de uno o más terceros, previamente autorizados por "EL CLIENTE", y por quien o quienes "EL AGENTE ADUANAL" responderá plena y solidariamente, mientras "EL CLIENTE" designa a un nuevo agente aduanal para el despacho de sus mercancías.\n\nLa cancelación de la patente del "EL AGENTE ADUANAL" será causa suficiente para dar por rescindido el presente contrato.\n\nEn caso de cancelación del presente contrato promovida por "EL CLIENTE", "EL AGENTE ADUANAL" se compromete a dejar de hacer despachos aduanales en nombre de "EL CLIENTE", o sus compañías afiliadas, a partir de la fecha de cancelación, aun cuando la encomienda otorgada por "EL CLIENTE" a "EL AGENTE ADUANAL" aun esté vigente ante cualquier autoridad aduanera o fiscal.',
    },
    {
      title: 'TERCERA. - FORMALIDADES.',
      text: 'Con el propósito de abrir e integrar el expediente del usuario (el "Expediente del Usuario") y dar cumplimiento a las disposiciones aplicables, "EL CLIENTE" proporcionará a "EL AGENTE ADUANAL" copia legible, vigente y completa de la información y documentación mínima prevista en el ANEXO "A" del presente contrato, así como la documentación adicional que resulte necesaria según el régimen aduanero, las mercancías, el INCOTERM, las regulaciones y restricciones no arancelarias y demás particularidades de cada operación.\n\n"EL CLIENTE" se obliga a mantener actualizado el Expediente del Usuario. Cualquier cambio de domicilio fiscal u operativo, representante legal, socios/accionistas, actividad, infraestructura o medios empleados en sus actividades deberá notificarse por escrito a "EL AGENTE ADUANAL" dentro de los cinco (5) días hábiles siguientes, acompañando la documentación soporte correspondiente.\n\n"EL CLIENTE" se obliga a proveer a "EL AGENTE ADUANAL", con la oportunidad, claridad y precisión necesarias todos los elementos para la realización del despacho aduanero de mercancías, incluyendo, de manera enunciativa, los siguientes:',
      list: {
        type: 'numbered',
        items: [
          'Manifestación de Valor, así como todos los documentos e información que prueban la correcta determinación del valor en aduana de las mercancías, entre otros, los siguientes: (a) Factura comercial; (b) el conocimiento de embarque, lista de empaque, guía aérea o demás documentos de transporte; (c) El que compruebe el origen cuando corresponda, y la procedencia de las mercancías; (d) En el que conste la garantía a que se refiere el inciso e), fracción I del artículo 36-A de la Ley Aduanera; (e) En el que conste el pago de las mercancías, tales como la transferencia electrónica del pago o carta de crédito; (f) El relativo a los gastos de transporte, seguros y gastos conexos que correspondan a la operación de que se trate; (g) Contratos relacionados con la transacción de la mercancía objeto de la operación; (h) Los que soporten los conceptos incrementables a que se refiere el artículo 65 de la Ley Aduanera; (i) Los demás documentos e información, necesaria que "EL CLIENTE" consideró para la determinación de valor en aduana de la mercancía.',
          'Descripción de las mercancías, detallando la cantidad, valor y demás datos que permitan su identificación, así como las marcas y el número total de bultos que contienen las mercancías.',
          'Relación de todas las facturas que serán amparadas en el pedimento correspondiente, indicando las fechas de cada una y datos completos de los proveedores.',
          'Carta de no-comercialización.',
          'Carta técnica (en su caso).',
          'Carta de encomienda.',
          'Carta de traducción.',
          'En su caso, carta de exclusión de las Normas Oficiales Mexicanas.',
          'Los documentos con los que se compruebe el cumplimiento de las regulaciones y restricciones no arancelarias.',
          'Los INCOTERMS aplicables.',
          'En caso de que la mercancía sea de difícil clasificación, "EL CLIENTE" deberá entregar un análisis químico o de laboratorio en donde se detallen las características de dichas mercancías suficientes para determinar la clasificación arancelaria y número de identificación comercial.',
          'Los documentos e información que acredite los recursos empleados en la operación y la efectiva realización de esta, entre otros: (a) Los comprobantes fiscales digitales por Internet; (b) Las facturas comerciales o documentos equivalentes; (c) La documentación que sustente los conceptos que se suman al valor de transacción de las mercancías importadas y aquellos que no se comprendan en dicho valor, conforme a los artículos 65 y 66 de esta Ley; y (d) Cualquier otro documento o registro, que se señale mediante reglas, que demuestre la efectiva realización de la operación de comercio exterior, carta instrucciones, correos electrónicos.',
          'La información, documentación evidencias en la que se advierta la veracidad de cada una de las Declaraciones de "EL CLIENTE" en el presente contrato.',
        ],
      },
      after: 'La integración y actualización del Expediente del Usuario es condición para que "EL AGENTE ADUANAL" acepte el encargo conferido y promueva operaciones. La falta de entrega, actualización o consistencia de la información y documentación facultará a "EL AGENTE ADUANAL" a suspender temporalmente la atención de operaciones o a rechazar el encargo conferido, sin responsabilidad, hasta en tanto "EL CLIENTE" subsane lo conducente.\n\nPor otro lado, "EL AGENTE ADUANAL" se obliga a realizar los trámites que le sean encomendados por "EL CLIENTE" a más tardar en los tiempos pactados con "EL CLIENTE", siempre que no existan causas no atribuibles a "EL AGENTE ADUANAL" que impidan el despacho de las mercancías en tiempo y forma. Asimismo, "EL AGENTE ADUANAL" se obliga a liberar las mercancías de que se trate en el lugar que le sea indicado en los términos y tiempos establecidos por "EL CLIENTE", corriendo a cargo de este el traslado de la mercancía.\n\n"EL AGENTE ADUANAL" formará un expediente electrónico de cada pedimento o documento aduanero en que intervenga, en el formato en que se haya transmitido, incluyendo anexos y acuses, y lo conservará como parte de su contabilidad por los plazos legales. Adicionalmente, conservará el original de la manifestación de valor y el soporte del encargo conferido (y su acuse, cuando sea electrónico).\n\n"EL AGENTE ADUANAL" podrá no aceptar el encargo conferido si "EL CLIENTE" no entrega la documentación e información suficiente, para la determinación del régimen aduanero de las mercancías, de su correcta clasificación arancelaria, de la exacta determinación del número de identificación comercial, los documentos que acrediten el cumplimiento materia de regulaciones y restricciones no arancelarias rijan para dichas mercancías, así como la información y documentación que acredite la correcta determinación del valor en aduana de las mercancías y los recursos empleados en la operación y la efectiva realización de la misma.\n\nLos expedientes electrónicos a que se refiere el párrafo anterior serán proporcionados a "EL CLIENTE", sin cargo adicional, dentro de los cinco (5) días hábiles siguientes al despacho, a través del medio acordado por las Partes ([PORTAL/REPOSITORIO/ENTREGA SEGURA]). "EL CLIENTE" reconoce su obligación de conservar dichos expedientes conforme a la legislación aplicable.\n\n"EL CLIENTE" autoriza a "EL AGENTE ADUANAL" a digitalizar, almacenar y resguardar la documentación soporte relacionada con las operaciones. Cuando la normativa exija la conservación de originales en la esfera de control de "EL CLIENTE", éste será responsable de su guarda, conservación y exhibición a la autoridad cuando sea requerido.',
    },
    {
      title: 'CUARTA. - RESPONSABILIDAD DE LAS PARTES.',
      text: '"LAS PARTES" declaran conocer el alcance y valor de los artículos 41 y 54 de la Ley Aduanera, por lo que "EL AGENTE ADUANAL" actuará, en el ámbito del presente contrato, como representante de "EL CLIENTE" exclusivamente para efectos del despacho aduanero y actos inherentes ante autoridades, auxiliares y sistemas electrónicos aplicables. Dicha representación no constituye un mandato general ni faculta a "EL AGENTE ADUANAL" para realizar actos distintos a los estrictamente vinculados con el despacho aduanero, salvo pacto expreso por escrito.\n\n"EL CLIENTE" será responsable de la veracidad, exactitud y autenticidad de la información y documentación que proporcione o valide, así como de las consecuencias derivadas de su inexactitud u omisión. "EL AGENTE ADUANAL" será responsable por la correcta integración y transmisión de la información del pedimento conforme a la documentación recibida y por actuar con la diligencia debida dentro de su esfera de control.\n\nEn el supuesto de que "EL AGENTE ADUANAL" incurra en responsabilidad directa ante las autoridades aduaneras o fiscales, en el pago de diferencias de contribuciones, cuotas compensatorias, multas, recargos y demás accesorios, o por incumplimiento de regulaciones y restricciones no arancelarias; así como en procedimientos de suspensión, cancelación o inhabilitación de alguna de las patentes o autorizaciones, cuando ello derive total o parcialmente de la inexactitud, falsedad, omisión o inconsistencia en la información y documentos proporcionados por "EL CLIENTE", éste se obliga a sacar en paz y a salvo e indemnizar a "EL AGENTE ADUANAL" por la pérdida o menoscabo patrimonial que se le ocasione, incluyendo gastos y honorarios de defensa, en términos de la legislación civil aplicable.',
    },
    {
      title: 'QUINTA. - HONORARIOS Y FORMA DE PAGO.',
      text: '"EL CLIENTE" pagará a "EL AGENTE ADUANAL", como contraprestación por los servicios objeto de este contrato, las cantidades que resulten de acuerdo a la tarifa detallada en la cotización correspondiente, misma que forma parte integrante del presente. Dicha tarifa será revisada anualmente, y las actualizaciones, ajustes y modificaciones que se hagan a tal tarifa, que sean firmadas y fechadas por las partes, constituirán, en su momento, la tarifa subsiguiente que formará parte del presente contrato a partir de su fecha de firma. Se entiende comprendida en la contraprestación la integración, conservación y entrega a "EL CLIENTE" de los expedientes electrónicos por operación previstos en la cláusula Tercera, salvo servicios extraordinarios o adicionales que se cotizarán por separado.\n\nPara la obtención del pago a que se refiere el párrafo que antecede, "EL AGENTE ADUANAL" enviara a las oficinas de "EL CLIENTE" sus facturas y/o recibos de honorarios a revisión, acompañadas de los pedimentos originales y demás documentación comprobatoria, acordando con el "EL CLIENTE" lo que se refiere a horarios de revisión y pagos. El plazo de pago es de XXX días a partir de la recepción de la factura por parte de "EL CLIENTE" a excepción de las operaciones definitivas que se tienen que pagar al día siguiente.',
    },
    {
      title: 'SEXTA. - IMPUESTOS Y CONTRIBUCIONES.',
      text: '"EL CLIENTE" es responsable de todos y cada uno de los impuestos y contribuciones al comercio exterior que conforme a la ley le corresponda pagar. Por tanto, "EL AGENTE ADUANAL" solicitará a "EL CLIENTE" con la debida anticipación los fondos necesarios para que por cuenta de "EL CLIENTE" presente las declaraciones y pague los impuestos y contribuciones, para que no exista ningún atraso o dificultad en la operación de que se trate. Dichos fondos serán utilizados única y exclusivamente para tal fin, pudiendo considerar el Pago Electrónico de Comercio Exterior (PECE).',
    },
    {
      title: 'SÉPTIMA. - CONFIDENCIALIDAD.',
      text: '"EL AGENTE ADUANAL" acepta y se obliga con "EL CLIENTE" respecto de la conservación de toda la información que ésta le transmita o genere con motivo de la firma del presente documento y de las operaciones que realicen al amparo del mismo, así como la información y especificaciones técnicas relacionadas con el mismo, que deberán ser manejadas como información confidencial sin importar el medio a través del cual sean reveladas, por lo que constituyen secretos industriales (en lo sucesivo "Información Confidencial").\n\n"EL AGENTE ADUANAL" podrá proporcionar la Información Confidencial únicamente a su propio personal, siempre que éste tenga la necesidad de conocer dicha información para proceder únicamente a realizar los fines especificados en el presente documento, en los pedidos y en aquellos contratos o convenios que, en su caso, llegaren a celebrar. Por tal motivo, "EL AGENTE ADUANAL" dará instrucciones a su propio personal en relación con el deber de confidencialidad que deben guardar respecto de la Información Confidencial y sobre las penalidades a las cuales estarán sujetos en caso de incumplimiento.\n\nCada una de las partes reconoce y acepta que la Información Confidencial que haya recibido por cualquier medio o forma y en cualquier momento, así como aquella que en lo futuro reciba conforme a este documento, a los pedidos y a los contratos o convenios que, en su caso, llegaren a celebrar, es y continuará siendo propiedad exclusiva de la parte que la emita.',
    },
    {
      title: 'OCTAVA. RELACION LABORAL',
      text: 'Ambas partes expresamente reconocen que la relación laboral de los trabajadores, empleados, dependientes, apoderados y/o agentes que participen en la prestación de los servicios materia del presente contrato, corresponde directamente a "EL AGENTE ADUANAL", por lo que "EL CLIENTE" no tendrá responsabilidad alguna en relación con su conducta o actuaciones.\n\nEl presente contrato es de naturaleza civil y se celebra como prestación de servicios profesionales. En consecuencia, no existe relación laboral, de subordinación o dependencia entre "LAS PARTES", ni entre una Parte y el personal de la otra, por lo cual cada Parte será la única responsable de sus obligaciones laborales, de seguridad social y demás aplicables respecto de su propio personal.',
    },
    {
      title: 'NOVENA. - CASO FORTUITO O FUERZA MAYOR.',
      text: 'Ninguna de "LAS PARTES" será responsable de cualquier retraso o incumplimiento de la ejecución del objeto de este contrato, que resulte directa o indirectamente de caso fortuito o fuerza mayor, particularmente por emergencia, accidente, incendio, sismo, inundación, tormenta, huelga, paro de labores o cualquier otro hecho o impedimento que la parte afectada pruebe que estuvo fuera de su control y no pudo prever los hechos al momento de la celebración del presente contrato o evitar o superar los mismos, o de evitar o superar sus consecuencias, en la inteligencia de que, una vez superados estos eventos, se reanudaran las actividades en la forma y términos que determinen "LAS PARTES".',
    },
    {
      title: 'DÉCIMA. - NO CESIÓN',
      text: '"LAS PARTES" no podrán ceder o transmitir total o parcialmente sus derechos, intereses y obligaciones conforme al presente contrato.',
    },
    {
      title: 'DÉCIMA PRIMERA.- NOTIFICACIONES.',
      text: 'Cualquier notificación conforme a este contrato deberá realizarse por escrito y podrá entregarse (i) personalmente; (ii) por servicio de mensajería comercial con acuse de recibo; o (iii) por correo electrónico a las direcciones que "LAS PARTES" designen por escrito. Las notificaciones se considerarán recibidas en la fecha y hora que conste en el acuse de recibo o, tratándose de correo electrónico, en el acuse de entrega del servicio de correo, salvo prueba en contrario.\n\nDe igual forma, ambas partes se obligan a notificar a su contraparte, a más tardar el siguiente día hábil en que sea recibida o conocida, cualquier comunicación, citatorio, requerimiento, resolución y/o notificación (incluyendo las practicadas o disponibles en sistemas electrónicos y buzones oficiales) de autoridades aduaneras, fiscales y/o de cualquier ámbito gubernamental referente a cualquier trámite o despacho aduanero en el que ambas hayan participado.',
    },
    {
      title: 'DÉCIMA SEGUNDA. - IDIOMAS.',
      text: 'Este contrato se celebra en el idioma español.',
    },
    {
      title: 'DÉCIMA TERCERA. - JURISDICCIÓN.',
      text: 'Los comparecientes se someten a los Tribunales de la Ciudad de Reynosa Tamaulipas, para los efectos de la interpretación y cumplimiento de este contrato, haciendo renuncia expresa al fuero distinto que por razón de su domicilio presente o futuro pueda o pudiere corresponderles.',
    },
  ]

  clausulas.forEach((clausula) => {
    writeSectionTitle(doc, clausula.title, paragraphOptions)
    clausula.text.split('\n\n').forEach((paragraph) => {
      writeParagraph(doc, paragraph, paragraphOptions)
    })

    if (clausula.list) {
      createPdfList(doc, clausula.list.items, {
        type: clausula.list.type,
        indent: 20,
        fontSize: 9,
        width: contentWidth,
        align: 'justify',
        moveDown: 0.4,
      })
      doc.moveDown(0.3)
    }

    if (clausula.after) {
      clausula.after.split('\n\n').forEach((paragraph) => {
        writeParagraph(doc, paragraph, paragraphOptions)
      })
    }
  })

  // ANEXOS
  writeSectionTitle(doc, 'ANEXOS (FORMAN PARTE INTEGRANTE DEL PRESENTE CONTRATO):', paragraphOptions)

  writeSectionTitle(
    doc,
    'ANEXO "A".- DOCUMENTACIÓN MÍNIMA PARA INTEGRAR Y ACTUALIZAR EL EXPEDIENTE DEL USUARIO (LEY ADUANERA, ARTÍCULO 162, FRACCIÓN VI; RGCE 2026, REGLA 1.4.14).',
    paragraphOptions
  )

  createPdfList(doc, [
    'Identificación oficial vigente del representante legal y, en su caso, de las personas autorizadas como contactos operativos.',
    'Acta constitutiva o instrumento notarial de constitución y sus modificaciones; poderes o instrumentos que acrediten facultades del representante legal.',
    'Datos de contacto: correos electrónicos y números telefónicos (operativo y/o administrativo).',
    'Comprobante de domicilio del lugar donde realiza sus actividades (y, en su caso, del domicilio fiscal cuando sea distinto).',
    'Fotografías del lugar donde realiza sus actividades, en las que se aprecie fachada, maquinaria, equipo de oficina, personal, medios de transporte y demás medios utilizados.',
    'Documentación que acredite la legal propiedad o posesión del inmueble y de los activos con los que realiza sus actividades (p. ej. escrituras, contrato de arrendamiento, contratos de comodato, facturas de activos, etc.).',
    'Clave en el RFC o número de identificación fiscal (o su equivalente, si es residente en el extranjero).',
    'Constancia de situación fiscal, cuando sea aplicable.',
    'Manifestación bajo protesta de decir verdad de "EL CLIENTE", señalando: (a) que no tiene vinculación, en términos del artículo 68 de la Ley Aduanera, con contribuyentes publicados en el listado del artículo 69-B, cuarto párrafo del CFF; y (b) que no se le ha emitido ni notificado resolución que determine que emite falsos comprobantes fiscales, en términos del artículo 49 Bis del CFF.',
    'Evidencia y/o constancias de consulta de padrones/listados y demás verificaciones que "EL AGENTE ADUANAL" deba integrar para efectos de cumplimiento (documentación elaborada o recabada por "EL AGENTE ADUANAL").',
    'Cualquier otro documento que resulte necesario para acreditar lo anterior y/o para la naturaleza de las operaciones de comercio exterior que solicite "EL CLIENTE".',
  ], {
    type: 'numbered',
    indent: 20,
    fontSize: 9,
    width: contentWidth,
    align: 'justify',
    moveDown: 0.4,
  })
  doc.moveDown(0.3)

  writeSectionTitle(
    doc,
    'ANEXO "B".- CONTENIDO MÍNIMO DEL EXPEDIENTE ELECTRÓNICO POR OPERACIÓN (PEDIMENTO/DOCUMENTO ADUANERO) (LEY ADUANERA, ARTÍCULO 162, FRACCIÓN VII).',
    paragraphOptions
  )

  createPdfList(doc, [
    'Pedimento o documento aduanero en el formato en que se haya transmitido.',
    'Anexos y acuses electrónicos vinculados a la operación (incluyendo, en su caso, e-documents y acuse de valor).',
    'Documentación soporte proporcionada por "EL CLIENTE" y utilizada para el despacho (p. ej. factura, documentos de transporte, lista de empaque, permisos/avisos, certificados, etc.), en la medida en que sea parte del expediente.',
    'Copia del documento con el que "EL CLIENTE" compruebe el encargo conferido para realizar el despacho aduanero y su acuse cuando sea electrónico.',
    'Copia digital del original de la manifestación de valor (resguardándose el original conforme corresponda).',
    'Registro de comunicaciones relevantes e instrucciones operativas vinculadas con la operación, cuando sea necesario para la trazabilidad.',
  ], {
    type: 'numbered',
    indent: 20,
    fontSize: 9,
    width: contentWidth,
    align: 'justify',
    moveDown: 0.4,
  })
  doc.moveDown(0.3)

  writeParagraph(
    doc,
    `Conformes las partes con el contenido y alcance legal del presente contrato de prestación de servicios, lo firman por duplicado a través de sus representantes legales, a los ${signatureDay} días del mes de ${signatureMonth} del año ${signatureYear}, quedando un ejemplar en poder de cada una de las partes.`,
    paragraphOptions
  )

  // BLOQUE DE FIRMAS
  if (doc.y > doc.page.height - doc.page.margins.bottom - 220) {
    doc.addPage()
  }

  doc.moveDown(1.5)

  const colWidth = 220
  const leftColX = doc.page.margins.left
  const rightColX = doc.page.width - doc.page.margins.right - colWidth

  let baseSignatureY = doc.y

  doc.font('Helvetica-Bold').fontSize(9)
  doc.text('EL AGENTE ADUANAL', leftColX, baseSignatureY, { width: colWidth, align: 'left' })
  doc.text('El cliente', rightColX, baseSignatureY, { width: colWidth, align: 'left' })
  doc.font('Helvetica').fontSize(9)
  doc.text(socialReason, rightColX, doc.y, { width: colWidth, align: 'left' })

  doc.x = doc.page.margins.left
  doc.y = baseSignatureY + 55
  baseSignatureY = doc.y

  doc.font('Helvetica').fontSize(9)
  doc.text('______________________________', leftColX, baseSignatureY, { width: colWidth, align: 'left' })
  doc.text('______________________________', rightColX, baseSignatureY, { width: colWidth, align: 'left' })

  doc.font('Helvetica-Bold').fontSize(9)
  // Inconsistencia al calcular posiciones relativas
  doc.text('LEONEL ERNESTO CANTU LOZANO', leftColX, doc.y, { width: colWidth, align: 'left' })
  doc.text(representativeFullName.toUpperCase(), rightColX, baseSignatureY + 12, { width: colWidth, align: 'left' })

  doc.font('Helvetica').fontSize(9)
  doc.text('REPRESENTANTE LEGAL', rightColX, doc.y, { width: colWidth, align: 'left' })
  doc.x = doc.page.margins.left
  doc.y = doc.y + 40

  baseSignatureY = doc.y
  doc.font('Helvetica-Bold').fontSize(9)
  doc.text('Testigo', leftColX, baseSignatureY, { width: colWidth, align: 'left' })
  doc.text('Testigo', rightColX, baseSignatureY, { width: colWidth, align: 'left' })

  doc.x = doc.page.margins.left
  doc.y = baseSignatureY + 55
  baseSignatureY = doc.y

  doc.font('Helvetica').fontSize(9)
  doc.text('______________________________', leftColX, baseSignatureY, { width: colWidth, align: 'left' })
  doc.text('______________________________', rightColX, baseSignatureY, { width: colWidth, align: 'left' })
  doc.text('Nombre completo', leftColX, doc.y, { width: colWidth, align: 'left' })
  doc.text('Nombre completo', rightColX, baseSignatureY + 12, { width: colWidth, align: 'left' })

  doc.end()
  return doc
}
