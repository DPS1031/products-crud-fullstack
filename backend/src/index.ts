import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import { verifyToken } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', verifyToken, productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
