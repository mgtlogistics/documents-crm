import PDFDocument from 'pdfkit'
import writeInlineFormattedText from './utils/writeInlineFormattedText.js'
import createSignatureBox from './utils/createSignatureBox.js'

const DEFAULT_TITLE = 'POLÍTICA SOBRE LA PROHIBICIÓN DEL TRABAJO FORZOSO U OBLIGATORIO DE LOS\nCOLABORADORES CONFORME LOS ACUERDOS DEL ARTICULO 23.6 T-MEC'

function getTextValue(...values) {
	const value = values.find((candidate) => typeof candidate === 'string' && candidate.trim())
	return value ? value.trim() : ''
}

export function generarPoliticaTrabajoForzoso(data = {}) {
	const form = data.formData || data.data || data
	const doc = new PDFDocument({ size: 'LETTER', margin: 72 })
	const LEFT = doc.page.margins.left
	const RIGHT = doc.page.width - doc.page.margins.right
	const WIDTH = RIGHT - LEFT
	const titleText = getTextValue(form.title, form.documentTitle) || DEFAULT_TITLE
	const metadata = {
		code: getTextValue(form.code, form.documentCode) || 'GAA-SGS-4.1-P5-TFO-v1',
		process: getTextValue(form.process, form.responsibleProcess) || 'Gestor del\nSistema',
		version: getTextValue(form.version) || '1',
		issueDate: getTextValue(form.issueDate, form.fechaEmision) || '15/12/2023',
		preparedBy: getTextValue(form.preparedBy, form.realizo) || 'GSS',
		approvedBy: getTextValue(form.approvedBy, form.autorizo) || 'DG',
	}
	const confidentiality = getTextValue(form.confidentialityNote)
		|| 'Completamente confidencial y para uso exclusivo de Global Agentes Aduanales y Asesores en Comercio Exterior, SC.'
	const electronicNotice = getTextValue(form.electronicNotice)
		|| 'El documento electrónico prevalece sobre cualquier impresión del mismo.'
	const signatureHint = getTextValue(form.signatureHint) || '(autocompletado)'

	const cols = [WIDTH * 0.22, WIDTH * 0.15, WIDTH * 0.1, WIDTH * 0.15, WIDTH * 0.1, WIDTH * 0.1, WIDTH * 0.18]
	const headers = ['Código', 'Resp. del\nProceso', 'Versión', 'Fecha de\nEmisión', 'Realizó', 'Autorizó', 'No. de Pág.']
	const rowH = 30
	let cx = LEFT

	function drawPageHeader(pageNumber) {
		writeInlineFormattedText(doc, titleText, { x: LEFT, width: WIDTH, font: 'Helvetica-Bold', fontSize: 10, align: 'center' })
		doc.moveDown(0.5)
		const tableTop = doc.y
		const values = [metadata.code, metadata.process, metadata.version, metadata.issueDate, metadata.preparedBy, metadata.approvedBy, `Página ${pageNumber} de 2`]

		cx = LEFT
		headers.forEach((header, index) => {
			doc.rect(cx, tableTop, cols[index], rowH).stroke()
			doc.fontSize(7).font('Helvetica-Bold').text(header, cx + 2, tableTop + 4, { width: cols[index] - 4, align: 'center' })
			cx += cols[index]
		})

		cx = LEFT
		values.forEach((value, index) => {
			doc.rect(cx, tableTop + rowH, cols[index], rowH).stroke()
			doc.fontSize(7).font('Helvetica').text(value, cx + 2, tableTop + rowH + 6, { width: cols[index] - 4, align: 'center' })
			cx += cols[index]
		})
		doc.y = tableTop + rowH * 2 + 10
		doc.fontSize(7).font('Helvetica-Oblique').text(confidentiality, LEFT, doc.y, { width: WIDTH, align: 'left' })
		doc.fontSize(7).font('Helvetica-Oblique').text(electronicNotice, LEFT, doc.y, { width: WIDTH, align: 'right' })
		doc.moveDown(pageNumber === 1 ? 1 : 3)
	}

	// ── Helper: página nueva si no hay espacio ──
	function ensureSpace(minH) {
		if (doc.y + minH > doc.page.height - doc.page.margins.bottom) {
			doc.addPage()
		}
	}

	function drawFormattedText(text, options = {}) {
		writeInlineFormattedText(doc, text, {
			x: options.x ?? LEFT,
			width: options.width ?? WIDTH,
			font: options.font || 'Helvetica',
			fontSize: options.fontSize || 10,
			align: options.align || 'justify',
			lineHeight: options.lineHeight,
		})
	}

	drawPageHeader(1)

	// ══════════════════════════════════════════
	// INTRO PARAGRAPH
	// ══════════════════════════════════════════
	ensureSpace(60)
	  drawFormattedText(form.intro || '"Global Agentes Aduanales y Asesores en Comercio Exterior, SC", se compromete a cumplir con los dictámenes establecidos por la Declaración de la OIT sobre los Derechos en el Trabajo con respecto al trabajo forzoso u obligatorio para lo que definiremos los siguientes supuestos:')
	doc.moveDown(1)

	// ══════════════════════════════════════════
	// NUMBERED ITEMS
	// ══════════════════════════════════════════
	const INDENT = 20

	// 1. Leyes laborales
	ensureSpace(40)
	drawFormattedText(`**1.   ${form.section1Title || 'Leyes laborales'}:** ${form.section1Text || 'significa leyes y regulaciones, o disposiciones de las leyes y regulaciones, de una parte, que están directamente relacionadas con los siguientes derechos laborales internacionalmente reconocidos:'}`, { x: LEFT + INDENT, width: WIDTH - INDENT })
	doc.moveDown(0.4)

	const defaultSubItems = [
		'(a) la libertad de asociación y el reconocimiento efectivo del derecho a la negociación colectiva;',
		'(b) la eliminación de todas las formas de trabajo forzoso u obligatorio;',
		'(c) la abolición efectiva del trabajo infantil, la prohibición de las peores formas de trabajo infantil y otras protecciones laborales para niños y menores;',
		'(d) la eliminación de la discriminación en materia de empleo y ocupación; y',
		'(e) condiciones aceptables de trabajo respecto a salarios mínimos, horas de trabajo, y seguridad y salud en el trabajo;',
	]
	const subItems = Array.isArray(form.laborRights || form.subItems) ? (form.laborRights || form.subItems) : defaultSubItems
	subItems.forEach((item) => {
		ensureSpace(20)
		drawFormattedText(String(item), { x: LEFT + INDENT * 2, width: WIDTH - INDENT * 2, lineHeight: 11 })
		doc.moveDown(0.15)
	})
	doc.moveDown(0.5)

	// 2. Leyes y regulaciones
	ensureSpace(40)
	drawFormattedText(form.section2Lead || '**2.   Leyes y regulaciones** y **leyes o regulaciones** significa:', { x: LEFT + INDENT, width: WIDTH - INDENT })
	doc.moveDown(0.4)

	const defaultSubItems2 = [
		'(a) para México, las Leyes del Congreso o regulaciones y disposiciones promulgadas de conformidad con las Leyes del Congreso y, para los efectos de este Capítulo, incluye la Constitución Política de los Estados Unidos Mexicanos; y',
		'(b) para los Estados Unidos, las Leyes del Congreso o regulaciones promulgadas de conformidad con las Leyes del Congreso y, para los efectos de este Capítulo, incluye la Constitución de los Estados Unidos.',
	]
	const subItems2 = Array.isArray(form.regulations || form.subItems2) ? (form.regulations || form.subItems2) : defaultSubItems2
	subItems2.forEach((item) => {
		ensureSpace(30)
		drawFormattedText(String(item), { x: LEFT + INDENT * 2, width: WIDTH - INDENT * 2, lineHeight: 11 })
		doc.moveDown(0.2)
	})
	doc.moveDown(0.3)

	// 3. Artículo 23.6.1
	ensureSpace(50)
	drawFormattedText(`**3.   ${form.article2361Title || 'Artículo 23.6.1'}:** ${form.article2361 || 'Las Partes reconocen el objetivo de eliminar todas las formas de trabajo forzoso u obligatorio, incluido el trabajo infantil forzoso u obligatorio. Por consiguiente, cada Parte prohibirá, a través de medidas que considere apropiadas, la importación de mercancías a su territorio procedentes de otras fuentes producidas en su totalidad o en parte por trabajo forzoso u obligatorio, incluido el trabajo infantil forzoso u obligatorio.'}`, { x: LEFT + INDENT, width: WIDTH - INDENT })
	doc.moveDown(0.6)

	// 4. Artículo 23.6.2
	ensureSpace(50)
	drawFormattedText(`**4.   ${form.article2362Title || 'Artículo 23.6.2'}:** ${form.article2362 || 'Para asistir en la implementación del párrafo 3, las Partes establecerán cooperación para la identificación y movimiento de mercancías producidas por trabajo forzoso, según lo dispone el Artículo 23.12.5(c) (Cooperación).'}`, { x: LEFT + INDENT, width: WIDTH - INDENT })
	doc.moveDown(0.6)

	// 5. Artículo 23.12.5.C
	ensureSpace(40)
	drawFormattedText(`**5.   ${form.article23125cTitle || 'Artículo 23.12.5.C'}:** ${form.article23125c || 'Las Partes podrán desarrollar actividades de cooperación en la identificación y movimiento de mercancías producidas por trabajo forzoso.'}`, { x: LEFT + INDENT, width: WIDTH - INDENT })
	doc.moveDown(1)

	// ══════════════════════════════════════════
	// CLOSING PARAGRAPH
	// ══════════════════════════════════════════
	ensureSpace(80)
	if (form.closingText) {
		drawFormattedText(form.closingText)
	} else doc.fontSize(10).font('Helvetica').text(
		'Por lo que la empresa "Global Agentes Aduanales y Asesores en Comercio Exterior, SC ", se compromete a cumplir con el seguimiento e inspección entre sus empleados y socios comerciales, para que puedan garantizar que los bienes, insumos o mercancías nacionales e importadas a México para la elaboración de productos o mercancías no provienen de la extracción, producción o fabricación, total o parcialmente, con formas prohibidas de trabajo, es decir, forzoso u obligado incluido el trabajo infantil forzoso u obligado, al amparo del artículo 23.6 del T-MEC y el Acuerdo del Trabajo y Previsión Social que establece las mercancías cuya importación está sujeta a regulación a cargo de la Secretaría del Trabajo y Previsión Social, publicado en el DOF el 17 de febrero de 2023.',
		LEFT,
		doc.y,
		{ align: 'justify', width: WIDTH }
	)

	// ══════════════════════════════════════════
	// PAGE 2 — SIGNATURE
	// ══════════════════════════════════════════
	doc.addPage()

	// Encabezado y metadatos de página 2
	drawPageHeader(2)

	// Signature box
	const sigBoxW = WIDTH * 0.6
	const sigBoxH = 105
	ensureSpace(sigBoxH)
	const sigBoxTop = doc.y
	createSignatureBox(doc, {
		width: sigBoxW,
		height: sigBoxH,
		barHeight: 25,
		text: form.signatureLabel || 'NOMBRE, FECHA Y FIRMA.',
		y: sigBoxTop,
	})

	// Autocompletado hint inside box
	doc
		.fontSize(8)
		.font('Helvetica')
		.fillColor('#666666')
		.text(signatureHint, (doc.page.width - sigBoxW) / 2 + 4, sigBoxTop + 10, { width: sigBoxW - 8, align: 'center' })
	doc.fillColor('#000000')

	doc.end()
	return doc
}
