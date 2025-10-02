const express = require('express');
const { sendOrderToTelegram } = require('./telegram-bot');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Маршрут для приема заказов с сайта
app.post('/api/order', (req, res) => {
    try {
        const orderData = req.body;
        
        // Отправляем заказ в Telegram
        sendOrderToTelegram(orderData);
        
        res.json({ success: true, message: 'Заказ принят!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Ошибка при оформлении заказа' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
