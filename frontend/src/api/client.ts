import axios from 'axios';
import type { Product } from '../types';

const API_URL = 'http://18.207.180.47:3000';

const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = async (username: string, password: string) => {
  const res = await client.post('/api/auth/login', { username, password });
  return res.data;
};

export const getProducts = () => client.get('/api/products').then(r => r.data);
export const createProduct = (p: Omit<Product, 'id'>) => client.post('/api/products', p).then(r => r.data);
export const updateProduct = (id: number, p: Omit<Product, 'id'>) => client.put(`/api/products/${id}`, p).then(r => r.data);
export const deleteProduct = (id: number) => client.delete(`/api/products/${id}`);
