const notifyDesktop = require('./desktopNotifier')
const sendEmail = require('./mailer')

/**
 * @param {string} name
 * @param {number} price
 * @param {string} link
 */
module.exports = function notify(name, price, link) {
    console.log(`~~~~~~~~~~\n!!! FOUND ${name.substr(0, 15)} FOR ${price} @ ${link}\n~~~~~~~~~~`)

    console.log('ℹ️\tNotifying...')

    try {
        notifyDesktop(name, price, link)
        console.log('✅\tNotified desktop')
    } catch (e) {
        console.warn('⚠️\tFailed to notify desktop')
    }

    try {
        sendEmail(name, `${name}\n\n${price} ₽\n\n${link}`)
        console.log('✅\tNotified via email')
    } catch (e) {
        console.warn('⚠️\tFailed to send email', e)
    }
}
