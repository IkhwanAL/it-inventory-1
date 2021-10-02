const reportDataBeratDanVolume = require("./databeratdanvolume");
const reportDataPelabuhanMuatBongkar = require("./datapelabuhanmuatbongkar");
const reportDataPengajuan = require("./datapengajuan");
const reportDataPengangkutan = require("./datapengangkutan");
const reportDataPerkiraanTanggalPengeluaran = require("./dataperkiraantanggalpengeluaran");
const reportDataPetiKemas = require("./datapetikemas");
const reportDataPetiKemasDanPengemas = require("./datapetikemasdanpengemas");
const reportDataTempatPenimbunan = require("./datatempatpenimbunan");
const reportIdentitasPenerima = require("./identitaspenerima");
const reportIdentitasPengirim = require("./identitaspengirim");
const reportListBarang = require("./listbarang");
const reportListDokumen = require("./listdokumen");
const Report = require("./report");
const Role = require("./role");
const reportTransaksiPerdagangan = require("./transaksiperdagangan");
const User = require("./user");
const UserActivity = require("./useractivity");

const setAssociations = function() {
  Report.hasOne(reportIdentitasPenerima, {foreignKey: 'reportId'});
  Report.hasOne(reportIdentitasPengirim, {foreignKey: 'reportId'});
  Report.hasOne(reportDataBeratDanVolume, {foreignKey: 'reportId'});
  Report.hasOne(reportDataPelabuhanMuatBongkar, {foreignKey: 'reportId'});
  Report.hasOne(reportDataPengajuan, {foreignKey: 'reportId'});
  Report.hasOne(reportDataPengangkutan, {foreignKey: 'reportId'});
  Report.hasOne(reportDataPerkiraanTanggalPengeluaran, {foreignKey: 'reportId'});
  Report.hasOne(reportDataPetiKemas, {foreignKey: 'reportId'});
  Report.hasOne(reportDataPetiKemasDanPengemas, {foreignKey: 'reportId'});
  Report.hasOne(reportDataTempatPenimbunan, {foreignKey: 'reportId'});
  Report.hasOne(reportTransaksiPerdagangan, {foreignKey: 'reportId'});
  Report.hasMany(reportListBarang, {foreignKey: 'reportId'});
  Report.hasMany(reportListDokumen, {foreignKey: 'reportId'});

  reportIdentitasPenerima.belongsTo(Report, {foreignKey: 'reportId'});
  reportIdentitasPengirim.belongsTo(Report, {foreignKey: 'reportId'});
  reportDataBeratDanVolume.belongsTo(Report, {foreignKey: 'reportId'});
  reportDataPelabuhanMuatBongkar.belongsTo(Report, {foreignKey: 'reportId'});
  reportDataPengajuan.belongsTo(Report, {foreignKey: 'reportId'});
  reportDataPengangkutan.belongsTo(Report, {foreignKey: 'reportId'});
  reportDataPerkiraanTanggalPengeluaran.belongsTo(Report, {foreignKey: 'reportId'});
  reportDataPetiKemas.belongsTo(Report, {foreignKey: 'reportId'});
  reportDataPetiKemasDanPengemas.belongsTo(Report, {foreignKey: 'reportId'});
  reportDataTempatPenimbunan.belongsTo(Report, {foreignKey: 'reportId'});
  reportTransaksiPerdagangan.belongsTo(Report, {foreignKey: 'reportId'});
  reportListBarang.belongsTo(Report, {foreignKey: 'reportId'});
  reportListDokumen.belongsTo(Report, {foreignKey: 'reportId'});

  Role.hasOne(User, {foreignKey: 'role_id'});
  User.belongsTo(Role, {foreignKey: 'role_id'})

  User.hasMany(UserActivity, {foreignKey: "userId"})
  Report.hasOne(UserActivity)
  UserActivity.belongsTo(User, {foreignKey: "userId"})
  UserActivity.belongsTo(Report, {foreignKey: "reportId"})
};

module.exports = setAssociations;