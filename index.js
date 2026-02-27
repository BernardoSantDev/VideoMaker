const readline = require('readline-sync')
const robots = {
    userInput: require('./robots/userInput.js'),
    text: require('./robots/text.js')
}

async function start() {
    const content = {
        maximumSentences: 7
    }

    robots.userInput(content)
    await robots.text(content)

    console.log(content)
}
start();