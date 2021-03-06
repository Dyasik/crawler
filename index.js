// injects env vars from `.env` file to `process.env` object
// IF not run at Heroku (that is, only for local runs)
if (!process.env.HEROKU) {
    require('dotenv').config()
}

const {getWaitingTime, getTimestamp, getBrowser} = require('./src/utils')
const shops = require('./src/shops')

let browser
let loopTimeout

let checksCount = 0
let findsCount = 0

async function main() {
    console.log(`\n${getTimestamp()} CHECK STARTED\n`)

    browser = await getBrowser()

    for (const shop of shops) {
        const {name} = shop

        console.log(`Checking ${name}...`)

        const isAnythingFound = await shop.run(browser)

        if (isAnythingFound) {
            findsCount++
        } else {
            console.log(`ℹ️\tNothing found at ${name}`)
        }
    }

    await browser.close()
    browser = null

    checksCount++

    console.log(`\n📈\tGot ${findsCount} finds in ${checksCount} check cycles\n`)
}

async function mainLoop() {
    try {
        await main()
        console.log(`${getTimestamp()} CHECK FINISHED`)
    } catch (e) {
        console.warn('❌\tError in main loop:', e)
    } finally {
        const waitingTime = getWaitingTime()
        const waitResultDate = new Date(Date.now() + waitingTime)
        const waitMinutes = Math.round(waitingTime / 1000 / 60)

        console.log(`Next check @ ${getTimestamp(waitResultDate)} (in ~${waitMinutes} mins)`)

        loopTimeout = setTimeout(mainLoop, waitingTime)
    }
}

async function stop() {
    console.log('\nℹ️\tStopping...')

    if (browser) {
        // Use temporary swap variable to avoid any race condition
        const browserTemporary = browser
        browser = null
        await browserTemporary?.close()
    }

    clearTimeout(loopTimeout)

    console.log('✅\tStopped!')
}

async function stopAndExit() {
    await stop()
    process.exit(0)
}

mainLoop()
    .catch(err => {
        console.warn('❌\tError in the first main loop, terminating:', err)
        process.exit(0)
    })

process.on('SIGINT', stopAndExit)
process.on('SIGQUIT', stopAndExit)
process.on('SIGTERM', stopAndExit)
