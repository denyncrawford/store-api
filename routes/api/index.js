const router = require('express').Router()
const { apiVersion } = require('../../models/version')

router.get('/', (req, res) => {
  if (req.user) {
    let apiKey = req.user.api_key
    res.status(200).json({apiKey, apiVersion})
  } else {
    res.status(200).json(apiVersion())
  }
})

router.use('/plugins', require('./plugins'))
router.use('/websockets', require('./websockets'))

module.exports = router
