const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Токен бота (получи у @BotFather)
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// ID чата куда отправлять заказы (твой ID или группы)
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

// Функция для отправки заказа в Telegram
function sendOrderToTelegram(orderData) {
    const message = `
🛍️ НОВЫЙ ЗАКАЗ!

📦 Состав заказа:
${orderData.items.map(item => `• ${item.name} x${item.quantity} - ${item.price}₽`).join('\n')}

💰 Общая сумма: ${orderData.total}₽
📞 Телефон: ${orderData.phone || 'Не указан'}
📍 Адрес: ${orderData.address || 'Самовывоз'}
⏰ Время: ${new Date().toLocaleString()}
    `;

    bot.sendMessage(ADMIN_CHAT_ID, message);
}

// Команда старт
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Привет! Я бот кофейни "Уютная Чашка". Здесь ты можешь оформить заказ!');
});

module.exports = { sendOrderToTelegram };
