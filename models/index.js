const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/LMS_test', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }, (error) => {
    if (error) {
        console.log('error')
    } else {
        console.log('success')
    }
})

const Company = require('./company.model')
const Customer = require('./customer.model')
const Product = require('./product.model')