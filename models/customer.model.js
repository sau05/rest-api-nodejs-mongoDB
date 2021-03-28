const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

var customerSchema = new mongoose.Schema({
    product: { type: String, ref: 'product', required: true },
    name: { type: String, required: true },
    city: { type: String, required: true }
})

autoIncrement.initialize(mongoose.connection)

customerSchema.plugin(autoIncrement.plugin, {
    model: 'Customer',
    field: '_id',
    startAt: 1,
    incrementBy: 1
})

module.exports = mongoose.model('Customer', customerSchema)