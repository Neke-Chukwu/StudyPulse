import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Utils
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Constants
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const port = process.env.PORT || 5000;

// Connect to database
connectDB() 
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

// Declare express app
const app = express();

// Middleware
app.use(cors({
  origin: frontendOrigin,
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});