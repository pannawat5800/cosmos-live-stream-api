const express = require('express')
const router = express.Router()
const { 
    SendChatMessage, 
    SendGift, 
    SendPoint, 
    GetLiveStreamSetting,
    GetChats, 
    GetUserNumber, 
    GetStreamList,
    StartRecord,
    StopRecord
} = require('../controller/live-stream.controller')

router.put('/chats', SendChatMessage)
router.get('/chats/rooms/:roomId', GetChats)
router.get('/rooms/:roomId/users', GetUserNumber)
router.put('/gifts', SendGift)
router.get('/setting', GetLiveStreamSetting)
router.put('/points', SendPoint)
router.get('/list/rooms/:roomId', GetStreamList)
router.post('/record/start', StartRecord)
router.post('/record/stop', StopRecord)

module.exports = router