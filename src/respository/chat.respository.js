const ChatData = require('../models/chat-data.model')

class ChatDataRespository {

    async create(roomId, userId, content, contentType) {
        const chatData = new ChatData({
            roomId: roomId,
            userId: userId,
            content: content,
            contentType: contentType,
            status: 'sending'
        })
        const result = await chatData.save()
        return result
    }

    async updateSendingStatus(id, requestId, status) {
        const result = await ChatData.findByIdAndUpdate(id, {
            requestId,
            status
        }, { new: true })
        return result
    }
}

module.exports = ChatDataRespository