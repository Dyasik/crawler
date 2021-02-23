const ShopProcessor = require('./baseShop')

module.exports = new ShopProcessor(
    'OGO',
    // ищу видеокарты по запросу RTX
    'https://new.ogo1.ru/search/?PAGESIZE=60&q=RTX&SECTION_CODE=&SORT=&ORDER=&ONLY_AVAILABLE=1&EXACT_SEARCH=1&set_filter=Y&view=plate&arrFilter%5BS_ID%5D%5B0%5D=84998',
    '.b-plate-product',
    '.b-plate-product__title',
    '.b-plate-product__price',
    (rawPrice) => Number(rawPrice.replace(/[\s|руб.]/g, ''))
)
