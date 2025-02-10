const afip = require('../config/afipInstance.cjs');
const QRCode = require('qrcode');

const crearYAsignarCAE = async (req, res) => {
    const returnFullResponse = false;
    const date = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    const { cantReg, ptoVta, cbteTipo, concepto, docTipo, docNro, cbteDesde, cbteHasta, cbteFch, 
        impTotal, impTotConc, impNeto, impOpEx, impIva, impTrib, monId, monCotiz, condicionIVAReceptorId,
    } = req.body;
    let data = {
        'CantReg' 	: cantReg,  // Cantidad de comprobantes a registrar
        'PtoVta' 	: ptoVta,  // Punto de venta
        'CbteTipo' 	: cbteTipo,  // Tipo de comprobante (ver tipos disponibles) 
        'Concepto' 	: concepto,  // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
        'DocTipo' 	: docTipo, // Tipo de documento del comprador (99 consumidor final, ver tipos disponibles)
        'DocNro' 	: docNro,  // Número de documento del comprador (0 consumidor final)
        'CbteDesde' 	: cbteDesde,  // Número de comprobante o numero del primer comprobante en caso de ser mas de uno
        'CbteHasta' 	: cbteHasta,  // Número de comprobante o numero del último comprobante en caso de ser mas de uno
        'CbteFch' 	: afip.ElectronicBilling.formatDate(cbteFch), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
        'ImpTotal' 	: impTotal, // Importe total del comprobante
        'ImpTotConc' 	: impTotConc,   // Importe neto no gravado
        'ImpNeto' 	: impNeto, // Importe neto gravado
        'ImpOpEx' 	: impOpEx,   // Importe exento de IVA
        'ImpIVA' 	: impIva,  //Importe total de IVA
        'ImpTrib' 	: impTrib,   //Importe total de tributos
        'MonId' 	: monId, //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
        'MonCotiz' 	: monCotiz,     // Cotización de la moneda usada (1 para pesos argentinos)  
        'CondicionIVAReceptorId': condicionIVAReceptorId        
    }

    try {
        const res = await afip.ElectronicBilling.createVoucher(data, returnFullResponse);
        
        res.status(201).json({success:true, message: "Comprobante creado con exito", data: res});
    } catch (error) {
        console.error("Error al intentar emitir el comprobante",error);
        res.status(501).json({success: false, message: "No se emitir el comprobante"});
    }
}

const crearFacturaC = async (req, res) => {
    const { punto_de_venta, concepto, docTipo, docNro, impTotal, fechaServicioDesde, fechaServicioHasta, fechaVencimientoPago,
        condicionIVAReceptorId } = req.body;
    const impNeto = impTotal / 1.21;
    const impIva = impNeto * 0.21;
	const tipo_de_factura = 11; // 11 = Factura C
    const fecha = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
	 
	//Número de la ultima Factura C
	last_voucher = await afip.ElectronicBilling.getLastVoucher(punto_de_venta, tipo_de_factura);
	const numero_de_factura = last_voucher+1;
    
    
	const data = {
		'CantReg' 	: 1, // Cantidad de facturas a registrar
		'PtoVta' 	: punto_de_venta,
		'CbteTipo' 	: tipo_de_factura, 
		'Concepto' 	: concepto,
		'DocTipo' 	: docTipo,
		'DocNro' 	: docNro,
		'CbteDesde' : numero_de_factura,
		'CbteHasta' : numero_de_factura,
		'CbteFch' 	: parseInt(fecha.replace(/-/g, '')),	
		'FchServDesde'  : (fechaServicioDesde ? parseInt(fechaServicioDesde.replace(/-/g, '')) : null),
		'FchServHasta'  : (fechaServicioHasta ? parseInt(fechaServicioHasta.replace(/-/g, '')) : null),
		'FchVtoPago'    : (fechaVencimientoPago ? parseInt(fechaVencimientoPago.replace(/-/g, '')) : null),
		'ImpTotal' 	: impTotal,
		'ImpTotConc': 0, // Importe neto no gravado
		'ImpNeto' 	: impTotal,
		'ImpOpEx' 	: 0,
		'ImpIVA' 	: 0,
		'ImpTrib' 	: 0, //Importe total de tributos
		'MonId' 	: 'PES', //Tipo de moneda usada en la factura ('PES' = pesos argentinos) 
		'MonCotiz' 	: 1, // Cotización de la moneda usada (1 para pesos argentinos)  
        'CondicionIVAReceptorId': condicionIVAReceptorId        
	};

	/** 
	 * Creamos la Factura 
	 **/
    try {
	    const response = await afip.ElectronicBilling.createVoucher(data);
        
        res.status(201).json({success: true, message:"Exito al crear la factura C", data: response});
    } catch (error){
        console.error("Error en emitir la factura tipo C: "+ error);
        res.status(501).json({success: false, message: "Error al crear la factura C:",error});
    }
}

