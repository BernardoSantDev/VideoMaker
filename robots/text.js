const axios = require("axios")
const sentenceBoundaryDetection = require("sbd")

async function robot(content) {
    await fetchFullWikipediaContent(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)

    async function fetchFullWikipediaContent(content) {
        try {
            const searchTermFormatted = content.searchTerm.replace(/ /g, "_")

            const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=true&titles=${searchTermFormatted}&format=json&origin=*`

            const response = await axios.get(url, {
                headers: {
                    "User-Agent": "VideoMakerBot/1.0 (contact@email.com)"
                }
            })

            const pages = response.data.query.pages
            const page = Object.values(pages)[0]

            if (!page.extract) {
                console.log("No content found.")
                return
            }

            const cleanText = page.extract

            const finalText = `${content.prefix} ${content.searchTerm}.\n\n${cleanText}`

            content.sourceContentOriginal = finalText

        } catch (error) {
            console.log("Error:", error.response?.status || error.message)
        }
    }

    function sanitizeContent(content) {
        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)
        
        content.sourceContentSanitized = withoutDatesInParentheses

        function removeBlankLinesAndMarkdown(text) {
            const allLines = text.split("\n")

            const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
                if (line.trim().length === 0 || line.trim().startsWith("=")) {
                    return false
                }
                return true
            })
            return withoutBlankLinesAndMarkdown.join(' ')
        }
    }

    function removeDatesInParentheses(text) {
        return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ')
    }

    function breakContentIntoSentences(content) {
        content.sentences = []

        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }
}


module.exports = robot