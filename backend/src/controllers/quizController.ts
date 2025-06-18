import { Request, Response } from 'express';
import { Question } from '../models/Question';
import { calculateScore, getQuizAnalytics, getQuestionAnalytics } from '../services/quizService';
import { Types } from 'mongoose';

const generateQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic, difficulty, count = 10 } = req.query;
    const query: any = {};

    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;

    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: Number(count) } }
    ]);

    if (questions.length === 0) {
      res.status(404).json({ message: 'No questions found for the given criteria' });
      return;
    }

    res.status(200).json({ questions });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ message: 'Error generating quiz' });
  }
};

const submitQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const { answers, timeSpent } = req.body;
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const userId = new Types.ObjectId(req.user!.id);

    if (!Array.isArray(answers) || answers.length === 0) {
      res.status(400).json({ message: 'Invalid answers format' });
      return;
    }

    const result = await calculateScore(userId, answers, timeSpent);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Error submitting quiz' });
  }
};

const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const userId = new Types.ObjectId(req.user!.id);
    const quizAnalytics = await getQuizAnalytics(userId);
    const questionAnalytics = await getQuestionAnalytics(userId);

    res.status(200).json({
      quizAnalytics,
      questionAnalytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

export { generateQuiz, submitQuiz, getAnalytics }; 