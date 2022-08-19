const axios = require("axios")
const { cosmosApiUrl } = require('../core/config.core');
const { InternalError } = require("../core/response.core");
class CosmosApiRespository {

    constructor() {
        this.api = axios.create({
            baseURL: `${cosmosApiUrl}/api`,
            // timeout: 1000,
        });
    }

    async getCadidate(id) {
        const { data } = await this.api.get(`/candidate/show/${id}`)
        return data
    }
    
    async getGift(id) {
        const { data }= await this.api.get(`/gift/show/${id}`)
        return data
    }

    async getVoteParameter() {
        const { data } = await this.api.get('/voteParameter/getVoteParams')
        return data
    }

    async sentGiftHistory(params) {
       try {
           const { data } = await this.api.post('/sentGiftHistory/sendAndRecord', {
               "user_id": params.user_id,
               "candidate_id": params.candidate_id,
               "gift_id": params.gift_id,
               "send_date_time": new Date(),
               "token": params.token,
               "username": params.username,
               "email": params.email,
           })
           return data
       } catch(error) {
           throw error.response || error.message
       }
    }

    async updatePointCandidate(cadidateId, totalPoint) {
        try {
            const { data } = await this.api.patch(`/candidate/total_points/${cadidateId}`, {
                "total_points": totalPoint
            })
            return data
        } catch(error) {
            throw error.response || error.message
        }
    }


}

module.exports = new CosmosApiRespository