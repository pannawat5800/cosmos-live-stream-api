const logger = require('../core/logger.core');
const { NotFoundResource, InternalError } = require('../core/response.core');

const ZegoAPIRespository = require('../respository/zego.respository')
const LiveStreamSettingRespository = require('../respository/live-stream-setting.respository');
const ChatDataRespository = require('../respository/chat.respository');
const ChatGiftFirestoreDB = require('../respository/chat-firestore.respository')
const cosmosApiRespository = require('../respository/cosmos_api.respository')

const { ChatDataStatus, ChatDataType } = require('../models/data.model');

const chatDataRespository = new ChatDataRespository()
const liveStreamSettingRespository = new LiveStreamSettingRespository()
const zegoAPIRespository = new ZegoAPIRespository()
const chatGiftFirestoreDB = new ChatGiftFirestoreDB()

const sendMessageToChatLiveStreamService = async (params) => {
    try {

        const { roomId, message, user } = params
        const isRoomExist = await liveStreamSettingRespository.roomIsExisted(roomId)

        if (!isRoomExist) {
            logger.error(`room id (${roomId}) does not exist.`)
            throw new NotFoundResource("room id does not exist.")
        }

        logger.info('start save chat data')
        const chatData = await chatDataRespository.create(
            roomId,
            user.id,
            message,
            ChatDataType.Message,
        )

        logger.info('start send broadcast message to zego engine')

        const content = JSON.stringify({
            message: message,
            contentType: ChatDataType.Message
        })
        const userName = JSON.stringify({
            image: user.image,
            name: user.name,
        })
        const sendChat = await zegoAPIRespository.sendBarrageMessage(
            roomId,
            user.id,
            userName,
            content,
        )
        console.log('send chat: ', sendChat)

        const messageStatus = sendChat.isSuccess ? ChatDataStatus.Success : ChatDataStatus.Failed
        const updateChateData = await chatDataRespository
            .updateSendingStatus(
                chatData._id.toHexString(),
                sendChat.data?.RequestId || '',
                messageStatus
            )

        if (!sendChat.isSuccess) throw new InternalError('Send message to chat room is falided')
        return updateChateData

    } catch (error) {
        logger.error(`Send message to chat live stream error: ${error}`)
        throw new InternalError('Send message to chat live stream error')
    }
}

const sendGiftToChatLiveStreamService = async (params) => {
    try {
        const { roomId, giftId, toMember, user } = params
        const isRoomExist = await liveStreamSettingRespository.roomIsExisted(roomId)
        if (!isRoomExist) {
            logger.error(`room id (${roomId}) does not exist.`)
            throw new NotFoundResource("room id does not exist.")
        }

        const [candidate, gift] = await Promise.all([
            cosmosApiRespository.getCadidate(toMember),
            cosmosApiRespository.getGift(giftId)
        ])

        if (!candidate) {
            throw new NotFoundResource('Cadidate is not found')
        }

        if (!gift) {
            throw new NotFoundResource('Gift is not found.')
        }

        console.log('cadidate: ', candidate)
        console.log('gift: ', gift)


        const chatData = await chatDataRespository.createForGift(
            roomId,
            user.id,
            giftId,
            ChatDataType.Gift,
            toMember
        )

        const sendChat = await chatGiftFirestoreDB.create({
            roomId,
            user,
            gift: {
                id: gift._id,
                name: gift.name,
                url: gift.image.url,
            },
            toMember: candidate.code,
            contentType: ChatDataType.Gift
        })

        console.log("send caht id: ", sendChat.id)

        // const messageStatus = sendChat.isSuccess ? ChatDataStatus.Success : ChatDataStatus.Failed
        const updateChateData = await chatDataRespository
            .updateSendingStatusWithDocId(
                chatData._id.toHexString(),
                sendChat.id || '',
                ChatDataStatus.Success
            )

        return updateChateData


    } catch (error) {
        console.log(error)
        logger.error(`Send gift to chat live stream error: ${error}`)
        throw new InternalError('Send message to chat live stream error')
    }
}

const getCurrentChatListOnLiveStream = async (roomId) => {
    const chats = await chatDataRespository.getChatsByStatusAndRoom(roomId, ChatDataStatus.Success)
    console.log(chats)
    return chats
}

const getNumberUsersView = async (roomId) => {
    const result = await zegoAPIRespository.getRoomCurrentUser(roomId)
    console.log(result)
    if (!result.isSuccess) {
        throw InternalError('Get number user view error')
    }

    const room = result.data.Data.UserCountList.find((ele) => ele.RoomId === roomId)
    return room
}


const sendPointToChatLiveStreamService = async (params) => {
    try {
        const { roomId, token, toMember, user } = params
        const isRoomExist = await liveStreamSettingRespository.roomIsExisted(roomId)
        if (!isRoomExist) {
            logger.error(`room id (${roomId}) does not exist.`)
            throw new NotFoundResource("room id does not exist.")
        }
        const [candidate, vote] = await Promise.all([
            cosmosApiRespository.getCadidate(toMember),
            cosmosApiRespository.getVoteParameter()
        ])
        console.log(vote)
        const {token2, point } = vote
        const votePoint = point * token / token2

        const chatData = await chatDataRespository.createForPoint(
            roomId,
            user.id,
            votePoint,
            ChatDataType.Point,
            toMember
        )

        const sendChat = await chatGiftFirestoreDB.create({
            roomId,
            user,
            point: votePoint,
            toMember: candidate.code,
            contentType: ChatDataType.Point,
        })

        console.log("send caht id: ", sendChat.id)

        // const messageStatus = sendChat.isSuccess ? ChatDataStatus.Success : ChatDataStatus.Failed
        const updateChateData = await chatDataRespository
            .updateSendingStatusWithDocId(
                chatData._id.toHexString(),
                sendChat.id || '',
                ChatDataStatus.Success
            )

        return updateChateData


    } catch (error) {
        console.log(error)
        logger.error(`Send gift to chat live stream error: ${error}`)
        throw new InternalError('Send message to chat live stream error')
    }
}


const getStreamActiveList = async (roomId) => {
    const result = await zegoAPIRespository.getStreamsByRoom(roomId)
    console.log(result)
    if (!result.isSuccess) {
        throw InternalError('Get number user view error')
    }

    const stream = result.data.Data.StreamList
    return stream
}


module.exports = {
    sendMessageToChatLiveStreamService,
    sendGiftToChatLiveStreamService,
    sendPointToChatLiveStreamService,
    getCurrentChatListOnLiveStream,
    getNumberUsersView,
    getStreamActiveList
}