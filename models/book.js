const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  googleId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  synopsis: String,
  image: String,
  link: { type: String, required: true },
  date: { type: Date, default: Date.now }  
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
