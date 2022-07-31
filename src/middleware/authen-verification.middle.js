const admin = require('../core/firebase.core')
const logger = require('../core/logger.core')
const { UnAuthorized } = require('../core/response.core')

const authenVerification = async (request, response, next) => {
    try {
        const token = request.headers['auth_token']
        if (!token || token.trim() === '') {
           return response.status(401).json(new UnAuthorized('token is required'))
        }
        await admin.auth().verifyIdToken(token)
        next()
    } catch(error){
        logger.error('verify token is error: ')
        logger.error(error)
        response.status(401).json(new UnAuthorized('verified token is failed'))
    }
}

module.exports = {
    authenVerification
}