import OpenAI from 'openai';
import { Question } from '../models/Question';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuestions = async (content: string): Promise<Partial<Question>[]> => {
  try {
    // Split content into chunks to handle large PDFs
    const chunks = splitContentIntoChunks(content, 4000);
    const questions: Partial<Question>[] = [];

    for (const chunk of chunks) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert at creating educational questions. Generate multiple-choice and theory questions based on the provided content. 
            For multiple-choice questions, provide 4 options with one correct answer.
            For theory questions, provide a detailed answer.
            Format your response as a JSON array of questions, where each question has:
            - type: "mcq" or "theory"
            - question: the question text
            - options: array of 4 options (for MCQ only)
            - answer: the correct answer or detailed explanation
            - topic: the main topic of the question
            - difficulty: "easy", "medium", or "hard"`,
          },
          {
            role: 'user',
            content: chunk,
          },
        ],
      });

      const generatedQuestions = JSON.parse(response.choices[0].message.content || '[]');
      questions.push(...generatedQuestions);
    }

    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions');
  }
};

const splitContentIntoChunks = (content: string, maxLength: number): string[] => {
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxLength) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}; 