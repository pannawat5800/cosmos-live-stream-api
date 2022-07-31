
const Collections = {
    LiveStreamSetting: 'live_stream_settings',
    ChatData: 'chat_datas',
    Gifts: 'gifts',
    Candidates: 'candidates',
    User: 'users'
}

const ChatDataType = {
    Message: 'Message',
    Gift: 'Gift',
    Point: 'Point',
    Link: 'Link',
}

const ChatDataStatus = {
    Sending: 'Sending',
    Success: 'Success',
    Failed: 'Failed'
}

module.exports = {
    Collections,
    ChatDataType,
    ChatDataStatus
}