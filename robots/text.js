function robot(content) {
    fetchContentFromWikipedia(content)
    sanitizeContent(content)
    beakContentIntoSentences(content)
}

module.exports = robot