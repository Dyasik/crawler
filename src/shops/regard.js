const ShopProcessor = require('./baseShop')

module.exports = new ShopProcessor(
    'Regard',
    // ищу по запросу 'geforce rtx' в разделе 'Видеокарты'
    'https://www.regard.ru/catalog/?query=geforce+rtx&group=4000',
    '#hits .block',
    'a.header',
    'div.price span:last-of-type'
)
