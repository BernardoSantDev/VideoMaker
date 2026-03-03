const { auth } = require('googleapis/build/src/apis/youtube')
const state = require('./state.js')
const express = require('express')
const google = require('googleapis').google
const OAuth2 = google.auth.OAuth2

async function robot() {
    const content = state.load()

    await authenticateWithOAuth()
    //await uploadVideo(content)
    //await uploadThumbnail(content)

    async function authenticateWithOAuth() {
        const webServer = await startWebServer()
        const OAuthClient = await createOAuthClient()
        //await requestUserConsent()
        //await waitForGoogleCallback()
        //await requestGoogleForAccessTokens()
        //await setGlobalGoogleAuthentication()
        //await stopWebServer()

        async function startWebServer() {
            return new Promise((resolve, reject) => {
                const port = 5000
                const app = express()

                const server = app.listen(port, () => {
                    console.log(`> [youtube-robot] Listening on http://localhost:${port}`)

                    resolve({
                        app,
                        server
                    })
                })
            })
        }

        async function createOAuthClient() {
            const credentials = require('../credentials/google-youtube.json')

            const OAuthClient = new OAuth2(
                credentials.web.client_id,
                credentials.web.client_secret,
                credentials.web.redirect_uris[0]
            )

            return OAuthClient
        }

        
        
    }

}

module.exports = robot