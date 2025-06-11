// database.js (CommonJS)
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS servers_db (
        server_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        pause BOOLEAN DEFAULT false,
        auto_eggs BOOLEAN DEFAULT false
    )`);
}

module.exports = { db };
