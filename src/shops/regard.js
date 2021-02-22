const puppeteer = require('puppeteer');
const {getTextContent, isNameInteresting, isPriceInteresting} = require('../utils')
const notify = require('../notifications')

/**
 * @param {string} rawPrice
 * @returns {number}
 */
function parseRegardPrice(rawPrice) {
    return Number(rawPrice.replace(/\s/g, ''))
}

// ищу по запросу 'geforce rtx' в разделе 'Видеокарты'
const REGARD_URL = 'https://www.regard.ru/catalog/?query=geforce+rtx&group=4000';

/**
 * @param {puppeteer.Browser} browser
 * @returns {Promise<boolean>}
 */
module.exports = async function processRegard(browser) {
    /**
     * @var {puppeteer.Page}
     */
    let page

    let isSomethingFound = false

    try {
        page = await browser.newPage();

        await page.goto(REGARD_URL, {
            waitUntil: 'networkidle2'
        });

        const items = await page.$$('#hits .block')

        for (const item of items) {
            const nameEl = await item.$('a.header')
            const priceEl = await item.$('div.price span:last-of-type')

            const name = await getTextContent(page, nameEl)

            if (!isNameInteresting(name)) {
                continue
            }

            const rawPrice = await getTextContent(page, priceEl)

            if (!rawPrice) {
                console.log(`~ Bad price '${rawPrice}' for item '${name}'`)
                continue
            }

            const price = parseRegardPrice(rawPrice)

            if (!isPriceInteresting(price)) {
                continue
            }

            isSomethingFound = true
            notify(name, price, REGARD_URL)
        }
    } catch (e) {
        console.warn('⚠️\tRegard error:', e)
    } finally {
        page?.close()
    }

    return isSomethingFound
}
