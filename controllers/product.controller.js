const mongoose = require('mongoose');
const companyModel = require('../models/company.model');
const customerModel = require('../models/customer.model');
const { constants } = require('../helper/constants')

const ProductModel = mongoose.model('product');

exports.add = ((req, res) => {
    companyModel.findOne({ _id: req.body.company }).lean().then((company) => {
        if (company == null) {
            res.send({ status: constants.STATUS_NOTFOUND, message: 'No such company found' })
        } else {
            var product = new ProductModel();
            product.name = req.body.name;
            product.company = req.body.company;
            product.price = req.body.price;
            product.save().then((docs) => {
                res.send({ status: constants.STATUS_SUCCESS, message: 'Record successfully added' })
            }).catch((e) => {
                res.send({ status: constants.STATUS_ERROR, message: 'Error while saving record' })
            })
        }
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Error while getting comapany.' })
    })
})

exports.list = ((req, res) => {
    ProductModel.find().lean().then((docs) => {
        res.send({ status: constants.STATUS_SUCCESS, products: docs })
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Error while fetching product list' })
    })
})

exports.update = ((req, res) => {
    ProductModel.findOne({ _id: req.body.id }).lean().then((product) => {
        if (product == null) {
            res.send({ status: constants.STATUS_NOTFOUND, message: 'No such product found' })
        } else {
            companyModel.findOne({ _id: req.body.company }).lean().then((company) => {
                if (company == null) {
                    res.send({ status: constants.STATUS_NOTFOUND, message: 'No such company found' })
                } else {
                    ProductModel.findByIdAndUpdate({ _id: req.body.id }, req.body).then((docs) => {
                        res.send({ status: constants.STATUS_SUCCESS, message: 'Product updated successfully.' })
                    }).catch((e) => {
                        res.send({ status: constants.STATUS_ERROR, message: 'Failed to update product' })
                    })
                }
            }).catch((e) => {
                res.send({ status: constants.STATUS_ERROR, message: 'Error while getting company' })
            })
        }
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Error while getting product' })
    })
})

exports.delete = ((req, res) => {
    ProductModel.findOne({ _id: req.params.id }).then((docs) => {
        if (docs == null) {
            res.send({ status: constants.STATUS_NOTFOUND, message: `This product doesn't exist` })
        } else {
            docs.remove()
            res.send({ status: constants.STATUS_SUCCESS, message: 'Product deleted successfully.' })
        }
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Failed to delete product.' })
    })
})

exports.popularproduct = ((req, res) => {
    customerModel.find({ city: req.body.city }).lean().then((docs) => {
        if (docs.length == 0) {
            res.send({ status: constants.STATUS_NOTFOUND, message: 'No such city found.' })
        } else {
            let result = docs.reduce((a, v) => {
                if (!a[v.product]) {
                    a[v.product] = 0;
                }
                a[v.product] = a[v.product] + 1;
                return a;
            }, {});
            let maxValue = Math.max(...Object.values(result));
            let finalRes = Object.keys(result).filter(x => result[x] == maxValue);
            ProductModel.find({ _id: { $in: finalRes } }).populate({ path: 'company', model: 'Company' }).lean().then((products) => {
                res.send({ status: constants.STATUS_SUCCESS, products: products })
            }).catch((e) => {
                res.send({ status: constants.STATUS_ERROR, message: 'Error while fetching products.' })
            })
        }
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Error while getting customer' })
    })
})
