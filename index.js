// injects env vars from `.env` file to `process.env` object
// IF not run at Heroku (that is, only for local runs)
if (!process.env.HEROKU) {
    require('dotenv').config()
}

const puppeteer = require('puppeteer')
const {wait, getTimestamp} = require('./src/utils')
const shops = require('./src/shops')

let browser

async function main() {
    console.log(`\n${getTimestamp()} CHECK STARTED\n`)

    browser = await puppeteer.launch({
        defaultViewport: {
            width: 1300,
            height: 900
        },
        // headless: false,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });

    for (const shopName of Object.getOwnPropertyNames(shops)) {
        console.log(`Checking ${shopName}...`)

        const checkShop = shops[shopName]
        const isAnythingFound = await checkShop(browser)

        if (!isAnythingFound) {
            console.log(`ℹ️\tNothing found at ${shopName}`)
        }
    }

    await browser.close()
    browser = null
}

async function mainLoop() {
    try {
        await main()
    } catch (e) {
        console.warn('❌\tError in main loop:', e)
    }

    await wait()

    return mainLoop()
}

async function stop() {
    console.log('')
    console.log('ℹ️\tStopping...')

    if (browser) {
        // Use temporary swap variable to avoid any race condition
        const browserTemporary = browser
        browser = null
        await browserTemporary?.close()
    }

    console.log('✅\tStopped!')
}

async function stopAndExit() {
    await stop()
    process.exit(0)
}

mainLoop()
    .catch(err => console.warn('❌\tError in the main loop, terminating:', err))

process.on('SIGINT', stopAndExit)
process.on('SIGQUIT', stopAndExit)
process.on('SIGTERM', stopAndExit)
