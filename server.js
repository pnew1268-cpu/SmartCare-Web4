const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ────────────────────────────────────────────────
// CORS — must be the very first middleware
// 'null' origin covers requests from file:// pages
// ────────────────────────────────────────────────
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (curl, Postman) or from localhost / file://
        const allowed = ['http://localhost:5000', 'http://127.0.0.1:5000'];
        if (!origin || allowed.includes(origin) || origin === 'null') {
            callback(null, true);
        } else {
            callback(null, true); // allow all for dev — tighten in production
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle all pre-flight OPTIONS requests

// ────────────────────────────────────────────────
// Body parsers — before routes
// ────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ────────────────────────────────────────────────
// Request logger
// ────────────────────────────────────────────────
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ────────────────────────────────────────────────
// API Routes — registered BEFORE static serving
// ────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/clinical', require('./routes/clinical'));
app.use('/api/admin',    require('./routes/admin'));
app.use('/api/messages', require('./routes/messages'));

// ────────────────────────────────────────────────
// Static files
// ────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname)));

// ────────────────────────────────────────────────
// SPA fallback — serve index.html for non-API GETs
// ────────────────────────────────────────────────
app.get('*', (req, res) => {
    if (req.url.startsWith('/api/')) {
        return res.status(404).json({ msg: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ────────────────────────────────────────────────
// Global error handler
// ────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ msg: 'Server error', details: err.message });
});

app.listen(PORT, () => {
    console.log(`✅  Server running on http://localhost:${PORT}`);
    console.log(`   Database: DISABLED (in-memory mode)`);
});
