const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    registerNumber: { type: String, required: true, unique: true },
    standard: { type: String, required: true },
    division: { type: String, required: true },
    studentId: { type: Number, unique: true }
});

module.exports = mongoose.model('Student', studentSchema);
