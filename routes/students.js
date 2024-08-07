const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const QRCode = require('qrcode');
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;

async function generateUniqueId() {
    let uniqueId = await 'LR' + Math.floor(10000 + Math.random() * 90000);
    let student = await Student.findOne({ studentId: uniqueId }).lean();
    student ? uniqueId = await 'LR' + Math.floor(10000 + Math.random() * 90000) : null;
    return uniqueId;
}


// Student Registration Route
router.get('/register', (req, res) => {
    res.render('student-register', { title: "Register Student" });
});

router.post('/register', async (req, res) => {
    const { studentName, registerNumber, standard, division } = req.body;
    let student = await Student.findOne({ registerNumber: registerNumber }).lean();
    if (student) {
        return res.render('student-register', { title: "Register Student", error: { message: 'Student already registered.' } });
    }
    const studentId = await generateUniqueId();

    try {
        // Create a document
        const doc = new PDFDocument();
        const student = new Student({ studentName, registerNumber, standard, division, studentId: studentId });
        await student.save();

        // Generate QR code 
        const qrData = JSON.stringify({ studentId, studentName, registerNumber, standard, division });
        const qrCodeUrl = await QRCode.toDataURL(qrData);

        doc.fontSize(16).text('Luminara', { align: 'center' });
        doc.fontSize(12).text(`Student ID: ${studentId}`);
        doc.text(`Name: ${studentName}`);
        doc.text(`Register Number: ${registerNumber}`);
        doc.text(`Standard: ${standard}`);
        doc.text(`Division: ${division}`);
        doc.text(' ');
        doc.image(qrCodeUrl, { fit: [100, 100], align: 'center' });

        doc.pipe(res);

        doc.end();

        // res.redirect('/students/register');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
