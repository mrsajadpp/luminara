const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Student Registration Route
router.get('/register', (req, res) => {
    res.render('student-register', { title: "Register Student" });
});

router.post('/register', async (req, res) => {
    const { studentName, registerNumber, standard, division } = req.body;
    const studentId = await Student.countDocuments() + 1;
    try {
        const student = new Student({ studentName, registerNumber, standard, division, studentId });
        await student.save();
        res.redirect('/students/register');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
