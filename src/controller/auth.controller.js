const { generateZegoEngineTokenForUser, generateZegoEngineTokenForUndefindUser, generateZegoEngineTokenForAdmin, generateFirebaseToken } = require('../services/auth.service')
const catchAsync = require('../utils/catchAsync')


const SignInAdmin = catchAsync(async (request, response) => {
    const { userId, roomId } =  request.body
    const token = await generateZegoEngineTokenForAdmin(userId, roomId)
    response.json({ token })
})

const SignInUser = catchAsync(async (request, response) => {
    const { userId, roomId } = request.body
    const token = await generateZegoEngineTokenForUser(userId, roomId)
    response.json({ token })
})

const SignInAnonymous = catchAsync(async (request, response) => {
    const { userId, roomId } = request.body
    const token = await generateZegoEngineTokenForUndefindUser(userId, roomId)
    response.json({ token })
})

const SignInCustomToken = catchAsync(async (request, response) => {
    const { userId, isanonymouse } = request.body
    const token = await generateFirebaseToken(userId)
    response.json({ token })
})
module.exports = {
    SignInAdmin,
    SignInUser,
    SignInAnonymous,
    SignInCustomToken
}
