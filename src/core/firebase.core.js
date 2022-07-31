const admin = require('firebase-admin');
const serviceAccount = require('../assets/cosmos-9370a-firebase-adminsdk-dtnox-8f8bd0ab1e.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

module.exports = admin