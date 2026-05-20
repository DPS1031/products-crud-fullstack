import { useState } from 'react';
import Login from './components/Login';
import ProductList from './components/ProductList';

export default function App() {
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem('token') ? 'admin' : null
  );

  return username
    ? <ProductList username={username} onLogout={() => setUsername(null)} />
    : <Login onLogin={setUsername} />;
}
