import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import quizRoutes from './routes/quizRoutes';
import { setupUploadsDirectory } from './utils/setupUploads';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
const result = dotenv.config({ path: path.join(__dirname, '../../.env') });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Setup uploads directory
setupUploadsDirectory();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quiz', quizRoutes);

// Error handling middleware
app.use(errorHandler);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studypulse';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 