const axios = require('axios').default
const { zegoRTCUrlServer } = require('./config.core')

const zego_api = axios.create({
    baseURL: zegoRTCUrlServer,
})

module.exports = zego_api