const generarQR = async (req, res) => {
    const { fechaComprobante, cuit, ptoVta, tipoCmp, nroCmp, importe, tipoDocRec, nroDocRec, CAE} = req.body;
    const date = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    const QRCodeData = {
        'ver': 1, // Versión del formato de los datos (1 por defecto)
        'fecha': date, // Fecha de emisión del comprobante
        'cuit': cuit, // Cuit del Emisor del comprobante
        'ptoVta': ptoVta, // Punto de venta utilizado para emitir el comprobante
        'tipoCmp': tipoCmp, // Tipo de comprobante
        'nroCmp': nroCmp, // Tipo de comprobante
        'importe': importe, // Importe Total del comprobante (en la moneda en la que fue emitido)
        'moneda': 'ARS', // Moneda del comprobante
        'ctz': 1, // Cotización en pesos argentinos de la moneda utilizada
        'tipoDocRec': tipoDocRec, // Código del Tipo de documento del receptor
        'nroDocRec': nroDocRec, // Número de documento del receptor
        'tipoCodAut': 'E', // “A” para comprobante autorizado por CAEA, “E” para comprobante autorizado por CAE
        'codAut': CAE  // CAE o CAEA, segun corresponda
    };


    // Preparamos el texto para el qr en base a https://www.afip.gob.ar/fe/qr/documentos/QRespecificaciones.pdf
    const QRCodeText = 'https://www.afip.gob.ar/fe/qr/?p=' + btoa(JSON.stringify(QRCodeData));
    
    try {
        const res = await QRCode.toDataURL(QRCodeText); // Podemos obtenerlo como URL
        
        res.status(201).json({success:true, message:"QR generado con exito", data: res});
    } catch (error) {
        console.error("Error en generar el QR: "+error);
        res.status(501).json({ success: false, message: "Error al generar el QR"});
    }
}

const obtenerInformacionComprobanteEmitido = async (req, res) => {
    const { puntoDeVenta, numeroDeComprobante, tipoDeComprobante } = req.body;
    try {
        const voucherInfo = await afip.ElectronicBilling.getVoucherInfo(numeroDeComprobante, puntoDeVenta, tipoDeComprobante);

        if(voucherInfo === null){
            console.error('El comprobante no existe');
        }
        res.status(200).json({success: true, message: "Exito al traer el comprobante", data: voucherInfo});
    } catch (error) {
        console.error("Error al traer el comprobante: " + error);
        res.status(500).json({success: false, message: "No se pudo traer el comprobante"});
    }
}

const obtenerNumeroUltimoComprobanteCreado = async (req, res) => {
    const {puntoDeVenta, tipoDeComprobante} = req.body;
    try {
        const lastVoucher = await afip.ElectronicBilling.getLastVoucher(puntoDeVenta, tipoDeComprobante);

        if(voucherInfo === null){
            console.error('No hay comprobantes');
        }
        res.status(200).json({success: true, message: "Exito al traer el ultimo comprobante", data: lastVoucher});
    } catch (error) {
        console.error("Error al traer el comprobante: " + error);
        res.status(500).json({success: false, message: "No se pudo traer el comprobante"});
    }
}

