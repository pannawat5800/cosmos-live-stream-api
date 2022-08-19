const express = require('express')
const router = express.Router()

const {
    SignInAdmin,
    SignInUser,
    SignInAnonymous,
    SignInCustomToken
} = require('../controller/auth.controller')

router.post('/sign-in/user', SignInUser)
router.post('/sign-in/admin', SignInAdmin)
router.post('/sign-in/anonymous', SignInAnonymous)
router.post('/sign-in/custom', SignInCustomToken)


module.exports = router