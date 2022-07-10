const logger = require('../core/logger.core');
const { NotFoundResource, InternalError } = require('../core/response.core');

const ZegoAPIRespository = require('../respository/zego.respository')
const LiveStreamSettingRespository = require('../respository/live-stream-setting.respository');
const ChatDataRespository= require('../respository/chat.respository');
const { ChatDataStatus, ChatDataType } = require('../models/data.model');

const chatDataRespository = new ChatDataRespository()
const liveStreamSettingRespository = new LiveStreamSettingRespository()
const zegoAPIRespository = new ZegoAPIRespository()

const sendMessageToChatLiveStreamService = async (params) => {
    try {
        const { roomId, userId, message, name } = params
        const isRoomExist = await liveStreamSettingRespository.roomIsExisted(roomId)

        if (!isRoomExist) {
            logger.error(`room id (${roomId}) does not exist.`)
            throw new NotFoundResource("room id does not exist.")
        }

        logger.info('start save chat data')
        const chatData = await chatDataRespository.create(
            roomId,
            userId,
            message,
            ChatDataType.Message,
        )

        logger.info('start send broadcast message to zego engine')
        const content = JSON.stringify({
            message: message,
            messageType: ChatDataType.Message
        })
        const sendChat = await zegoAPIRespository.sendBroadcastMessage({
            roomId,
            userId,
            name,
            content
        })

        const messageStatus = sendChat.isSuccess ? ChatDataStatus.Success : ChatDataStatus.Failed
        const updateChateData = await chatDataRespository
            .updateSendingStatus(
                chatData._id.toHexString(), 
                sendChat?.RequestId || '', 
                messageStatus
            )

        if (!sendChat.isSuccess) throw new InternalError('Send message to chat room is falided')
        
        return updateChateData

    } catch(error) {
        logger.error(`Send message to chat live stream error: ${error}`)
        throw new InternalError('Send message to chat live stream error')
    }
}

const sendGiftToChatLiveStreamService = async (params) => {
    try {
        const { roomId, userId, giftId, toMemberId, name } = params
        const isRoomExist = await liveStreamSettingRespository.roomIsExisted(roomId)
        if (!isRoomExist) {
            logger.error(`room id (${roomId}) does not exist.`)
            throw new NotFoundResource("room id does not exist.")
        }

        const chatData = await chatDataRespository.create(
            roomId,
            userId,
            giftId,
            ChatDataType.Gift,
        )
        
        const content = JSON.stringify({
            giftUrl: '',
            toMemeber: memberId,
            messageType: ChatDataType.Gift
        })
        const sendChat = await zegoAPIRespository.sendBroadcastMessage({
            roomId,
            userId,
            name,
            content
        })

        const messageStatus = sendChat.isSuccess ? ChatDataStatus.Success : ChatDataStatus.Failed
        const updateChateData = await chatDataRespository
            .updateSendingStatus(
                chatData._id.toHexString(), 
                sendChat?.RequestId || '',
                messageStatus
            )

        if (!sendChat.isSuccess) throw new InternalError('Send Gift to member is falided')

        return updateChateData
        

    } catch(error) {
        logger.error(`Send gift to chat live stream error: ${error}`)
        throw new InternalError('Send message to chat live stream error')
    }
}



module.exports = {
    sendMessageToChatLiveStreamService,
    sendGiftToChatLiveStreamService
}