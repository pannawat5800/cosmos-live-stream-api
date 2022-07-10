const Joi = require('joi')
const SendChatMessageSchema = Joi.object({
    roomId: Joi.string().required().error(new Error('room id is required and must be string')),
    userId: Joi.string().required().error(new Error('user id is required and must be string')),
    message: Joi.string().required().error(new Error('message is required and must be string')),
    name: Joi.string().required().error(new Error('name is required and must be string')),
})

const SendGiftSchema = Joi.object({
    roomId: Joi.string().required().error(new Error('room id is required and must be string')),
    userId: Joi.string().required().error(new Error('user id is required and must be string')),
    giftId: Joi.string().required().error(new Error('message is required and must be string')),
    name: Joi.string().required().error(new Error('name is required and must be string')),
    toMember: Joi.string().required().error(new Error('to member is required and must be string')),
})

module.exports = {
    SendChatMessageSchema,
    SendGiftSchema
}