const mongoose = require('mongoose');

// Book Schema
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    free: { type: Boolean, default: false },
    pdfUrl: { type: String, required: true },
    coverImage: { type: String }, // URL обкладинки книги
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
