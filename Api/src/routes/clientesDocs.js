import express from 'express'

const router = express.Router()

import Staff from '../models/Staff.js'

import { generarConvenioSeguridad } from '../documents/ConvenioSeguridadOEA.js'
import { generarCuestionarioSeguridadSocioComercial } from '../documents/CuestionarioDeSeguridadSocioComercial.js'
import { generarAcuerdoSociosComerciales } from '../documents/AcuerdoSociosComerciales.js'
import { generarAvisoDePrivacidad } from '../documents/AvisoDePrivacidad.js'
import { generarCartaCFDI } from '../documents/CartaCFDI.js'
import { generarCartaDeEncomienda } from '../documents/CartaDeEncomienda.js'
import { generarCartaEncomiendaPersonasMorales } from '../documents/CartaEncomiendaPersonasMorales.js'
import { generarCartaProtesta } from '../documents/CartaProtesta.js'
import { generarCartaProtestaPersonaMoral } from '../documents/CartaProtestaPersonaMoral.js'
import { generarContratoPrestacionServiciosAgenteAduanal } from '../documents/ContratoPrestacionServiciosAgenteAduanal.js'
import { generarContratoMVE } from '../documents/ContratoMVE.js'
import { generarCuestionarioEstandaresSeguridad } from '../documents/CuestionarioEstandaresSeguridad.js'
import { generarCuestionarioInicialNecesidades } from '../documents/CuestionarioInicialNecesidades.js'
import { generarDocumentosRequeridosCliente } from '../documents/DocumentosRequeridosCliente.js'
import { generarPoliticaSeguridadInformatica } from '../documents/PoliticaSeguridadInformatica.js'
import { generarPoliticaTrabajoForzoso } from '../documents/PoliticaTrabajoForzoso.js'
import { generarContratoServiciosProfesionales } from '../documents/contratoServicios/main.js'
import dayjs from 'dayjs'
import 'dayjs/locale/es.js'
import { generarCartaEncomiendaLeonel } from '../documents/CartaEncomiendaLeonel.js'
import { generarContratoPrestacionServiciosAgenteAduanalLeonel } from '../documents/ContratoPrestacionServiciosAgenteAduanalLeonel.js'
import { generarInformacionClienteNuevo } from '../documents/InformacionClienteNuevo.js'
import { generarManifestacionMaterialidadLeonel } from '../documents/ManifestacionMaterialidadLeonel.js'
import { generarCertificacionOrigenTMEC } from '../documents/CertificacionOrigenTMEC.js'
import { generarCartaDeclaracionDeslindePCST } from '../documents/CartaDeclaracionDeslindePCST.js'

dayjs.locale('es')

const getLegalRepresentativeFullName = (company = {}) => {
  const representative = company?.legalRepresentative || {}
  const fullName = [
    representative.firstName,
    representative.paternalLastName,
    representative.maternalLastName,
  ]
    .filter((part) => typeof part === 'string' && part.trim().length > 0)
    .join(' ')
    .trim()

  return fullName || company?.legalRepresentativeName || 'No aplica'
}

// Ruta para descargar el documento
router.get('/convenio-seguridad', async (req, res) => {
  try {
    const doc = generarConvenioSeguridad({
      nombreRepresentante: 'Representante de Prueba',
      nombreEmpresa: 'Empresa de Prueba S.A. de C.V.',
      dia: '14',
      mes: 'noviembre',
      anio: '2024',
    })

    const fileName = 'convenio-seguridad-prueba.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar el convenio de seguridad',
      error: error.message,
    })
  }
})

router.post('/convenio-seguridad', async (req, res) => {
  try {
    const userData = await Staff.findById(req.body.userId)
    const fecha = dayjs().format('D [de] MMMM [de] YYYY').split(' de ')
    const doc = generarConvenioSeguridad({
      nombreRepresentante: getLegalRepresentativeFullName(userData?.company),
      nombreEmpresa: userData.company.socialReason,
      dia: fecha[0],
      mes: fecha[1],
      anio: fecha[2],
    })

    const fileName = 'convenio-seguridad-prueba.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'No fue posible generar el convenio de seguridad',
      error: error.message,
    })
  }
})

router.post('/cuestionario-seguridad', async (req, res) => {
  console.log(123)
  try {

    const userData = await Staff.findById(req.body.userId)
    const data = {
      ...req.body,
      user: userData,
    }
    console.log(data)
    const doc = generarCuestionarioSeguridadSocioComercial(data)

    const fileName = 'cuestionario-seguridad-socio-comercial.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
    doc.end()
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: 'No fue posible generar el cuestionario de seguridad',
      error: error.message,
    })
  }
})

router.get('/acuerdo-socios-comerciales', async (req, res) => {
  try {
    const data = {
      name: "Hola que tal"
    }
    const doc = generarAcuerdoSociosComerciales(data)

    const fileName = 'acuerdo-socios-comerciales.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar el acuerdo de socios comerciales',
      error: error.message,
    })
  }
})

