import PDFDocument from 'pdfkit'

export function generarPoliticaTrabajoForzoso() {
	const doc = new PDFDocument({ size: 'LETTER', margin: 72 })
	const AUTOCOMP = '(autocompletado)'
	const LEFT = doc.page.margins.left
	const RIGHT = doc.page.width - doc.page.margins.right
	const WIDTH = RIGHT - LEFT

	// ── Helper: página nueva si no hay espacio ──
	function ensureSpace(minH) {
		if (doc.y + minH > doc.page.height - doc.page.margins.bottom) {
			doc.addPage()
		}
	}

	// ══════════════════════════════════════════
	// ENCABEZADO / HEADER TABLE
	// ══════════════════════════════════════════
	const titleText =
		'POLÍTICA SOBRE LA PROHIBICIÓN DEL TRABAJO FORZOSO U OBLIGATORIO DE LOS\nCOLABORADORES CONFORME LOS ACUERDOS DEL ARTICULO 23.6 T-MEC'
	doc.fontSize(10).font('Helvetica-Bold').text(titleText, LEFT, doc.y, {
		align: 'center',
		width: WIDTH,
	})
	doc.moveDown(0.5)

	// Metadata table (Código, Resp, Versión, Fecha, Realizó, Autorizó, No. de Pág.)
	const tableTop = doc.y
	const cols = [WIDTH * 0.22, WIDTH * 0.15, WIDTH * 0.1, WIDTH * 0.15, WIDTH * 0.1, WIDTH * 0.1, WIDTH * 0.18]
	const headers = ['Código', 'Resp. del\nProceso', 'Versión', 'Fecha de\nEmisión', 'Realizó', 'Autorizó', 'No. de Pág.']
	const rowH = 30
	let cx = LEFT

	// Header row
	headers.forEach((h, i) => {
		doc.rect(cx, tableTop, cols[i], rowH).stroke()
		doc.fontSize(7).font('Helvetica-Bold').text(h, cx + 2, tableTop + 4, { width: cols[i] - 4, align: 'center' })
		cx += cols[i]
	})

	// Data row
	cx = LEFT
	const dataRow = [
		'GAA-SGS-4.1-P5-TFO-v1',
		'Gestor del\nSistema',
		'1',
		'15/12/2023',
		'GSS',
		'DG',
		'Página 1 de 2',
	]
	dataRow.forEach((d, i) => {
		doc.rect(cx, tableTop + rowH, cols[i], rowH).stroke()
		doc.fontSize(7).font('Helvetica').text(d, cx + 2, tableTop + rowH + 6, { width: cols[i] - 4, align: 'center' })
		cx += cols[i]
	})

	doc.y = tableTop + rowH * 2 + 10

	// Confidenciality note
	doc
		.fontSize(7)
		.font('Helvetica-Oblique')
		.text(
			'Completamente confidencial y para uso exclusivo de Global Agentes Aduanales y Asesores en Comercio Exterior, SC.',
			LEFT,
			doc.y,
			{ width: WIDTH, align: 'left' }
		)
	doc
		.fontSize(7)
		.font('Helvetica-Oblique')
		.text('El documento electrónico prevalece sobre cualquier impresión del mismo.', LEFT, doc.y, {
			width: WIDTH,
			align: 'right',
		})
	doc.moveDown(1)

	// ══════════════════════════════════════════
	// INTRO PARAGRAPH
	// ══════════════════════════════════════════
	ensureSpace(60)
	doc
		.fontSize(10)
		.font('Helvetica')
		.text(
			'"Global Agentes Aduanales y Asesores en Comercio Exterior, SC", se compromete a cumplir con los dictámenes establecidos por la Declaración de la OIT sobre los Derechos en el Trabajo con respecto al trabajo forzoso u obligatorio para lo que definiremos los siguientes supuestos:',
			LEFT,
			doc.y,
			{ align: 'justify', width: WIDTH }
		)
	doc.moveDown(1)

	// ══════════════════════════════════════════
	// NUMBERED ITEMS
	// ══════════════════════════════════════════
	const INDENT = 20

	// 1. Leyes laborales
	ensureSpace(40)
	doc.fontSize(10).font('Helvetica-Bold').text('1.   Leyes laborales: ', LEFT + INDENT, doc.y, { continued: true })
	doc
		.font('Helvetica')
		.text(
			'significa leyes y regulaciones, o disposiciones de las leyes y regulaciones, de una parte, que están directamente relacionadas con los siguientes derechos laborales internacionalmente reconocidos:',
			{ align: 'justify', width: WIDTH - INDENT }
		)
	doc.moveDown(0.4)

	const subItems = [
		'(a) la libertad de asociación y el reconocimiento efectivo del derecho a la negociación colectiva;',
		'(b) la eliminación de todas las formas de trabajo forzoso u obligatorio;',
		'(c) la abolición efectiva del trabajo infantil, la prohibición de las peores formas de trabajo infantil y otras protecciones laborales para niños y menores;',
		'(d) la eliminación de la discriminación en materia de empleo y ocupación; y',
		'(e) condiciones aceptables de trabajo respecto a salarios mínimos, horas de trabajo, y seguridad y salud en el trabajo;',
	]
	subItems.forEach((item) => {
		ensureSpace(20)
		doc
			.fontSize(10)
			.font('Helvetica')
			.text(item, LEFT + INDENT * 2, doc.y, { align: 'justify', width: WIDTH - INDENT * 2 })
		doc.moveDown(0.3)
	})
	doc.moveDown(0.5)

	// 2. Leyes y regulaciones
	ensureSpace(40)
	doc
		.fontSize(10)
		.font('Helvetica-Bold')
		.text('2.   Leyes y regulaciones', LEFT + INDENT, doc.y, { continued: true })
	doc.font('Helvetica').text(' y ', { continued: true })
	doc.font('Helvetica-Bold').text('leyes o regulaciones', { continued: true })
	doc.font('Helvetica').text(' significa:', { width: WIDTH - INDENT })
	doc.moveDown(0.4)

	const subItems2 = [
		'(a) para México, las Leyes del Congreso o regulaciones y disposiciones promulgadas de conformidad con las Leyes del Congreso y, para los efectos de este Capítulo, incluye la Constitución Política de los Estados Unidos Mexicanos; y',
		'(b) para los Estados Unidos, las Leyes del Congreso o regulaciones promulgadas de conformidad con las Leyes del Congreso y, para los efectos de este Capítulo, incluye la Constitución de los Estados Unidos.',
	]
	subItems2.forEach((item) => {
		ensureSpace(30)
		doc
			.fontSize(10)
			.font('Helvetica')
			.text(item, LEFT + INDENT * 2, doc.y, { align: 'justify', width: WIDTH - INDENT * 2 })
		doc.moveDown(0.4)
	})
	doc.moveDown(0.3)

	// 3. Artículo 23.6.1
	ensureSpace(50)
	doc.fontSize(10).font('Helvetica-Bold').text('3.   Artículo 23.6.1: ', LEFT + INDENT, doc.y, { continued: true })
	doc
		.font('Helvetica')
		.text(
			'Las Partes reconocen el objetivo de eliminar todas las formas de trabajo forzoso u obligatorio, incluido el trabajo infantil forzoso u obligatorio. Por consiguiente, cada Parte prohibirá, a través de medidas que considere apropiadas, la importación de mercancías a su territorio procedentes de otras fuentes producidas en su totalidad o en parte por trabajo forzoso u obligatorio, incluido el trabajo infantil forzoso u obligatorio.',
			{ align: 'justify', width: WIDTH - INDENT }
		)
	doc.moveDown(0.6)

	// 4. Artículo 23.6.2
	ensureSpace(50)
	doc.fontSize(10).font('Helvetica-Bold').text('4.   Artículo 23.6.2: ', LEFT + INDENT, doc.y, { continued: true })
	doc
		.font('Helvetica')
		.text(
			'Para asistir en la implementación del párrafo 3, las Partes establecerán cooperación para la identificación y movimiento de mercancías producidas por trabajo forzoso, según lo dispone el Artículo 23.12.5(c) (Cooperación).',
			{ align: 'justify', width: WIDTH - INDENT }
		)
	doc.moveDown(0.6)

	// 5. Artículo 23.12.5.C
	ensureSpace(40)
	doc.fontSize(10).font('Helvetica-Bold').text('5.   Artículo 23.12.5.C: ', LEFT + INDENT, doc.y, { continued: true })
	doc
		.font('Helvetica')
		.text(
			'Las Partes podrán desarrollar actividades de cooperación en la identificación y movimiento de mercancías producidas por trabajo forzoso.',
			{ align: 'justify', width: WIDTH - INDENT }
		)
	doc.moveDown(1)

	// ══════════════════════════════════════════
	// CLOSING PARAGRAPH
	// ══════════════════════════════════════════
	ensureSpace(80)
	doc.fontSize(10).font('Helvetica').text(
		'Por lo que la empresa "Global Agentes Aduanales y Asesores en Comercio Exterior, SC ", se compromete a cumplir con el seguimiento e inspección entre sus empleados y socios comerciales, para que puedan garantizar que los bienes, insumos o mercancías nacionales e importadas a México para la elaboración de productos o mercancías no provienen de la extracción, producción o fabricación, total o parcialmente, con formas prohibidas de trabajo, es decir, forzoso u obligado incluido el trabajo infantil forzoso u obligado, al amparo del artículo 23.6 del T-MEC y el Acuerdo del Trabajo y Previsión Social que establece las mercancías cuya importación está sujeta a regulación a cargo de la Secretaría del Trabajo y Previsión Social, publicado en el DOF el 17 de febrero de 2023.',
		LEFT,
		doc.y,
		{ align: 'justify', width: WIDTH }
	)

	// ══════════════════════════════════════════
	// PAGE 2 — SIGNATURE
	// ══════════════════════════════════════════
	doc.addPage()

	// Page 2 header
	doc.fontSize(10).font('Helvetica-Bold').text(titleText, LEFT, doc.y, { align: 'center', width: WIDTH })
	doc.moveDown(0.5)

	// Metadata table page 2
	const t2Top = doc.y
	cx = LEFT
	headers.forEach((h, i) => {
		doc.rect(cx, t2Top, cols[i], rowH).stroke()
		doc.fontSize(7).font('Helvetica-Bold').text(h, cx + 2, t2Top + 4, { width: cols[i] - 4, align: 'center' })
		cx += cols[i]
	})
	cx = LEFT
	const dataRow2 = [
		'GAA-SGS-4.1-P5-TFO-v1',
		'Gestor del\nSistema',
		'1',
		'15/12/2023',
		'GSS',
		'DG',
		'Página 2 de 2',
	]
	dataRow2.forEach((d, i) => {
		doc.rect(cx, t2Top + rowH, cols[i], rowH).stroke()
		doc.fontSize(7).font('Helvetica').text(d, cx + 2, t2Top + rowH + 6, { width: cols[i] - 4, align: 'center' })
		cx += cols[i]
	})
	doc.y = t2Top + rowH * 2 + 10

	doc
		.fontSize(7)
		.font('Helvetica-Oblique')
		.text(
			'Completamente confidencial y para uso exclusivo de Global Agentes Aduanales y Asesores en Comercio Exterior, SC.',
			LEFT,
			doc.y,
			{ width: WIDTH, align: 'left' }
		)
	doc
		.fontSize(7)
		.font('Helvetica-Oblique')
		.text('El documento electrónico prevalece sobre cualquier impresión del mismo.', LEFT, doc.y, {
			width: WIDTH,
			align: 'right',
		})
	doc.moveDown(3)

	// Signature box
	const sigBoxX = LEFT + WIDTH * 0.2
	const sigBoxW = WIDTH * 0.6
	const sigBoxTop = doc.y
	const sigBoxH = 80
	const sigLabelH = 25

	doc.rect(sigBoxX, sigBoxTop, sigBoxW, sigBoxH).stroke()
	doc.rect(sigBoxX, sigBoxTop + sigBoxH, sigBoxW, sigLabelH).fillAndStroke('#cccccc', '#000000')
	doc
		.fillColor('#000000')
		.fontSize(10)
		.font('Helvetica-Bold')
		.text('NOMBRE, FECHA Y FIRMA.', sigBoxX, sigBoxTop + sigBoxH + 7, { width: sigBoxW, align: 'center' })

	// Autocompletado hint inside box
	doc
		.fontSize(8)
		.font('Helvetica')
		.fillColor('#666666')
		.text(AUTOCOMP, sigBoxX + 4, sigBoxTop + 10, { width: sigBoxW - 8, align: 'center' })
	doc.fillColor('#000000')

	doc.end()
	return doc
}
