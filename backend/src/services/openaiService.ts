import OpenAI from 'openai';
import { Question } from '../models/Question';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateQuestions = async (content: string): Promise<Partial<Question>[]> => {
  try {
    // Split content into chunks if it's too long
    const chunks = splitContentIntoChunks(content, 4000);

    const questions: Partial<Question>[] = [];

    for (const chunk of chunks) {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert nursing educator. Generate multiple-choice and theory questions from the provided content. 
            For each question, provide:
            1. The question text
            2. For MCQs: 4 options and the correct answer
            3. For theory questions: a detailed answer
            Format the response as a JSON array of questions.`
          },
          {
            role: "user",
            content: chunk
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
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
  const chunks: string[] = [];
  let currentChunk = '';

  // Split content into sentences
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [];

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