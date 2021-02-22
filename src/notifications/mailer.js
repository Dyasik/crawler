const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
})

module.exports = function sendEmail(subject, text) {
    return transport.sendMail({
        from: '',
        subject,
        text,
        to: '',
    })
}
