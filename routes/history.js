const express = require('express');
const router = express.Router();
const History = require('../models/History');
const Student = require('../models/Student');
const Book = require('../models/Book');
const moment = require('moment');
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;

// Book Taking Registration Route
router.get('/take', (req, res) => {
    res.render('book-take', { title: "Register Book Taking" });
});

router.post('/take', async (req, res) => {
    const { studentId, bookId, bookName } = req.body;
    try {
        let student = await Student.findOne({ studentId: studentId }).lean();
        let book = await Book.findOne({ bookId: bookId }).lean();
        const dueDate = moment().add(7, 'days').toDate();
        const history = new History({ studentId, bookId, bookName, dueDate, studentDbID: student._id, bookDbID: book._id });
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
        // Fetch overdue books
        const overdueBooks = await History.find({ status: 'taken', dueDate: { $lt: new Date() } }).lean();
        for (let entry of overdueBooks) {
            const student = await Student.findOne({ studentId: entry.studentId }); // Find student by custom ID
            const book = await Book.findOne({ bookId: entry.bookId });            // Find book by custom ID
            entry.studentName = student ? student.studentName : 'Unknown';
            entry.bookName = book ? book.bookName : 'Unknown';
            entry.fine = moment().diff(entry.dueDate, 'days') * 5;
        }

        // Fetch books taken
        const booksTaken = await History.find({ status: 'taken', dueDate: { $gte: new Date() } }).lean();
        for (let entry of booksTaken) {
            const student = await Student.findOne({ studentId: entry.studentId }); // Find student by custom ID
            const book = await Book.findOne({ bookId: entry.bookId });            // Find book by custom ID
            entry.studentName = student ? student.studentName : 'Unknown';
            entry.bookName = book ? book.bookName : 'Unknown';
        }

        // Fetch books returned
        const booksReturned = await History.find({ status: 'returned' }).lean();
        for (let entry of booksReturned) {
            const student = await Student.findOne({ studentId: entry.studentId }); // Find student by custom ID
            const book = await Book.findOne({ bookId: entry.bookId });            // Find book by custom ID
            entry.studentName = student ? student.studentName : 'Unknown';
            entry.bookName = book ? book.bookName : 'Unknown';
        }


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

// History Pages Routes

// Overdue Books History
router.get('/overdue', async (req, res) => {
    try {
        // Fetch overdue books
        const overdueBooks = await History.find({ status: 'taken', dueDate: { $lt: new Date() } }).lean();
        for (let entry of overdueBooks) {
            const student = await Student.findOne({ studentId: entry.studentId }); // Find student by custom ID
            const book = await Book.findOne({ bookId: entry.bookId });            // Find book by custom ID
            entry.studentName = student ? student.studentName : 'Unknown';
            entry.bookName = book ? book.bookName : 'Unknown';
            entry.fine = moment().diff(entry.dueDate, 'days') * 5;
        }

        res.render('overdue-history', {
            title: "Overdue Books History",
            overdueBooks,
            formatDate: date => moment(date).format('YYYY-MM-DD') // Helper function for formatting dates
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Books Taken History
router.get('/taken', async (req, res) => {
    try {
        // Fetch books taken
        const booksTaken = await History.find({ status: 'taken', dueDate: { $gte: new Date() } }).lean();
        for (let entry of booksTaken) {
            const student = await Student.findOne({ studentId: entry.studentId }); // Find student by custom ID
            const book = await Book.findOne({ bookId: entry.bookId });            // Find book by custom ID
            entry.studentName = student ? student.studentName : 'Unknown';
            entry.bookName = book ? book.bookName : 'Unknown';
        }

        // Render the page with book and student details
        res.render('taken-history', {
            title: "Books Taken History",
            booksTaken,
            formatDate: date => moment(date).format('YYYY-MM-DD') // Helper function for formatting dates
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Books Returned History
router.get('/returned', async (req, res) => {
    try {
        // Fetch books returned
        const booksReturned = await History.find({ status: 'returned' }).lean();
        for (let entry of booksReturned) {
            const student = await Student.findOne({ studentId: entry.studentId }); // Find student by custom ID
            const book = await Book.findOne({ bookId: entry.bookId });            // Find book by custom ID
            entry.studentName = student ? student.studentName : 'Unknown';
            entry.bookName = book ? book.bookName : 'Unknown';
        }

        res.render('returned-history', {
            title: "Books Returned History",
            booksReturned,
            formatDate: date => moment(date).format('YYYY-MM-DD') // Helper function for formatting dates
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
