const express = require('express')
const google = require('googleapis').google
const youtube = google.youtube({ version: 'v3'})
const OAuth2 = google.auth.OAuth2
const state = require('./state.js')
const fs = require('fs')


async function robot() {
    const content = state.load()

    await authenticateWithOAuth()
    //await uploadVideo(content)
    //await uploadThumbnail(content)

    async function authenticateWithOAuth() {
        const webServer = await startWebServer()
        const OAuthClient = await createOAuthClient()
        requestUserConsent(OAuthClient)
        const authorizationToken = await waitForGoogleCallback(webServer)
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

        function requestUserConsent(OAuthClient) {
            const consentUrl = OAuthClient.generateAuthUrl({
                access_type: 'offline',
                scope: ['https://www.googleapis.com/auth/youtube']
            })

            console.log(`> [youtube-robot] Please give your consent: ${consentUrl}`)
        }
        

         async function waitForGoogleCallback(webServer) {
            return new Promise((resolve, reject) => {
                console.log('> [youtube-robot] Waiting for user consent...')

                webServer.app.get('/oauth2callback', (req, res) => {
                    const authCode = req.query.code
                    console.log(`> [youtube-robot] Consent given: ${authCode}`)

                res.send('<h1>Thank you!</h1><p>Now close this tab.</p>')
                resolve(authCode)
                })
            })
        }


        
    }

}

module.exports = robot