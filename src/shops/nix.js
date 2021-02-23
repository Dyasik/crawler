const ShopProcessor = require('./baseShop')

module.exports = new ShopProcessor(
    'NIX',
    // ищу видеокарты с GPU NVIDIA GEFORCE RTX
    'https://izhevsk.nix.ru/price.html?section=video_cards_all&sch_id=1134#c_id=101&fn=101&g_id=22&page=1&sort=p214&spoiler=&store=region-511_0&thumbnail_view=2',
    '#search_results tr.highlight',
    '.cell-name',
    '.cell-price'
)
