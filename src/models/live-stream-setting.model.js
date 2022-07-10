const mongoose = require('mongoose');
const { Collections } = require('./data.model')

const LiveStreamSettingSchema = new mongoose.Schema({
    streamID: {
        type: String,
        unique: true 
    },
    roomID: {
        type: String,
        unique: true 
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        index: true
    },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true })

const LiveStreamSetting = mongoose.model(Collections.LiveStreamSetting, LiveStreamSettingSchema);
module.exports = LiveStreamSetting