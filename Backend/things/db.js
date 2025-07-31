// need/db.js
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.resolve(__dirname, 'db.db');
const db = new Database(dbPath);

module.exports = db;
