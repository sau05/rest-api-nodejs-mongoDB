const connection = require('./models');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const routes = require('./routes')
const router = express.Router()

app.use(bodyparser.urlencoded({
    extended : true
}))

app.use(express.json());

app.get('/', (req, res) => {
    res.render('index', {})
})

routes.configure(app, router)

app.listen('3000', () => {
    console.log('server started')
})