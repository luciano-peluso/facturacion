const Parametro = require('../models/Parametro');
const ParametrosEnum = require('./ParametrosEnum');

class ParametroFactory {
  static separarPorPipe(valor) {
    return valor ? valor.split('|').map((item) => item.trim()).filter(Boolean) : [];
  }

  static separarPorPuntoYComa(valor) {
    return valor ? valor.split(';').map((item) => item.trim()).filter(Boolean) : [];
  }

  static separarPorComas(valor) {
    return valor ? valor.split(',').map((item) => item.trim()).filter(Boolean) : [];
  }

  static async obtenerParametro(keyParametro) {
    return Parametro.findOne({
      where: { key_parametro: keyParametro },
    });
  }

  static async obtenerValorBooleano(keyParametro) {
    const parametro = await this.obtenerParametro(keyParametro);
    return parametro ? parametro.valor_booleano : null;
  }

  static async obtenerValorString(keyParametro) {
    const parametro = await this.obtenerParametro(keyParametro);
    return parametro ? parametro.valor_string : null;
  }

  static async obtenerValorEntero(keyParametro) {
    const parametro = await this.obtenerParametro(keyParametro);
    return parametro ? parametro.valor_int : null;
  }

  static async obtenerValorDouble(keyParametro) {
    const parametro = await this.obtenerParametro(keyParametro);
    return parametro ? parametro.valor_double : null;
  }

  static async getPantallaFacturasColumnasVisibles() {
    const valor = await this.obtenerValorString(
      ParametrosEnum.PANTALLA_FACTURAS_COLUMNAS_VISIBLES
    );

    if (!valor) {
      return [];
    }

    return this.separarPorComas(valor);
  }

  static async getPantallaPacientesColumnasVisibles() {
    const valor = await this.obtenerValorString(
      ParametrosEnum.PANTALLA_PACIENTES_COLUMNAS_VISIBLES
    );

    if (!valor) {
      return [];
    }

    return this.separarPorPipe(valor);
  }
}

module.exports = ParametroFactory;
