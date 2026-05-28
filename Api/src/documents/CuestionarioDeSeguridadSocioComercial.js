import PDFDocument from 'pdfkit'

const BLUE = '#0A2B6B'
const TEAL = '#1E5B6B'

function drawTopBlock(doc) {
	const left = doc.page.margins.left
	const width = doc.page.width - doc.page.margins.left - doc.page.margins.right

	// El formato original trae logotipo; al no tener imagen en el repo, se deja texto marca en azul.
	doc.font('Helvetica-Bold').fontSize(28).fillColor('#2F66A8').text('squiñon', left + 14, 30, {
		width: 170,
		align: 'left',
		lineBreak: false,
	})

	doc.font('Helvetica').fontSize(7).fillColor('#000000').text('Fecha', left + width - 210, 44, {
		width: 24,
		lineBreak: false,
	})
	doc
		.moveTo(left + width - 180, 51)
		.lineTo(left + width - 10, 51)
		.lineWidth(0.8)
		.strokeColor('#000000')
		.stroke()

	doc.font('Helvetica-Bold').fontSize(16).text('Cuestionario de Seguridad para Socio Comercial', left, 78, {
		width,
		align: 'center',
	})

	const introY = 120
	const introH = 94
	doc.rect(left + 56, introY, width - 56, introH).strokeColor('#000000').lineWidth(0.8).stroke()
	doc.font('Helvetica').fontSize(8.4).text(
		'Como Agente Aduanal certificado en materia de seguridad para la cadena de suministros bajo los requisitos del perfil del agente aduanal OEA que expide el Servicio de Administración Tributaria y con la finalidad de proporcionar la seguridad que sus operaciones requieren, le solicitamos responder al siguiente cuestionario para obtener conocimiento de las medidas de seguridad implementadas en cada uno de los centros de trabajo. Esperando fortalecer la seguridad de nuestra cadena de suministros, bajo el seguimiento de requerimientos y recomendaciones del programa OEA agradecemos de antemano las facilidades para la verificación de sus respuestas.',
		left + 68,
		introY + 12,
		{ width: width - 80, align: 'center' }
	)

	doc.y = introY + introH + 8

	const lineStartX = left + 210
	const lineEndX = left + width - 10
	const drawLabeledLine = (label, y) => {
		doc.font('Helvetica').fontSize(8).text(label, left + 10, y, { lineBreak: false })
		doc.moveTo(lineStartX, y + 9).lineTo(lineEndX, y + 9).lineWidth(0.6).strokeColor('#000000').stroke()
	}

	drawLabeledLine('Nombre de la persona o empresa', doc.y)
	drawLabeledLine('Nombre representante legal', doc.y + 20)
	drawLabeledLine('Nombre quien respondió la verificación', doc.y + 40)
	doc.font('Helvetica').fontSize(8).text('En caso de contar con certificación de', left + 10, doc.y + 58, { lineBreak: false })
	doc.font('Helvetica').fontSize(8).text('seguridad indicar el número de', left + 10, doc.y + 68, { lineBreak: false })
	doc.font('Helvetica').fontSize(8).text('certificado', left + 10, doc.y + 78, { lineBreak: false })
	doc.moveTo(lineStartX, doc.y + 75).lineTo(left + width - 175, doc.y + 75).lineWidth(0.6).strokeColor('#000000').stroke()
	doc.font('Helvetica').fontSize(8).text('Emitido por', left + width - 165, doc.y + 67, { lineBreak: false })
	doc.moveTo(left + width - 110, doc.y + 75).lineTo(lineEndX, doc.y + 75).lineWidth(0.6).strokeColor('#000000').stroke()
	drawLabeledLine('Vigencia de la certificación', doc.y + 94)

	doc.font('Helvetica').fontSize(8).text(
		'Instrucciones: Indicar con una x la respuesta. El resultado es medido por personal quien aplica y verifica el cuestionario e instalaciones',
		left + 10,
		doc.y + 108,
		{ width: width - 20 }
	)

	doc.y = doc.y + 126
}

