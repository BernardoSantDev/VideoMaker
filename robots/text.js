const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey

function robot(content) {
    fetchContentFromWikipedia(content)
    //sanitizeContent(content)
    //beakContentIntoSentences(content)

    async function fetchContentFromWikipedia(content) {
    console.log(`> [text-robot] Buscando conteúdo para: ${content.searchTerm}`);
    
    const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2');

    try {
        // Log antes da chamada para confirmar que o código chegou aqui
        console.log('> [text-robot] Chamando API da Algorithmia...');
        
        const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm);
        const wikipediaContent = wikipediaResponse.get();

        // Verifique a estrutura do que foi retornado
        console.log('> [text-robot] Resposta recebida com sucesso!');
        
        content.sourceContentOriginal = wikipediaContent.content;
    } catch (error) {
        // Isso vai te mostrar exatamente por que a implementação falhou
        console.error('> [text-robot] Erro na implementação:', error.message);
        throw error; 
    }
}
}

module.exports = robot