const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const router = express.Router()

// middleware that is specific to this router
router.use(express.static('public'))
router.use(expressLayouts)
router.use('/css', express.static(__dirname + '/public'), router)
router.use('/js', express.static(__dirname + '/public'), router)
router.use('/img', express.static(__dirname + '/public'), router)

router.get('/', (req, res) => {
    res.render('admin/dashboard', {
        title: 'Dashboard',
        top: '',
        bottom: '',
        layout: './layouts/admin_layout.ejs'
    })
})
router.get('/profile', (req, res) => {
    res.render('admin/profile', {
        title: 'Profile',
        top: '',
        bottom: '',
        layout: './layouts/admin_layout.ejs'
    })
})
router.get('/engine-form', (req, res) => {
    res.render('admin/engine-form', {
        title: 'Engine Form',
        top: '',
        bottom: ['<script type="module" src="js/app/engine.form.js"></script>'],
        layout: './layouts/admin_layout.ejs'
    })
})
router.get('/engine-list', (req, res) => {
    res.render('admin/engine-list', {
        title: 'Engine List',
        top: [
            '<script type="module" src="js/app/engine.list.js"></script>'
        ],
        bottom: '',
        layout: './layouts/admin_layout.ejs'
    })
})
router.get('/storage-list', (req, res) => {
    res.render('admin/storage-list', {
        title: 'STORAGE LIST',
        top: [
            '<script type="module" src="js/app/storage-list.js"></script>'
        ],
        bottom: '',
        layout: './layouts/admin_layout.ejs'
    })
})
router.get('/customer-list', (req, res) => {
    res.render('admin/customer-list', {
        title: 'CUSTOMER LIST',
        top: [
            '<script type="module" src="js/app/customer-list.js"></script>'
        ],
        bottom: '',
        layout: './layouts/admin_layout.ejs'
    })
})
router.get('/type-list', (req, res) => {
    res.render('admin/type-list', {
        title: 'TYPE LIST',
        top: '',
        bottom: '',
        layout: './layouts/admin_layout.ejs'
    })
})
router.get('/preserve-list', (req, res) => {
    res.render('admin/preserve-list', {
        title: 'PRESERVE LIST',
        top: '',
        bottom: '',
        layout: './layouts/admin_layout.ejs'
    })
})
router.get('/map', (req, res) => {
    res.render('admin/map', {
        title: 'Indoor MAP',
        top: [
            '<script src="https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js"></script>',
            '<script src="https://unpkg.com/tippy.js@6/dist/tippy-bundle.umd.js"></script>'
        ],
        bottom: [
            '<script src="js/external/gsap.min.js"></script>',
            '<script src="js/external/draggable.min.js"></script>',
            '<script type="module" src="js/app/indoor.map.js" defer="true"></script>'
        ],
        layout: './layouts/admin_layout.ejs'
    })
})

module.exports = router