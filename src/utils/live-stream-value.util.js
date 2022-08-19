const crypto = require('crypto');

const generateStreamId = () => {
    return 'push_stream_' + Math.random(10).toString(16) + Date.now()
}

const generateRoomId = () => {
    return 'room_boardcast_' + Math.random(10).toString(16) + Date.now()
}

const generateUASignature = (appId, signatureNonce, serverSecret, timeStamp) => {
    const hash = crypto.createHash('md5'); //Use the MD5 hashing algorithm.
    const str = appId + signatureNonce + serverSecret + timeStamp;
    console.log(str)
    hash.update(str);
    //hash.digest('hex') indicates that the output is in hex format 
    return hash.digest('hex');
}

const generateSignatureNonce = () => crypto.randomBytes(8).toString('hex')


module.exports = {
    generateStreamId,
    generateRoomId,
    generateUASignature,
    generateSignatureNonce
}