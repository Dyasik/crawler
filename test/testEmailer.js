const sendEmail = require('../src/notifications/mailer')

console.log('Sending email...')

try {
    sendEmail('TEST SUBJECT', 'Test text')
    console.log('Done! ✅')
} catch (e) {
    console.log('❌\tFailed to send email:', e)
}

