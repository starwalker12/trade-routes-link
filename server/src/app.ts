import express from 'express';
import cors from 'cors';
import path from 'path';
import { errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.js';
import citiesRoutes from './routes/cities.js';
import searchRoutes from './routes/search.js';
import suppliersRoutes from './routes/suppliers.js';
import inventoryRoutes from './routes/inventory.js';
import invoiceRoutes from './routes/invoices.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/supplier/invoices', invoiceRoutes);

app.use(errorHandler);

export default app;
