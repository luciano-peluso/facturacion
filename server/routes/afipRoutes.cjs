const express = require('express');
const {
    crearYAsignarCAE, crearFacturaC, generarQR, crearFacturaPDF, obtenerInformacionComprobanteEmitido, obtenerNumeroUltimoComprobanteCreado,
    obtenerPuntosDeVentaDisponibles, obtenerTiposDeComprobantesDisponibles, obtenerTiposDeConceptoDisponibles, obtenerTiposDeDocumentoDisponibles,obtenerTiposDeAlicuotaDisponibles,
    obtenerTiposDeMonedaDisponibles, obtenerTiposDeOpcionesDisponibles, obtenerTiposDeTributoDisponibles } = require('../controllers/afipController.cjs');

const router = express.Router();

// Endpoints

router.get('/obtener-informacion-comprobante', obtenerInformacionComprobanteEmitido);
router.get('/obtener-numero-ultimo-comprobante', obtenerNumeroUltimoComprobanteCreado);
router.get('/obtener-puntos-venta', obtenerPuntosDeVentaDisponibles);
router.get('/obtener-tipo/comprobante', obtenerTiposDeComprobantesDisponibles);
router.get('/obtener-tipo/concepto', obtenerTiposDeConceptoDisponibles);
router.get('/obtener-tipo/documento', obtenerTiposDeDocumentoDisponibles);
router.get('/obtener-tipo/alicuota', obtenerTiposDeAlicuotaDisponibles);
router.get('/obtener-tipo/moneda', obtenerTiposDeMonedaDisponibles);
router.get('/obtener-tipo/opciones', obtenerTiposDeOpcionesDisponibles);
router.get('/obtener-tipo/tributo', obtenerTiposDeTributoDisponibles);

router.get('/crear/CAE', crearYAsignarCAE);
router.post('/crear/factura-c', crearFacturaC);
router.post('/crear/codigo-qr', generarQR);
router.post('/crear/factura-pdf', crearFacturaPDF);


module.exports = router;