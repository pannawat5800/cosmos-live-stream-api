const express = require('express')
const router = express.Router()

const { SendChatMessage, SendGift, GetLiveStreamSetting } = require('../controller/live-stream.controller')

router.put('/chats', SendChatMessage)
router.put('/gifts', SendGift)
router.get('/setting', GetLiveStreamSetting)
module.exports = router