import OpenAI from 'openai';
import { IQuestion } from '../models/Question';

// Debug logging
console.log('Environment variables:', {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Set' : 'Not set',
  NODE_ENV: process.env.NODE_ENV
});

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateQuestions = async (content: string): Promise<Partial<IQuestion>[]> => {
  try {
    const chunks = splitContentIntoChunks(content);
    const questions: Partial<IQuestion>[] = [];

    for (const chunk of chunks) {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a nursing education expert. Generate multiple-choice and theory questions based on the provided content. Format each question as a JSON object with type, question, options (for multiple-choice), answer, topic, and difficulty fields."
          },
          {
            role: "user",
            content: chunk
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
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

const splitContentIntoChunks = (content: string, maxLength: number = 4000): string[] => {
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxLength) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}; 