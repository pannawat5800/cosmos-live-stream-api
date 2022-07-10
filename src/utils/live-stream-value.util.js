const generateStreamId = () => {
    return 'push_stream_' + Math.random(10).toString(16) + Date.now()
}

const generateRoomId = () => {
    return 'room_boardcast_' + Math.random(10).toString(16) + Date.now()
}

module.exports = {
    generateStreamId,
    generateRoomId
}