require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
require('./models/User');
require('./models/Book');
require('./models/ReadingProgress');

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Simple Route
app.get('/', (req, res) => res.send('API is running...'));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
