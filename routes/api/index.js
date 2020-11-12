const router = require('express').Router()
const version = require('../../models/version')

router.get('/', function (req, res) {
  res.status(200).json(version.apiVersion())
})

router.use('/plugins', require('./plugins'))
router.use('/websockets', require('./websockets'))

module.exports = router
