const reportTransaksiPerdagangan = require('../../database/models/transaksiperdagangan');

const createReportTransaksiPerdagangan = async (data, transaction = null) => {
    try {
        const result = await reportTransaksiPerdagangan.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const updateReportTransaksiPerdagangan = async (data, idIdentitasPengirim, idReport, returning = false, transaction = null) => {
    try {
        const result = await reportTransaksiPerdagangan.update(data, {
            where: {
                id: idIdentitasPengirim,
                reportId: idReport
            },
            returning: returning,
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error
    }
}

module.exports = {
    createReportTransaksiPerdagangan,
    updateReportTransaksiPerdagangan
}