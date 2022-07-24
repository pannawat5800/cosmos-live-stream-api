const mongoose = require('mongoose');
const { ChatDataType, ChatDataStatus } = require('./data.model');
const { Collections } = require('./data.model')

const Schema = mongoose.Schema
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
        enum: [...Object.keys(ChatDataType)]
    },
    status: {
        type: String,
        enum: [ChatDataStatus.Sending, ChatDataStatus.Success, ChatDataStatus.Failed],
        default: ChatDataStatus.Sending
    },
    requestId: String,
    documentId: String,
    gift: Schema.Types.ObjectId,
    point: Number,
    toMember: Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true })

const ChatData = mongoose.model(Collections.ChatData, ChatDataSchema);
module.exports = ChatData
