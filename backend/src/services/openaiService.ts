// backend/src/services/openaiService.ts
import OpenAI from 'openai';
import { IQuestion } from '../models/Question';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const MAX_TOKENS_PER_REQUEST = 1000;
const MAX_CHUNK_SIZE = 4000;

let openaiClientInstance: OpenAI | null = null;
let requestCount = 0;
let lastRequestTime = Date.now();

const getOpenAIClient = (): OpenAI => {
    if (!openaiClientInstance) {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.error("Critical Error: OPENAI_API_KEY environment variable is missing");
            throw new Error('OPENAI_API_KEY environment variable is not set');
        }

        openaiClientInstance = new OpenAI({ apiKey });
        console.log("OpenAI client successfully initialized");
    }

    return openaiClientInstance;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const rateLimit = async (): Promise<void> => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < 1000) { // Rate limit to 1 request per second
        await sleep(1000 - timeSinceLastRequest);
    }
    
    lastRequestTime = Date.now();
    requestCount++;
};

const retryWithBackoff = async <T>(
    operation: () => Promise<T>,
    retries: number = MAX_RETRIES
): Promise<T> => {
    try {
        await rateLimit();
        return await operation();
    } catch (error) {
        if (retries > 0 && error instanceof Error) {
            console.warn(`Operation failed, retrying... (${retries} attempts left)`);
            await sleep(RETRY_DELAY * (MAX_RETRIES - retries + 1));
            return retryWithBackoff(operation, retries - 1);
        }
        throw error;
    }
};

const splitContentIntoChunks = (content: string, maxLength: number = MAX_CHUNK_SIZE): string[] => {
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

const generateQuestions = async (content: string): Promise<Partial<IQuestion>[]> => {
    try {
        const openai = getOpenAIClient();
        const chunks = splitContentIntoChunks(content);
        const questions: Partial<IQuestion>[] = [];

        for (const chunk of chunks) {
            const response = await retryWithBackoff(async () => {
                return await openai.chat.completions.create({
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
                    max_tokens: MAX_TOKENS_PER_REQUEST,
                    response_format: { type: "json_object" }
                });
            });

            const rawContent = response.choices[0].message.content;
            if (!rawContent) {
                console.warn('OpenAI returned empty content for question generation');
                continue;
            }

            try {
                const generatedQuestions = JSON.parse(rawContent);
                if (Array.isArray(generatedQuestions)) {
                    questions.push(...generatedQuestions);
                } else if (typeof generatedQuestions === 'object') {
                    questions.push(generatedQuestions);
                }
            } catch (jsonError) {
                console.error('Failed to parse JSON from OpenAI response:', jsonError);
                continue;
            }
        }

        return questions;
    } catch (error) {
        console.error('Error generating questions:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to generate questions');
    }
};

export { generateQuestions, getOpenAIClient };
