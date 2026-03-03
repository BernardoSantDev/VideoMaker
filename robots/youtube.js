const { auth } = require('googleapis/build/src/apis/youtube')
const state = require('./state.js')

async function robot() {
    const content = state.load()

    await authenticateWithOAuth()
    //await uploadVideo(content)
    //await uploadThumbnail(content)

    async function authenticateWithOAuth() {
        const webServer = await startWebServer()
        //await createOAuthClient()
        //await requestUserConsent()
        //await waitForGoogleCallback()
        //await requestGoogleForAccessTokens()
        //await setGlobalGoogleAuthentication()
        //await stopWebServer()
        
    }

}

module.exports = robot