router.post('/acuerdo-socios-comerciales', async (req, res) => {
  console.log(req.body)
  const data = req.body
  try {
    const doc = generarAcuerdoSociosComerciales(data)

    const fileName = 'acuerdo-socios-comerciales.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar el acuerdo de socios comerciales',
      error: error.message,
    })
  }
})

router.get('/aviso-privacidad', async (req, res) => {
  try {
    const doc = generarAvisoDePrivacidad()

    const fileName = 'aviso-privacidad.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar el aviso de privacidad',
      error: error.message,
    })
  }
})



router.post('/carta-cfdi', async (req, res) => {
  try {
    const userData = await Staff.findById(req.body.userId)

    console.log(userData)

    const data = {
      ...req.body,
      user: userData
    }

    const doc = generarCartaCFDI(data)

    const fileName = 'carta-cfdi.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar la carta CFDI',
      error: error.message,
    })
  }
})

router.post('/carta-encomienda', async (req, res) => {
  try {
    const userData = await Staff.findById(req.body.userId)
    const data = {
      ...req.body,
      user: userData,
    }
    console.log(data)
    const doc = generarCartaEncomiendaLeonel(data)

    const fileName = 'carta-encomienda.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'No fue posible generar la carta de encomienda',
      error: error.message,
    })
  }
})

router.get('/carta-encomienda-personas-morales', async (req, res) => {
  try {
    const doc = generarCartaEncomiendaPersonasMorales()

    const fileName = 'carta-encomienda-personas-morales.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar la carta encomienda para personas morales',
      error: error.message,
    })
  }
})

router.post('/carta-encomienda-personas-morales', async (req, res) => {
  try {
    const userData = await Staff.findById(req.body.userId)
    const data = {
      ...req.body,
      user: userData,
    }


    const doc = generarCartaEncomiendaPersonasMorales(data)

    const fileName = 'carta-encomienda-personas-morales.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'No fue posible generar la carta encomienda para personas morales',
      error: error.message,
    })
  }
})

router.get('/carta-protesta', async (req, res) => {
  try {
    const doc = generarCartaProtesta()

    const fileName = 'carta-protesta.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar la carta de protesta',
      error: error.message,
    })
  }
})

router.get('/carta-protesta-persona-moral', async (req, res) => {
  try {
    const doc = generarCartaProtestaPersonaMoral()

    const fileName = 'carta-protesta-persona-moral.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar la carta de protesta para persona moral',
      error: error.message,
    })
  }
})

router.post('/carta-protesta', async (req, res) => {

  try {
    const userData = await Staff.findById(req.body.userId)
    const data = {
      ...req.body,
      user: userData,
    }

    const doc = generarCartaProtesta(data)

    const fileName = 'carta-protesta.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar la carta de protesta',
      error: error.message,
    })
  }
})

router.post('/carta-protesta-persona-moral', async (req, res) => {
  try {
    const userData = await Staff.findById(req.body.userId)
    const data = {
      ...req.body,
      user: userData,
    }

    const doc = generarCartaProtestaPersonaMoral(data)

    const fileName = 'carta-protesta-persona-moral.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar la carta de protesta para persona moral',
      error: error.message,
    })
  }
})

router.get('/contrato-prestacion-servicios', async (req, res) => {
  try {
    const doc = generarContratoPrestacionServiciosAgenteAduanal()

    const fileName = 'contrato-prestacion-servicios-agente-aduanal.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar el contrato de prestacion de servicios',
      error: error.message,
    })
  }
})

router.get('/contrato-prestacion-servicios-leonel', async (req, res) => {
  try {
    const doc = generarContratoPrestacionServiciosAgenteAduanalLeonel()

    const fileName = 'contrato-prestacion-servicios-leonel.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'No fue posible generar el contrato de prestacion de servicios',
      error: error.message,
    })
  }
})

router.post('/contrato-prestacion-servicios-leonel', async (req, res) => {
  try {
    const userData = await Staff.findById(req.body.userId)
    const data = {
      ...req.body,
      user: userData,
    }

    const doc = generarContratoPrestacionServiciosAgenteAduanalLeonel(data)

    const fileName = 'contrato-prestacion-servicios-leonel.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'No fue posible generar el contrato de prestacion de servicios',
      error: error.message,
    })
  }
})

router.get('/informacion-cliente-nuevo', async (req, res) => {
  try {
    const doc = generarInformacionClienteNuevo()

    const fileName = 'informacion-cliente-nuevo.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'No fue posible generar el formato de informacion de cliente nuevo',
      error: error.message,
    })
  }
})

router.post('/informacion-cliente-nuevo', async (req, res) => {
  try {
    const userData = await Staff.findById(req.body.userId)
    const data = {
      ...req.body,
      user: userData,
    }
    const doc = generarInformacionClienteNuevo(data)

    const fileName = 'informacion-cliente-nuevo.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'No fue posible generar el formato de informacion de cliente nuevo',
      error: error.message,
    })
  }
})

