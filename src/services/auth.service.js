const { NotFoundResource, InternalError } = require('../core/response.core')
const LiveStreamSettingRespository = require('../respository/live-stream-setting.respository');

const { generateToken04 } = require('../utils/zegoServerAssistant');
const { appID, serverSecrete, effectiveTimeInSeconds } = require('../core/config.core')
const logger = require('../core/logger.core');



const liveStreamSettingRespository = new LiveStreamSettingRespository()

const generateZegoEngineTokenForUser = async (userId, roomID) => {
    try {
        // Check room is existing
        const isRoomExited = await liveStreamSettingRespository.roomIsExisted(roomID)
        if (!isRoomExited) {
            logger.error(`room ID ${roomID} dose not exist.`)
            throw new NotFoundResource('This room id does not exist.')
        }
        
        const payload = {
            room_id: roomID,
            privilege: {
                1: 1,   // loginRoom: 1 pass , 0 not pass
                2: 0    // publishStream: 1 pass , 0 not pass
            },
            stream_id_list: null
        }
        const token = generateToken04(appID, userId, serverSecrete, effectiveTimeInSeconds, JSON.stringify(payload))
        return token
        
    } catch (error) {
        console.log(error)
        logger.error(`Generate zego engin token for user error: ${error.toString()}`)
        throw new InternalError('Generate zego engin token for user error')
    }
}

const generateZegoEngineTokenForUndefindUser = async (userId, roomID) => {
    try {
        const payload = {
            room_id: roomID,
            privilege: {
                1: 1,   // loginRoom: 1 pass , 0 not pass
                2: 0    // publishStream: 1 pass , 0 not pass
            },
            stream_id_list: null
        }
        const token = generateToken04(appID, userId, serverSecrete, effectiveTimeInSeconds, JSON.stringify(payload))
        return token
    } catch(error) {
        logger.error(`Generate zego engin token for undefind error: ${error}`)
        throw new InternalError('Generate zego engin token for undefind user error')
    }
}

const generateZegoEngineTokenForAdmin = async (userId, roomID) => {
    try {
        const isRoomExited = await liveStreamSettingRespository.roomIsExisted(roomID)
        if (!isRoomExited) {
            logger.error(`room ID ${roomID} dose not exist.`)
            throw new NotFoundResource('This room id does not exist.')
        }

        const payload = {
            room_id: roomID,
            privilege: {
                1: 1,   // loginRoom: 1 pass , 0 not pass
                2: 1   // publishStream: 1 pass , 0 not pass
            },
            stream_id_list: null
        }
        const token = generateToken04(appID, userId, serverSecrete, effectiveTimeInSeconds, JSON.stringify(payload))
        return token
    } catch(error) {
        logger.error(`Generate zego engin token for admin error: ${error}`)
        throw new InternalError('Generate zego engin token for admin error')
        
    }
}




module.exports = {
    generateZegoEngineTokenForUser,
    generateZegoEngineTokenForUndefindUser,
    generateZegoEngineTokenForAdmin
}