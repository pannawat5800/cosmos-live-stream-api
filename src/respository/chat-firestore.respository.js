const admin = require('../core/firebase.core')
class ChatGiftFirestoreDB  {
    constructor() {
        this.collection = admin.firestore().collection('chats-grift') 
    }

    async create(data) {
        const result = await this.collection.add({ ...data, createAt: new Date()})
        return result
    }

    async deleteAll() {
        const result = await this.collection.deleteAll()
        return result
    }
}

module.exports = ChatGiftFirestoreDB