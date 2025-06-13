import { Request, Response } from 'express';
import { parsePDF } from '../services/pdfService';
import { generateQuestions } from '../services/openaiService';
import { Question } from '../models/Question';

export const uploadPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const filePath = req.file.path;
    const content = await parsePDF(filePath);
    const questions = await generateQuestions(content);

    // Save questions to database
    await Question.insertMany(questions);

    res.status(200).json({
      message: 'PDF processed successfully',
      questionsCount: questions.length
    });
    return;
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ message: 'Error processing PDF' });
    return;
  }
}; 