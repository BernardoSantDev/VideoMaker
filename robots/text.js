const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey

function robot(content) {
    fetchContentFromWikipedia(content)
    //sanitizeContent(content)
    //beakContentIntoSentences(content)

    console.log('Logando se a função fetchContentFromWikipedia retornou algo: ', console.log(fetchContentFromWikipedia()))

    async function fetchContentFromWikipedia(content) {
        return 'RESULTADO DA PROMISE'
        const algorithmiaAuthenticatad = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticatad.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponse.get()
        console.log(wikipediaContent)
    }
}

module.exports = robot