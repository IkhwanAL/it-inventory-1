const TempatPenimbunan = require("../../database/models/tempat_penimbunan");
const { ConflictCreateData, ForeignKeyViolation } = require("../../middlewares/errHandler");
const { convertStrignToDateUTC } = require("../convert");

const convert = (data) => {
    data.perkiraanTanggalPengeluaran = convertStrignToDateUTC(data.perkiraanTanggalPengeluaran)
}

const saveTempatPenimbunan = async(data, transaction) => {
    try {
        convert(data);
        const result = await TempatPenimbunan.create(data, {
            transaction,
            returning: true
        });
        return result;
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
        }
    }
}

module.exports = {
    saveTempatPenimbunan
}