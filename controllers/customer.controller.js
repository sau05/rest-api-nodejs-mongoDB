const express = require('express')
const mongoose = require('mongoose');
const customerModel = require('../models/customer.model');
const productModel = require('../models/product.model');

const router = express.Router();
const CustomerModel = mongoose.model('Customer');
router.get('/add', (req, res) => {
    res.render('add-customer')
})

router.post('/add', (req, res) => {
    productModel.findOne({ _id: req.body.product }, (err, product) => {
        if (err) {
            res.send({ status: 400, message: 'Error' })
        } else if (product == null) {
            res.send({ status: 404, message: 'No such product found' })
        } else {
            var customer = new CustomerModel();
            customer.name = req.body.name;
            customer.product = req.body.product;
            customer.city = req.body.city;
            customer.save((err, docs) => {
                if (err) {
                    res.send({ status: 400, message: 'Error adding customer' })
                } else {
                    res.send({ status: 200, message: 'Record successfully added' })
                }
            })
        }
    })
})

router.get('/list', (req, res) => {
    CustomerModel.find((err, docs) => {
        if (err) {
            res.send({ status: 400, message: 'Error while fetching customer list' })
        } else {
            res.send({ status: 200, Customers: docs })
        }
    }).lean()
})

router.put('/update', (req, res) => {
    CustomerModel.findOne({ _id: req.body.id }, (err, customer) => {
        if (err) {
            res.send({ status: 400, message: 'Error while getting customer' })
        } else if (customer == null) {
            res.send({ status: 404, message: 'No such customer found' })
        } else {
            productModel.findOne({ _id: req.body.product }, (err, product) => {
                if (err) {
                    res.send({ status: 400, message: 'Error' })
                } else if (product == null) {
                    res.send({ status: 404, message: 'No such product found' })
                } else {
                    CustomerModel.findByIdAndUpdate({ _id: req.body.id }, req.body, (err, docs) => {
                        if (err) {
                            res.send({ status: 400, message: 'Failed to update customer.' })
                        } else {
                            res.send({ status: 200, message: 'Customer updated successfully.' })
                        }
                    })
                }
            })
        }
    })

})

router.delete('/delete/:id', (req, res) => {
    CustomerModel.findOne({ _id: req.params.id }, (err, customer) => {
        if (err) {
            res.send({ status: 400, message: 'Error while getting customer' })
        } else if (customer == null) {
            res.send({ status: 404, message: 'No such customer found' })
        } else {
            CustomerModel.findOneAndRemove({ _id: req.params.id }, (err, docs) => {
                if (err) {
                    res.send({ status: 400, message: 'Failed to delete customer.' })
                } else {
                    res.send({ status: 200, message: 'Customer deleted successfully.' })
                }
            })
        }
    })
})

router.post('/filtercustomer', async (req, res) => {
    const customerName = req.body.customerName;
    await CustomerModel.find({ name: customerName }).then(async (customers) => {
        if (customers.length == 0) {
            res.send({ status: 404, message: 'No such customer found.' })
        } else {
            let products = []
            for (const customer of customers) {
                await productModel.findOne({ _id: customer.product }).populate({ path: 'company', model: 'Company' }).lean().then(async (product) => {
                    products.push(product)
                })
            }
            await res.send({ status: 200, products: products })
        }
    })
})

module.exports = router;