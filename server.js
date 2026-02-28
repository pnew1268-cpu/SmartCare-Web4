const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// prefer explicit default port for clarity (overrides environment when unset)
const DEFAULT_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_PORT;

// Ensure MySQL credentials are available to the DB layer before it is required
// and also create a direct mysql connection for explicit verification.
const mysql = require('mysql2');

// Set env vars so ./db picks them up (keeps existing config behavior)
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_USER = process.env.DB_USER || 'medapp';
process.env.MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'M!nA@2026#S3cure';
process.env.DB_NAME = process.env.DB_NAME || 'medical_system';

// Direct MySQL connection for verification (as requested)
const connection = mysql.createConnection({ host: "localhost", user: "medapp", password: "M!nA@2026#S3cure", database: "medical_system" });

connection.connect(err => {
    if (err) {
        console.error('\n❌  MySQL connection failed:', err.message);
        console.error('   Please ensure the MySQL service is running and credentials are correct.');
        process.exit(1);
    }
    console.log('Connected to MySQL ✅');
});

const sequelize = require('./db');

// ────────────────────────────────────────────────
// CORS — must be the very first middleware
// 'null' origin covers requests from file:// pages
// ────────────────────────────────────────────────
const corsOptions = {
    origin: true,
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle all pre-flight OPTIONS requests

// ────────────────────────────────────────────────
// Body parsers — before routes
// ────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static assets from the public directory (required by user request)
// this must come before any SPA/fallback logic below
app.use(express.static(path.join(__dirname, 'public')));

// NOTE: older code also served the entire project root; leave it after
// uploads/handling just in case other files depend on it.


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
// mount individual routers at both their normal prefixes and directly under /api
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/users',    require('./routes/users'));

// expose same handlers at root to allow paths like /api/login, /api/profile
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/users'));

app.use('/api/clinical', require('./routes/clinical'));
app.use('/api/admin',    require('./routes/admin'));
app.use('/api/messages',      require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api', require('./routes/family')); // Family member routes

// informational /api root to avoid plain 404 when user visits it
app.get('/api', (req, res) => {
    res.json({
        msg: 'MedRecord API root. Try /login, /register, /profile, /users/...',
        available: [
            '/api/login', '/api/register', '/api/profile',
            '/api/users/doctors', '/api/clinical/prescriptions',
            '/api/messages', '/api/notifications'
        ]
    });
});

// Ping endpoint to verify server status
app.get('/api/ping', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ────────────────────────────────────────────────
// SPA fallback & API 404
// ────────────────────────────────────────────────

// 1. API 404 — Handle unmatched /api requests BEFORE static/SPA fallback
app.use('/api', (req, res) => {
    res.status(404).json({ 
        msg: 'API endpoint not found',
        url: req.originalUrl,
        method: req.method
    });
});

// 2. Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Specific 404 for missing uploads to prevent SPA fallback
app.use('/uploads', (req, res) => {
    res.status(404).send('File Not Found');
});

// NOTE: A catch‑all static serve of the project root was originally here.
// Keep it for compatibility but it comes _after_ public/ so public files win.
app.use(express.static(path.join(__dirname)));

// 3. SPA Fallback — ONLY for GET requests that are NOT for /api
app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. Generic 404 handler for non-GET requests or fallthrough
app.use((req, res) => {
    if (req.originalUrl.startsWith('/api') || req.method !== 'GET') {
        return res.status(404).json({ msg: 'Not Found' });
    }
    res.status(404).sendFile(path.join(__dirname, 'index.html')); // Fallback to SPA even on 404 if it's a GET
});

// ────────────────────────────────────────────────
// Global error handler
// ────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ msg: 'Server error', details: err.message });
});

// Sync database then start server
const User = require('./models/User');
const Notification = require('./models/Notification');
const FamilyMember = require('./models/FamilyMember');

// Define relationships
User.hasMany(FamilyMember, { foreignKey: 'userId', onDelete: 'CASCADE' });
FamilyMember.belongsTo(User, { foreignKey: 'userId' });

// Authenticate DB connection first to provide clear messages for failures
sequelize.authenticate()
    .then(() => {
        console.log('sequelize.authenticate() succeeded');
        const dialect = sequelize.getDialect ? sequelize.getDialect() : 'unknown';
        if (dialect === 'mysql') {
            console.log('Connected to MySQL ✅');
        } else {
            console.log(`Connected to database (${dialect})`);
        }
        // Proceed to sync schema
        return sequelize.sync({ alter: false });
    })
    .then(() => {
        console.log('sequelize.sync() completed');
        return Promise.resolve();
    })
    .then(async () => {
        // Seed simple users for development if missing
        const seedAdmin = await User.findByPk('admin001');
        if (!seedAdmin) {
            await User.create({ id: 'admin001', name: 'Admin User', phone: '0000000000', email: 'admin@medrecord.com', password: 'admin123', roles: ['admin'], activeRole: 'admin' });
            console.log('[SEED] Created admin user: admin001 / admin123');
        }
        const seedPatient = await User.findByPk('12345678901234');
        if (!seedPatient) {
            await User.create({ id: '12345678901234', name: 'Test Patient', phone: '01012345678', email: 'patient@test.com', password: 'test123', roles: ['patient'], activeRole: 'patient' });
            console.log('[SEED] Created test patient: 12345678901234 / test123');
        }
        // Seed a development test doctor account for quick login via temporary button
        const existingTestDoc = await User.findOne({ where: { email: 'testdoctor@example.com' } });
        if (!existingTestDoc) {
            await User.create({
                id: '30000000000001', // valid 14-digit starting with 3
                name: 'Test Doctor',
                phone: '01099999999',
                email: 'testdoctor@example.com',
                password: 'password123',
                roles: ['doctor'],
                activeRole: 'doctor',
                specialization: 'Testing',
                city: 'Cairo',
                governorate: 'Cairo',
                verificationStatus: 'approved'
            });
            console.log('[SEED] Created test doctor: ID=30000000000001 phone=01099999999 / password123');
        }

        // start listening and keep a handle so we can catch errors
        // Only start listening when this file is the main module (prevents double-listen when imported)
        if (require.main === module) {
            const server = app.listen(PORT, '0.0.0.0', () => {
                console.log(`✅  Server running on http://localhost:${PORT}`);
                console.log(`   Internal Address: http://0.0.0.0:${PORT}`);
                try {
                    console.log(`   Database: ${sequelize.getDialect ? sequelize.getDialect() : 'unknown'} (${process.env.NODE_ENV || 'development'})`);
                } catch (e) {
                    // ignore
                }
            });

            server.on('error', err => {
                if (err.code === 'EADDRINUSE') {
                    console.error(`❌  Port ${PORT} already in use. Is another instance running?`);
                    process.exit(1);
                }
                console.error('❌  Server error:', err);
            });

            // Graceful shutdown
            process.on('SIGINT', () => {
                console.log('\nShutting down server...');
                server.close(() => {
                    console.log('Server closed.');
                    process.exit(0);
                });
            });
        } else {
            console.log('Server module imported, skipping app.listen()');
        }
    })
    .catch(err => {
        // Provide a helpful, actionable error message for DB connection failures
        console.error('\n❌  Database connection failed');
        console.error('Error stack:', err.stack || err);
        try {
            const dialect = sequelize.getDialect ? sequelize.getDialect() : 'unknown';
            console.error(`   Dialect: ${dialect}`);
        } catch (e) {}
        console.error('   Error details:', err.message || err);
        console.error('   Host:', process.env.DB_HOST || 'localhost');
        console.error('   User:', process.env.DB_USER || process.env.USER || 'medapp');
        console.error('   Database:', process.env.DB_NAME || process.env.DB_DATABASE || 'medical_system');
        console.error('\n   Please verify your MySQL server is running, credentials are correct, and mysql2 is installed.');
        process.exit(1);
    });
