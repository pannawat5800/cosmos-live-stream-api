const LiveStreamSetting = require('../models/live-stream-setting.model')

class LiveStreamSettingRespository {

    /**
     * 
     * @param {roomId: string; streamId: string,} data 
     */
    async createLiveSetting(data) {
        const livestream = new LiveStreamSetting({
            streamId: data.streamId,
            roomId: data.roomId,
            status: 'active'
        })

        const result = await livestream.save()
        return result
    }


    async roomIsExisted(roomId) {
        const result = await LiveStreamSetting.exists({ roomId, status: 'active' })
        return result
    }

    async getActiveOne() {
        const result = await LiveStreamSetting.findOne({ status: 'active' })
        return result
    }
}


module.exports = LiveStreamSettingRespository