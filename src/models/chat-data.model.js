const mongoose = require('mongoose');
const { ChatDataType, ChatDataStatus } = require('./data.model');
const { Collections } = require('./data.model')

const ChatDataSchema = mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    content: String,
    contentType: {
        type: String,
        required: true,
        enum: [ChatDataType.Message, ChatDataType.Link, ChatDataType.Gift]
    },
    status: {
        type: String,
        enum: [ChatDataStatus.Sending, ChatDataStatus.Success, ChatDataStatus.Failed],
        default: ChatDataStatus.Sending
    },
    requestId: String,
    toMember: String,
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true })

const ChatData = mongoose.model(Collections.ChatData, ChatDataSchema);
module.exports = ChatData
