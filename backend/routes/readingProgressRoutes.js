const express = require('express');
const ReadingProgress = require('../models/ReadingProgress');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Отримання прогресу читання для книги
router.get('/:bookId', protect, async (req, res) => {
    const { bookId } = req.params;

    try {
        const user = req.user;

        // Перевіряємо, чи книга є в бібліотеці користувача
        if (!user.library.some((book) => book.toString() === bookId)) {
            return res.status(400).json({ message: 'Book not in library' });
        }

        const progress = user.readingProgress?.[bookId] || 1; // Якщо прогрес не знайдено, починаємо з 1
        res.status(200).json({ bookId, lastChapter: progress });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reading progress', error });
    }
});

// Збереження прогресу читання
router.post('/:bookId', protect, async (req, res) => {
    const { bookId } = req.params;
    const { lastChapter } = req.body;

    try {
        const user = req.user;

        // Перевіряємо, чи книга є в бібліотеці користувача
        if (!user.library.some((book) => book.toString() === bookId)) {
            return res.status(400).json({ message: 'Book not in library' });
        }

        // Оновлюємо прогрес читання для книги
        user.readingProgress = user.readingProgress || {};
        user.readingProgress[bookId] = lastChapter;

        await user.save();
        res.status(200).json({ message: 'Reading progress saved', progress: user.readingProgress[bookId] });
    } catch (error) {
        res.status(500).json({ message: 'Error saving reading progress', error });
    }
});

module.exports = router;