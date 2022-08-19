const LiveStreamSetting = require('../models/live-stream-setting.model')

class LiveStreamSettingRespository {

    /**
     * 
     * @param {roomId: string; streamId: string,} data 
     */
    async createLiveSetting(data) {
        const livestream = new LiveStreamSetting({
            streamID: data.streamId,
            roomID: data.roomId,
            status: 'active'
        })

        const result = await livestream.save()
        return result
    }


    async roomIsExisted(roomId) {
        const result = await LiveStreamSetting.exists({ roomID: roomId, status: 'active' })
        return result
    }

    async streamIsExisted(streamId) {
        const result = await LiveStreamSetting.exists({ streamID: streamId, status: 'active' })
        return result
    }

    async getActiveOne() {
        const result = await LiveStreamSetting.findOne({ status: 'active' }).lean()
        return result
    }

    async updateAllInActive() {
        const result = await LiveStreamSetting.updateMany({ status: 'active' }, { status: 'inactive'})
        return result
    }
}


module.exports = LiveStreamSettingRespository