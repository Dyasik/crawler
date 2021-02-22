const nodemailer = require('nodemailer')

const {EMAIL_LOGIN, EMAIL_PASS, EMAIL_TO} = process.env

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_LOGIN,
        pass: EMAIL_PASS,
    },
})

module.exports = function sendEmail(subject, text) {
    return transport.sendMail({
        from: `Dyasik's Crawler <${EMAIL_LOGIN}>`,
        subject,
        text,
        to: EMAIL_TO,
    })
}
