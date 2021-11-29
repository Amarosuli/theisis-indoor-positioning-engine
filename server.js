const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const router = express.Router()


const publics = require('./routes/public_route.js')
const admins = require('./routes/admin_route.js')

const app = express()
const port = process.env.PORT || 3000

app.use(expressLayouts)
app.use(express.static('public'), router)
app.use('/css', express.static(__dirname + '/public'), router)
app.use('/js', express.static(__dirname + '/public'), router)
app.use('/img', express.static(__dirname + '/public'), router)

app.set('view engine', 'ejs')
app.set('layout', './layouts/public_layout.ejs')

// control redirect
app.get('/', (req, res) => { res.render('redirect', { title: 'Page', top: '', bottom: '' }) })

// public routes
app.use('/public', publics)
// admin routes
app.use('/admin', admins)


// login routes
app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login Page',
        layout: './layouts/login_layout'
    })
})

app.get('*', (req, res) => {
    res.status(404).render('404', {
        title: '404',
        top: '',
        bottom: '',
        layout: './layouts/login_layout'
    })
})




app.listen(port, () => {
    console.info(`App running on port ${port}`)
})