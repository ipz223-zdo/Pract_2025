const express = require('express');
const protect = require('../middleware/authMiddleware');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const Counter = require('../models/Counter');

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Перевірка, чи користувач вже існує
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Генерація нового _id
        const _id = await getNextSequence('users');

        // Створення користувача
        const user = await User.create({
            _id,
            name,
            email,
            password
        });

        // Генерація токена
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error('Error in register route:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Вхід користувача
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Отримати бібліотеку користувача
router.get('/library', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user).populate('library');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.library);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching library', error });
    }
});

// Додати книгу до бібліотеки користувача
router.post('/library', protect, async (req, res) => {
    const { bookId } = req.body;

    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.library.includes(bookId)) {
            return res.status(400).json({ message: 'Book already in library' });
        }

        user.library.push(bookId);
        await user.save();
        res.status(201).json({ message: 'Book added to library' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding book to library', error });
    }
});

async function getNextSequence(name) {
    const counter = await Counter.findOneAndUpdate(
        { name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
}

module.exports = router;
