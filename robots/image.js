const axios = require('axios')
const state = require('./state.js')
const pexelsCredentials = require('../credentials/pexels.json')

async function robot() {
    const content = state.load()

    const response = await axios.get('https://api.pexels.com/v1/search', {
        headers: {
            Authorization: pexelsCredentials.apiKey
        },
        params: {
            query: 'Michael Jackson',
            per_page: 2
        }
    })

    console.dir(response.data, { depth: null })
    process.exit(0)
}

module.exports = robot