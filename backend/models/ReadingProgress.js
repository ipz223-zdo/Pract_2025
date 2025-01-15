const mongoose = require('mongoose');

// Reading Progress Schema
const readingProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    chapter: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('ReadingProgress', readingProgressSchema);
