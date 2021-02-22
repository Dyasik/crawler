const nodemailer = require('nodemailer')

const {EmailLogin, EmailPass, EmailTo} = require('../../conf')

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EmailLogin,
        pass: EmailPass,
    },
})

module.exports = function sendEmail(subject, text) {
    return transport.sendMail({
        from: `Dyasik's Crawler <${EmailLogin}>`,
        subject,
        text,
        to: EmailTo,
    })
}
