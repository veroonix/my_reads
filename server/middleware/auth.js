const jwt = require('jsonwebtoken');
const fs = require('fs');

// Загружаем публичный ключ из .env
const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH);

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("🟡 Получен заголовок авторизации:", authHeader);

    if (!authHeader) {
        console.warn("🚫 Нет заголовка Authorization! Доступ запрещён.");
        return res.sendStatus(401); // Нет заголовка — отказ
    }

    const token = authHeader.split(' ')[1];
    console.log("🔑 Извлечён токен:", token);

    jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
            console.error("❌ Ошибка проверки JWT:", err.message);
            return res.sendStatus(403); // Ошибка — отказ
        }

        console.log("✅ Токен успешно верифицирован! Декодированные данные:", decoded);
        req.user = { userId: decoded.userId };

        next(); // Передаём управление дальше
    });
};

module.exports = verifyToken;

//добавить это для защищённых маршрутов ( получение списков пользователей)

/*
const verifyToken = require('./middleware/auth');

app.get('/api/user', verifyToken, async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    res.json(user);
});

 */