const axios = require("axios")
const { cosmosApiUrl } = require('../core/config.core')
class CosmosApiRespository {

    constructor() {
        this.api = axios.create({
            baseURL: `${cosmosApiUrl}/api`,
            timeout: 1000,
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

}

module.exports = new CosmosApiRespository