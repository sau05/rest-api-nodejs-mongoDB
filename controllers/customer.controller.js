const mongoose = require('mongoose');
const productModel = require('../models/product.model');
const { constants } = require('../helper/constants')

const CustomerModel = mongoose.model('Customer');

exports.add = ((req, res) => {
    productModel.findOne({ _id: req.body.product }).then((product) => {
        if (product == null) {
            res.send({ status: constants.STATUS_NOTFOUND, message: 'No such product found' })
        } else {
            var customer = new CustomerModel();
            customer.name = req.body.name;
            customer.product = req.body.product;
            customer.city = req.body.city;
            customer.save().then((docs) => {
                res.send({ status: constants.STATUS_SUCCESS, message: 'Record successfully added' })
            }).catch((e) => {
                res.send({ status: constants.STATUS_ERROR, message: 'Error adding customer' })
            })
        }
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Error while checking product' })
    })
})

exports.list = ((req, res) => {
    CustomerModel.find().lean().then((docs) => {
        res.send({ status: constants.STATUS_SUCCESS, Customers: docs })
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Error while fetching customer list' })
    })
})

exports.update = ((req, res) => {
    CustomerModel.findOne({ _id: req.body.id }).lean().then((customer) => {
        if (customer == null) {
            res.send({ status: constants.STATUS_NOTFOUND, message: 'No such customer found' })
        } else {
            productModel.findOne({ _id: req.body.product }).lean().then((product) => {
                if (product == null) {
                    res.send({ status: constants.STATUS_NOTFOUND, message: 'No such product found' })
                } else {
                    CustomerModel.findByIdAndUpdate({ _id: req.body.id }, req.body).then((docs) => {
                        res.send({ status: constants.STATUS_SUCCESS, message: 'Customer updated successfully.' })
                    }).catch((e) => {
                        res.send({ status: constants.STATUS_ERROR, message: 'Failed to update customer.' })
                    })
                }
            }).catch((e) => {
                res.send({ status: constants.STATUS_ERROR, message: 'Error while getting product.' })
            })
        }
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Error while getting customer' })
    })
})

exports.delete = ((req, res) => {
    CustomerModel.findOne({ _id: req.params.id }).lean().then((customer) => {
        if (customer == null) {
            res.send({ status: constants.STATUS_NOTFOUND, message: 'No such customer found' })
        } else {
            CustomerModel.findOneAndRemove({ _id: req.params.id }).then((docs) => {
                res.send({ status: constants.STATUS_SUCCESS, message: 'Customer deleted successfully.' })
            }).catch((e) => {
                res.send({ status: constants.STATUS_ERROR, message: 'Failed to delete customer.' })
            })
        }
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Error while getting customer' })
    })
})

exports.filtercustomer = (async (req, res) => {
    const customerNames = req.body.customerName;
    await CustomerModel.find({ name: { $in: customerNames } }).then(async (customers) => {
        if (customers.length == 0) {
            res.send({ status: constants.STATUS_NOTFOUND, message: 'No such customer found.' })
        } else {
            let productIds = customers.map(customer => customer.product)
            await productModel.find({ _id: { $in: productIds } }).populate({ path: 'company', model: 'Company' }).lean().then(async (products) => {
                res.send({ status: constants.STATUS_SUCCESS, products: products })
            }).catch((e) => {
                res.send({ status: constants.STATUS_NOTFOUND, message: 'No such customer found.' })
            })
        }
    }).catch((e) => {
        res.send({ status: constants.STATUS_ERROR, message: 'Error while getting customer.' })
    })
})
