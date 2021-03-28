const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const customerModel = require('./customer.model')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    company: { type: String, ref: 'Company', required: true },
    price: { type: String, required: true }
})

autoIncrement.initialize(mongoose.connection)

productSchema.plugin(autoIncrement.plugin, {
    model: 'product',
    field: '_id',
    startAt: 1,
    incrementBy: 1
})

productSchema.post('remove', (doc, next) => {
    customerModel.deleteOne({ product: doc._id }).exec()
    next()
})

module.exports = mongoose.model('product', productSchema)