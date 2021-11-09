'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const DokumenTambahan = db.define('dokumen_tambahan', {
  nomorBC10: {
    allowNull: true,
    type: Sequelize.STRING
  },
  nomorBC11: {
    allowNull:true,
    type: Sequelize.STRING
  },
  nomorBL: {
    allowNull: true,
    type: Sequelize.STRING
  },
  tanggalBC10: {
    allowNull: true,
    type: Sequelize.STRING
  },
  tanggalBC11: {
    allowNull: true,
    type: Sequelize.STRING
  },
  tanggalBL: {
    allowNull: true,
    type: Sequelize.STRING
  },
  reportId: {
    allowNull: false,
    type: Sequelize.INTEGER,
    references: {
      model: 'reports',
      key: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
}, {
  tableName: 'dokumen_tambahan',
  freezeTableName: true,
})

module.exports = DokumenTambahan;