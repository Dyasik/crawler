const ShopProcessor = require('./baseShop')

module.exports = new ShopProcessor(
    'OLDI',
    // ищу видеокарты по запросу rtx
    // Puppeteer fails to navigate to this shop. Perhaps there's some crawlers protection
    'https://www.oldi.ru/catalog/6571/?filter_NAME=rtx',
    '.catalog-list-wrapper .catalog-list-item',
    '.catalog-list-caption',
    '.catalog-list-price',
    (rawPrice) => Number(rawPrice.replace(/[\sa]/g, ''))
)
