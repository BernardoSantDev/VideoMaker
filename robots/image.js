const fs = require('fs')
const path = require('path')
const imageDownloader = require('image-downloader')
const gm = require('gm').subClass({ imageMagick: true })
const axios = require('axios')
const state = require('./state.js')
const pexelsCredentials = require('../credentials/pexels.json')

async function robot() {
    const content = state.load()

    //await fetchImagesOfAllSentences(content)
    //await downloadAllImages(content)
    //await convertAllImages(content)
    await createAllSentenceImages(content)

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
                per_page: 10
            }
        })

        const imagesUrl = response.data.photos.map((photo) => {
            return photo.src.medium
        })

        return imagesUrl
    }

    async function downloadAllImages(content) {
        content.downloadedImages = []

        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            const images = content.sentences[sentenceIndex].images

            for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
                const imageUrl = images[imageIndex]

                try {
                    if (content.downloadedImages.includes(imageUrl)) {
                        throw new Error("Imagem já foi baixada anteriormente.")
                    }


                    await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`)
                    content.downloadedImages.push(imageUrl)
                    console.log(`> [${sentenceIndex}] [${imageIndex}]  Baixou imagem com sucesso: ${imageUrl}`)
                    break
                } 
                catch (error) {
                    console.log(`> [${sentenceIndex}] [${imageIndex}]  Erro ao baixar (${imageUrl}): ${error}`)
                }
            }
        }
    }

    async function downloadAndSave(url, fileName) {
        const folderPath = path.resolve(__dirname, '..', 'content')

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true })
        }

        return imageDownloader.image({
            url,
            dest: path.join(folderPath, fileName)
        })
    }

    async function convertAllImages(content) {
        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
        await convertImage(sentenceIndex)
        }
    }

    async function convertImage(sentenceIndex) {
    return new Promise((resolve, reject) => {
        const width = 1920
        const height = 1080

        const inputFile = path.resolve(__dirname, '..', 'content', `${sentenceIndex}-original.png`)
        const outputFile = path.resolve(__dirname, '..', 'content', `${sentenceIndex}-converted.png`)

        if (!fs.existsSync(inputFile)) {
            console.log(`> [video-robot] Pulando imagem inexistente: ${inputFile}`)
            return resolve()
        }

            gm()
                .in(inputFile)
                .out('(')
                    .out('-clone')
                    .out('0')
                    .out('-background', 'white')
                    .out('-blur', '0x9')
                    .out('-resize', `${width}x${height}^`)
                .out(')')
                .out('(')
                    .out('-clone')
                    .out('0')
                    .out('-background', 'white')
                    .out('-resize', `${width}x${height}`)
                .out(')')
                .out('-delete', '0')
                .out('-gravity', 'center')
                .out('-compose', 'over')
                .out('-composite')
                .out('-extent', `${width}x${height}`)
                .write(outputFile, (error) => {
                    if (error) {return reject(error)}

                    console.log(`> [video-robot] Image converted: ${outputFile}`)
                    resolve()
                })
        })
    }


    async function createAllSentenceImages(content) {
        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            await createSentenceImage(sentenceIndex, content.sentences[sentenceIndex].text)
        }
    }

    async function createSentenceImage(sentenceIndex, sentenceText) {
        return new Promise((resolve, reject) => {
            const outputFile = path.resolve(__dirname, '..', 'content', `${sentenceIndex}-sentence.png`)

            const templateSettings = {
                0: {
                    size: '1920x400',
                    gravity: 'center'
                },
                1: {
                    size: '1920x1080',
                    gravity: 'center'
                },
                2: {
                    size: '800x1080',
                    gravity: 'west'
                },
                3: {
                    size: '1920x400',
                    gravity: 'center'
                },
                4: {
                    size: '1920x1080',
                    gravity: 'center'
                },
                5: {
                    size: '800x1080',
                    gravity: 'west'
                },
                6: {
                    size: '1920x400',
                    gravity: 'center'
                }
            }

            gm()
                .out('-size', templateSettings[sentenceIndex].size)
                .out('-gravity', templateSettings[sentenceIndex].gravity)
                .out('-background', 'transparent')
                .out('-fill', 'white')
                .out('-kerning', '-1')
                .out(`caption:${sentenceText}`)
                .write(outputFile, (error) => {
                    if (error) {
                        return reject(error)
                    }

                    console.log(`> [video-robot] Sentence created: ${outputFile}`)
                    resolve()
                })
        })
    }

}

module.exports = robot