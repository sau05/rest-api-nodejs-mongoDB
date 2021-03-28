const express = require('express')
const mongoose = require('mongoose');
const customerModel = require('../models/customer.model');
const productModel = require('../models/product.model');

const router = express.Router();
const CompanyModel = mongoose.model('Company');

router.get('/add', (req, res) => {
    res.render('add-company')
})

router.post('/add', (req, res) => {
    var company = new CompanyModel();
    company.name = req.body.name;
    company.status = req.body.status;
    company.save((err, docs) => {
        if (err) {
            res.send('Error Occured')
        } else {
            res.redirect('/company/list')
        }
    })
    // res.render('add-company')
})
router.get('/list', (req, res) => {
    CompanyModel.find((err, docs) => {
        if (err) {
            res.send({ status: 400, message: 'Error while fetching company list' })
        } else {
            res.send({ status: 200, Company: docs })
        }
    }).lean()
})

router.put('/update', (req, res) => {
    CompanyModel.findOne({ _id: req.body.id }, (err, company) => {
        if (err) {
            res.send({ status: 400, message: 'Error while getting company' })
        } else if (company == null) {
            res.send({ status: 404, message: 'No such company found' })
        } else {
            CompanyModel.findByIdAndUpdate({ _id: req.body.id }, req.body, (err, docs) => {
                if (err) {
                    res.send({ status: 400, message: 'Failed to update company.' })
                } else {
                    res.send({ status: 200, message: 'Company updated successfully.' })
                }
            })
        }
    })
})

router.delete('/delete/:id', (req, res) => {
    CompanyModel.findOne({ _id: req.params.id }, (err, company) => {
        if (err) {
            res.send({ status: 400, message: 'Error while getting company' })
        } else if (company == null) {
            res.send({ status: 404, message: 'No such company found' })
        } else {
            CompanyModel.findOne({ _id: req.params.id }, (err, docs) => {
                if (err) {
                    res.send({ status: 400, message: 'Failed to delete company.' })
                } else if (docs == null) {
                    res.send({ status: 404, message: `This company doesn't exist` })
                } else {
                    docs.remove().then((result) => {
                        res.send({ status: 200, message: 'Company deleted successfully.' })
                    }).catch((e) => {
                        res.send({ status: 500, message: e })
                    })
                }
            })
        }
    })
})

router.post('/filtercompany', async (req, res) => {
    const companyName = req.body.companyName;
    await CompanyModel.findOne({ name: companyName }).lean().then(async (company) => {
        if (company === null) {
            res.send({ status: 404, message: 'No such company found.' })
        } else {
            let customers = []
            await productModel.find({ company: company._id }).lean().then(async (products) => {
                for (const product of products) {
                    await customerModel.find({ product: product._id }).populate({ path: 'product' }).lean().then(async (customer) => {
                        customers.push(customer)
                    })
                }
                await res.send({ status: 200, customer: customers })
            })
        }
    })
})

router.post('/getCityWithMostSales', (req, res) => {
    CompanyModel.findOne({ name: req.body.companyName }, { _id: true }).lean().then((company) => {
        if (company == null) {
            res.send({ status: 404, message: 'No such company found.' })
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
                    res.send({ status: 200, 'popular city': finalRes })
                }).catch((e) => {
                    res.send({ status: 400, message: 'Error while getting customer.' })
                })
            }).catch((e) => {
                res.send({ status: 400, message: 'Error while getting product.' })
            })
        }
    }).catch((e) => {
        res.send({ status: 400, message: 'Error while getting company.' })
    })
})

module.exports = router;