const ChatData = require('../models/chat-data.model')
const { ChatDataStatus, Collections } = require('../models/data.model')
const mongoose = require('mongoose')

class ChatDataRespository {

    async create(roomId, userId, content, contentType, ) {
        const chatData = new ChatData({
            roomId: roomId,
            userId: userId,
            content: content,
            contentType: contentType,
        })
        const result = await chatData.save()
        return result
    }

    async createForGift(roomId, userId, giftId, contentType, toMember) {
        const chatData = new ChatData({
            roomId: roomId,
            userId: userId,
            gift: new mongoose.Types.ObjectId(giftId),
            contentType: contentType,
            toMember: new mongoose.Types.ObjectId(toMember)
        })
        const result = await chatData.save()
        return result
    }

    async createForPoint(roomId, userId, point, contentType, toMember) {
        const chatData = new ChatData({
            roomId: roomId,
            userId: userId,
            point: point,
            contentType: contentType,
            toMember: new mongoose.Types.ObjectId(toMember)
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

    async updateSendingStatusWithDocId(id, documentId, status) {
        const result = await ChatData.findByIdAndUpdate(id, {
            documentId,
            status
        }, { new: true })
        return result
    }

    // async getChatsByStatusAndRoom(roomId, status) {
    //     const result = await ChatData.find({ roomId, status }).sort({ createAt: 1 }).exec()
    //     return result
    // }

    async getChatsByStatusAndRoom(roomId, status) {
        const result = await ChatData.aggregate([
            { 
                $match: {
                    roomId: roomId,
                    status: status
                },
            },
            {
                $lookup: {
                    from: Collections.Gifts,
                    localField: 'gift',
                    foreignField: '_id',
                    as: 'gift'
                }
            },
            {
                $lookup: {
                    from: Collections.Candidates,
                    let: { toMember : '$toMember'},
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$_id", "$$toMember"] } } },
                        { $project: { code: 1 }}
                    ],
                    as: 'toMember'
                }
            },
            {
                $unwind: {
                    path: '$gift',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: '$toMember',
                    preserveNullAndEmptyArrays: true,
                }
            },
            { $sort: { createAt : 1 }}
        ]).exec()
        return result
    }
}

module.exports = ChatDataRespository