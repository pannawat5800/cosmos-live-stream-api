const ChatGiftFirestoreDB = require('../../respository/chat-firestore.respository')
const CleanUpChatDataInFirebase = async () => {
    try {
        const chatGiftFirestoreDB = new ChatGiftFirestoreDB()
        await chatGiftFirestoreDB.deleteAll()
    } catch(error) {
        console.error('clean up chat data firebase error: ', error)
    }
}

module.exports = {
    CleanUpChatDataInFirebase
}