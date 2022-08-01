const logger = require('../core/logger.core');
const { NotFoundResource, InternalError, BadRequest } = require('../core/response.core');

const ZegoAPIRespository = require('../respository/zego.respository')
const LiveStreamSettingRespository = require('../respository/live-stream-setting.respository');
const ChatDataRespository = require('../respository/chat.respository');
const ChatGiftFirestoreDB = require('../respository/chat-firestore.respository')
const cosmosApiRespository = require('../respository/cosmos_api.respository')
const cosmosVoteApiRespository = require('../respository/cosmos_vote_api.respository')

const { ChatDataStatus, ChatDataType } = require('../models/data.model');

const chatDataRespository = new ChatDataRespository()
const liveStreamSettingRespository = new LiveStreamSettingRespository()
const zegoAPIRespository = new ZegoAPIRespository()
const chatGiftFirestoreDB = new ChatGiftFirestoreDB()

const sendMessageToChatLiveStreamService = async (params) => {

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


}

const sendGiftToChatLiveStreamService = async (params) => {

    const { roomId, giftId, toMember, user, accessToken } = params
    const [isRoomExist, candidate, gift, balance, voteParameter] = await Promise.all([
        liveStreamSettingRespository.roomIsExisted(roomId),
        cosmosApiRespository.getCadidate(toMember),
        cosmosApiRespository.getGift(giftId),
        cosmosVoteApiRespository.getUserBalance(accessToken),
        cosmosApiRespository.getVoteParameter(),
    ])

    if (!voteParameter.isVoteOn) {
        throw new BadRequest('vote is not open', 'vote_not_allow')
    }

    if (!isRoomExist) {
        logger.error(`room id (${roomId}) does not exist.`)
        throw new NotFoundResource("room id does not exist.")
    }

    if (!candidate) {
        throw new NotFoundResource('Cadidate is not found')
    }

    if (!gift) {
        throw new NotFoundResource('Gift is not found.')
    }

    if (!balance) {
        throw new BadRequest('Youre balace is empty')
    }

    if (balance < gift.token) {
        throw new BadRequest('Youre token is not enough for sending the gift.', 'not_enough_token')
    }

    console.log('cadidate: ', candidate)
    console.log('gift: ', gift)

    const resultSendGift = await cosmosApiRespository.sentGiftHistory({
        user_id: user.id,
        candidate_id: candidate._id,
        gift_id: gift._id,
        token: gift.token,
        username: user.name,
        email: user.email,
    })

    console.log('result send gift: ', resultSendGift)

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
    const { roomId, token, toMember, user, accessToken } = params

    const [isRoomExist, candidate, vote, balance] = await Promise.all([
        liveStreamSettingRespository.roomIsExisted(roomId),
        cosmosApiRespository.getCadidate(toMember),
        cosmosApiRespository.getVoteParameter(),
        cosmosVoteApiRespository.getUserBalance(accessToken),
    ])

    if (!vote.isVoteOn) {
        throw new BadRequest('vote is not open', 'vote_not_allow')
    }

    if (!isRoomExist) {
        logger.error(`room id (${roomId}) does not exist.`)
        throw new NotFoundResource("room id does not exist.")
    }

    if (!candidate) {
        throw new NotFoundResource('Cadidate is not found')
    }

    if (!balance) {
        throw new BadRequest('Youre balace is empty')
    }

    if (balance < token) {
        throw new BadRequest('Youre token is not enough for sending the point.', 'not_enough_token')
    }

    const { token2, point } = vote
    const votePoint = point * token / token2

    const totalPoint = candidate.total_points + votePoint

    await cosmosApiRespository.updatePointCandidate(
        candidate._id,
        totalPoint
    )


    const data = {
        userid: user.id,
        username: user.name,
        email: user.email,
        token: token,
        point: votePoint,
        candidate: candidate._id
    }
    const voteResult = await cosmosVoteApiRespository.sendPointVote(data)
    console.log('vote resutl: ', voteResult)

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