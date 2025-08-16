const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const UserReview = require("../models/reviews.model"); // Импорт модели
const fetch = require("node-fetch"); // Для запроса в Google API
const verifyToken = require("../middleware/auth"); // Защита маршрутов
const UserBooks = require("../models/book.model");
mongoose.connect('mongodb://localhost:27017/book-app')

router.get("/books/reviews",  verifyToken, async (req, res) =>{
    const { bookId } = req.query;
    try {
        const reviews = await UserReview.find({ bookId })
            .populate({ path: 'userId', select: 'name email' }) // Укажите нужные поля из модели пользователя
            .sort({ createdAt: -1 }); // Сортировка по дате (сначала новые)

        if (reviews.length === 0) {
             return res.sendStatus(204);
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Ошибка при получении отзывов:", error);
        res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
})

router.get("/books/raiting", verifyToken, async (req, res) => {
    const { bookId } = req.query;
    
    try {
        // Добавляем агрегацию для расчета среднего рейтинга
        const aggregationResult = await UserReview.aggregate([
            {
                $match: { bookId: bookId } // Фильтруем по нужной книге
            },
            {
                $group: {
                    _id: "$bookId",
                    averageRating: { $avg: "$userRating" },
                    reviews: { $push: "$$ROOT" } // Сохраняем все отзывы
                }
            },
            {
                $project: {
                    _id: 0,
                    averageRating: { $round: ["$averageRating", 1] }, // Округляем до 1 знака
                    reviews: 1
                }
            }
        ]);

        if (!aggregationResult.length) {
            return res.sendStatus(204);
        }

        // Популяция пользовательских данных для отзывов
        const result = await UserReview.populate(aggregationResult[0].reviews, {
            path: 'userId',
            select: 'name email'
        });

        res.status(200).json({
            reviews: result,
            averageRating: aggregationResult[0].averageRating
        });

    } catch (error) {
        console.error("Ошибка при получении отзывов:", error);
        res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
});

router.get("/books/user-review", verifyToken, async (req, res) => {
    console.log(">> /books/user-review hit, query:", req.query);
    try {
        const userId = req.user.userId;
        const { bookId } = req.query;
        console.log("User:", userId, "BookId:", bookId);
        const existingReview = await UserReview.findOne({ userId, bookId })
            .populate({ path: 'userId', select: 'name email' });
        console.log("Existing review:", existingReview);
        if (!existingReview) {
            return res.sendStatus(204);
        }
        res.status(200).json(existingReview);
    } catch (error) {
        res.status(500).json({ 
            message: "Ошибка при получении отзыва",
            error: error.message 
        });
    }
});


router.post("/books/review/add", verifyToken, async (req, res) => {
  console.log("----- POST /books/review/add вызван -----");
  console.log("Тело запроса:", req.body);

  const userId = req.user.userId; 
  console.log("Полученный userId из verifyToken middleware:", userId);

  // Деструктурируем ожидаемые поля из тела запроса
  const { bookId, reviewText, userRating, createdAt } = req.body;
  console.log("Деструктурированные данные:", { bookId, reviewText, userRating, createdAt });

  try {
    console.log(`Поиск отзыва для userId: ${userId} и bookId: ${bookId}`);
    let existingReview = await UserReview.findOne({ userId: userId, bookId: bookId });
    
    if (existingReview) {
      console.log("Найден существующий отзыв:", existingReview);
      existingReview.reviewText = reviewText;
      existingReview.userRating = userRating;
      existingReview.createdAt = createdAt || Date.now();
      await existingReview.save();
      console.log("Отзыв успешно обновлён:", existingReview);
      return res.status(200).json({ message: "Отзыв успешно обновлён!" });
    } else {
      console.log("Отзыв не найден, создаём новый");
      // Если отзыва ещё нет, создаём новый
      const newReview = new UserReview({ userId, bookId, reviewText, userRating, createdAt });
      await newReview.save();
      console.log("Новый отзыв успешно добавлен:", newReview);
      return res.status(201).json({ message: "Отзыв успешно добавлен!" });
    }
  } catch (error) {
    console.error("Ошибка при добавлении/обновлении отзыва:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
});

router.delete("/books/review/delete", verifyToken, async (req, res) => {
    const userId = req.user.userId; 
    const { bookId} = req.body;
    try {
    // Находим и удаляем отзыв, удовлетворяющий условиям
    const deletedReview = await UserReview.findOneAndDelete({ userId, bookId });
    
    if (!deletedReview) {
      return res.status(404).json({ message: "Отзыв не найден" });
    }
    
    res.status(200).json({ message: "Отзыв успешно удалён" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error });
    }
})

module.exports = router;