import PDFDocument from 'pdfkit'
import createStylizedParagraph from './createStylizedParagraph.js'
import writeParagraphTitle from './writeParagraphTitle.js'
import createSignatureBox from './createSignatureBox.js'
import drawStyledHeader from './drawStyledHeader.js'
import drawStyledFooter from './drawStyledFooter.js'



export function generarAvisoDePrivacidad() {
  const doc = new PDFDocument({
    size: 'LETTER',
    margin: 40,
    bottomMargin: 60, // Impide que el texto pase de aquí y choque con el footer
    bufferPages: true
  })
  const left = doc.page.margins.left
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const AUTOCOMP = '(autocompletado)'
  const totalPages = 5

  const headerOptions = {
    title: 'AVISO DE PRIVACIDAD',
    cols: [150, 75, 45, 65, 50, 50, 70], // Puedes cambiar los anchos si un código es más largo
    headers: ['Código', 'Resp. de Proceso', 'Versión', 'Fecha de Emisión', 'Realizó', 'Autorizó', 'No. de Pág.'],
    values: ['GAA-SGS-04-F9-AP-v1', 'Ejecutivo de Trafico', '1', '17/06/2020', 'GSS', 'DG']
    // Nota: El 7mo valor ("Pág. X de Y") se omite aquí porque la función lo calcula sola
  };

  const titleOptions = {
    fontSize: 15,
    align: 'center'
  }
  const paragraphOptions = {
    fontSize: 10,
    width,
    align: 'justify'
  }
  doc.on('pageAdded', () => {
    const range = doc.bufferedPageRange();
    const pageNumber = range.start + range.count;
    // Ojo: En este punto de la ejecución parcial aún no conocemos el total absoluto,
    // por lo que pasamos null para que la función dibuje solo "Pág. 2" momentáneamente
    drawStyledHeader(doc, pageNumber, null, headerOptions, false);
  });

  // PAGE 1
  drawStyledHeader(doc, 1, null, headerOptions)

  const paragraph1 = [
    { text: 'Con base a la normativa fijada por la ' },
    { text: '“Ley Federal de Protección de Datos Personales en Posesión de Particulares”', isBold: true },
    { text: ' de ahora en adelante (LEY) así como de las especificaciones y parámetros en el ' },
    { text: '“Reglamento a la Ley Federal de Protección de Datos Personales en Posesión de Particulares”', isBold: true },
    { text: ' (REGLAMENTO); ' },
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC', isBold: true },
    { text: '. Pone a disposición del público los términos y condiciones del Aviso de Privacidad para la Protección de los Datos Personales (Aviso de Privacidad).' },
    { text: 'Aviso de Privacidad para la Protección de los Datos Personales', isBold: true },
    { text: ' (Aviso de Privacidad).' },
  ]

  writeParagraphTitle(doc, 'Aviso de Privacidad Clientes, Proveedores y Prestadores de Servicio', titleOptions)
  createStylizedParagraph(doc, paragraph1, paragraphOptions)
  doc.moveDown(2)

  const paragraph2 = [
    { text: 'El responsable de la recepción, manejo y salvaguarda de la información será ' },
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC', isBold: true },
    { text: ', información que podrá ser utilizada conforme a las finalidades que se hayan estipulado con los Titulares de los Datos Personales donde medie su consentimiento en cada una de las contrataciones o con el conocimiento y aceptación de las políticas de privacidad y las condiciones de uso anexadas en el portal de internet https://aaglobal.net/ así como por medio del presente ' },
    { text: 'Aviso de Privacidad', isBold: true },
    { text: '. La obligación del cuidado de la información podrá ser compartida, cuando se prevea en la negociación con terceros y se tenga debidamente regulada mediante instrumento privado que así lo ampare notificándolo al Titular de los Datos Personales.' },
  ]
  writeParagraphTitle(doc, 'RESPONSABLE DE LOS DATOS PERSONALES', titleOptions)
  createStylizedParagraph(doc, paragraph2, paragraphOptions)
  doc.moveDown(2)

  const paragraph3 = [
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC', isBold: true },
    { text: ' solicitará y dará uso respecto de sus Clientes, Proveedores y Prestadores de Servicios los siguientes Datos: Nombre Completo, Fecha de Nacimiento, Nacionalidad, Edad, Lugar de Nacimiento, Domicilio Particular, Teléfono, Correo Electrónico, Clave Única de Registro de Población, Registro Federal de Contribuyentes, Claves de Registro Poblacional de cualquier índole, Estado Civil, Antecedentes Penales, Acta de Nacimiento, Comprobante de Domicilio, Correo Electrónico, Cartas de Recomendación, Escolaridad y Trayectoria Educativa, Titulo, Firma, Información Fiscal, Así como toda la información societaria de la Persona Moral sea Acta Constitutiva, Poderes, Boleta RPPyC, Estatutos y Asambleas; que pudiera a discreción del “Instituto Federal de Acceso a la Información y Protección de Datos”' },
    { text: ' (IFAI) ', isBold: true },
    { text: ' ser considerados datos personales, los cuales igualmente se encuentran protegidos por el presente Aviso de Privacidad.' },
  ]
  writeParagraphTitle(doc, 'DATOS PERSONALES RECABADOS', titleOptions)
  createStylizedParagraph(doc, paragraph3, paragraphOptions)
  doc.moveDown(2)


  const paragraph4 = [
    { text: 'El manejo de Datos Personales Sensibles tales como (Estado de Salud Presente o Futura, Enfermedades, Afiliación Sindical,) se sujetaran a un trámite estricto y de mayor seguridad a efecto de garantizar la confianza y seguridad del Titular de los Datos Personales en el caso de que se solicitara algún dato de esa índole, cuyo caso será notificado y se recabara el consentimiento expreso del Titular de los Datos Personales además de ser revisado exhaustivamente para garantizar la seguridad total de la información.' },
  ]
  createStylizedParagraph(doc, paragraph4, paragraphOptions)
  doc.moveDown(2)

  const paragraph5 = [
    { text: 'Toda aquella información que sea facilitada por Clientes, Proveedores y Prestadores de Servicios respecto de datos personales de Terceros como elementos de referencia u otros, se sujetaran a las medidas de protección de la información de ' },
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC', isBold: true },
    { text: ', no quedara exento de responsabilidad quien facilite tal información, de lo que se tendrá una responsabilidad compartida tanto de Clientes, Proveedores y Prestadores de Servicios junto con ' },
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC', isBold: true },
    { text: '. Desde el momento que la información este a disposición de ' },
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC', isBold: true },
    { text: ' y de la cual se da a conocer a las partes involucradas a través del presente ' },
    { text: 'Aviso de Privacidad.', isBold: true }
  ];
  createStylizedParagraph(doc, paragraph5, paragraphOptions)
  doc.moveDown(2)

  drawStyledFooter(doc, 1, 3)
  doc.addPage()

  writeParagraphTitle(doc, 'FINALIDAD EN EL USO DE INFORMACIÓN', titleOptions)

  const paragraph6 = [
    { text: 'Los datos personales solicitados por ' },
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC.', isBold: true },
    { text: ' Tendrán como finalidad: (a) Identificar al Cliente (b) Para la celebración del Contrato (c) Para desarrollar nuevos productos y servicios (d) Identificar al Proveedor o Prestador de Servicios (e) Analizar al Proveedor o Prestador de Servicios que se Contratara a favor de los Proyectos de ' },
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC', isBold: true },
    { text: ' (f) Brindar un mejor servicio de atención y trato con el Cliente, Proveedor o Prestador de Servicio (g) Integración del Expediente de Información de nuestro Cliente, Proveedor o Prestador de Servicios para futuras consultas y antecedentes (h) Para dar cumplimiento a Obligaciones de Carácter Fiscal o Comercial (i) Con fines de Comunicación con Cliente, Proveedor o Prestador de Servicios (j) Otorgamiento de estímulos o reconocimientos a nuestro Cliente, Proveedor o Prestador de Servicios (k) Para la mejora de los estándares de Publicidad (l) atención de consultas, dudas, aclaraciones o quejas.' }
  ];
  createStylizedParagraph(doc, paragraph6, paragraphOptions)
  doc.moveDown(2)


  const paragraph7 = [
    { text: 'Todas las Finalidades previstas anteriormente estarán canalizadas al desarrollo, implementación y crecimiento del objeto principal de ' },
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC;', isBold: true },
    { text: ' así como de la salvaguarda de derechos del Titular de los Datos Personales.' }
  ];
  createStylizedParagraph(doc, paragraph7, paragraphOptions)
  doc.moveDown(2)

  const paragraph8 = [
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC', isBold: true },
    { text: '. garantiza por medio de todas las medidas de seguridad administrativas, técnicas y físicas el proteger su información, garantizando en todo momento estricta confidencialidad y privacidad de la información a través de la implementación de políticas de privacidad y de control de la información, así como lo estipulado contractualmente sujetándonos a los parámetros de la ' },
    { text: 'LEY', isBold: true },
    { text: ' y su ' },
    { text: 'REGLAMENTO,', isBold: true },
    { text: ' así como a los ' },
    { text: 'Parámetros de Autorregulación', isBold: true },
    { text: ' dictados por el ' },
    { text: 'IFAI', isBold: true },
    { text: ' y las demás normativas aplicables. Aunado a lo anterior ' },
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC', isBold: true },
    { text: ' informa que en ninguna circunstancia venderá, alquilara o enajenara información relativa a los datos personales del Titular o de Tercero que se use como referencia; ni los compartirá, transmitirá o transferirá sin que medie su consentimiento.' }
  ];
  createStylizedParagraph(doc, paragraph8, paragraphOptions)
  doc.moveDown(2)


  writeParagraphTitle(doc, 'TRANSFERENCIA DE DATOS PERSONALES', titleOptions)
  const paragraph9 = [
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC', isBold: true },
    { text: ' podrá transferir sus datos personales a Terceros Persona Física o Moral cuando la transferencia sea necesaria para la conclusión de la gestión contractual o de servicios que ofrece la presente Sociedad siempre y cuando medie el consentimiento del Titular de los Datos Personales. Asimismo, le informamos que tales terceros asumen las mismas obligaciones y responsabilidades frente a sus datos personales en uso y disposición que ' },
    { text: '-----------------------------------------,' },
    { text: ' en términos de este ' },
    { text: 'Aviso de Privacidad', isBold: true },
    { text: ' y los principios de protección de datos personales previstos en la ' },
    { text: 'LEY', isBold: true },
    { text: ' y su ' },
    { text: 'REGLAMENTO.', isBold: true }
  ];
  createStylizedParagraph(doc, paragraph9, paragraphOptions)
  doc.moveDown(2)

  writeParagraphTitle(doc, 'ATENCIÓN DUDAS Y RECLAMACIONES', titleOptions)
  const paragraph10 = [
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC', isBold: true },
    { text: ' tiene sus oficinas ubicadas en Dr. Mier #4309 Col Hidalgo, C.P. 88160, Tel: 867 713-23-13; así como el correo electrónico ' },
    { text: 'info@aaglobal.net', isUnderlined: true },
    { text: ' para la atención de dudas o reclamaciones.' }
  ];
  createStylizedParagraph(doc, paragraph10, paragraphOptions)
  doc.moveDown(2)

  drawStyledFooter(doc, 2, 3)
  doc.addPage()

  writeParagraphTitle(doc, 'LISTADO DE EXCLUSIÓN Y CANCELACIÓN', titleOptions)
  const paragraph11 = [
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC', isBold: true },
    { text: ' no podrá en ninguna circunstancia contractual retener la información del Titular de los Datos Personales cuando esta se haya cancelado debidamente con el procedimiento previsto excepto por las siguientes causas: Inconformidades Laborales, Presunción Delictuosa, Normativa Aplicable y Petición de la Autoridad.' }
  ];
  createStylizedParagraph(doc, paragraph11, paragraphOptions)
  doc.moveDown(2)

  const paragraph12 = [
    { text: 'Respecto de lo anterior será responsabilidad de ' },
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC', isBold: true },
    { text: ' conforme a las especificaciones legales el retener la información; cuando sea respecto a información fiscal / contable de 5 a 10 años según lo previsto en el Código Fiscal de la Federación en su Art. 30 y en el caso de información comercial 10 años según lo previsto en el Art. 46 del Código de Comercio. Agotado ese plazo de tiempo la información podrá ser cancelada.' }
  ];
  createStylizedParagraph(doc, paragraph12, paragraphOptions)
  doc.moveDown(2)


  const paragraph13 = [
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC', isBold: true },
    { text: ' se compromete a incluir su información a un Listado de Exclusión para suspender toda actividad contractual y ofrecimiento de servicios que pudiera recaer en actos de molestia respecto del uso de su información, tal información será debidamente resguardada hasta la conclusión de los términos señalados por ley y petición de autoridad para proceder a su Cancelación de la cual será debidamente notificado.' }
  ];
  createStylizedParagraph(doc, paragraph13, paragraphOptions)
  doc.moveDown(2)

  writeParagraphTitle(doc, 'ACTUALIZACIÓN Y MODIFICACIÓN DEL AVISO DE PRIVACIDAD', titleOptions)

  const paragraph14 = [
    { text: 'Global Agentes Aduanales y Asesores en Comercio Exterior, SC', isBold: true },
    { text: ' se reserva el Derecho de actualizar y modificar el presente Aviso de Privacidad en cualquier momento. Todas las modificaciones al Aviso de Privacidad se notificarán vía electrónica a través del portal de Internet ' },
    { text: 'https://aaglobal.net/', isUnderlined: true }
  ];
  createStylizedParagraph(doc, paragraph14, paragraphOptions)
  doc.moveDown(2)

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('Recibí y estoy enterado (a) del Aviso de Privacidad que la Agencia Aduanal Global Agentes Aduanales y Asesores en Comercio Exterior, SC hace de mi conocimiento.', {
      align: 'center',
    })
    .moveDown(1.2)


  createSignatureBox(doc, {
    width: 280,
    height: 100,
    barHeight: 26,
    text: 'NOMBRE, FECHA Y FIRMA.'
  })

  drawStyledFooter(doc, 3, 3)

  doc.end()
  return doc
}
