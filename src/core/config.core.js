require('dotenv').config()

const config = {
    appID: Number(process.env.APP_ID) || 770981051,
    serverSecret: process.env.SERVER_SECRT || '45254380bd8f626d49cea7518c10c37c',
    effectiveTimeInSeconds: 86400,
    zegoRTCUrlServer: 'https://rtc-api.zego.im',
    dbUrl: process.env.DB_URL || "mongodb://root:example@localhost:27017",
    dbName: process.env.DB_NAME || "cosmosapp",
    dbUsername: process.env.DB_USERNAME|| 'root',
    dbPass: process.env.DB_PASSWORD || 'example',
    port: Number(process.env.PORT),
    cosmosApiUrl: process.env.COSMOS_API
}

module.exports = config