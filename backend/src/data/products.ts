import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../products.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0
  )
`);

// Seed inicial si la tabla está vacía
const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)');
  insert.run('Laptop Pro', 'High performance laptop', 2500000, 10);
  insert.run('Wireless Mouse', 'Ergonomic wireless mouse', 85000, 50);
  insert.run('Mechanical Keyboard', 'RGB mechanical keyboard', 320000, 25);
}

export default db;
