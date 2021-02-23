const ShopProcessor = require('./baseShop')

module.exports = new ShopProcessor(
    'Citilink',
    // ищу видеокарты с памятью GDDR6 стоимостью от 25к
    'https://www.citilink.ru/catalog/videokarty/?f=available.all%2Cavailable.instore%2Cdiscount.any%2C308_29gddr6&price_min=25000',
    '.ProductGroupList .product_data__gtm-js',
    '.ProductCardHorizontal__title',
    '.ProductCardHorizontal__price_current-price'
)
