const mongoose = require('mongoose');
const customerModel = require('../models/customer.model');
const productModel = require('../models/product.model');
const { constants } = require('../helper/constants')
const CompanyModel = mongoose.model('Company');

exports.add = ((req, res) => {
    var company = new CompanyModel();
    company.name = req.body.name;
    company.status = req.body.status;
    company.save().then((docs) => {
        res.send({ status: constants.STATUS_SUCCESS, message: 'Record successfully added' })
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Error while saving company.' })
    })
})

exports.list = ((req, res) => {
    CompanyModel.find().lean().then((docs) => {
        res.send({ status: constants.STATUS_SUCCESS, Company: docs })
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Error while fetching company list' })
    })
})

exports.update = ((req, res) => {
    CompanyModel.findOne({ _id: req.body.id }).lean().then((company) => {
        if (company == null) {
            res.send({ status: constants.STATUS_NOTFOUND, message: 'No such company found' })
        } else {
            CompanyModel.findByIdAndUpdate({ _id: req.body.id }, req.body).lean().then((docs) => {
                res.send({ status: constants.STATUS_SUCCESS, message: 'Company updated successfully.' })
            }).catch((e) => {
                res.send({ status: constants.STATUS_ERROR, message: 'Failed to update company.' })
            })
        }
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Error while getting company' })
    })
})

exports.delete = ((req, res) => {
    CompanyModel.findOne({ _id: req.params.id }).lean().then((company) => {
        if (company == null) {
            res.send({ status: constants.STATUS_NOTFOUND, message: 'No such company found' })
        } else {
            CompanyModel.findOne({ _id: req.params.id }).then((docs) => {
                if (docs == null) {
                    res.send({ status: constants.STATUS_NOTFOUND, message: `This company doesn't exist` })
                } else {
                    docs.remove().then((result) => {
                        res.send({ status: constants.STATUS_SUCCESS, message: 'Company deleted successfully.' })
                    }).catch((e) => {
                        res.send({ status: constants.STATUS_ERROR, message: e })
                    })
                }
            }).catch((e) => {
                res.send({ status: constants.STATUS_ERROR, message: 'Failed to delete company.' })
            })
        }
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Error while getting company' })
    })
})

exports.filtercompany = (async (req, res) => {
    const companyNames = req.body.companyName;
    await CompanyModel.find({ name: { $in: companyNames } }).lean().then(async (companies) => {
        if (companies.length == 0) {
            res.send({ status: constants.STATUS_NOTFOUND, message: 'No such company found.' })
        } else {
            let companyIds = companies.map(company => company._id)
            await productModel.find({ company: { $in: companyIds } }).lean().then(async (products) => {
                let productIds = products.map(product => product._id)
                await customerModel.find({ product: { $in: productIds } }).populate({ path: 'product' }).lean().then(async (customers) => {
                    res.send({ status: constants.STATUS_SUCCESS, customer: customers })
                }).catch((e) => {
                    res.send({ status: constants.STATUS_ERROR, message: 'Error while getting customer.' })
                })
            }).catch((e) => {
                res.send({ status: constants.STATUS_ERROR, message: 'Error while getting product.' })
            })
        }
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Error while getting company.' })
    })
})

exports.getCityWithMostSales = ((req, res) => {
    CompanyModel.findOne({ name: req.body.companyName }, { _id: true }).lean().then((company) => {
        if (company == null) {
            res.send({ status: constants.STATUS_NOTFOUND, message: 'No such company found.' })
        } else {
            productModel.find({ company: company._id }, { _id: true }).lean().then((products) => {
                let productIds = products.map(product => product._id)
                customerModel.find({ product: { $in: productIds } }).lean().then((customers) => {
                    let result = customers.reduce((a, v) => {
                        if (!a[v.city]) {
                            a[v.city] = 0;
                        }
                        a[v.city] = a[v.city] + 1;
                        return a;
                    }, {});
                    let maxValue = Math.max(...Object.values(result))
                    let finalRes = Object.keys(result).filter(x => result[x] == maxValue)
                    res.send({ status: constants.STATUS_SUCCESS, 'popular city': finalRes })
                }).catch((e) => {
                    res.send({ status: constants.STATUS_ERROR, message: 'Error while getting customer.' })
                })
            }).catch((e) => {
                res.send({ status: constants.STATUS_ERROR, message: 'Error while getting product.' })
            })
        }
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Error while getting company.' })
    })
})
