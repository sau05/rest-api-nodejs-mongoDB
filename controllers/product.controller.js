const express = require('express')
const mongoose = require('mongoose');
const companyModel = require('../models/company.model');
const customerModel = require('../models/customer.model');

const router = express.Router();
const ProductModel = mongoose.model('product');

router.get('/add', (req, res) => {
    res.render('add-product')
})

router.post('/add', (req, res) => {
    companyModel.findOne({ _id: req.body.company }, (err, company) => {
        if (err) {
            res.send({ status: 400, message: 'Error' })
        } else if (company == null) {
            res.send({ status: 404, message: 'No such company found' })
        } else {
            var product = new ProductModel();
            product.name = req.body.name;
            product.company = req.body.company;
            product.price = req.body.price;
            product.save((err, docs) => {
                if (err) {
                    res.send({ status: 400, message: 'Error' })
                } else {
                    res.send({ status: 200, message: 'Record successfully added' })
                }
            })
        }
    })
})

router.get('/list', (req, res) => {
    ProductModel.find((err, docs) => {
        if (err) {
            res.send({ status: 400, message: 'Error while fetching product list' })
        } else {
            res.send({ status: 200, products: docs })
        }
    }).lean()
})

router.put('/update', (req, res) => {
    ProductModel.findOne({ _id: req.body.id }, (err, product) => {
        if (err) {
            res.send({ status: 400, message: 'Error while getting product' })
        } else if (product == null) {
            res.send({ status: 404, message: 'No such product found' })
        } else {
            companyModel.findOne({ _id: req.body.company }, (err, company) => {
                if (err) {
                    res.send({ status: 400, message: 'Error' })
                } else if (company == null) {
                    res.send({ status: 404, message: 'No such company found' })
                } else {
                    ProductModel.findByIdAndUpdate({ _id: req.body.id }, req.body, (err, docs) => {
                        if (err) {
                            res.send({ status: 400, message: 'Failed to update product' })
                        } else {
                            res.send({ status: 200, message: 'Product updated successfully.' })
                        }
                    })
                }
            })
        }
    })
})

router.delete('/delete/:id', (req, res) => {
    ProductModel.findOne({ _id: req.params.id }, (err, docs) => {
        if (err) {
            res.send({ status: 400, message: 'Failed to delete product.' })
        } else if (docs == null) {
            res.send({ status: 404, message: `This product doesn't exist` })
        } else {
            docs.remove()
            res.send({ status: 200, message: 'Product deleted successfully.' })
        }
    })
})

router.post('/popularproduct', (req, res) => {
    customerModel.find({ city: req.body.city }, (err, docs) => {
        if (err) {
            res.send({ status: 400, message: 'Error while getting customer' })
        } else if (docs.length == 0) {
            res.send({ status: 404, message: 'No such city found.' })
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
                res.send({ status: 200, products: products })
            }).catch((e) => {
                res.send({ status: 400, message: 'Error while fetching products.' })
            })
        }
    }).lean()
})

module.exports = router;