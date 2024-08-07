const express = require('express');
const router = express.Router();
const History = require('../models/History');
const moment = require('moment');

// Book Taking Registration Route
router.get('/take', (req, res) => {
    res.render('book-take', { title: "Register Book Taking" });
});

router.post('/take', async (req, res) => {
    const { studentId, bookId, bookName } = req.body;
    const dueDate = moment().add(7, 'days').toDate();
    try {
        const history = new History({ studentId, bookId, bookName, dueDate });
        await history.save();
        res.redirect('/history/take');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// History Page
router.get('/', async (req, res) => {
    try {
        const overdueBooks = await History.find({ status: 'taken', dueDate: { $lt: new Date() } }).populate('studentId').populate('bookId');
        overdueBooks.forEach(entry => {
            entry.fine = moment().diff(entry.dueDate, 'days') * 5;
        });

        const booksTaken = await History.find({ status: 'taken', dueDate: { $gte: new Date() } }).populate('studentId').populate('bookId');
        const booksReturned = await History.find({ status: 'returned' }).populate('studentId').populate('bookId');

        res.render('history', { 
            title: "History", 
            overdueBooks,
            booksTaken,
            booksReturned
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Book Return Route
router.post('/return', async (req, res) => {
    const { studentId, bookId } = req.body;
    try {
        const historyEntry = await History.findOne({ studentId, bookId, status: 'taken' });
        if (historyEntry) {
            historyEntry.status = 'returned';
            await historyEntry.save();
        }
        res.redirect('/history');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
