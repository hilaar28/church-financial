const express = require('express');
const sqlite3 = require('sqlite3').verbose();
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

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database('./church_finance.db', (err) => {
            if (err) {
                console.error('❌ Database connection failed:', err);
                reject(err);
            } else {
                console.log('✅ Connected to SQLite database');
                createTables().then(resolve).catch(reject);
            }
        });
    });
}

// Create database tables
function createTables() {
    return new Promise((resolve, reject) => {
        // Members table
        db.run(`
            CREATE TABLE IF NOT EXISTS members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                address TEXT,
                status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
                join_date DATE DEFAULT CURRENT_DATE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) return reject(err);

            // Tithes table
            db.run(`
                CREATE TABLE IF NOT EXISTS tithes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    member_id INTEGER,
                    member_name TEXT,
                    amount REAL NOT NULL,
                    type TEXT DEFAULT 'tithe' CHECK (type IN ('tithe', 'offering', 'special')),
                    date DATE NOT NULL,
                    notes TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
                )
            `, (err) => {
                if (err) return reject(err);

                // Expenses table
                db.run(`
                    CREATE TABLE IF NOT EXISTS expenses (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        category TEXT NOT NULL CHECK (category IN ('utilities', 'salary', 'maintenance', 'outreach', 'office', 'other')),
                        amount REAL NOT NULL,
                        description TEXT NOT NULL,
                        date DATE NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `, (err) => {
                    if (err) return reject(err);

                    // Budgets table
                    db.run(`
                        CREATE TABLE IF NOT EXISTS budgets (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            category TEXT NOT NULL CHECK (category IN ('utilities', 'salary', 'maintenance', 'outreach', 'office', 'other')),
                            amount REAL NOT NULL DEFAULT 0,
                            year INTEGER NOT NULL DEFAULT (strftime('%Y', 'now')),
                            month INTEGER NOT NULL DEFAULT (strftime('%m', 'now')),
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            UNIQUE(category, year, month)
                        )
                    `, (err) => {
                        if (err) return reject(err);

                        // Settings table
                        db.run(`
                            CREATE TABLE IF NOT EXISTS settings (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                setting_key TEXT UNIQUE NOT NULL,
                                setting_value TEXT,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                            )
                        `, (err) => {
                            if (err) return reject(err);

                            // Insert default settings if not exist
                            db.run(`
                                INSERT OR IGNORE INTO settings (setting_key, setting_value) VALUES
                                ('church_name', 'AFM in Zimbabwe Belvedere Assembly'),
                                ('church_address', ''),
                                ('church_phone', ''),
                                ('church_email', ''),
                                ('church_logo', NULL)
                            `, (err) => {
                                if (err) return reject(err);

                                // Insert sample data
                                console.log('📝 Inserting sample data...');

                                // Sample members
                                db.run(`
                                    INSERT OR IGNORE INTO members (id, name, email, phone, address, status, join_date) VALUES
                                    (1, 'John Doe', 'john@example.com', '+1234567890', '123 Main St', 'active', '2024-01-15'),
                                    (2, 'Jane Smith', 'jane@example.com', '+1234567891', '456 Oak Ave', 'active', '2024-02-20'),
                                    (3, 'Bob Johnson', 'bob@example.com', '+1234567892', '789 Pine Rd', 'active', '2024-03-10')
                                `, (err) => {
                                    if (err) return reject(err);

                                    // Sample tithes
                                    db.run(`
                                        INSERT OR IGNORE INTO tithes (member_id, member_name, amount, type, date, notes) VALUES
                                        (1, 'John Doe', 100.00, 'tithe', '2024-11-01', 'Monthly tithe'),
                                        (2, 'Jane Smith', 75.50, 'tithe', '2024-11-01', 'Monthly tithe'),
                                        (1, 'John Doe', 50.00, 'offering', '2024-11-15', 'Special offering')
                                    `, (err) => {
                                        if (err) return reject(err);

                                        // Sample expenses
                                        db.run(`
                                            INSERT OR IGNORE INTO expenses (category, amount, description, date) VALUES
                                            ('utilities', 150.00, 'Electricity bill', '2024-11-01'),
                                            ('salary', 1200.00, 'Pastor salary', '2024-11-01'),
                                            ('maintenance', 200.00, 'Building repairs', '2024-11-10'),
                                            ('office', 75.00, 'Office supplies', '2024-11-05')
                                        `, (err) => {
                                            if (err) return reject(err);

                                            // Sample budgets
                                            db.run(`
                                                INSERT OR IGNORE INTO budgets (category, amount, year, month) VALUES
                                                ('utilities', 200.00, strftime('%Y', 'now'), strftime('%m', 'now')),
                                                ('salary', 1500.00, strftime('%Y', 'now'), strftime('%m', 'now')),
                                                ('maintenance', 300.00, strftime('%Y', 'now'), strftime('%m', 'now')),
                                                ('outreach', 250.00, strftime('%Y', 'now'), strftime('%m', 'now')),
                                                ('office', 100.00, strftime('%Y', 'now'), strftime('%m', 'now')),
                                                ('other', 150.00, strftime('%Y', 'now'), strftime('%m', 'now'))
                                            `, (err) => {
                                                if (err) return reject(err);
                                                console.log('✅ Sample data inserted');
                                                console.log('✅ Database tables created successfully');
                                                resolve();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

// API Routes

// Members routes
app.get('/api/members', (req, res) => {
    db.all('SELECT * FROM members ORDER BY name ASC', [], (err, rows) => {
        if (err) {
            console.error('Error fetching members:', err);
            res.status(500).json({ error: 'Failed to fetch members' });
        } else {
            res.json(rows);
        }
    });
});

app.post('/api/members', (req, res) => {
    const { name, email, phone, address, status, joinDate } = req.body;
    db.run(
        'INSERT INTO members (name, email, phone, address, status, join_date) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email || null, phone || null, address || null, status || 'active', joinDate || new Date().toISOString().split('T')[0]],
        function(err) {
            if (err) {
                console.error('Error creating member:', err);
                res.status(500).json({ error: 'Failed to create member' });
            } else {
                res.json({ id: this.lastID, ...req.body });
            }
        }
    );
});

app.put('/api/members/:id', (req, res) => {
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
    
    db.run(
        'UPDATE members SET name = ?, email = ?, phone = ?, address = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name.trim(), email || null, phone || null, address || null, status || 'active', req.params.id],
        function(err) {
            if (err) {
                console.error('Error updating member:', err);
                res.status(500).json({ error: 'Failed to update member: ' + err.message });
            } else if (this.changes === 0) {
                console.error('Member not found for update:', req.params.id);
                res.status(404).json({ error: 'Member not found' });
            } else {
                console.log('Member updated successfully:', req.params.id);
                res.json({ success: true, id: req.params.id });
            }
        }
    );
});

app.delete('/api/members/:id', (req, res) => {
    db.run('DELETE FROM members WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            console.error('Error deleting member:', err);
            res.status(500).json({ error: 'Failed to delete member' });
        } else {
            res.json({ success: true });
        }
    });
});

// Tithes routes
app.get('/api/tithes', (req, res) => {
    db.all('SELECT * FROM tithes ORDER BY date DESC, created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Error fetching tithes:', err);
            res.status(500).json({ error: 'Failed to fetch tithes' });
        } else {
            res.json(rows);
        }
    });
});

app.post('/api/tithes', (req, res) => {
    const { memberId, memberName, amount, type, date, notes } = req.body;
    db.run(
        'INSERT INTO tithes (member_id, member_name, amount, type, date, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [memberId || null, memberName, amount, type || 'tithe', date, notes || null],
        function(err) {
            if (err) {
                console.error('Error creating tithe:', err);
                res.status(500).json({ error: 'Failed to create tithe record' });
            } else {
                res.json({ id: this.lastID, ...req.body });
            }
        }
    );
});

app.delete('/api/tithes/:id', (req, res) => {
    db.run('DELETE FROM tithes WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            console.error('Error deleting tithe:', err);
            res.status(500).json({ error: 'Failed to delete tithe record' });
        } else {
            res.json({ success: true });
        }
    });
});

// Expenses routes
app.get('/api/expenses', (req, res) => {
    db.all('SELECT * FROM expenses ORDER BY date DESC, created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Error fetching expenses:', err);
            res.status(500).json({ error: 'Failed to fetch expenses' });
        } else {
            res.json(rows);
        }
    });
});

app.post('/api/expenses', (req, res) => {
    const { category, amount, description, date } = req.body;
    db.run(
        'INSERT INTO expenses (category, amount, description, date) VALUES (?, ?, ?, ?)',
        [category, amount, description, date],
        function(err) {
            if (err) {
                console.error('Error creating expense:', err);
                res.status(500).json({ error: 'Failed to create expense' });
            } else {
                res.json({ id: this.lastID, ...req.body });
            }
        }
    );
});

app.delete('/api/expenses/:id', (req, res) => {
    db.run('DELETE FROM expenses WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            console.error('Error deleting expense:', err);
            res.status(500).json({ error: 'Failed to delete expense' });
        } else {
            res.json({ success: true });
        }
    });
});

// Budget routes
app.get('/api/budgets', (req, res) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    db.all(
        'SELECT * FROM budgets WHERE year = ? AND month = ?',
        [currentYear, currentMonth],
        (err, rows) => {
            if (err) {
                console.error('Error fetching budgets:', err);
                res.status(500).json({ error: 'Failed to fetch budgets' });
            } else {
                // Convert to object format for frontend compatibility
                const budgets = {};
                rows.forEach(row => {
                    budgets[row.category] = parseFloat(row.amount);
                });
                res.json(budgets);
            }
        }
    );
});

app.post('/api/budgets', (req, res) => {
    const budgets = req.body;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Clear existing budgets for current month
    db.run(
        'DELETE FROM budgets WHERE year = ? AND month = ?',
        [currentYear, currentMonth],
        function(err) {
            if (err) {
                console.error('Error clearing budgets:', err);
                res.status(500).json({ error: 'Failed to save budgets' });
                return;
            }

            // Insert new budgets
            let completed = 0;
            const total = Object.keys(budgets).length;

            if (total === 0) {
                res.json({ success: true });
                return;
            }

            for (const [category, amount] of Object.entries(budgets)) {
                db.run(
                    'INSERT INTO budgets (category, amount, year, month) VALUES (?, ?, ?, ?)',
                    [category, amount, currentYear, currentMonth],
                    function(err) {
                        if (err) {
                            console.error('Error inserting budget:', err);
                            if (!res.headersSent) {
                                res.status(500).json({ error: 'Failed to save budgets' });
                            }
                            return;
                        }

                        completed++;
                        if (completed === total) {
                            res.json({ success: true });
                        }
                    }
                );
            }
        }
    );
});

// Settings routes
app.get('/api/settings', (req, res) => {
    db.all('SELECT * FROM settings', [], (err, rows) => {
        if (err) {
            console.error('Error fetching settings:', err);
            res.status(500).json({ error: 'Failed to fetch settings' });
        } else {
            const settings = {};
            rows.forEach(row => {
                settings[row.setting_key] = row.setting_value;
            });
            res.json(settings);
        }
    });
});

app.post('/api/settings', (req, res) => {
    const settings = req.body;
    let completed = 0;
    const total = Object.keys(settings).length;

    if (total === 0) {
        res.json({ success: true });
        return;
    }

    for (const [key, value] of Object.entries(settings)) {
        db.run(
            'INSERT OR REPLACE INTO settings (setting_key, setting_value) VALUES (?, ?)',
            [key, value],
            function(err) {
                if (err) {
                    console.error('Error saving setting:', err);
                    if (!res.headersSent) {
                        res.status(500).json({ error: 'Failed to save settings' });
                    }
                    return;
                }

                completed++;
                if (completed === total) {
                    res.json({ success: true });
                }
            }
        );
    }
});

// Dashboard data route
app.get('/api/dashboard', (req, res) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    let results = {};
    let completed = 0;
    const total = 3;

    // Get monthly tithes
    db.get(
        "SELECT SUM(amount) as total FROM tithes WHERE substr(date, 6, 2) = ? AND substr(date, 1, 4) = ?",
        [currentMonth.toString().padStart(2, '0'), currentYear.toString()],
        (err, row) => {
            if (err) {
                console.error('Error fetching tithes:', err);
                res.status(500).json({ error: 'Failed to fetch dashboard data' });
                return;
            }
            results.monthlyTithes = parseFloat(row.total || 0);
            completed++;
            if (completed === total) sendResponse();
        }
    );

    // Get monthly expenses
    db.get(
        "SELECT SUM(amount) as total FROM expenses WHERE substr(date, 6, 2) = ? AND substr(date, 1, 4) = ?",
        [currentMonth.toString().padStart(2, '0'), currentYear.toString()],
        (err, row) => {
            if (err) {
                console.error('Error fetching expenses:', err);
                res.status(500).json({ error: 'Failed to fetch dashboard data' });
                return;
            }
            results.monthlyExpenses = parseFloat(row.total || 0);
            completed++;
            if (completed === total) sendResponse();
        }
    );

    // Get active members count
    db.get(
        'SELECT COUNT(*) as count FROM members WHERE status = ?',
        ['active'],
        (err, row) => {
            if (err) {
                console.error('Error fetching members:', err);
                res.status(500).json({ error: 'Failed to fetch dashboard data' });
                return;
            }
            results.activeMembers = row.count || 0;
            completed++;
            if (completed === total) sendResponse();
        }
    );

    function sendResponse() {
        res.json({
            monthlyTithes: results.monthlyTithes,
            monthlyExpenses: results.monthlyExpenses,
            activeMembers: results.activeMembers
        });
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
            console.log(`📊 SQLite database connected`);
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