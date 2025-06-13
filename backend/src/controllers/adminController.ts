import { Request, Response } from 'express';
import { parsePDF } from '../services/pdfService';
import { generateQuestions } from '../services/openaiService';
import { Question } from '../models/Question';

const uploadPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const content = await parsePDF(req.file.path);
    const questions = await generateQuestions(content);

    await Question.insertMany(questions);

    res.status(200).json({ 
      message: 'PDF processed successfully',
      questionsCount: questions.length
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ message: 'Error processing PDF' });
  }
};

const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic, type, difficulty, page = 1, limit = 10 } = req.query;
    const query: any = {};

    if (topic) query.topic = topic;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;

    const skip = (Number(page) - 1) * Number(limit);
    const questions = await Question.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Question.countDocuments(query);

    res.status(200).json({
      questions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
};

const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Error deleting question' });
  }
};

export { uploadPDF, getQuestions, deleteQuestion }; 