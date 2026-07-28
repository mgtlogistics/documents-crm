import { generarContratoServiciosProfesionales } from './contratoServicios/main.js'

export function generarContratoServiciosP(data = {}, options = {}) {
	return generarContratoServiciosProfesionales(data, options)
}

export default generarContratoServiciosP