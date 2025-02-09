const express = require('express');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Збереження кастомізації
router.post('/settings', protect, async (req, res) => {
    const { fontStyle, fontSize, textColor, backgroundColor } = req.body;

    try {
        const user = req.user;

        user.readingSettings = {
            fontStyle,
            fontSize,
            textColor,
            backgroundColor,
        };

        await user.save();
        res.status(200).json({ message: 'Settings saved', settings: user.readingSettings });
    } catch (error) {
        res.status(500).json({ message: 'Error saving settings', error });
    }
});

// Отримання кастомізації
router.get('/settings', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json(user.readingSettings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings', error });
    }
});

module.exports = router;
