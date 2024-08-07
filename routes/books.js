const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;

// Book Adding Route
router.get('/add', (req, res) => {
    res.render('book-add', { title: "Add Book" });
});

router.post('/add', async (req, res) => {
    const { bookName, bookNumber } = req.body;
    try {
        const book = new Book({ bookName, bookId: bookNumber });
        await book.save();
        res.redirect('/books/add');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
