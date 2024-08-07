const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    bookName: { type: String, required: true },
    status: { type: String, enum: ['taken', 'returned'], default: 'taken' },
    dueDate: { type: Date, required: true },
    fine: { type: Number, default: 0 }
});

module.exports = mongoose.model('History', historySchema);
