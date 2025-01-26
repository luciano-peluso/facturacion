const Factura = require('../models/Factura');

const getFacturas = async (req, res) => {
    try {
        const facturas = await Factura.findAll({ paranoid:false }); 
        res.status(200).json({success: true, message:"Facturas traidas con éxito", data: facturas});
    } catch (error) {
        console.error("Error al traer las facturas: ", error);
        res.status(500).json({success: false, message: "Error al traer las facturas."});
    }
}

const getFacturaById = async (req, res) => {
    const { id } = req.params;
    try {
        const factura = await Factura.findByPk(id);
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
    const { paciente_id, punto_de_venta, numero_factura, monto, estado, fecha_emision, fecha_facturada } = req.body;
    try {
        const factura = await Factura.create({ paciente_id, punto_de_venta, numero_factura, monto, estado, fecha_emision, fecha_facturada });
        res.status(201).json({ success: true, message: "Factura creada", data: factura });
    } catch (error) {
        console.error("Error al crear la factura:", error);
        res.status(500).json({ success: false, message: "Error al crear la factura" });
    }
};

const updateFactura = async (req, res) => {
    const { id } = req.params;
    const { paciente_id, punto_de_venta, numero_factura, monto, estado, fecha_emision, fecha_facturada } = req.body;
    try {
        const factura = await Factura.findByPk(id);
        if (!factura) {
            return res.status(404).json({ success: false, message: "Factura no encontrada" });
        }
        await factura.update({ paciente_id, punto_de_venta, numero_factura, monto, estado, fecha_emision, fecha_facturada });
        res.status(200).json({ success: true, message: "Factura actualizada", data: factura });
    } catch (error) {
        console.error("Error al actualizar la factura:", error);
        res.status(500).json({ success: false, message: "Error al actualizar la factura" });
    }
};

const deleteFactura = async (req, res) => {
    const { id } = req.params;
    try {
        const factura = await Factura.findByPk(id);
        if (!factura) {
            return res.status(404).json({ success: false, message: "Factura no encontrada" });
        }
        await factura.destroy();
        res.status(200).json({ success: true, message: "Factura eliminada" });
    } catch (error) {
        console.error("Error al eliminar la factura:", error);
        res.status(500).json({ success: false, message: "Error al eliminar la factura" });
    }
};

module.exports = {
    getFacturas,
    getFacturaById,
    createFactura,
    updateFactura,
    deleteFactura,
};
