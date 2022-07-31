const axios = require('axios')
const config = require('../core/config.core')

class CosmosVoteApiRespository {
    constructor() {
        this.api = axios.create({
            baseURL: `${config.cosmosVoteApiUrl}/clientapi`,
            headers: {
                'Content-Type': 'application/json',
                key: config.accessKeyVoteApi
            },
            // timeout: 1000,
        });
    }

    async getUserBalance(accesstoken) {
        const { data } = await this.api.get('/userBalance', { headers: { 'x-access-token': accesstoken } })
        return data.balance || 0
    }

    async sendPointVote(params) {
        try {
            const { data } = await this.api.post('/UpdateVoteLog', {
                "userid": params.userid,
                "username": params.username,
                "email": params.email,
                "token": params.token,
                "point": params.point,
                "candidate": params.candidate
            })
            return data
        } catch(error) {
            throw error.response.data || error.message
        }
    }

}

module.exports = new CosmosVoteApiRespository()