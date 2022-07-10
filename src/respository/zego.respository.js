const logger = require('../core/logger.core')
const zego_api = require('../core/zego_api.core')

class ZegoAPIRespository  {

    async sendBroadcastMessage(roomId, userId, userName, content) {
        try {
            const response = await zego_api.get('/', {
                params: {
                    Action: "SendBroadcastMessage",
                    RoomId: roomId,
                    UserId: userId,
                    UserName: userName,
                    MessageCategory: 1,
                    MessageContent: content
                }
            })
            return { 
                isSuccess: true, 
                data: response.data
            }

        } catch(error) {
            logger.error(`send boardcast message error: ${error}`)
            return {
                isSuccess: false,
                error: error
            }
        }
    }
}


module.exports = ZegoAPIRespository