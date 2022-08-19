const LiveStreamSettingRespository = require('../../respository/live-stream-setting.respository')
const ChatDataRespository = require('../../respository/chat.respository')
const { generateStreamId, generateRoomId } = require('../../utils/live-stream-value.util')
const logger = require('../../core/logger.core')

const CreateLiveSettingJob = async () => {
    try {
        logger.info('start create live setting job')

        const liveStreamSettingRespository = new LiveStreamSettingRespository()
        const chatDataRespository = new ChatDataRespository()

        const liveActive = await liveStreamSettingRespository.getActiveOne()
        const isLiveUsed = await chatDataRespository.roomIdIsExistInChat(liveActive.roomID)
        if (isLiveUsed) {
            await liveStreamSettingRespository.updateAllInActive()
            await liveStreamSettingRespository.createLiveSetting({
                streamId: generateStreamId(),
                roomId: generateRoomId()
            })
        }
        logger.info('end create live setting job')
       
    } catch(error) {
        console.error('job schedule create live stream setting error')
        console.error(error)
    }
}

module.exports = {
    CreateLiveSettingJob
}