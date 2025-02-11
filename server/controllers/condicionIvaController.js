const CondicionIva = require('../models/CondicionIva');

const getCondicionesIva = async (req, res) => {
    try {
        const response = await CondicionIva.findAll();
        res.status(200).json({success:true, message:"Se trajeron con exito las condiciones de IVA.", data: response});
    } catch (error){
        console.error("Error al traer las condiciones de IVA: ", error);
        res.status(500).json({success: false, message: "Error al traer las condiciones de IVA."});
    }
}

const getCondicionIva = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await CondicionIva.findByPk(id);
        if (!response) {
            return res.status(404).json({ success: false, message: "Condicion IVA no encontrada" });
        }
        res.status(200).json({success:true, message:"Se trajeron con exito las condiciones de IVA.", data: response});
    } catch (error){
        console.error("Error al traer las condiciones de IVA: ", error);
        res.status(500).json({success: false, message: "Error al traer las condiciones de IVA."});
    }
}

module.exports = {
    getCondicionesIva,
    getCondicionIva
}