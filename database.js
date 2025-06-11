// database.js
import sqlite3 from 'sqlite3';
// or: import { data } from './data.js'; // if using a JS config

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

// Your database initialization logic
function initializeDatabase() {
    // Example: create table if not exists
    db.run(`CREATE TABLE IF NOT EXISTS servers_db (
        server_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        pause BOOLEAN DEFAULT false,
        auto_eggs BOOLEAN DEFAULT false
    )`);
}

export default db;
