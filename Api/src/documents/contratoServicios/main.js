import { formatLongDate } from './helpers/formatters.js'
import { createContractDocument } from './helpers/layout.js'

import renderPage01 from './sections/page01.js'
import renderPage02 from './sections/page02.js'
import renderPage03 from './sections/page03.js'
import renderPage04 from './sections/page04.js'
import renderPage05 from './sections/page05.js'
import renderPage06 from './sections/page06.js'
import renderPage07 from './sections/page07.js'
import renderPage08 from './sections/page08.js'
import renderPage09 from './sections/page09.js'
import renderPage10 from './sections/page10.js'
import renderPage11 from './sections/page11.js'
import renderPage12 from './sections/page12.js'
import renderPage13 from './sections/page13.js'
import renderPage14 from './sections/page14.js'
import renderPage15 from './sections/page15.js'
import renderPage16 from './sections/page16.js'
import renderPage17 from './sections/page17.js'
import renderPage18 from './sections/page18.js'
import renderPage19 from './sections/page19.js'
import renderPage20 from './sections/page20.js'
import renderPage21 from './sections/page21.js'
import renderPage22 from './sections/page22.js'
import renderPage23 from './sections/page23.js'
import renderPage24 from './sections/page24.js'
import renderPage25 from './sections/page25.js'

const sections = [
	renderPage01,
	renderPage02,
	renderPage03,
	renderPage04,
	renderPage05,
	renderPage06,
	renderPage07,
	renderPage08,
	renderPage09,
	renderPage10,
	renderPage11,
	renderPage12,
	renderPage13,
	renderPage14,
	renderPage15,
	renderPage16,
	renderPage17,
	renderPage18,
	renderPage19,
	renderPage20,
	renderPage21,
	renderPage22,
	renderPage23,
	renderPage24,
	renderPage25,
]

export function generarContratoServiciosProfesionales(data = {}, options = {}) {
	const doc = createContractDocument(options.layout)
	const context = {
		...data,
		issueDate: data.issueDate || formatLongDate(),
	}

	sections.forEach((renderSection, index) => {
		if (index > 0) {
			doc.addPage()
		}

		renderSection(doc, context, {
			...options,
			pageNumber: index + 1,
		})
	})

	doc.end()
	return doc
}

export default generarContratoServiciosProfesionales
