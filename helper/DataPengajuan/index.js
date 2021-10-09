const reportDataPengajuan = require('../../database/models/datapengajuan');
const authorization = require('../authorization');
const Report = require('../../database/models/report');

const createDataPengajuan = async (data, transaction) => {
    try {
        const result = await reportDataPengajuan.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const getDataPengajuan = async(idReport, type, transaction = null) => {
    try {
        const result = await reportDataPengajuan.get({
            include: [
                {
                    model: Report,
                    where: {
                        typeReport: type
                    },
                    through: {
                        attributes: []
                    }
                }
            ],
            where: {
                reportId: idReport,
            },
            transaction: transaction
        });

        return result
    } catch (error) {
        throw error;
    }
}

const updateDataPengajuan = async (data, idToUpdate, idReport, returning = false, transaction = null) => {
    try {
        const result = await reportDataPengajuan.update(data, {
            where:{ 
                id: idToUpdate,
                reportId: idReport
            },
            returning: returning,
            transaction: transaction
        });
        console.log(result);
        if(result[0] == 0){
            throw new Error(`Data Didn't Exists`);
        }
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createDataPengajuan,
    updateDataPengajuan,
    getDataPengajuan
}