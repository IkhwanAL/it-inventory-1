const dataBarang = require('../../database/models/data_barang');
const DataKapal = require('../../database/models/data_kapal');
const Report = require('../../database/models/report');
const { ForeignKeyViolation, ConflictCreateData } = require('../../middlewares/errHandler');

const getDataBarang = async (reportId) => {
    const data = await dataBarang.findAll({ where: { reportId: reportId } });
    return data;
}

const saveDataBarang = async(data, transaction) => {
    try {
        const res = await dataBarang.create(data, {
            transaction 
        })
        return res;
    } catch (error) {
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation('Terjadi Kesalahan Pada Server')
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data")
        }
    }
}

const fetchBarangAfterChoosingKapalPenjual = async (req, idKapal) => {
    try {
        const query = {
            include: [
                {
                    model: Report,
                    attributes: [],
                    required: true,
                    include: [
                        {
                            model: DataKapal,
                            required: true,
                            attributes: [],
                            where: {
                                id: idKapal
                            }
                        }
                    ]
                }
            ],
            attributes:['id', 'kodeBarang']
        }

        const fetched = await dataBarang.findAll(query);
        if(!fetched){
            throw NotFoundException('Data Barang Pada Kapal Tidak Di Temukan');
        }

        return fetched;
    } catch (error) {
        returnError(error, "Gagal Memproses Data Kapal Penjual");
    }
}
module.exports = {
    saveDataBarang,
    getDataBarang,
    fetchBarangAfterChoosingKapalPenjual
}