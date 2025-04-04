const Factura = require('../models/Factura');
const Paciente = require('../models/Paciente')
const ObraSocial = require('../models/ObraSocial');
const Tutor = require('../models/Tutor');
const { Op } = require('sequelize');
const Notificacion = require('../models/Notificacion');
const PacienteObraSocial = require('../models/PacienteObraSocial');

const getFacturas = async (req, res) => {
    try {
        const facturas = await Factura.findAll({ 
            paranoid: true,
            include: [
                {
                    model: PacienteObraSocial, 
                    as: 'paciente_obra_social',
                    attributes: ['id', 'paciente_id', 'obra_social_id'],
                    include: [
                        {
                            model: Paciente,
                            as: "paciente",
                            attributes: ['id', 'nombre', 'dni', 'tutor_id'],
                            include: [
                                {
                                    model: Tutor,
                                    attributes: ['nombre', 'dni'],
                                    as: "tutor"
                                }
                            ]
                        },
                        {
                            model: ObraSocial,
                            as: "obra_social",
                            attributes: ['id', 'nombre', 'cuit']
                        }
                    ]
                }
            ]
        }); 
        res.status(200).json({success: true, message:"Facturas traidas con éxito", data: facturas});
    } catch (error) {
        console.error("Error al traer las facturas: ", error);
        res.status(500).json({success: false, message: "Error al traer las facturas."});
    }
}

const getFacturaById = async (req, res) => {
    const { id } = req.params;
    try {
        const factura = await Factura.findByPk(id, {  // Pasar id directamente
            include: [
                {
                    model: Paciente,
                    as: 'paciente', // Alias definido en las asociaciones
                    attributes: ['id', 'nombre'],
                },
            ],
        });

        if (!factura) {
            return res.status(404).json({ success: false, message: "Factura no encontrada" });
        }
        res.status(200).json({ success: true, data: factura });
    } catch (error) {
        console.error("Error al traer la factura:", error);
        res.status(500).json({ success: false, message: "Error al traer la factura" });
    }
};

const createFactura = async (req, res) => {
    const { paciente_id, punto_de_venta, numero_factura, monto, estado, fecha_emision, fecha_facturada, fecha_cobro, es_consultorio } = req.body;
    try {
        const factura = await Factura.create({ paciente_id, punto_de_venta, numero_factura, monto, estado, fecha_emision, fecha_facturada, fecha_cobro, es_consultorio });
        res.status(201).json({ success: true, message: "Factura creada", data: factura });
    } catch (error) {
        console.error("Error al crear la factura:", error);
        res.status(500).json({ success: false, message: "Error al crear la factura" });
    }
};

const updateFactura = async (req, res) => {
    const { id } = req.params;
    const { paciente_id, punto_de_venta, numero_factura, monto, estado, fecha_emision, fecha_facturada, fecha_cobro, es_consultorio } = req.body;

    try {
        const factura = await Factura.findByPk(id);
        if (!factura) {
            return res.status(404).json({ success: false, message: "Factura no encontrada" });
        }

        // Si la factura se marca como "Pendiente", borramos la fecha de cobro
        const nuevaFechaCobro = estado ? fecha_cobro : null;

        const nuevoMonto = parseFloat(monto.replace(",","."));

        await factura.update({ paciente_id, punto_de_venta, numero_factura, monto: nuevoMonto, estado, fecha_emision, fecha_facturada, fecha_cobro: nuevaFechaCobro, es_consultorio });

        res.status(200).json({ success: true, message: "Factura actualizada", data: factura });
    } catch (error) {
        console.error("Error al actualizar la factura:", error);
        res.status(500).json({ success: false, message: "Error al actualizar la factura" });
    }
};

const cobrarFactura = async(req, res) => {
    const { id } = req.params;
    const { fecha_cobro, estado } = req.body;
    try {
        const factura = await Factura.findByPk(id);
        if (!factura) {
            return res.status(404).json({ success: false, message: "Factura no encontrada" });
        }
        await factura.update({ fecha_cobro, estado })
        res.status(200).json({ success: true, message: "Factura actualizada", data: factura });
    } catch (error) {
        console.error("Error al actualizar la factura:", error);
        res.status(500).json({ success: false, message: "Error al actualizar la factura" });
    }
}

const deleteFactura = async (req, res) => {
    const { id } = req.params;
    try {
        const factura = await Factura.findByPk(id);
        if (!factura) {
            return res.status(404).json({ success: false, message: "Factura no encontrada" });
        }

        // Buscar la notificación asociada a la factura
        const notificacion = await Notificacion.findOne({ where: { factura_id: id } });

        // Si existe, eliminar la notificación
        if (notificacion) {
            await notificacion.destroy();
        }

        // Eliminar la factura
        await factura.destroy();

        res.status(200).json({ success: true, message: "Factura y notificación eliminadas correctamente" });
    } catch (error) {
        console.error("Error al eliminar la factura:", error);
        res.status(500).json({ success: false, message: "Error al eliminar la factura" });
    }
};

const obtenerFacturasPorMes = async (req, res) => {
    try {
        const { mes, anio } = req.params;
        const inicioMes = new Date(anio, mes - 1, 1);
        const finMes = new Date(anio, mes, 0, 23, 59, 59);

        const facturas = await Factura.findAll({
            where: {
                fecha_cobro: {
                    [Op.between]: [inicioMes, finMes],
                },
            },
            attributes: ["id", "numero_factura", "fecha_facturada", "monto", "fecha_cobro", "es_consultorio"],
            include: [
                {
                    model: Paciente,
                    as: "paciente",
                    attributes: ["id", "nombre"],
                },
            ],
            paranoid: true,
        });

        res.status(200).json({ success: true, data: facturas });
    } catch (error) {
        console.error("Error al traer las facturas:", error);
        res.status(500).json({ success: false, message: "Error al traer las facturas: " + error });
    }
};

module.exports = {
    getFacturas,
    getFacturaById,
    createFactura,
    updateFactura,
    cobrarFactura,
    deleteFactura,
    obtenerFacturasPorMes
};