router.get('/manifestacion-materialidad-leonel', async (req, res) => {
  try {
    const doc = generarManifestacionMaterialidadLeonel()

    const fileName = 'manifestacion-materialidad-leonel.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'No fue posible generar la manifestacion de materialidad',
      error: error.message,
    })
  }
})

router.post('/manifestacion-materialidad-leonel', async (req, res) => {
  try {
    const userData = await Staff.findById(req.body.userId)
    const data = {
      ...req.body,
      user: userData,
    }

    console.log(data)
    console.log('tite')

    const doc = generarManifestacionMaterialidadLeonel(data)

    const fileName = 'manifestacion-materialidad-leonel.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'No fue posible generar la manifestacion de materialidad',
      error: error.message,
    })
  }
})

router.get('/certificacion-origen-tmec', async (req, res) => {
  try {
    const doc = generarCertificacionOrigenTMEC()

    const fileName = 'certificacion-origen-tmec.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'No fue posible generar la certificacion de origen T-MEC',
      error: error.message,
    })
  }
})

router.post('/certificacion-origen-tmec', async (req, res) => {
  try {
    console.log(req.body)
    const doc = generarCertificacionOrigenTMEC(req.body)

    const fileName = 'certificacion-origen-tmec.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'No fue posible generar la certificacion de origen T-MEC',
      error: error.message,
    })
  }
})

router.get('/carta-declaracion-deslinde-pcst', async (req, res) => {
  try {
    const doc = generarCartaDeclaracionDeslindePCST()

    const fileName = 'carta-declaracion-deslinde-pcst.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'No fue posible generar la carta de declaracion y deslinde PCST',
      error: error.message,
    })
  }
})

router.post('/carta-declaracion-deslinde-pcst', async (req, res) => {
  try {
    const userData = req.body.userId ? await Staff.findById(req.body.userId) : null
    const data = {
      ...req.body,
      user: userData,
    }
    const doc = generarCartaDeclaracionDeslindePCST(data)

    const fileName = 'carta-declaracion-deslinde-pcst.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'No fue posible generar la carta de declaracion y deslinde PCST',
      error: error.message,
    })
  }
})

router.get('/contrato-mve', async (req, res) => {
  try {
    const doc = generarContratoMVE()

    const fileName = 'contrato-mve-gaa-cliente.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar el contrato MVE',
      error: error.message,
    })
  }
})

router.get('/contrato-servicios-profesionales', async (req, res) => {
  try {
    const doc = generarContratoServiciosProfesionales()

    const fileName = 'contrato-servicios-profesionales.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar el contrato de servicios profesionales',
      error: error.message,
    })
  }
})

router.get('/cuestionario-estandares-seguridad', async (req, res) => {
  try {

    const doc = generarCuestionarioEstandaresSeguridad()

    const fileName = 'cuestionario-estandares-seguridad.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar el cuestionario de estandares en seguridad',
      error: error.message,
    })
  }
})

router.post('/contrato-servicios-profesionales', async (req, res) => {
  try {
    const userData = await Staff.findById(req.body.userId)
    const data = {
      ...req.body,
      user: userData,
    }
    console.log(data)
    const doc = generarContratoServiciosProfesionales(data)

    const fileName = 'contrato-servicios-profesionales.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar el contrato de servicios profesionales',
      error: error.message,
    })
  }
})

router.post('/cuestionario-estandares-seguridad', async (req, res) => {
  try {
    const userData = await Staff.findById(req.body.userId)
    const data = {
      ...req.body,
      user: userData,
    }
    console.log(data)
    const doc = generarCuestionarioEstandaresSeguridad(data)

    const fileName = 'cuestionario-estandares-seguridad.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'No fue posible generar el cuestionario de estandares en seguridad',
      error: error.message,
    })
  }
})

router.get('/cuestionario-inicial-necesidades', async (req, res) => {
  try {
    const doc = generarCuestionarioInicialNecesidades()

    const fileName = 'cuestionario-inicial-necesidades.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar el cuestionario inicial de necesidades',
      error: error.message,
    })
  }
})

router.get('/documentos-requeridos-cliente', async (req, res) => {
  try {
    const doc = generarDocumentosRequeridosCliente()

    const fileName = 'documentos-requeridos-cliente.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar el check list de documentos requeridos',
      error: error.message,
    })
  }
})

router.get('/politica-seguridad-informatica', async (req, res) => {
  try {
    const doc = generarPoliticaSeguridadInformatica()

    const fileName = 'politica-seguridad-informatica.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar la politica de seguridad informatica',
      error: error.message,
    })
  }
})

router.get('/politica-trabajo-forzoso', async (req, res) => {
  try {
    const doc = generarPoliticaTrabajoForzoso()

    const fileName = 'politica-trabajo-forzoso.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    doc.pipe(res)
  } catch (error) {
    return res.status(500).json({
      message: 'No fue posible generar la política de prohibición del trabajo forzoso',
      error: error.message,
    })
  }
})

export const routeConfig = { path: "/api/clients", router }