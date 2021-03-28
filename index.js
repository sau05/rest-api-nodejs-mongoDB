const connection = require('./models');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const CompanyController = require('./controllers/company.controller')
const CustomerController = require('./controllers/customer.controller')
const ProductController = require('./controllers/product.controller')

app.use(bodyparser.urlencoded({
    extended : true
}))

// app.set('views', path.join(__dirname, '/views/'));

// app.engine('hbs', expressHandlebars({
//     extname: 'hbs', 
//     defaultLayout: 'mainlayout',
//     layoutsDir: __dirname + '/views/layouts'
// }))

app.use(express.json());

// app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index', {})
})

app.use('/Company', CompanyController)
app.use('/Customer', CustomerController)
app.use('/Product', ProductController)

app.listen('3000', () => {
    console.log('server started')
})