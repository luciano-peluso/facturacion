const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const ParametroModulo = require('./ParametroModulo');
const ParametroTipoDato = require('./ParametroTipoDato');

const Parametro = sequelize.define('Parametro', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_modulo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'par_modulo',
      key: 'id',
    },
  },
  id_tipo_dato: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'par_tipo_dato',
      key: 'id',
    },
  },
  key_parametro: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  lista_valores_posibles: {
    type: DataTypes.STRING(4000),
    allowNull: true,
    comment: 'Lista de valores admitidos separados por |. Ejemplo: paciente|fecha|total|estado',
  },
  valor_booleano: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  valor_string: {
    type: DataTypes.STRING(4000),
    allowNull: true,
  },
  valor_int: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  valor_double: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  fecha_ultima_modificacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'par_parametro',
  indexes: [
    { unique: true, fields: ['key_parametro'] },
    { fields: ['id_modulo'] },
    { fields: ['id_tipo_dato'] },
  ],
});

Parametro.belongsTo(ParametroModulo, { as: 'modulo', foreignKey: 'id_modulo' });
Parametro.belongsTo(ParametroTipoDato, { as: 'tipoDato', foreignKey: 'id_tipo_dato' });

module.exports = Parametro;
