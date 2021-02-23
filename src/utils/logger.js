module.exports = function debug(...args) {
    if (!process.env.DEBUG) {
        return
    }

    console.log('🛠', ...args)
}
