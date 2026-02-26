const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
});
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connection
const sequelize = require('./db');
sequelize.sync()
    .then(() => console.log('SQLite Database Sync Complete...'))
    .catch(err => console.log('DB Connection Error:', err));

// Routes (Before Static for priority)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/clinical', require('./routes/clinical'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/messages', require('./routes/messages'));

// Static Folder (serving from root as per requirement)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname)));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR STACK:', err.stack);
    res.status(500).json({ msg: 'Server error', details: err.message });
});

// Fallback for direct index.html access (root)
app.get('*', (req, res) => {
    // Check if it's an API request that fell through
    if (req.url.startsWith('/api/')) {
        return res.status(404).json({ msg: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
