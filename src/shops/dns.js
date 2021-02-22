const puppeteer = require('puppeteer');
const {getTextContent, isNameInteresting, isPriceInteresting} = require('../utils')
const notify = require('../notifications')

/**
 * @param {string} rawPrice
 * @returns {number}
 */
function parseDnsPrice(rawPrice) {
    return Number(rawPrice.replace(/[\s₽]/g, ''))
}

// ищу видеокарты для игровых ПК с памятью GDDR6 стоимостью от 25к
const DNS_URL = 'https://www.dns-shop.ru/catalog/17a89aab16404e77/videokarty/?price=25000-199999&f[p36]=b2oy&f[mz]=el42z';

/**
 * @param {puppeteer.Browser} browser
 * @returns {Promise<boolean>}
 */
module.exports = async function processDns(browser) {
    /**
     * @var {puppeteer.Page}
     */
    let page

    let isSomethingFound = false

    try {
        page = await browser.newPage();

        await page.goto(DNS_URL, {
            waitUntil: 'networkidle2'
        });

        const items = await page.$$('.catalog-product')

        for (const item of items) {
            const nameEl = await item.$('.catalog-product__name')
            const priceEl = await item.$('.product-buy__price')

            const name = await getTextContent(page, nameEl)

            if (!isNameInteresting(name)) {
                continue
            }

            const rawPrice = await getTextContent(page, priceEl)

            if (!rawPrice) {
                console.log(`~ Bad price '${rawPrice}' for item '${name}'`)
                continue
            }

            const price = parseDnsPrice(rawPrice)

            if (!isPriceInteresting(price)) {
                continue
            }

            isSomethingFound = true
            notify(name, price, DNS_URL)
        }
    } catch (e) {
        console.warn('⚠️\tDNS error:', e)
    } finally {
        page?.close()
    }

    return isSomethingFound
}
