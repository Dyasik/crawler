const puppeteer = require('puppeteer');
const {getTextContent, isNameInteresting, isPriceInteresting} = require('../utils')
const notify = require('../notifications')

module.exports = class ShopProcessor {
    /** @const */
    name = 'BaseShopProcessor'
    /** @private */
    url = 'example.com'
    /** @private */
    itemCardSelector = ''
    /** @private */
    itemNameSelector = ''
    /** @private */
    itemPriceSelector = ''

    // When we cannot navigate to a shop page, we suggest being blocked by its firewall.
    // In this case, we try to skip checking this shop for 1 or more subsequent checks.
    /** @private */
    skipTimesInitial = 0
    /** @private */
    skipTimesLeft = 0

    constructor(name, url, itemCardSelector, itemNameSelector, itemPriceSelector, parsePrice) {
        this.name = name
        this.url = url
        this.itemCardSelector = itemCardSelector
        this.itemNameSelector = itemNameSelector
        this.itemPriceSelector = itemPriceSelector

        if (parsePrice) {
            this.parsePrice = parsePrice
        }
    }

    /**
     * @private
     * @param {string} rawPrice
     * @returns {number}
     */
    parsePrice(rawPrice) {
        return Number(rawPrice.replace(/[\s₽]/g, ''))
    }

    /**
     * @param {puppeteer.Browser} browser
     * @returns {Promise<boolean>} isSomethingFound
     */
    async run(browser) {
        if (this.skipTimesLeft) {
            this.skipTimesLeft--

            console.log(`ℹ️\t Skipping shop (${this.skipTimesLeft} skips will follow)`)

            return false
        }

        /**
         * @var {puppeteer.Page}
         */
        let page

        let isSomethingFound = false

        try {
            page = await browser.newPage();

            await page.goto(this.url, {
                waitUntil: ['domcontentloaded', 'networkidle2'],
                timeout: 1000 * 60, // waiting not more than 1 min for the page to load
            });

            const items = await page.$$(this.itemCardSelector)

            for (const item of items) {
                const nameEl = await item.$(this.itemNameSelector)
                const priceEl = await item.$(this.itemPriceSelector)

                const name = await getTextContent(page, nameEl)

                if (!isNameInteresting(name)) {
                    continue
                }

                const rawPrice = await getTextContent(page, priceEl)

                if (!rawPrice) {
                    console.log(`~ Bad price '${rawPrice}' for item '${name}'`)
                    continue
                }

                const price = this.parsePrice(rawPrice)

                if (!isPriceInteresting(price)) {
                    continue
                }

                isSomethingFound = true
                notify(name, price, this.url)
            }

            this.skipTimesInitial = 0
        } catch (e) {
            this.skipTimesInitial++
            this.skipTimesLeft = this.skipTimesInitial

            console.warn(`⚠️\t${this.name} error:`, e)
        } finally {
            page?.close()
        }

        return isSomethingFound
    }
}
