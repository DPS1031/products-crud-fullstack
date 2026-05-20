import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/client';
import type { Product } from '../types';

interface Props { username: string; onLogout: () => void; }

const empty = (): Omit<Product, 'id'> => ({ name: '', description: '', price: 0, stock: 0 });

export default function ProductList({ username, onLogout }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(empty());
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setProducts(await getProducts());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) await updateProduct(editId, form);
    else await createProduct(form);
    setForm(empty());
    setEditId(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock });
    setEditId(p.id!);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this product?')) { await deleteProduct(id); load(); }
  };

  const handleLogout = () => { localStorage.removeItem('token'); onLogout(); };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Products</h2>
        <div style={styles.headerRight}>
          <span style={styles.user}>👤 {username}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          <button style={styles.addBtn} onClick={() => { setForm(empty()); setEditId(null); setShowForm(true); }}>+ Add Product</button>
        </div>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ margin: '0 0 1rem' }}>{editId ? 'Edit Product' : 'New Product'}</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input style={styles.input} placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input style={styles.input} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <input style={styles.input} type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} required />
            <input style={styles.input} type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })} required />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={styles.addBtn} type="submit">{editId ? 'Update' : 'Create'}</button>
              <button style={styles.cancelBtn} type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={styles.tr}>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>{p.description}</td>
                <td style={styles.td}>${p.price.toLocaleString()}</td>
                <td style={styles.td}>{p.stock}</td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => handleEdit(p)}>Edit</button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(p.id!)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  headerRight: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  title: { margin: 0, fontSize: '1.5rem', color: '#ffffff' },
  user: { fontSize: '0.9rem', color: '#ffffff' },
  formCard: { background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: { padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem' },
  table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  thead: { backgroundColor: '#0078d4' },
  th: { padding: '0.85rem 1rem', color: 'white', textAlign: 'left', fontWeight: 600 },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '0.85rem 1rem', color: '#333' },
  addBtn: { padding: '0.5rem 1rem', backgroundColor: '#0078d4', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  logoutBtn: { padding: '0.5rem 1rem', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  cancelBtn: { padding: '0.5rem 1rem', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  editBtn: { marginRight: '0.5rem', padding: '0.35rem 0.75rem', backgroundColor: '#f6ad55', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  deleteBtn: { padding: '0.35rem 0.75rem', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};
