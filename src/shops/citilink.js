const puppeteer = require('puppeteer');
const {getTextContent, isNameInteresting, isPriceInteresting} = require('../utils')
const notify = require('../notifications')

/**
 * @param {string} rawPrice
 * @returns {number}
 */
function parseCLPrice(rawPrice) {
    return Number(rawPrice.replace(/\s/g, ''))
}

// ищу видеокарты с памятью GDDR6 стоимостью от 25к
const CL_URL = 'https://www.citilink.ru/catalog/videokarty/?f=available.all%2Cavailable.instore%2Cdiscount.any%2C308_29gddr6&price_min=25000';

/**
 * @param {puppeteer.Browser} browser
 * @returns {Promise<boolean>}
 */
module.exports = async function processCL(browser) {
    /**
     * @var {puppeteer.Page}
     */
    let page

    let isSomethingFound = false

    try {
        page = await browser.newPage();

        await page.goto(CL_URL, {
            waitUntil: 'networkidle2'
        });

        const items = await page.$$('.ProductGroupList .product_data__gtm-js')

        for (const item of items) {
            const nameEl = await item.$('.ProductCardHorizontal__title')
            const priceEl = await item.$('.ProductCardHorizontal__price_current-price')

            const name = await getTextContent(page, nameEl)

            if (!isNameInteresting(name)) {
                continue
            }

            const rawPrice = await getTextContent(page, priceEl)

            if (!rawPrice) {
                console.log(`~ Bad price '${rawPrice}' for item '${name}'`)
                continue
            }

            const price = parseCLPrice(rawPrice)

            if (!isPriceInteresting(price)) {
                continue
            }

            isSomethingFound = true
            notify(name, price, CL_URL)
        }
    } catch (e) {
        console.warn('⚠️\tCL error:', e)
    } finally {
        page?.close()
    }

    return isSomethingFound
}
