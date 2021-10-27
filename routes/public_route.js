const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const router = express.Router()

// middleware that is specific to this router
router.use(express.static('public'))
router.use(expressLayouts)
router.use('/css', express.static(__dirname + '/public'), router)
router.use('/js', express.static(__dirname + '/public'), router)
router.use('/img', express.static(__dirname + '/public'), router)

// define the home page route
router.get('/', (req, res) => {
    res.render('public/dashboard', {
        title: 'Dashboard',
        top: '',
        bottom: '',
    })
})

router.get('/map', (req, res) => {
    res.render('public/map', {
        title: 'Indoor MAP',
        top: [
            '<script src="js/external/sweetalert2.all.min.js"></script>',
            '<script src="https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js"></script>',
            '<script src="https://unpkg.com/tippy.js@6/dist/tippy-bundle.umd.js"></script>',
            '<script defer src="js/external/gsap.min.js"></script>',
            '<script defer type="module" src="js/app/indoor.map.js"></script>'
        ],
        bottom: ''
    })
})
router.get('/engine-list', (req, res) => {
    res.render('public/engine-list', {
        title: 'ENGINE LIST',
        top: [
            '<script type="module" src="js/app/engine.list.js"></script>'
        ],
        bottom: '',
    })
})

module.exports = router