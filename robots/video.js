const fs = require('fs')
const path = require('path')
const imageDownloader = require('image-downloader')
const gm = require('gm').subClass({ imageMagick: true })
const axios = require('axios')
const state = require('./state.js')
const pexelsCredentials = require('../credentials/pexels.json')
const { exec } = require('child_process')


async function robot() {
    const content = state.load()

    await convertAllImages(content)
    await createAllSentenceImages(content)
    await createYouTubeThumbnail(content)
    await renderVideo(content)

    state.save(content)

    async function convertAllImages(content) {
        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
        await convertImage(sentenceIndex)
        }
    }

    async function convertImage(sentenceIndex) {
        return new Promise((resolve, reject) => {
            const width = 1920
            const height = 1080

            const inputFile = path.resolve(__dirname, '..', 'content', `${sentenceIndex}-original.png`)
            const outputFile = path.resolve(__dirname, '..', 'content', `${sentenceIndex}-converted.png`)

            if (!fs.existsSync(inputFile)) {
                console.log(`> [video-robot] Pulando imagem inexistente: ${inputFile}`)
                return resolve()
            }

                gm()
                    .in(inputFile)
                    .out('(')
                        .out('-clone')
                        .out('0')
                        .out('-background', 'white')
                        .out('-blur', '0x9')
                        .out('-resize', `${width}x${height}^`)
                    .out(')')
                    .out('(')
                        .out('-clone')
                        .out('0')
                        .out('-background', 'white')
                        .out('-resize', `${width}x${height}`)
                    .out(')')
                    .out('-delete', '0')
                    .out('-gravity', 'center')
                    .out('-compose', 'over')
                    .out('-composite')
                    .out('-extent', `${width}x${height}`)
                    .write(outputFile, (error) => {
                        if (error) {return reject(error)}

                        console.log(`> [video-robot] Image converted: ${outputFile}`)
                        resolve()
                    })
        })
    }


    async function createAllSentenceImages(content) {
        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            await createSentenceImage(sentenceIndex, content.sentences[sentenceIndex].text)
        }
    }

    async function createSentenceImage(sentenceIndex, sentenceText) {
        return new Promise((resolve, reject) => {
            const outputFile = path.resolve(__dirname, '..', 'content', `${sentenceIndex}-sentence.png`)

            const templateSettings = {
                0: {
                    size: '1920x400',
                    gravity: 'center'
                },
                1: {
                    size: '1920x1080',
                    gravity: 'center'
                },
                2: {
                    size: '800x1080',
                    gravity: 'west'
                },
                3: {
                    size: '1920x400',
                    gravity: 'center'
                },
                4: {
                    size: '1920x1080',
                    gravity: 'center'
                },
                5: {
                    size: '800x1080',
                    gravity: 'west'
                },
                6: {
                    size: '1920x400',
                    gravity: 'center'
                }
            }

            gm()
                .out('-size', templateSettings[sentenceIndex].size)
                .out('-gravity', templateSettings[sentenceIndex].gravity)
                .out('-background', 'transparent')
                .out('-fill', 'white')
                .out('-kerning', '-1')
                .out(`caption:${sentenceText}`)
                .write(outputFile, (error) => {
                    if (error) {
                        return reject(error)
                    }

                    console.log(`> [video-robot] Sentence created: ${outputFile}`)
                    resolve()
                })
        })
    }

    async function createYouTubeThumbnail() {
        return new Promise((resolve, reject) => {
            const inputFile = path.resolve(__dirname, '..', 'content', '0-converted.png')
            const outputFile = path.resolve(__dirname, '..', 'content', 'youtube-thumbnail.jpg')

            gm(inputFile)
                .write(outputFile, (error) => {
                    if (error) {
                    return reject(error)
                    }

                    console.log('> [video-robot] YouTube thumbnail created')
                    resolve()
                })
        })
    }

    async function renderVideo(content) {
        return new Promise((resolve, reject) => {
            const path = require('path')
            const fs = require('fs')
            const { exec } = require('child_process')

            const rootPath = path.resolve(__dirname, '..')
            const contentPath = path.join(rootPath, 'content')
            const outputPath = path.join(contentPath, 'output.mp4')
            const musicPath = path.join(contentPath, 'music.mp3')

            if (!fs.existsSync(musicPath)) {
                return reject("Coloque music.mp3 dentro da pasta content/")
            }

            const totalScenes = content.sentences.length
            const sceneDuration = 7
            const transitionDuration = 0.8

            let inputs = ''
            let filterComplex = ''

            for (let i = 0; i < totalScenes; i++) {
                const imagePath = path.join(contentPath, `${i}-converted.png`)
                const textPath = path.join(contentPath, `${i}-sentence.png`)

                inputs += ` -loop 1 -t ${sceneDuration} -i "${imagePath}"`
                inputs += ` -loop 1 -t ${sceneDuration} -i "${textPath}"`

                const imgIndex = i * 2
                const txtIndex = i * 2 + 1

                // 1. Divide a imagem em duas cópias
                filterComplex += `
                [${imgIndex}:v]
                scale=1920:1080,
                format=rgba,
                split=2[base${i}_normal][base${i}_blur];
                `

                // 2. Aplicamos o blur e brilho apenas na cópia "_blur"
                filterComplex += `
                [base${i}_blur]
                boxblur=10:5,
                eq=brightness=-0.55,
                vignette=PI/6
                [dark${i}];
                `

                // 3. Juntamos a cópia "_normal" com a "dark" aos 2 segundos
                filterComplex += `
                [base${i}_normal][dark${i}]
                overlay=enable='gte(t,2)'
                [bg${i}];
                `

                // 4. Texto com fade
                // Fade-in começa aos 2s. 
                // Fade-out começa aos 6.5s (para terminar suavemente no segundo 7)
                filterComplex += `
                [${txtIndex}:v]
                format=rgba,
                fade=t=in:st=2:d=0.5:alpha=1,
                fade=t=out:st=6.5:d=0.5:alpha=1
                [text${i}];
                `

                // 5. Overlay do texto em cima do fundo da cena
                // O texto fica visível do segundo 2 até o segundo 7
                filterComplex += `
                [bg${i}][text${i}]
                overlay=(W-w)/2:(H-h)/2:enable='between(t,2,7)'
                [scene${i}];
                `
            }

            let lastOutput = `[scene0]`

            for (let i = 1; i < totalScenes; i++) {
                const offset = (sceneDuration - transitionDuration) * i

                filterComplex += `${lastOutput}[scene${i}]xfade=transition=fade:duration=${transitionDuration}:offset=${offset}[xf${i}];`

                lastOutput = `[xf${i}]`
            }

            filterComplex = filterComplex.replace(/\s+/g, ' ')

            const finalVideoStream = totalScenes > 1
                ? `[xf${totalScenes - 1}]`
                : `[scene0]`

            const command =
                `ffmpeg -y ${inputs} -i "${musicPath}" ` +
                `-filter_complex "${filterComplex} ${finalVideoStream}format=yuv420p[video]" ` +
                `-map "[video]" -map ${totalScenes * 2}:a ` +
                `-c:v libx264 -c:a aac -shortest "${outputPath}"`

            console.log("🎬 Renderizando vídeo...")

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log("STDERR:", stderr)
                    return reject(error)
                }
                resolve()
            })
        })
    }

}

module.exports = robot
