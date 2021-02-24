const ShopProcessor = require('./baseShop')

module.exports = new ShopProcessor(
    'OnlineTrade',
    // ищу видеокарты по серии rtx дешевле 80к
    'https://www.onlinetrade.ru/catalogue/videokarty-c338/?price1=2490&price2=80000&line[]=NVIDIA%20GeForce%20RTX&advanced_search=1&rating_active=0&special_active=1&selling_active=1&producer_active=1&price_active=1&proizvoditel_vid_active=0&line_active=1&graphic_processor_active=1&naznachenie_active=1&memory_size_active=1&memory_type_active=1&bus_active=0&dop_pitanie_active=1&cooling_mode_active=1&ventilyatori_active=1&rekom_power_active=1&podsvetka_active=0&dlina_active=0&low_profile_active=0&kol_slots_active=0&sockets_active=0&srok_garantii_active=0&cat_id=338',
    '.indexGoods__item',
    '.indexGoods__item__name',
    '.indexGoods__item__price .js__actualPrice'
)
