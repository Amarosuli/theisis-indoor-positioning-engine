const express = require('express')
const router = express.Router()
const puppeteer = require('puppeteer')

router.use(express.static('public'))

router.get('/pdf', async (req, res) => {
   res.format({
      'application/pdf': async () => {
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            await page.goto(`http://localhost:3000/admin/engine-list`, {
               waitUntil: 'networkidle2'
            })
            const buffer = await page.pdf({
               path: 'hn.pdf',
               format: 'A4',
               })
            await browser.close()
            res.status(200).send(buffer)
            }
      })
   })

   module.exports = router