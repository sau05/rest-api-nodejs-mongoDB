var express = require("express");
const CompanyController = require('./controllers/company.controller')
const CustomerController = require('./controllers/customer.controller')
const ProductController = require('./controllers/product.controller')


exports.configure = ((app, route)=>{

    app.use('/', route)
    
    app.post('/company/add', CompanyController.add)
    app.get('/company/list', CompanyController.list)
    app.put('/company/update', CompanyController.update)
    app.delete('/company/delete/:id', CompanyController.delete)
    app.post('/company/filtercompany', CompanyController.filtercompany)
    app.post('/company/getCityWithMostSales', CompanyController.getCityWithMostSales)

    app.post('/product/add', ProductController.add)
    app.get('/product/list', ProductController.list)
    app.put('/product/update', ProductController.update)
    app.delete('/product/delete/:id', ProductController.delete)
    app.post('/product/popularproduct', ProductController.popularproduct)

    app.post('/customer/add', CustomerController.add)
    app.get('/customer/list', CustomerController.list)
    app.put('/customer/update', CustomerController.update)
    app.delete('/customer/delete/:id', CustomerController.delete)
    app.post('/customer/filtercustomer', CustomerController.filtercustomer)

    // return route
})