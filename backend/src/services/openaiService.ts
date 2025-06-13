// backend/src/services/openaiService.ts
import OpenAI from 'openai';
import { IQuestion } from '../models/Question'; 


let openaiClientInstance: OpenAI | null = null;


export function getOpenAIClient(): OpenAI {
    
    if (!openaiClientInstance) {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.error("Critical Error: OPENAI_API_KEY environment variable is missing when getOpenAIClient() was called.");
            throw new Error('OPENAI_API_KEY environment variable is not set');
        }

        
        openaiClientInstance = new OpenAI({ apiKey });
        console.log("OpenAI client successfully initialized."); 
    }

    return openaiClientInstance;
}



export const generateQuestions = async (content: string): Promise<Partial<IQuestion>[]> => {
    try {
        // Get the OpenAI client instance here, ensuring it's initialized with the key
        const openai = getOpenAIClient(); // <--- IMPORTANT: Call the new function here

        const chunks = splitContentIntoChunks(content);
        const questions: Partial<IQuestion>[] = [];

        for (const chunk of chunks) {
            const response = await openai.chat.completions.create({
                model: "gpt-4", // Ensure you have access to GPT-4 
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
                max_tokens: 1000,
                 // Add response_format to ensure JSON output from GPT-4
                response_format: { type: "json_object" }
            });

            const rawContent = response.choices[0].message.content;
            if (!rawContent) {
                console.warn('OpenAI returned empty content for question generation.');
                continue; // Skip this chunk if content is empty
            }

            let generatedQuestions: Partial<IQuestion>[] = [];
            try {
                generatedQuestions = JSON.parse(rawContent);
            } catch (jsonError) {
                console.error('Failed to parse JSON from OpenAI response:', jsonError, 'Raw content:', rawContent);
                // Depending on requirements, you might want to skip this chunk or throw a specific error
                continue;
            }

            questions.push(...generatedQuestions);
        }

        return questions;
    } catch (error) {
        console.error('Error generating questions:', error);
        throw new Error('Failed to generate questions');
    }
};

// This utility function remains the same
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
