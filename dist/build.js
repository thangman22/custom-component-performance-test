const fs = require('fs')
const signale = require('signale')
const compression = require('compression')
// const nameSpaces = ['lit-element', 'stenciljs', 'vanilla', 'vanilla-shadow-dom', 'vuejs']
const nameSpaces = ['vanilla-shadow-dom']
const log_file = fs.createWriteStream(__dirname + '/debug.log', { flags: 'a+' })
const puppeteer = require('puppeteer')

const express = require("express")
const app = express()
const path = require("path")

const jsAssests = {
    'lit-element': [{ path:'./lit-element/github-profile-badge.js', module: true }],
    'stenciljs': [{ path:'./stenciljs/github-profile-badge.js', module: false }],
    'vanilla': [{ path:'./vanilla/github-profile-badge.js', module: false }],
    'vanilla-shadow-dom': [{ path:'./vanilla-shadow-dom/github-profile-badge.js', module: false }],
    'vuejs': [{ path: './vuejs/vue.js', module: false }, { path: './vuejs/github-profile-badge.js', module: false }]
}

const jsPlaceHolder = '<!-- SCRIPT here -->'

const htmlPlaceHolder = '<!-- STYLE here -->'

const cssAssests = {
    'lit-element': ['./lit-element/main.css'],
    'stenciljs': ['./stenciljs/main.css'],
    'vanilla': ['./vanilla/main.css'],
    'vanilla-shadow-dom': ['./vanilla-shadow-dom/main.css'],
    'vuejs': ['./vuejs/main.css']
}

function getTemplateFile () {
    return getFileContent('./index.src.html')
}

function getFileContent(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, function read(err, data) {
            if (err) {
                reject(err)
            }
            resolve(data.toString())
        })
    })
}

function getCssTemplate (nameSpace) {
    return Promise.all(cssAssests[nameSpace].map(async asset => {
        return cssContent = await getFileContent(asset)
    }))
}

function getJsTemplate(nameSpace) {
    return new Promise((resolve, _) => {
        resolve(jsAssests[nameSpace].map(asset => `<script ${asset.module ? 'type="module"' : ''} src="${asset.path}"></script>`))
    })
}

function mergeTemplate (html, css, js) {
    return html.replace(jsPlaceHolder, js.join('\n')).replace(htmlPlaceHolder, `<style>${css.join('\n')}</style>`)
}

function genarateTemplate(nameSpace) {
    return new Promise(async (resolve, reject) => {
    let htmlTemplate = await getTemplateFile()
    let cssTemplate = await getCssTemplate(nameSpace)
    let jsTemplate = await getJsTemplate(nameSpace)
    let completeTemplate = await mergeTemplate(htmlTemplate, cssTemplate, jsTemplate)
        fs.writeFile("index.html", completeTemplate, function (err) {
            if (err) {
                reject(err)
            }

            resolve(true)
        }); 
    })
}



(async () => {
    
    app.get('/', function (_, res) {
        res.sendFile(path.join(__dirname + '/index.html'))
    })

    app.get('/build', async function (req, res) {
        await genarateTemplate(req.query.nameSpace)
        res.sendFile(path.join(__dirname + '/index.html'))
    })
    app.use(compression())
    app.use(express.static('./'))
    app.listen(3001)
    if(process.argv[2] === 'test'){
        let result = {}
        for (nameSpace of nameSpaces) {
            result[nameSpace] = []
            signale.debug(`Start testing for ${nameSpace} ...`)
            signale.complete(`Genrated Template ${nameSpace}`)
            await genarateTemplate(nameSpace)
            signale.watch(`Serving file for ${nameSpace} ...`)

            for (i = 1; i <= 2000; i++) {
                let performanceObject = {
                    firstCreateComponent: 0.0,
                    UpdateComponent: 0.0,
                    firstPaint: 0.0,
                    firstContentfulPaint: 0.0,
                    domContentLoad: 0.0,
                    domContentComplete: 0.0,
                    lib: nameSpace
                }
                let browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
                let page = await browser.newPage()
                let firstCreate = true
                page.on('console', msg => {
                    let consoleText = msg.text()
                    if (consoleText.indexOf('Create Component') !== -1 || consoleText.indexOf('Update Component') !== -1) {
                        if (firstCreate) {
                            performanceObject.firstCreateComponent = parseFloat(consoleText.replace('Create Component ', ''))
                            signale.debug('First create time ' + consoleText.replace('Create Component ', '') + ' ms')
                            firstCreate = false
                        } else {
                            performanceObject.UpdateComponent = parseFloat(consoleText.replace('Create Component ', '').replace('Update Component ', ''))
                            signale.debug('Update time ' + consoleText.replace('Create Component ', '').replace('Update Component ', '') + ' ms')
                        }
                    }

                    if (consoleText.indexOf('first-paint ') !== -1) {
                        performanceObject.firstPaint = parseFloat(consoleText.replace('first-paint ', ''))
                        signale.debug('First paint ' + consoleText.replace('first-paint ', '') + ' ms')
                    }

                    if (consoleText.indexOf('first-contentful-paint ') !== -1) {
                        performanceObject.firstContentfulPaint = parseFloat(consoleText.replace('first-contentful-paint ', ''))
                        signale.debug('First Contentful paint ' + consoleText.replace('first-contentful-paint ', '') + ' ms')
                    }

                    if (consoleText.indexOf('dcl ') !== -1) {
                        performanceObject.domContentLoad = parseFloat(consoleText.replace('dcl ', ''))
                        signale.debug('Dom Content load ' + consoleText.replace('dcl ', '') + ' ms')
                    }

                    if (consoleText.indexOf('dom load completed ') !== -1) {
                        performanceObject.domContentComplete = parseFloat(consoleText.replace('dom load completed ', ''))
                        signale.debug('Dom Content load completed ' + consoleText.replace('dom load completed ', '') + ' ms')
                    }
                })

                signale.complete('Open URL http://localhost:3000/')
                await page.goto('http://localhost:3000/')
                signale.pending(`Waiting ${nameSpace} component update... 15s`)
                await page.waitFor(15000)
                await browser.close()
                result[nameSpace].push(performanceObject)
                signale.complete(`Prformance Information for ${nameSpace} ${JSON.stringify(performanceObject)}`)
                log_file.write(JSON.stringify(performanceObject) + '\n')
                signale.success('Close browser')
            }
        }
    }
 
})()



