const logger = require('../core/logger.core')
const zego_api = require('../core/zego_api.core')
const { appID, serverSecret } = require('../core/config.core')
const { generateSignatureNonce, generateUASignature } = require('../utils/live-stream-value.util')
const { addHours } = require('../utils/dateTime.utile')

class ZegoAPIRespository {


    async sendBroadcastMessage(roomId, userId, userName, content) {
        try {
            const publishParamter = this.getPublishParameter()
            const response = await zego_api.get('', {
                params: {
                    Action: "SendBroadcastMessage",
                    RoomId: roomId,
                    UserId: userId,
                    UserName: userName,
                    MessageCategory: 2,
                    MessageContent: content,
                    ...publishParamter,
                }
            })
            return {
                isSuccess: true,
                data: response.data
            }

        } catch (error) {
            console.error(error.response.data)
            logger.error(`send boardcast message error: ${error}`)
            return {
                isSuccess: false,
                error: error.response.data
            }
        }
    }

    async sendBarrageMessage(roomId, userId, userName, content) {
        try {
            const publishParamter = this.getPublishParameter()
            const response = await zego_api.get('', {
                params: {
                    Action: "SendBarrageMessage",
                    RoomId: roomId,
                    UserId: userId,
                    UserName: userName,
                    MessageCategory: 2,
                    MessageContent: content,
                    ...publishParamter,
                }
            })
            return {
                isSuccess: true,
                data: response.data
            }

        } catch (error) {
            console.error(error.response.data)
            logger.error(`send boardcast message error: ${error}`)
            return {
                isSuccess: false,
                error: error.response.data
            }
        }
    }


    async getRoomCurrentUser(roomId) {
        try {
            const publishParamter = this.getPublishParameter()
            const { data } = await zego_api.get('', {
                params: {
                    Action: "DescribeUserNum",
                    'RoomId[]': roomId,
                    ...publishParamter,
                }
            })
            return {
                isSuccess: true,
                data: data
            }
        } catch(error) {
            console.log(error)
            logger.error(`request current user error: ${error}`)
            return {
                isSuccess: false,
                error: error.response.data
            }
        }
    }

    async getStreamsByRoom(roomId) {
        try {
            const publishParamter = this.getPublishParameter()
            const { data } = await zego_api.get('', {
                params: {
                    Action: "DescribeSimpleStreamList",
                    RoomId: roomId,
                    ...publishParamter,
                }
            })
            return {
                isSuccess: true,
                data: data
            }
        } catch (error) {
            console.log(error)
            logger.error(`request current user error: ${error}`)
            return {
                isSuccess: false,
                error: error.response.data
            }
        }
    }

    async startRecordStreamOnServer(streamId, endTime) {
        try {
            console.log("streamid: ", streamId)
            const publishParamter = this.getPublishParameter()
            console.log('end time: ', (Math.round(addHours(3) / 1000)))
            const { data } = await zego_api.get('', {
                params: {
                    Action: "StartCDNRecrod",
                    'StreamId[]': streamId,
                    Vendo: "Tencent",
                    EndTime: Math.round(addHours(3) / 1000),
                    ...publishParamter,
                }
            })
            console.log('data: ', data)
            return {
                isSuccess: true,
                data: data
            }
        } catch (error) {
            console.log(error)
            logger.error(`request current user error: ${error}`)
            return {
                isSuccess: false,
                error: error.response.data
            }
        }
    }

    async stopRecordStreamOnServer(streamId) {
        try {
            const publishParamter = this.getPublishParameter()
            const { data } = await zego_api.get('', {
                params: {
                    Action: "StopCDNRecord",
                    StreamId: [streamId],
                    Vendo: "Tencent",
                    ...publishParamter,
                }
            })
            return {
                isSuccess: true,
                data: data
            }
        } catch (error) {
            console.log(error)
            logger.error(`request current user error: ${error}`)
            return {
                isSuccess: false,
                error: error.response.data
            }
        }
    }


    getPublishParameter() {
        const timeStamp = Math.round(Date.now() / 1000);
        const signatureNonce = generateSignatureNonce()
        // console.log(appID, ' ', signatureNonce, ' ', serverSecret, ' ', timeStamp)
        const signature = generateUASignature(appID, signatureNonce, serverSecret, timeStamp)
        return {
            AppId: appID,
            SignatureNonce: signatureNonce,
            Timestamp: timeStamp,
            Signature: signature,
            SignatureVersion: '2.0',
            IsTest: 'false'
        }
    }
}


module.exports = ZegoAPIRespository