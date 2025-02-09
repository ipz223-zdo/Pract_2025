require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('./models/User');
require('./models/Book');
require('./models/ReadingProgress');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const readingProgressRoutes = require('./routes/readingProgressRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const customizationRoutes = require('./routes/customizationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Використання маршрутів
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/progress', readingProgressRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/customization', customizationRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Simple Route
app.get('/', (req, res) => res.send('API is running...'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));