function drawMainSection(doc, title, rows, resultText) {
	const left = doc.page.margins.left
	const widths = [28, 33, 332, 28, 28, 170, 67]
	const headerH = 18
	const totalW = widths.reduce((a, b) => a + b, 0)
	const baseRowH = 18

	const rowHeights = rows.map((row) => {
		doc.font('Helvetica').fontSize(7.2)
		const textH = doc.heightOfString(row.pregunta, { width: widths[2] - 6 })
		return Math.max(baseRowH, textH + 5)
	})
	const contentH = rowHeights.reduce((a, b) => a + b, 0)

	let y = doc.y
	let x = left

	const headerLabels = ['No.', 'Valor', title, 'Si', 'No', 'Observaciones', 'Resultado']
	headerLabels.forEach((label, i) => {
		doc.rect(x, y, widths[i], headerH).fillColor(BLUE).fill()
		doc.rect(x, y, widths[i], headerH).strokeColor('#000000').lineWidth(0.5).stroke()
		doc.font('Helvetica-Bold').fontSize(8).fillColor('#FFFFFF').text(label, x + 2, y + 5, {
			width: widths[i] - 4,
			align: 'center',
			lineBreak: false,
		})
		x += widths[i]
	})

	y += headerH
	x = left + widths[0] + widths[1] + widths[2] + widths[3] + widths[4] + widths[5]
	doc.rect(x, y, widths[6], contentH).strokeColor('#000000').lineWidth(0.5).stroke()
	doc.font('Helvetica').fontSize(14).fillColor('#000000').text(resultText, x + 2, y + contentH / 2 - 9, {
		width: widths[6] - 4,
		align: 'center',
	})

	rows.forEach((row, i) => {
		const h = rowHeights[i]
		x = left

		doc.rect(x, y, widths[0], h).strokeColor('#000000').lineWidth(0.5).stroke()
		doc.font('Helvetica').fontSize(8).fillColor('#000000').text(String(row.no), x + 1, y + 4, {
			width: widths[0] - 2,
			align: 'center',
			lineBreak: false,
		})
		x += widths[0]

		doc.rect(x, y, widths[1], h).strokeColor('#000000').lineWidth(0.5).stroke()
		doc.font('Helvetica').fontSize(8).fillColor('#000000').text(String(row.valor), x + 1, y + 4, {
			width: widths[1] - 2,
			align: 'center',
			lineBreak: false,
		})
		x += widths[1]

		doc.rect(x, y, widths[2], h).strokeColor('#000000').lineWidth(0.5).stroke()
		doc.font('Helvetica').fontSize(7.2).fillColor('#000000').text(row.pregunta, x + 3, y + 3, {
			width: widths[2] - 6,
			align: 'left',
		})
		x += widths[2]

		doc.rect(x, y, widths[3], h).strokeColor('#000000').lineWidth(0.5).stroke()
		x += widths[3]
		doc.rect(x, y, widths[4], h).strokeColor('#000000').lineWidth(0.5).stroke()
		x += widths[4]
		doc.rect(x, y, widths[5], h).strokeColor('#000000').lineWidth(0.5).stroke()

		y += h
	})

	doc.rect(left, doc.y, totalW, headerH + contentH).strokeColor('#000000').lineWidth(0.5).stroke()
	doc.y = doc.y + headerH + contentH
}

