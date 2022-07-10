const express = require('express')
const router = express.Router()

const {
    SignInAdmin,
    SignInUser,
    SignInAnonymous
} = require('../controller/auth.controller')

router.post('/sign-in/user', SignInUser)
router.post('/sign-in/admin', SignInAdmin)
router.post('/sign-in/anonymous', SignInAnonymous)


module.exports = router