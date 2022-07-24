const { sendMessageToChatLiveStreamService, 
    sendGiftToChatLiveStreamService, 
    sendPointToChatLiveStreamService, 
    getCurrentChatListOnLiveStream, 
    getNumberUsersView,
    getStreamActiveList
} = require("../services/live-stream.service")
const { SendChatMessageSchema, SendGiftSchema, SendPointSchema } = require('../validation/live-stream.validation')
const catchAsync = require("../utils/catchAsync")
const { BadRequest } = require("../core/response.core")
const logger = require("../core/logger.core")
const LiveStreamSettingRespository = require('../respository/live-stream-setting.respository');


const SendChatMessage = catchAsync(async (request, response) => {
    const { error } = SendChatMessageSchema.validate(request.body)
    if (error) {
        logger.error(`This body request is invalid: ${error}`)
        throw new BadRequest('This body request is invalid')
    }

    const result = await sendMessageToChatLiveStreamService(request.body)
    response.json(result)
})

const SendGift = catchAsync(async (request, response) => {
    const { error } = SendGiftSchema.validate(request.body)
    if (error) {
        logger.error(`This body request is invalid: ${error}`)
        throw new BadRequest('This body request is invalid')
    }
    const result = await sendGiftToChatLiveStreamService(request.body)
    response.json(result)
})

const SendPoint = catchAsync(async (request, response) => {
    const { error } = SendPointSchema.validate(request.body)
    if (error) {
        logger.error(`This body request is invalid: ${error}`)
        throw new BadRequest('This body request is invalid')
    }
    const result = await sendPointToChatLiveStreamService(request.body)
    response.json(result)
})

const RecordStream = catchAsync(async (request, response) => {
    response.send('success')
})

const GetLiveStreamSetting = catchAsync(async (request, response) => {
    const liveStreamSettingRespository = new LiveStreamSettingRespository()
    const data = await liveStreamSettingRespository.getActiveOne()
    response.json(data)
})

const GetChats = catchAsync(async (request, response) => {
    const { roomId } = request.params
    if (!roomId) {
        logger.error('Room id is requried.')
        return new BadRequest('room id is required.')
    }
    const chats = await getCurrentChatListOnLiveStream(roomId)
    response.json(chats)
})

const GetUserNumber = catchAsync(async (request, response) => {
    const { roomId } = request.params
    if (!roomId) {
        logger.error('Room id is requried.')
        return new BadRequest('room id is required.')
    }
    console.log('room id: ', roomId)
    const data = await getNumberUsersView(roomId)
    
    response.json(data)
})


const GetStreamList = catchAsync(async (request, response) => {
    const { roomId } = request.params
    if (!roomId) {
        logger.error('Room id is requried.')
        return new BadRequest('room id is required.')
    }
    console.log('room id: ', roomId)
    const data = await getStreamActiveList(roomId)

    response.json(data)
})

module.exports = {
    SendGift,
    SendChatMessage,
    SendPoint,
    RecordStream,
    GetLiveStreamSetting,
    GetChats,
    GetUserNumber,
    GetStreamList
}