const axios = require("axios")

async function robot(content) {
    await fetchFullWikipediaContent(content)

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

            // 🔥 AQUI ESTÁ A MÁGICA
            content.sourceContentOriginal = finalText

        } catch (error) {
            console.log("Error:", error.response?.status || error.message)
        }
    }

    return content
}

module.exports = robot