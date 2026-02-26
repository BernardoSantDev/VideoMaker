const algorithmia = require('algorithmia')

function robot(content) {
    fetchContentFromWikipedia(content)
    //sanitizeContent(content)
    //beakContentIntoSentences(content)

    function fetchContentFromWikipedia(content) {
        const algorithmiaAuthenticatad = algorithmia('API KEY TEMPORARIA')
        const wikipediaAlgorithm = algorithmiaAuthenticatad.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponse.get()
        console.log(wikipediaContent)
    }
}

module.exports = robot