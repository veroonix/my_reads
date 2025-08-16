const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserData", required: true },
  bookId: { type: String, required: true }, // ID книги из Google API
  reviewText: { type: String }, // Комментарий
  userRating: { type: Number, min: 1, max: 5 }, // Оценка пользователя
  createdAt: { type: Date, default: Date.now },
});

const UserReview = mongoose.model("Review", reviewSchema);

module.exports = UserReview;
