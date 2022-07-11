const express = require('express')
const router = express.Router()

const AuthRouter = require('./auth.route')
const LiveStreamRouter = require('./live-stream.route')

router.use('/auth', AuthRouter)
router.use('/live-stream', LiveStreamRouter)


module.exports = router