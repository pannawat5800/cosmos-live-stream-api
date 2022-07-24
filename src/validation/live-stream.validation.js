const Joi = require('joi')
const SendChatMessageSchema = Joi.object({
    roomId: Joi.string().required().error(new Error('room id is required and must be string')),
    message: Joi.string().required().error(new Error('message is required and must be string')),
    user: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        image: Joi.string().allow(null, '')
    })
})

const SendGiftSchema = Joi.object({
    roomId: Joi.string().required().error(new Error('room id is required and must be string')),
    giftId: Joi.string().required().error(new Error('gift id is required and must be string')),
    toMember: Joi.string().required().error(new Error('to member is required and must be string')),
    user: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        image: Joi.string().allow(null, '')
    })
})

const SendPointSchema = Joi.object({
    roomId: Joi.string().required().error(new Error('room id is required and must be string')),
    token: Joi.number().required().error(new Error('number is required and must be number')),
    toMember: Joi.string().required().error(new Error('to member is required and must be string')),
    user: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        image: Joi.string().allow(null, '')
    })
})

module.exports = {
    SendChatMessageSchema,
    SendGiftSchema,
    SendPointSchema
}