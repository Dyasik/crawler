const puppeteer = require('puppeteer')

const {HEADLESS, BROWSER_PATH} = process.env

module.exports = async function getBrowser() {
    const options = {
        defaultViewport: {
            width: 1300,
            height: 900
        },
        headless: HEADLESS === 'true',
        executablePath: BROWSER_PATH,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    }

    if (HEADLESS) {
        options.headless = HEADLESS === 'true'
    }

    return puppeteer.launch(options)
}
