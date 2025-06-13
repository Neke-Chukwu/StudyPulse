import { Request, Response } from 'express';
import { parsePDF } from '../services/pdfService';
import { generateQuestions } from '../services/openaiService';
import { Question } from '../models/Question';

export const uploadPDF = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse PDF content
    const pdfContent = await parsePDF(req.file.path);

    // Generate questions using OpenAI
    const questions = await generateQuestions(pdfContent);

    // Save questions to database
    const savedQuestions = await Question.insertMany(questions);

    res.status(200).json({
      message: 'PDF uploaded and processed successfully',
      questions: savedQuestions
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ message: 'Error processing PDF' });
  }
}; 