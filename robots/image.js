const axios = require('axios')
const state = require('./state.js')
const pexelsCredentials = require('../credentials/pexels.json')

async function robot() {
    const content = state.load()

    //await fetchImagesOfAllSentences(content)
    await downloadAllImages(content)

    //state.save(content)

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

    async function downloadAllImages(content) {
        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            const images = content.sentences[sentenceIndex].images

            for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
                const imageUrl = images[imageIndex]

                try {
                    //await downloadImage()
                    console.log(`> Baixou imagem com sucesso: ${imageUrl}`)
                    break
                } 
                catch (error) {
                    console.log(`> Erro ao baixar (${imageUrl}): ${error}`)
                }
            }
        }
    }
}

module.exports = robot