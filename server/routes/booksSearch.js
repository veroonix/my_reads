const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const UserBooks = require("../models/book.model"); // Импорт модели
const fetch = require("node-fetch"); // Для запроса в Google API
const verifyToken = require("../middleware/auth"); // Защита маршрутов

const api = 'https://www.googleapis.com';
const apiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;
mongoose.connect('mongodb://localhost:27017/book-app')

// 🔍 Поиск книги у пользователя или в Google Books API
router.get("/books/search", verifyToken, async (req, res) => {
    const { title } = req.query;
    const userId = req.user.userId; // Получаем ID пользователя из токена

      console.log(`[SEARCH] Начало поиска книги. Пользователь: ${userId}, Запрос: "${title}"`);
    try {
        // Ищем книгу в базе пользователя
        const userBooks = await UserBooks.findOne({ userId });

        if (userBooks) {
            const book = userBooks.books.find((b) => b.title.toLowerCase() === title.toLowerCase());
            if (book) {
                return res.json({ source: "database", status: book.status, title: book.title, bookId: book.bookId, author: book.author });
            }
        }

        const googleResponse = await fetch(`${api}/books/v1/volumes?q=${encodeURIComponent(title)}&langRestrict=ru&key=${apiKey}`);

        const googleData = await googleResponse.json();
      //  console.log("Данные Google API:", googleData);
        return res.json({ source: "google", items: googleData.items });
    } catch (error) {
        console.error("Ошибка сервера:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

module.exports = router;
