const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Купівля книги
router.post('/buy/:bookId', protect, async (req, res) => {
    const { bookId } = req.params;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const user = req.user;

        // Перевірка, чи книга вже у бібліотеці
        if (user.library.some((book) => book.toString() === bookId)) {
            return res.status(400).json({ message: 'Book already in library' });
        }

        // Якщо книга безкоштовна, додаємо її до бібліотеки
        if (book.isFree) {
            user.library.push(bookId);
        } else {
            // Логіка оплати (можна додати сторонній сервіс платежів)
            user.library.push(bookId); // Зараз просто додаємо книгу
        }

        await user.save();
        res.status(200).json({ message: 'Book added to library', library: user.library });
    } catch (error) {
        res.status(500).json({ message: 'Error purchasing book', error });
    }
});

// Отримання бібліотеки користувача
router.get('/library', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('library');
        res.status(200).json(user.library);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching library', error });
    }
});

module.exports = router;
