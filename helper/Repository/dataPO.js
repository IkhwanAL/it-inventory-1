const { file } = require('nconf');
const { Op } = require('sequelize');
const barangPO = require('../../database/models/barang_po');
const bcf3315 = require('../../database/models/bcf3315');
const dataBarang = require('../../database/models/data_barang');
const DataKapal = require('../../database/models/data_kapal');
const dataPO = require('../../database/models/po');
const Report = require('../../database/models/report');
const { ForeignKeyViolation, ConflictCreateData } = require('../../middlewares/errHandler');
const { isExist } = require("../checkExistingDataFromTable");

const saveDataPO = async(data, transaction) => {
    try {
        const res = await dataPO.create(data, {
            transaction,
            returning: true
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

const updateDataPO = async(data, query, transaction) => {
    try {
        await isExist(dataPO, query);
        const result = await dataPO.update(data, {
            ...query,
            transaction,
            returning: true,
            // plain: true
        })

        // return result[1].toJSON();
        return result[1];
    } catch (error) {

        if (error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        } else if (error.name == "ServerFault" || error.name == 'NotFoundException'){
            throw error
        } else {
            throw new ConflictCreateData("Gagal Mengubah Data");
        }
    }
}

const getAllPurchaseOrder= async (req, idUser) => {
    try {
            const query = {
                include: [
                    {
                        model: barangPO,
                        required: true,
                        attributes: []
                    },
                    {
                        model: Report,
                        required: true,
                        attributes: [],
                        include: [
                            {
                                model: DataKapal,
                                required: true,
                                attributes: []
                            }
                        ],
                        where: {
                            userId: idUser
                        }
                    },
                ],
                where: {
                    reportId: {
                        [Op.not]: null 
                    }
                },
                plain: false,

                attributes: ['nomorPO', 'tanggalPurchaseOrder', 'kapalPenjual', 'id']
            }
            const result = dataPO.findAll(query); 

            return result
   
    } catch (error) {
        throw error;
    }
}

const getAllPurchaseOrderForBCF3315 = async (req, idUser) => {
    try {
        const query = {
            include: [
                {
                    model: bcf3315,
                    attributes: ['id'],
                },
                {
                    model: Report,
                    attributes: [],
                    where: {
                        userId: idUser
                    }
                }
            ],
            where: {
                nomorPO: {
                    [Op.ne]: null
                }
            },
            attributes: ['nomorPO', 'id'],
            plain:false,
        }

        const result = await dataPO.findAll(query);
        for (let i = 0; i < result.length; i++) {
            const element = result[i].toJSON();
            if(element.bcf3315){
                delete result[i];
            }
            
        }
        // console.log(result);
        return result
    } catch (error) {
        throw error;
    }
}

const getBarangForBCF3315AfterChoosingNumberPurchaseOrder = async(req, idUser, idPO) => {
    try {
        const query = {
            include: [
                {
                    model: dataBarang,
                    attributes: [['kodeBarang', 'hsCode'], ['uraian', 'jenis']],
                    required: true
                },
                {
                    model: dataPO,
                    attributes: [],
                    include: [
                        {
                            model: Report,
                            where: {
                                userId: idUser
                            },
                            attributes: [],
                            required: true
                        }
                    ],
                    // required: true
                }
            ],
            logging: console.log,
            attributes: [['satuanKemasan', 'satuan',], ['jumlah', 'perkiraanJumlah']],
            plain: false,
            where: {
                poId: idPO
            }
        }; 

        const result = await barangPO.findAll(query);

        return result;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const viewOnePo = async(req, idUser, idPO) => {
    try {
        const query = {
            include: [
                {
                    model: barangPO,
                    required: true,
                    attributes: {
                        exclude: ['id', 'createdAt', 'updatedAt', 'idBarang']
                    }
                },
                {
                    model: Report,
                    required: true,
                    attributes: [],
                    where: {
                        userId: idUser
                    }
                }
            ],
            where: {
                id: idPO,
                isDelete: {
                    [Op.ne]: null
                }
            },
            attributes: {
                exclude: ['id', 'createdAt', 'updatedAt', 'reportId']
            },
            plain:true
        }

        const result = await dataPO.findOne(query);

        return result
    } catch (error) {
        throw error
    }
}

const checkPurchaseOrderExistance = async (nomorPo) => {
    return await dataPO.findOne({
        where: {
            nomorPO: nomorPo,
            isDelete: false
        } 
    })
}

const deletePurchaseOrderPerId = async(req, idUser, idPO) => {
    try {
        await isExist(dataPO, {
            where: {
                id: idPO
            }
        });

        await dataPO.update({
            isDelete: true
        },{
            where: {
                id: idPO
            }
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    saveDataPO,
    updateDataPO,
    getAllPurchaseOrder,
    viewOnePo,
    deletePurchaseOrderPerId,
    checkPurchaseOrderExistance,
    getAllPurchaseOrderForBCF3315,
    getBarangForBCF3315AfterChoosingNumberPurchaseOrder
}