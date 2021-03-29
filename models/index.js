const mongoose = require('mongoose')
require("dotenv").config();
const mongodbUrl = process.env.MONGODB_URL

mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }, (error) => {
    if (error) {
        console.log('error')
    } else {
        console.log('success')
    }
})

const Company = require('./company.model')
const Customer = require('./customer.model')
const Product = require('./product.model')