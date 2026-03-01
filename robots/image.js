const axios = require('axios')
const state = require('./state.js')
const pexelsCredentials = require('../credentials/pexels.json')

async function robot() {
    const content = state.load()

    await fetchImagesOfAllSentences(content)

    state.save(content)

    async function fetchImagesOfAllSentences(content) {
        for (const sentence of content.sentences) {

            const keyword = sentence.keywords[0] || content.searchTerm
            const query = `${content.searchTerm} ${keyword}`

            sentence.images = await fetchImagesAndReturnImagesLinks(query)
            sentence.imageSearchQuery = query
        }
    }

    async function fetchImagesAndReturnImagesLinks(query) {
        const response = await axios.get('https://api.pexels.com/v1/search', {
            headers: {
                Authorization: pexelsCredentials.apiKey
            },
            params: {
                query: query,
                per_page: 2
            }
        })

        const imagesUrl = response.data.photos.map((photo) => {
            return photo.src.medium
        })

        return imagesUrl
    }
}

module.exports = robot