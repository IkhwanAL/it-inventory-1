'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const produksiBarang = db.define('produksiBarang', {
  nomorProduksi: {
    type: Sequelize.STRING,
    unique: true
  },
  dataBarangId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'dataBarang',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
  quantity: {
    type: Sequelize.DECIMAL
  },
  tanggalProduksi: {
    type: Sequelize.DATEONLY
  },
  remarks: {
    type: Sequelize.STRING
  },
  isDelete: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  idKapal: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  tableName: 'produksiBarang',
  freezeTableName: true,
});

module.exports = produksiBarang;