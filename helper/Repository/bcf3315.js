const { Op } = require("sequelize");
const sequelize = require("../../configs/database");
const barangPO = require("../../database/models/barang_po")
const bcf3315 = require("../../database/models/bcf3315")
const dataBarang = require("../../database/models/data_barang");
const DataKapal = require("../../database/models/data_kapal");
const DataPengangkutan = require("../../database/models/data_pengangkutan");
const DokumenPemasukan = require("../../database/models/dokumen_pemasukan");
const infoPengguna = require("../../database/models/info_pengguna")
const po = require("../../database/models/po")
const Report = require("../../database/models/report")
const { isExist } = require("../checkExistingDataFromTable")
const { ServerFault } = require("../../middlewares/errHandler");
const {STATUS} = require("../Status.const");
const approval = require("../../database/models/approval");
const produkiBarang = require('../../database/models/produksi_barang')

const getBcf3315ThatAlreadyBeenAcceptByBeaCukai = async(req, idUser) => {
    try {
        return bcf3315.findAll({
            include: [
                {
                    model: po,
                    attributes: [],
                    required: true,
                    where: {
                        reportId: {
                            [Op.not]: null
                        },
                        userId: idUser
                    },
                }
            ],
            where: {
                nomorbcf3314: {
                    [Op.ne]: null
                },
                reportId: {
                    [Op.is]: null
                },
                status: STATUS.DISETUJUI
            },
            attributes: [
               [
                    sequelize.fn('CONCAT', 
                    'BCF 3.3.14-',
                    sequelize.col('nomorbcf3314')
                    ),'bcf'
                ],
                'id'
            ],
            raw: false,
        });
    } catch (error) {
        throw new ServerFault('Terjadi Kesalahan Pada Server', error, req);
    }
}
// 3.3.14
const fetchBCF3315PerId = async(req, idUser, idBCF, status = false) => {
    try {
        let where = {};
        let whereStatus = {};
        if(req.currentRole == 'User'){
            where = {
                userId: idUser
            }
        }
        if(status){
            whereStatus = {
                status: STATUS.DISETUJUI
            }
        }
        return bcf3315.findOne({
            ...whereStatus,
            include: [
                {
                    model: po,
                    attributes: ['id'],
                    ...where,
                    include: [
                        {
                            model: barangPO,
                            include: [
                                {
                                    model: dataBarang,
                                    attributes: [['uraian', 'jenisBarang'], ['kodeBarang', 'hsCode']]
                                }
                            ],
                            attributes: [
                                ['jumlah', 'perkiraanJumlah'],
                                ['hargaSatuan', 'satuan']
                            ]
                        }
                    ]
                }
            ],
            where: {
                id: idBCF
            },
            attributes: [
                'npwp',
                'nama',
                'alamat',
                'jabatan',
                'lokasiPLB',
                'caraPengangkutan',
                'pelabuhanMuat',
                'tanggalPerkiraan',
                'penanggungJawab',
                'namaPengangkutKeLuar',
                'voyage',
                'callSign'
            ],
        })
    } catch (error) {
        throw new ServerFault("Terjadi Kesalahan Pada Server", error, req)
    }
}
// 3.3.15
const fetchBCF3315PerIdForBC = async(req, idBCF, status = null) => {
    try {
        let where = {};
        let whereStats = {};
        if(req.currentRole == 'User'){
            where = {
                userId: req.currentUser
            }
        }
        if(status){
            whereStats = {
                status: STATUS.DISETUJUI
            }
        }
        return bcf3315.findOne({
            
            include: [
                {
                    model: po,
                    attributes: ['id'],
                    where: {
                        ...where
                    },
                    include: [
                        {
                            model: barangPO,
                            include: [
                                {
                                    model: dataBarang,
                                    attributes: [['uraian', 'jenisBarang'], ['kodeBarang', 'hsCode']]
                                }
                            ],
                            attributes: [
                                ['jumlah', 'perkiraanJumlah'],
                                ['hargaSatuan', 'satuan']
                            ]
                        }
                    ],
                    
                }
            ],
            where: {
                id: idBCF,
                ...whereStats
            },
            attributes: [
                'npwp',
                'nama',
                'alamat',
                'jabatan',
                'lokasiPLB',
                'nomor',
                'lampiran',
                'alasan',
                'caraPengangkutan',
                'pelabuhanMuat',
                'tanggalPerkiraan',
                'penanggungJawab',
                'namaPengangkutKeLuar',
                'voyage',
                'callSign',
                'status',
                'tanggal'
            ],
            logging: console.log
        })
    } catch (error) {
        // console.log(error)
        throw new ServerFault('Terjadi Kesalahan Pada Server', error, req);
    }
}
/**
 *  po.findOne({
            include: [
                {
                    model: barangPO,
                    required: true,
                    include: [
                        {
                            model: dataBarang,
                            attributes: [['uraian', 'jenisBarang'], ['kodeBarang', 'hsCode']]
                        }
                    ],
                    attributes: [
                        ['jumlah', 'perkiraanJumlah'],
                        ['hargaSatuan', 'satuan']
                    ]
                },{
                    model: bcf3315,
                    required: true,
                    where: {
                        id: idBCF
                    },
                    attributes: [
                        'lampiran',
                        'npwp',
                        'nama',
                        'alamat',
                        'lokasiPLB',
                        'caraPengangkutan',
                        'pelabuhanMuat',
                        'tanggalPerkiraan',
                        'namaPengangkutKeLuar',
                        'voyage',
                        'callSign',
        
                    ],
                    include: [
                        {
                            model: infoPengguna,
                            attributes: [
                                ['namaPemilik', 'nama'],
                                'nip'
                            ]
                        }
                    ]
                }

            ],
            where: {
                userId: idUser
            },
            attributes: [],
            logging: console.log
        })
 */

const updateDokumnBCFAfterChoosingForPLB = async(req, idReport, idBCF) => {
    try {
        return bcf3315.update({
            reportId: idReport
        }, {
            where: {
                id: idBCF
            }
        })
    } catch (error) {
        throw new ServerFault("Terjadi Kesalahan Pada Server", error, req);
    }
}

const deleteBCF = async(req, idBCF) => {
    try {
        await isExist(bcf3315, {
            where: {
                id: idBCF
            }
        });

        return bcf3315.update({
            isDelete: true
        }, {
            where: {
                id: idBCF
            }
        });
    } catch (error) {
        throw error;
    }
}

const deleteProduksi = async(req, id) => {
    try{
        await isExist(produkiBarang, {
            where: {
                id: id
            }
        });
        return produkiBarang.update({
            isDelete: true
        }, {
            where: {
                id: id
            }
        })
    }catch(error){
        throw error;
    }
}


module.exports = {
    getBcf3315ThatAlreadyBeenAcceptByBeaCukai,
    fetchBCF3315PerId,
    updateDokumnBCFAfterChoosingForPLB,
    deleteBCF,
    deleteProduksi,
    fetchBCF3315PerIdForBC
}