const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookName: { type: String, required: true },
    bookNumber: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Book', bookSchema);
