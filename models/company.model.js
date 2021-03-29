const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const productModel = require('./product.model')

var CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, required: true },
})

autoIncrement.initialize(mongoose.connection)

CompanySchema.plugin(autoIncrement.plugin, {
    model: 'Company',
    field: '_id',
    startAt: 1,
    incrementBy: 1
})

CompanySchema.post('remove', (doc, next) => {
    productModel.find({ company: doc._id }, (err, products) => {
        if (err) {
            next(new Error('error'))
        } else if (products.length == 0) {
            next(new Error('no such product'))
        } else {
            products.forEach((product) => {
                product.remove()
                next()
            })
        }
    }).exec()
})

module.exports = mongoose.model('Company', CompanySchema)