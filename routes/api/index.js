const router = require('express').Router()
const { apiVersion } = require('../../models/version')

router.get('/', (req, res) => {
  if (req.user) {
    let { api_key, username, name } = req.user
    let message = `Hi! ${name}. Welcome to the Graviton's Store API 2.0.`
    let version = apiVersion();
    res.status(200).json({username , message, api_key, ...version})
  } else {
    res.status(200).json(apiVersion())
  }
})

router.use('/plugins', require('./plugins'))
router.use('/websockets', require('./websockets'))

module.exports = router
