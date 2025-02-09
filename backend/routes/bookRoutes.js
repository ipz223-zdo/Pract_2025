const express = require('express');
const Book = require('../models/Book');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Налаштування multer для завантаження файлів
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Отримання списку книг
router.get('/', async (req, res) => {
    try {
        const books = await Book.find({});
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
});

// Додавання книги (для адміністратора) з підтримкою файлів
router.post('/', upload.single('pdfFile'), async (req, res) => {
    const { title, author, description } = req.body;
    const pdfUrl = req.file ? `/uploads/${req.file.filename}` : '';

    try {
        const book = new Book({
            title,
            author,
            description,
            pdfUrl
        });

        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error adding book', error });
    }
});

router.get('/:bookId/download', protect, async (req, res) => {
    const { bookId } = req.params;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const basePath = 'http://localhost:5000';
        const downloadUrl = `${basePath}${book.pdfUrl}`;

        console.log(downloadUrl)
        res.json({ downloadUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book download URL', error });
    }
});

// Отримати дані для читання книги
router.get('/:bookId/read', protect, async (req, res) => {
    const { bookId } = req.params;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const progress = await ReadingProgress.findOne({ userId: req.user, bookId });
        const chapter = progress ? progress.chapter : 0;

        res.json({
            title: book.title,
            author: book.author,
            currentChapter: chapter,
            description: book.description,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book reading data', error });
    }
});

// Отримання детальної інформації про книгу
router.get('/:bookId', protect, async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Перевіряємо, чи книга є в бібліотеці користувача
        const user = await User.findById(req.user);
        const isInLibrary = user.library.includes(book._id.toString());

        res.json({
            ...book.toObject(),
            isInLibrary,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book details', error });
    }
});


module.exports = router;
