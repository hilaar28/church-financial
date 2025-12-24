const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from current directory
app.use(express.static('.'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database connection
let db;

async function initializeDatabase() {
    let tempConnection;

    try {
        console.log('🔄 Initializing Church Finance Database...');

        // Connect without database first
        tempConnection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            authPlugins: {
                mysql_native_password: () => () => Buffer.from(process.env.DB_PASSWORD + '\0')
            }
        });

        // Create database if it doesn't exist
        await tempConnection.execute('CREATE DATABASE IF NOT EXISTS church_finance');
        console.log('✅ Database "church_finance" created or already exists');

        // Close temp connection
        await tempConnection.end();

        // Connect to the specific database
        db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            database: 'church_finance',
            authPlugins: {
                mysql_native_password: () => () => Buffer.from(process.env.DB_PASSWORD + '\0')
            }
        });

        console.log('✅ Connected to MySQL database');
        await createTables();
        console.log('🎉 Database initialization completed successfully!');
        console.log('');
        console.log('🚀 You can now start the server with: npm start');
        console.log('📊 Access the application at: http://localhost:3000');

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        if (tempConnection) {
            await tempConnection.end();
        }
        process.exit(1);
    }
}

// Create database tables
async function createTables() {
    try {
        console.log('📋 Creating tables...');

        // Members table
        await db.execute(`
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
        await db.execute(`
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
        await db.execute(`
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
        await db.execute(`
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
        await db.execute(`
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
        await db.execute(`
            INSERT IGNORE INTO settings (setting_key, setting_value) VALUES
            ('church_name', 'AFM in Zimbabwe Belvedere Assembly'),
            ('church_address', ''),
            ('church_phone', ''),
            ('church_email', ''),
            ('church_logo', NULL)
        `);
        console.log('✅ Default settings inserted');

        // Insert sample data
        console.log('📝 Inserting sample data...');

        // Sample members
        await db.execute(`
            INSERT IGNORE INTO members (id, name, email, phone, address, status, join_date) VALUES
            (1, 'John Doe', 'john@example.com', '+1234567890', '123 Main St', 'active', '2024-01-15'),
            (2, 'Jane Smith', 'jane@example.com', '+1234567891', '456 Oak Ave', 'active', '2024-02-20'),
            (3, 'Bob Johnson', 'bob@example.com', '+1234567892', '789 Pine Rd', 'active', '2024-03-10')
        `);

        // Sample tithes
        await db.execute(`
            INSERT IGNORE INTO tithes (member_id, member_name, amount, type, date, notes) VALUES
            (1, 'John Doe', 100.00, 'tithe', '2024-11-01', 'Monthly tithe'),
            (2, 'Jane Smith', 75.50, 'tithe', '2024-11-01', 'Monthly tithe'),
            (1, 'John Doe', 50.00, 'offering', '2024-11-15', 'Special offering')
        `);

        // Sample expenses
        await db.execute(`
            INSERT IGNORE INTO expenses (category, amount, description, date) VALUES
            ('utilities', 150.00, 'Electricity bill', '2024-11-01'),
            ('salary', 1200.00, 'Pastor salary', '2024-11-01'),
            ('maintenance', 200.00, 'Building repairs', '2024-11-10'),
            ('office', 75.00, 'Office supplies', '2024-11-05')
        `);

        // Sample budgets
        await db.execute(`
            INSERT IGNORE INTO budgets (category, amount, year, month) VALUES
            ('utilities', 200.00, YEAR(CURRENT_DATE), MONTH(CURRENT_DATE)),
            ('salary', 1500.00, YEAR(CURRENT_DATE), MONTH(CURRENT_DATE)),
            ('maintenance', 300.00, YEAR(CURRENT_DATE), MONTH(CURRENT_DATE)),
            ('outreach', 250.00, YEAR(CURRENT_DATE), MONTH(CURRENT_DATE)),
            ('office', 100.00, YEAR(CURRENT_DATE), MONTH(CURRENT_DATE)),
            ('other', 150.00, YEAR(CURRENT_DATE), MONTH(CURRENT_DATE))
        `);

        console.log('✅ Sample data inserted');

    } catch (error) {
        console.error('❌ Table creation failed:', error);
        throw error;
    }
}

// API Routes

// Members routes
app.get('/api/members', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM members ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});

app.post('/api/members', async (req, res) => {
    try {
        const { name, email, phone, address, status, joinDate } = req.body;
        const [result] = await db.execute(
            'INSERT INTO members (name, email, phone, address, status, join_date) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email || null, phone || null, address || null, status || 'active', joinDate || new Date().toISOString().split('T')[0]]
        );
        res.json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error('Error creating member:', error);
        res.status(500).json({ error: 'Failed to create member' });
    }
});

app.put('/api/members/:id', async (req, res) => {
    try {
        const { name, email, phone, address, status } = req.body;

        // Validate required fields
        if (!name || name.trim() === '') {
            console.error('Name is required for member update');
            return res.status(400).json({ error: 'Name is required' });
        }

        // Validate status if provided
        if (status && !['active', 'inactive'].includes(status)) {
            console.error('Invalid status value:', status);
            return res.status(400).json({ error: 'Status must be active or inactive' });
        }

        console.log('Updating member:', req.params.id, 'with data:', { name, email, phone, address, status });

        const [result] = await db.execute(
            'UPDATE members SET name = ?, email = ?, phone = ?, address = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [name.trim(), email || null, phone || null, address || null, status || 'active', req.params.id]
        );

        if (result.affectedRows === 0) {
            console.error('Member not found for update:', req.params.id);
            res.status(404).json({ error: 'Member not found' });
        } else {
            console.log('Member updated successfully:', req.params.id);
            res.json({ success: true, id: req.params.id });
        }
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).json({ error: 'Failed to update member: ' + error.message });
    }
});

app.delete('/api/members/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM members WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({ error: 'Failed to delete member' });
    }
});

// Tithes routes
app.get('/api/tithes', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM tithes ORDER BY date DESC, created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching tithes:', error);
        res.status(500).json({ error: 'Failed to fetch tithes' });
    }
});

app.post('/api/tithes', async (req, res) => {
    try {
        const { memberId, memberName, amount, type, date, notes } = req.body;
        const [result] = await db.execute(
            'INSERT INTO tithes (member_id, member_name, amount, type, date, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [memberId || null, memberName, amount, type || 'tithe', date, notes || null]
        );
        res.json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error('Error creating tithe:', error);
        res.status(500).json({ error: 'Failed to create tithe record' });
    }
});

app.delete('/api/tithes/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM tithes WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting tithe:', error);
        res.status(500).json({ error: 'Failed to delete tithe record' });
    }
});

// Expenses routes
app.get('/api/expenses', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM expenses ORDER BY date DESC, created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

app.post('/api/expenses', async (req, res) => {
    try {
        const { category, amount, description, date } = req.body;
        const [result] = await db.execute(
            'INSERT INTO expenses (category, amount, description, date) VALUES (?, ?, ?, ?)',
            [category, amount, description, date]
        );
        res.json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ error: 'Failed to create expense' });
    }
});

app.delete('/api/expenses/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM expenses WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

// Budget routes
app.get('/api/budgets', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const [rows] = await db.execute(
            'SELECT * FROM budgets WHERE year = ? AND month = ?',
            [currentYear, currentMonth]
        );

        // Convert to object format for frontend compatibility
        const budgets = {};
        rows.forEach(row => {
            budgets[row.category] = parseFloat(row.amount);
        });
        res.json(budgets);
    } catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({ error: 'Failed to fetch budgets' });
    }
});

app.post('/api/budgets', async (req, res) => {
    try {
        const budgets = req.body;
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        // Clear existing budgets for current month
        await db.execute(
            'DELETE FROM budgets WHERE year = ? AND month = ?',
            [currentYear, currentMonth]
        );

        // Insert new budgets
        const total = Object.keys(budgets).length;

        if (total === 0) {
            res.json({ success: true });
            return;
        }

        for (const [category, amount] of Object.entries(budgets)) {
            await db.execute(
                'INSERT INTO budgets (category, amount, year, month) VALUES (?, ?, ?, ?)',
                [category, amount, currentYear, currentMonth]
            );
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error saving budgets:', error);
        res.status(500).json({ error: 'Failed to save budgets' });
    }
});

// Settings routes
app.get('/api/settings', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM settings');
        const settings = {};
        rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        const settings = req.body;
        const total = Object.keys(settings).length;

        if (total === 0) {
            res.json({ success: true });
            return;
        }

        for (const [key, value] of Object.entries(settings)) {
            await db.execute(
                'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
                [key, value]
            );
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

// Dashboard data route
app.get('/api/dashboard', async (req, res) => {
    try {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        // Get monthly tithes
        const [tithesResult] = await db.execute(
            "SELECT SUM(amount) as total FROM tithes WHERE MONTH(date) = ? AND YEAR(date) = ?",
            [currentMonth, currentYear]
        );
        const monthlyTithes = parseFloat(tithesResult[0]?.total || 0);

        // Get monthly expenses
        const [expensesResult] = await db.execute(
            "SELECT SUM(amount) as total FROM expenses WHERE MONTH(date) = ? AND YEAR(date) = ?",
            [currentMonth, currentYear]
        );
        const monthlyExpenses = parseFloat(expensesResult[0]?.total || 0);

        // Get active members count
        const [membersResult] = await db.execute(
            'SELECT COUNT(*) as count FROM members WHERE status = ?',
            ['active']
        );
        const activeMembers = membersResult[0]?.count || 0;

        res.json({
            monthlyTithes,
            monthlyExpenses,
            activeMembers
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
    try {
        await initializeDatabase();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 MySQL database connected`);
            console.log(`🌐 Local access: http://localhost:${PORT}`);
            console.log(`🌐 Network access: http://YOUR_LOCAL_IP:${PORT}`);
            console.log(`🌐 For internet access, configure port forwarding on your router`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();