const notifier = require('node-notifier')

module.exports = function sendDesktopNotification(title, message, url) {
    notifier.notify({
        title,
        message,
        open: url,
    });
}
