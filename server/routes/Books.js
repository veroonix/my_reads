const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const UserBooks = require("../models/book.model"); // Импорт модели
const fetch = require("node-fetch"); // Для запроса в Google API
const verifyToken = require("../middleware/auth"); // Защита маршрутов
mongoose.connect('mongodb://localhost:27017/book-app')

router.post("/books/add", verifyToken, async (req, res) => {
    const userId = req.user.userId; 
    const {bookId, title, author, cover, status } = req.body;
    try {
    let userBooks = await UserBooks.findOne({ userId });

    if (!userBooks) {
        userBooks = new UserBooks({ userId, books: [{ bookId, title, author, cover, status }] });
    } else {
        userBooks.books.push({ bookId, title, author, cover, status });
    }

    await userBooks.save();
    res.status(201).json({ message: "Книга успешно добавлена!" });

    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 📌 Маршрут для получения списка книг пользователя
router.get("/books/get", verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId; 

        const userBooks = await UserBooks.findOne({ userId });

        if (!userBooks) {
            return res.status(404).json({ message: "❌ Книги не найдены!" });
        }

        res.json(userBooks.books);
    } catch (error) {
        res.status(500).json({ message: "❌ Ошибка сервера", error });
    }
});

router.put('/books/update', verifyToken, async (req, res) => {
  try {
    const { bookId, status } = req.body;
    const userId = req.user.userId; 
    // Находим и обновляем книгу
    const updatedBook = await UserBooks.findOneAndUpdate(
      { userId, "books.bookId": bookId },
      { $set: { "books.$.status": status } },
      { new: true }
);


    if (!updatedBook) {
      return res.status(404).json({ message: "Книга не найдена" });
    }

    res.json({ message: "Статус книги обновлен" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// 📌 Маршрут для удаления книги пользователя
router.delete("/books/delete",  verifyToken, async (req, res) => {
    const userId = req.user.userId; 
    try {
        const { bookId } = req.body;


        const userBooks = await UserBooks.findOne({ userId });
        if (!userBooks) {
            return res.status(404).json({ message: "❌ Книги не найдены!" });
        }

        const initialCount = userBooks.books.length;
        // Фильтруем массив и удаляем книгу с соответствующим bookId
        userBooks.books = userBooks.books.filter(book => book.bookId !== bookId);

        // Если длина массива не изменилась, книга не была найдена
        if (userBooks.books.length === initialCount) {
        return res
            .status(404)
            .json({ message: "❌ Книга с указанным bookId не найдена" });
        }

        // Сохраняем изменения
        await userBooks.save();
        res.status(200).json({ message: "✅ Книга успешно удалена" })
    }
    catch (error) {
        res.status(500).json({ message: "❌ Ошибка сервера", error });
    }
})
module.exports = router;