const { sequelize } = require('../config/db');
const ParametroHistorial = require('../models/ParametroHistorial');

class ParametroHistorialService {
  static async guardarValorAnterior(parametro, transaction) {
    return ParametroHistorial.create({
      id_parametro: parametro.id,
      valor_booleano: parametro.valor_booleano,
      valor_string: parametro.valor_string,
      valor_int: parametro.valor_int,
      valor_double: parametro.valor_double,
      fecha_cambio: new Date(),
    }, { transaction });
  }

  static async actualizarParametro(parametro, cambios) {
    return sequelize.transaction(async (transaction) => {
      await this.guardarValorAnterior(parametro, transaction);

      await parametro.update({
        ...cambios,
        fecha_ultima_modificacion: new Date(),
      }, { transaction });

      return parametro;
    });
  }
}

module.exports = ParametroHistorialService;
