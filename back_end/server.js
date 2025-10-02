const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const PORT = process.env.PORT || 3000;

// Настройки из переменных окружения
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

app.use(express.json());

// Разрешаем CORS для всех сайтов
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Функция для отправки заказа в Telegram
function sendOrderToTelegram(orderData) {
    const message = `
🛍️ НОВЫЙ ЗАКАЗ ИЗ САЙТА!

📦 Состав заказа:
${orderData.items.map(item => `• ${item.name} x${item.quantity} - ${item.price}₽`).join('\n')}

💰 Общая сумма: ${orderData.total}₽
📞 Телефон: ${orderData.phone}
📍 Адрес: ${orderData.address}
⏰ Время: ${new Date().toLocaleString()}
    `;

    return bot.sendMessage(ADMIN_CHAT_ID, message);
}

// Маршрут для приема заказов
app.post('/api/order', async (req, res) => {
    try {
        const orderData = req.body;
        console.log('📦 Новый заказ:', orderData);
        
        // Отправляем заказ в Telegram
        await sendOrderToTelegram(orderData);
        
        res.json({ success: true, message: 'Заказ принят!' });
    } catch (error) {
        console.error('❌ Ошибка:', error);
        res.json({ success: true, message: 'Заказ принят! Мы свяжемся с вами.' });
    }
});

// Проверка работы сервера
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Сервер кофейни работает!' });
});

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту: ${PORT}`);
});