function drawVerificationBlock(doc, title, rows) {
	const left = doc.page.margins.left
	const widths = [550, 50, 50, 260]
	const totalW = widths.reduce((a, b) => a + b, 0)
	const barH = 19
	const rowH = 20

	let y = doc.y
	doc.rect(left, y, totalW, barH).fillColor(TEAL).fill()
	doc.rect(left, y, totalW, barH).strokeColor('#000000').lineWidth(0.5).stroke()
	doc.font('Helvetica').fontSize(8).fillColor('#FFFFFF').text(title, left + 4, y + 5, {
		width: totalW - 8,
		align: 'center',
	})
	y += barH

	const headerLabels = ['item', 'si', 'no', 'Observaciones']
	let x = left
	headerLabels.forEach((label, i) => {
		doc.rect(x, y, widths[i], barH).fillColor(TEAL).fill()
		doc.rect(x, y, widths[i], barH).strokeColor('#000000').lineWidth(0.5).stroke()
		doc.font('Helvetica').fontSize(8).fillColor('#FFFFFF').text(label, x + 2, y + 5, {
			width: widths[i] - 4,
			align: 'center',
			lineBreak: false,
		})
		x += widths[i]
	})
	y += barH

	rows.forEach((text) => {
		x = left
		doc.rect(x, y, widths[0], rowH).strokeColor('#000000').lineWidth(0.5).stroke()
		doc.font('Helvetica').fontSize(8).fillColor('#000000').text(text, x + 3, y + 5, {
			width: widths[0] - 6,
			lineBreak: false,
		})
		x += widths[0]
		doc.rect(x, y, widths[1], rowH).strokeColor('#000000').lineWidth(0.5).stroke()
		x += widths[1]
		doc.rect(x, y, widths[2], rowH).strokeColor('#000000').lineWidth(0.5).stroke()
		x += widths[2]
		doc.rect(x, y, widths[3], rowH).strokeColor('#000000').lineWidth(0.5).stroke()
		y += rowH
	})

	doc.y = y + 3
}

function drawVerificationRowsOnly(doc, rows) {
	const left = doc.page.margins.left
	const widths = [550, 50, 50, 260]
	const rowH = 20
	let y = doc.y

	rows.forEach((text) => {
		let x = left
		doc.rect(x, y, widths[0], rowH).strokeColor('#000000').lineWidth(0.5).stroke()
		doc.font('Helvetica').fontSize(8).fillColor('#000000').text(text, x + 3, y + 5, {
			width: widths[0] - 6,
			lineBreak: false,
		})
		x += widths[0]
		doc.rect(x, y, widths[1], rowH).strokeColor('#000000').lineWidth(0.5).stroke()
		x += widths[1]
		doc.rect(x, y, widths[2], rowH).strokeColor('#000000').lineWidth(0.5).stroke()
		x += widths[2]
		doc.rect(x, y, widths[3], rowH).strokeColor('#000000').lineWidth(0.5).stroke()
		y += rowH
	})

	doc.y = y + 3
}

function drawConvenio(doc) {
	const left = doc.page.margins.left
	const width = doc.page.width - doc.page.margins.left - doc.page.margins.right

	doc.font('Helvetica').fontSize(9).fillColor('#000000').text('"Convenio entre Empresa y socio comercial"', left + 40, doc.y)
	doc.moveDown(0.8)

	doc.font('Helvetica').fontSize(9).text(
		'Nos comprometemos a mantener y seguir los estándares de seguridad en conjunto con la empresa para lograr la salvaguarda e integridad de la cadena de suministro. Así mismo a implementar las medidas con la que nuestra empresa no cuente para cumplir con los requisitos de seguridad',
		left,
		doc.y,
		{ width, align: 'left' }
	)
	doc.moveDown(1)

	const compromisos = [
		'1. Análisis de riesgo',
		'2. Seguridad física',
		'3. Controles de acceso físico',
		'4. Socios comerciales.',
		'5. Seguridad de procesos.',
		'6. Gestión aduanera.',
		'7. Seguridad de los vehículos de carga, contenedores, remolques y/o semirremolques.',
		'8. Seguridad del personal.',
		'9. Seguridad de la información y documentación.',
		'10. Capacitación en seguridad y concientización.',
		'11. Manejo e investigación de incidentes.',
	]

	compromisos.forEach((item) => {
		doc.font('Helvetica').fontSize(9).text(item, left + 20, doc.y)
	})

	const signY = doc.page.height - 78
	doc.font('Helvetica').fontSize(9).text('Nombre y firma de quien responde visita', left + 170, signY, {
		width: 280,
		align: 'center',
	})
	doc.font('Helvetica').fontSize(9).text('Nombre y forma de verificador', left + 500, signY, {
		width: 220,
		align: 'center',
	})
}

