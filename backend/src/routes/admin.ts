import express from 'express';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import upload from '../middleware/upload';
import { uploadPDF } from '../controllers/adminController';

const router = express.Router();

// PDF upload route
router.post(
  '/upload-pdf',
  auth,
  checkRole('admin'),
  upload.single('pdf'),
  uploadPDF
);

export default router; 