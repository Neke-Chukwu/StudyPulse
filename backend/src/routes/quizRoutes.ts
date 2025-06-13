import express from 'express';
import { generateQuiz, submitQuiz, getAnalytics } from '../controllers/quizController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/generate', authenticate, generateQuiz);
router.post('/submit', authenticate, submitQuiz);
router.get('/analytics', authenticate, getAnalytics);

export default router; 