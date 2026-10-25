const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Parametro = require('./Parametro');

const ParametroHistorial = sequelize.define('ParametroHistorial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_parametro: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'par_parametro',
      key: 'id',
    },
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
  fecha_cambio: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'par_parametro_historial',
  indexes: [
    { fields: ['id_parametro'] },
    { fields: ['fecha_cambio'] },
  ],
});

ParametroHistorial.belongsTo(Parametro, { as: 'parametro', foreignKey: 'id_parametro' });

module.exports = ParametroHistorial;
