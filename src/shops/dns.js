const ShopProcessor = require('./baseShop')

module.exports = new ShopProcessor(
    'DNS',
    // ищу видеокарты для игровых ПК с памятью GDDR6 стоимостью от 25к
    'https://www.dns-shop.ru/catalog/17a89aab16404e77/videokarty/?price=25000-199999&f[p36]=b2oy&f[mz]=el42z',
    '.catalog-product',
    '.catalog-product__name',
    '.product-buy__price'
)
