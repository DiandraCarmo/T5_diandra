import Database from 'better-sqlite3';

// eslint-disable-next-line id-length
const db = new Database('app.db');

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

export default db;
