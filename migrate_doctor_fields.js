const mysql = require('mysql2/promise');

(async () => {
    try {
        console.log('🔧 Running migration to add doctor verification fields...\n');
        
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'medapp',
            password: 'M!nA@2026#S3cure',
            database: 'medical_system'
        });

        // Check if verificationStatus column exists
        const [columns] = await conn.execute(`
            SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'verificationStatus'
        `);

        if (columns.length === 0) {
            console.log('➕ Adding verificationStatus column...');
            await conn.execute(`
                ALTER TABLE Users ADD COLUMN verificationStatus 
                ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' NOT NULL
            `);
            console.log('✅ verificationStatus column added');
        } else {
            console.log('✓ verificationStatus column already exists');
        }

        // Check if verificationNotes column exists
        const [notesCol] = await conn.execute(`
            SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'verificationNotes'
        `);

        if (notesCol.length === 0) {
            console.log('➕ Adding verificationNotes column...');
            await conn.execute(`
                ALTER TABLE Users ADD COLUMN verificationNotes TEXT
            `);
            console.log('✅ verificationNotes column added');
        } else {
            console.log('✓ verificationNotes column already exists');
        }

        // Check if uploads/doctors directory exists
        const fs = require('fs');
        if (!fs.existsSync('uploads/doctors')) {
            console.log('➕ Creating uploads/doctors directory...');
            fs.mkdirSync('uploads/doctors', { recursive: true });
            console.log('✅ uploads/doctors directory created');
        } else {
            console.log('✓ uploads/doctors directory already exists');
        }

        console.log('\n✅ Migration completed successfully!');
        conn.end();
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
})();
