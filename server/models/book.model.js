const mongoose = require('mongoose')

const userBookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user-data", required: true },
  books: [
    {
      bookId: { type: String, required: true }, // ID книги из Google Books API
      title: { type: String, required: true },
      author: { type: String },
      cover: { type: String },
      status: { type: String, enum: ["reading", "planned", "finished", "favourites"], default: "planned" },
    //  addedAt: { type: Date, default: Date.now },
    }
  ]
});


const UserBooks = mongoose.model("UserBooks", userBookSchema);

module.exports = UserBooks;