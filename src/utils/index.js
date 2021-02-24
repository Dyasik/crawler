const puppeteer = require('puppeteer');

const MODELS = [
    '2060',
    '2070',
    '3060',
    '3070',
    '6800',
]

/**
 * @param {string} name
 * @returns {boolean}
 */
function isNameInteresting(name) {
    for (const model of MODELS) {
        if (name.includes(model)) {
            return true
        }
    }

    return false
}

/**
 * @param {number} price
 * @returns {boolean}
 */
function isPriceInteresting(price) {
    return price <= (Number(process.env.MAX_PRICE) || 50_000)
}

/**
 * @param {puppeteer.Page} page
 * @param {puppeteer.ElementHandle} el
 * @returns {Promise<string>}
 */
async function getTextContent(page, el) {
    return page.evaluate(e => e.innerText, el)
}

const WAIT_TIME_MIN = Number(process.env.TIMEOUT_MIN)
const WAIT_TIME_MAX = Number(process.env.TIMEOUT_MAX)
const WAIT_TIME_DIFF = WAIT_TIME_MAX - WAIT_TIME_MIN

function getWaitingTime() {
    return Math.round(WAIT_TIME_MIN + Math.random() * WAIT_TIME_DIFF)
}

/**
 * @param {Date} [date]
 * @returns {string}
 */
function getTimestamp(date = new Date()) {
    const [, m, d, , t] = date.toString().split(' ')

    return `[${m} ${d} ${t}]`
}

module.exports = {
    isNameInteresting,
    isPriceInteresting,
    getTextContent,
    getWaitingTime,
    getTimestamp,
    getBrowser: require('./getBrowser'),
    debug: require('./logger'),
}
