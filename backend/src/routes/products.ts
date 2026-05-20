import { Router, Request, Response } from 'express';
import db from '../data/products';

const router = Router();

// GET all
router.get('/', (req: Request, res: Response) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

// GET by id
router.get('/:id', (req: Request, res: Response): void => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) { res.status(404).json({ message: 'Product not found' }); return; }
  res.json(product);
});

// POST
router.post('/', (req: Request, res: Response) => {
  const { name, description, price, stock } = req.body;
  const result = db.prepare(
    'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)'
  ).run(name, description, price, stock);
  res.status(201).json({ id: result.lastInsertRowid, name, description, price, stock });
});

// PUT
router.put('/:id', (req: Request, res: Response): void => {
  const { name, description, price, stock } = req.body;
  const result = db.prepare(
    'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?'
  ).run(name, description, price, stock, req.params.id);
  if (result.changes === 0) { res.status(404).json({ message: 'Product not found' }); return; }
  res.json({ id: req.params.id, name, description, price, stock });
});

// DELETE
router.delete('/:id', (req: Request, res: Response): void => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (result.changes === 0) { res.status(404).json({ message: 'Product not found' }); return; }
  res.status(204).send();
});

export default router;
