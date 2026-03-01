const axios = require('axios')
const state = require('./state.js')
const pexelsCredentials = require('../credentials/pexels.json')

async function robot() {
    const content = state.load()

    const imagesArray = await fetchImagesAndReturnImagesLinks("Michael Jackson")
    console.dir(imagesArray, { depth: null })
    process.exit(0)

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