const ParametroModulo = require('../models/ParametroModulo');
const ParametroTipoDato = require('../models/ParametroTipoDato');

const modulos = [
  { id: 1, key_modulo: 'FACTURAS', descripcion: 'Facturas' },
  { id: 2, key_modulo: 'PACIENTES', descripcion: 'Pacientes' },
  { id: 3, key_modulo: 'TUTORES', descripcion: 'Tutores' },
  { id: 4, key_modulo: 'OBRAS_SOCIALES', descripcion: 'Obras sociales' },
  { id: 5, key_modulo: 'AFIP', descripcion: 'AFIP' },
  { id: 6, key_modulo: 'CONFIGURACION', descripcion: 'Configuración' },
];

const tiposDato = [
  { id: 1, key_tipo_dato: 'BOOLEAN', descripcion: 'Booleano' },
  { id: 2, key_tipo_dato: 'STRING', descripcion: 'Texto' },
  { id: 3, key_tipo_dato: 'STRING_ARRAY', descripcion: 'Lista de textos' },
  { id: 4, key_tipo_dato: 'INT', descripcion: 'Entero' },
  { id: 5, key_tipo_dato: 'DOUBLE', descripcion: 'Número decimal de doble precisión' },
];

const inicializarParametrosBase = async () => {
  try {
    for (const modulo of modulos) {
      await ParametroModulo.findOrCreate({ where: { id: modulo.id }, defaults: modulo });
    }

    for (const tipoDato of tiposDato) {
      await ParametroTipoDato.findOrCreate({ where: { id: tipoDato.id }, defaults: tipoDato });
    }

    console.log('Catálogos base de parámetros inicializados correctamente.');
  } catch (error) {
    console.error('Error al inicializar catálogos base de parámetros:', error);
    throw error;
  }
};

module.exports = { inicializarParametrosBase };
