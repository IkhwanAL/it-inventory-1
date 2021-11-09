'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../../configs/database');
const db = require('../../configs/database');

const data_barang = db.define('data_barang', {
  kode_barang: {
    type: Sequelize.STRING
  },
  nama_barang: {
    type: Sequelize.STRING
  },
  uraian: {
    type: Sequelize.STRING
  },
  netto_brutto_volume: {
    type: Sequelize.DECIMAL
  },
  satuan_kemasan: {
    type: Sequelize.STRING
  },
  stock: {
    type: Sequelize.DECIMAL
  },
  pos_tarif: {
    type: Sequelize.STRING
  },
  bm: {
    type: Sequelize.DECIMAL
  },
  ppn: {
    type: Sequelize.DECIMAL
  },
  ppnbm: {
    type: Sequelize.DECIMAL
  },
  cukai: {
    type: Sequelize.DECIMAL
  },
}, {
  tableName: 'data_barang',
  freezeTableName: true,
})

module.exports = data_barang;