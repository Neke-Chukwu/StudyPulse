import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupUploadsDirectory } from './utils/setupUploads';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Setup uploads directory
setupUploadsDirectory();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studypulse')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 