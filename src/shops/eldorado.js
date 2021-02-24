const ShopProcessor = require('./baseShop')

module.exports = new ShopProcessor(
    'Eldorado',
    // ищу видеокарты по запросу `rtx` от 25к до 70к
    'https://www.eldorado.ru/search/catalog.php?q=rtx&price_from=25000&price_till=70000&search_filter%5Bsections%5D%5B210483640%5D=On&utf',
    'ul[data-dy=productsList] li[data-dy=product]',
    'a[data-dy=title]',
    'span[data-pc=offer_price]',
    (rawPrice) => Number(rawPrice.replace(/[\sр.]/g, ''))
)
