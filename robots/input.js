const readline = require('readline-sync')
const state = require('./state.js')

function robot() {
    const content = {}

    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()
    content.maximumSentences = askAndReturnMaximumSentences()
    state.save(content)

    function askAndReturnSearchTerm() {
        return readline.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
        const selectedPrefixText = prefixes[selectedPrefixIndex]
            
        return selectedPrefixText
    }

    function askAndReturnMaximumSentences() {
        return readline.questionInt('Quantas frases você deseja no vídeo?')
    }
}

module.exports = robot