export function generarCuestionarioSeguridadSocioComercial() {
	const doc = new PDFDocument({ size: 'LETTER', margin: 40, layout: 'landscape' })

	drawTopBlock(doc)

	drawMainSection(
		doc,
		'Seguridad del traslado de mercancías',
		[
			{ no: 1, valor: '10%', pregunta: '¿Utiliza transportista con medidas de seguridad o certificación en C-TPAT u OEA?' },
			{ no: 2, valor: '10%', pregunta: '¿Se asegura de dar seguimiento o monitorear su recorrido por algún sistema GPS o algún otro mecanismo?' },
			{ no: 3, valor: '10%', pregunta: '¿Se cerciora de que su transportista utilice candados de seguridad bajo la Norma ISO 17712?' },
			{ no: 4, valor: '10%', pregunta: '¿Conoce o designa la ruta de recorrido desde su origen al destino al transportista?' },
			{ no: 5, valor: '10%', pregunta: '¿En caso de desvío de la ruta, tiene comunicación con el transporte para conocer el motivo?' },
			{ no: 6, valor: '10%', pregunta: '¿Cuenta con plan de contingencia en caso de contaminación de la carga?' },
		],
		'___de 60'
	)

	drawMainSection(
		doc,
		'Información de la carga',
		[
			{ no: 7, valor: '5%', pregunta: '¿Cuenta con procedimientos para identificar, reportar y tratar las discrepancias de la carga y descarga de mercancía?' },
			{ no: 8, valor: '5%', pregunta: '¿Cuenta con procedimientos para asegurar que tanto la información electrónica y/o documental que es enviada por sus socios comerciales a partir de su solicitud de servicio durante el movimiento y el despacho del traslado de mercancía de la carga como la generada por cuenta propia sea legible, completa, exacta, oportuna y protegida contra cambios, pérdidas o introducción de información errónea?' },
			{ no: 9, valor: '5%', pregunta: '¿Se asegura de tener controlado el material de empaque y embalaje?' },
			{ no: 10, valor: '5%', pregunta: '¿Utiliza revisión K9 para asegurar el contenido de la carga libre de contaminación?' },
			{ no: 11, valor: '5%', pregunta: '¿Se asegura de verificar el contenido de cada paquete que envía?' },
		],
		'___de 25'
	)

	drawMainSection(
		doc,
		'Seguridad de la información',
		[
			{ no: 11, valor: '5%', pregunta: '¿La información generada de nuestra relación comercial es resguardada bajo llave?' },
			{ no: 12, valor: '5%', pregunta: '¿La información digital que se genera de nuestra relación comercial es respaldada con copia de seguridad?' },
			{ no: 13, valor: '5%', pregunta: '¿Cuenta con programas antivirus y cortafuegos?' },
		],
		'___de 15'
	)

	drawVerificationBlock(
		doc,
		'Verificación de indicadores de trabajo forzoso,  La siguiente sección no se cuestiona al socio comercial. Solo se responde por observación,',
		[
			'Abuso de la vulnerabilidad',
			'Engaño',
			'Restricción de movimiento',
			'Aislamiento',
			'Violencia física y sexual',
		]
	)

	doc.addPage()

	drawVerificationRowsOnly(doc, [
		'Intimidación y amenazas',
		'Retención de documentos de identificación',
		'Retención de salarios',
		'Servidumbre por deudas',
		'Exceso horas extras',
		'Condiciones de vida y trabajo abusivas',
	])

	drawVerificationBlock(
		doc,
		'Verificación indicadores para detectar clientes o proveedores que podrían no ser legítimos.  La siguiente sección no se cuestiona al socio comercial. Se verifica con responsable de socios comerciales y Documentadores o en su caso personal que tiene contacto con la empresa..',
		[
			'Realiza pagos en efectivo o solicita realizarlo',
			'realiza pagos por encima de la tarifa estandar',
			'Tiene poco conocimiento de la mercancía no proporcionan información técnica',
			'Es evasivo',
			'No proporcionan información de contactos',
			'Es empresa de reciente creación, menor a 1 mes',
			'Se localiza su domicilio',
			'Autorizan revisar mercancía para el previo.',
		]
	)

	doc.moveDown(2)
	drawConvenio(doc)

	doc.end()
	return doc
}

