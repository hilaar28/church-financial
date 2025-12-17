const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
    let connection;

    try {
        console.log('🔄 Initializing Church Finance Database...');

        // Connect without database first
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            authPlugins: {
                mysql_native_password: () => () => Buffer.from(process.env.DB_PASSWORD + '\0')
            }
        });

        // Create database
        await connection.execute('CREATE DATABASE IF NOT EXISTS church_finance');
        console.log('✅ Database "church_finance" created or already exists');

        // Switch to the database
        await connection.execute('USE church_finance');

        // Create tables
        console.log('📋 Creating tables...');

        // Members table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS members (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                phone VARCHAR(50),
                address TEXT,
                status ENUM('active', 'inactive') DEFAULT 'active',
                join_date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Members table created');

        // Tithes table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tithes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                member_id INT,
                member_name VARCHAR(255),
                amount DECIMAL(10,2) NOT NULL,
                type ENUM('tithe', 'offering', 'special') DEFAULT 'tithe',
                date DATE NOT NULL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
            )
        `);
        console.log('✅ Tithes table created');

        // Expenses table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS expenses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category ENUM('utilities', 'salary', 'maintenance', 'outreach', 'office', 'other') NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                description TEXT NOT NULL,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Expenses table created');

        // Budgets table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS budgets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category ENUM('utilities', 'salary', 'maintenance', 'outreach', 'office', 'other') NOT NULL,
                amount DECIMAL(10,2) NOT NULL DEFAULT 0,
                year YEAR NOT NULL DEFAULT (YEAR(CURRENT_DATE)),
                month TINYINT NOT NULL DEFAULT (MONTH(CURRENT_DATE)),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY unique_budget (category, year, month)
            )
        `);
        console.log('✅ Budgets table created');

        // Settings table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(100) UNIQUE NOT NULL,
                setting_value TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Settings table created');

        // Insert default settings
        await connection.execute(`
            INSERT IGNORE INTO settings (setting_key, setting_value) VALUES
            ('church_name', 'AFM in Zimbabwe Belvedere Assembly'),
            ('church_address', ''),
            ('church_phone', ''),
            ('church_email', ''),
            ('church_logo', NULL)
        `);
        console.log('✅ Default settings inserted');

        // Insert sample data (optional)
        console.log('📝 Inserting sample data...');

        // Sample members
        await connection.execute(`
            INSERT IGNORE INTO members (id, name, email, phone, address, status, join_date) VALUES
            (1, 'John Doe', 'john@example.com', '+1234567890', '123 Main St', 'active', '2024-01-15'),
            (2, 'Jane Smith', 'jane@example.com', '+1234567891', '456 Oak Ave', 'active', '2024-02-20'),
            (3, 'Bob Johnson', 'bob@example.com', '+1234567892', '789 Pine Rd', 'active', '2024-03-10')
        `);

        // Sample tithes
        await connection.execute(`
            INSERT IGNORE INTO tithes (member_id, member_name, amount, type, date, notes) VALUES
            (1, 'John Doe', 100.00, 'tithe', '2024-11-01', 'Monthly tithe'),
            (2, 'Jane Smith', 75.50, 'tithe', '2024-11-01', 'Monthly tithe'),
            (1, 'John Doe', 50.00, 'offering', '2024-11-15', 'Special offering')
        `);

        // Sample expenses
        await connection.execute(`
            INSERT IGNORE INTO expenses (category, amount, description, date) VALUES
            ('utilities', 150.00, 'Electricity bill', '2024-11-01'),
            ('salary', 1200.00, 'Pastor salary', '2024-11-01'),
            ('maintenance', 200.00, 'Building repairs', '2024-11-10'),
            ('office', 75.00, 'Office supplies', '2024-11-05')
        `);

        // Sample budgets
        await connection.execute(`
            INSERT IGNORE INTO budgets (category, amount, year, month) VALUES
            ('utilities', 200.00, YEAR(CURRENT_DATE), MONTH(CURRENT_DATE)),
            ('salary', 1500.00, YEAR(CURRENT_DATE), MONTH(CURRENT_DATE)),
            ('maintenance', 300.00, YEAR(CURRENT_DATE), MONTH(CURRENT_DATE)),
            ('outreach', 250.00, YEAR(CURRENT_DATE), MONTH(CURRENT_DATE)),
            ('office', 100.00, YEAR(CURRENT_DATE), MONTH(CURRENT_DATE)),
            ('other', 150.00, YEAR(CURRENT_DATE), MONTH(CURRENT_DATE))
        `);

        console.log('✅ Sample data inserted');
        console.log('🎉 Database initialization completed successfully!');
        console.log('');
        console.log('🚀 You can now start the server with: npm start');
        console.log('📊 Access the application at: http://localhost:3000');

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

initializeDatabase();