const obtenerPuntosDeVentaDisponibles = async (req, res) => {
    try {
        const salesPoints = await afip.ElectronicBilling.getSalesPoints();

        if(salesPoints === null) {
            console.error("No hay puntos de venta.");
        }
        res.status(200).json({success:true, message:"Exito al traer los puntos de venta", data: salesPoints});
    } catch(error) {
        console.error("Error en el punto de venta: " + error);
        res.status(500).json({success: false, message: "No se pudieron traer los puntos de venta"});
    }
}

const obtenerTiposDeComprobantesDisponibles = async (req, res) => {
    try {
    const voucherTypes = await afip.ElectronicBilling.getVoucherTypes();
    
    res.status(200).json({success:true, message:"Exito al traer los tipos de comprobantes", data: voucherTypes});
    } catch (error) {
        console.error("Error en traer los tipos de comprobante: " + error);
        res.status(500).json({success: false, message: "No se pudieron traer los tipos de comprobantes"});
    }
}

const obtenerTiposDeConceptoDisponibles = async (req, res) => {
    try {
        const conceptTypes = await afip.ElectronicBilling.getConceptTypes();
        res.status(200).json({success:true, message:"Exito al traer los tipos de concepto", data: conceptTypes});
    } catch (error) {
        console.error("Error en traer los tipos de concepto: " + error);
        res.status(500).json({success: false, message: "No se pudieron traer los tipos de concepto"});
    }
}

const obtenerTiposDeDocumentoDisponibles = async (req, res) => {
    try {
        const documentTypes = await afip.ElectronicBilling.getDocumentTypes();
        res.status(200).json({success:true, message:"Exito al traer los tipos de documento", data: documentTypes});
    } catch (error) {
        console.error("Error en traer los tipos de documento: " + error);
        res.status(500).json({success: false, message: "No se pudieron traer los tipos de documento"});
    }
}

const obtenerTiposDeAlicuotaDisponibles = async (req, res) => {
    try {
        const aliquotTypes = await afip.ElectronicBilling.getAliquotTypes();
        res.status(200).json({success:true, message:"Exito al traer los tipos de alicuotas", data: aliquotTypes});
    } catch (error) {
        console.error("Error en traer los tipos de alicuotas: " + error);
        res.status(500).json({success: false, message: "No se pudieron traer los tipos de alicuotas"});
    }
}

const obtenerTiposDeMonedaDisponibles = async (req, res) => {
    try {
        const currenciesTypes = await afip.ElectronicBilling.getCurrenciesTypes();
        res.status(200).json({success:true, message:"Exito al traer los tipos de moneda", data: currenciesTypes});
    } catch (error) {
        console.error("Error en traer los tipos de moneda: " + error);
        res.status(500).json({success: false, message: "No se pudieron traer los tipos de moneda"});
    }
}

const obtenerTiposDeOpcionesDisponibles = async (req, res) => {
    try {
        const optionTypes = await afip.ElectronicBilling.getOptionsTypes();
        res.status(200).json({success:true, message:"Exito al traer los tipos de opciones", data: optionTypes});
    } catch (error) {
        console.error("Error en traer los tipos de opciones: " + error);
        res.status(500).json({success: false, message: "No se pudieron traer los tipos de opciones"});
    }
}

const obtenerTiposDeTributoDisponibles = async (req, res) => {
    try {
        const taxTypes = await afip.ElectronicBilling.getTaxTypes();
        res.status(200).json({success:true, message:"Exito al traer los tipos de tributo", data: taxTypes});
    } catch (error) {
        console.error("Error en traer los tipos de tributo: " + error);
        res.status(500).json({success: false, message: "No se pudieron traer los tipos de tributo"});
    }
}

module.exports = {
    crearYAsignarCAE,
    crearFacturaC,
    generarQR,
    obtenerInformacionComprobanteEmitido,
    obtenerNumeroUltimoComprobanteCreado,
    obtenerPuntosDeVentaDisponibles,
    obtenerTiposDeComprobantesDisponibles,
    obtenerTiposDeConceptoDisponibles,
    obtenerTiposDeDocumentoDisponibles,
    obtenerTiposDeAlicuotaDisponibles,
    obtenerTiposDeMonedaDisponibles,
    obtenerTiposDeOpcionesDisponibles,
    obtenerTiposDeTributoDisponibles
}