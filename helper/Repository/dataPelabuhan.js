const DataPelabuhan = require("../../database/models/data_pelabuhan")
const { ForeignKeyViolation, ConflictCreateData } = require('../../middlewares/errHandler');
const { isExist } = require("../checkExistingDataFromTable");

const getDataPelabuhan = async (reportId) => {
    const data = await DataPelabuhan.findOne({ where: { reportId: reportId } });
    return data;
}

const saveDataPelabuhan = async(data, transaction) => {
    try {
        return DataPelabuhan.create(data, {
            transaction,
            returning: true
        });
    } catch (error) {
        if(error.name === 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error)
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data", error)
        }
    }
}

const updateDataPelabuhanRepo = async(data, reportId, transaction) => {
    try {
        const query = {
            where: {
                id: data.id,
                reportId
            }
        }
        await isExist(DataPelabuhan, query)

        const result = await DataPelabuhan.update(data, {
            ...query,
            transaction,
            returning: true,
            plain: true
        });

        return result[1].toJSON();
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error);
        }else if(error.name == "ServerFault" || error.name == 'NotFoundException'){
            throw error
        } else {
            throw new ConflictCreateData("Gagal Mengubah Data", error);
        }
    }
}

module.exports = {
    saveDataPelabuhan,
    updateDataPelabuhanRepo,
    getDataPelabuhan
}