import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from './client';
import { API_ENDPOINTS } from '../constants';

interface QuizGenerationParams {
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  count?: number;
}

interface QuizSubmission {
  answers: { questionId: string; answer: string }[];
  timeSpent: number;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number;
  questions: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    correctAnswer: string;
  }[];
}

interface QuizAnalytics {
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  accuracy: number;
  recentAttempts: any[];
  topicPerformance: {
    topic: string;
    averageScore: number;
    totalAttempts: number;
  }[];
  difficultyPerformance: {
    difficulty: string;
    averageScore: number;
    totalAttempts: number;
  }[];
}

const generateQuiz = async (params: QuizGenerationParams) => {
  const { data } = await apiClient.get(API_ENDPOINTS.QUIZ.GENERATE, { params });
  return data;
};

const submitQuiz = async (submission: QuizSubmission): Promise<QuizResult> => {
  const { data } = await apiClient.post<QuizResult>(API_ENDPOINTS.QUIZ.SUBMIT, submission);
  return data;
};

const getQuizAnalytics = async (): Promise<QuizAnalytics> => {
  const { data } = await apiClient.get<QuizAnalytics>(API_ENDPOINTS.QUIZ.ANALYTICS);
  return data;
};

export const useGenerateQuizQuery = (params: QuizGenerationParams) => {
  return useQuery({
    queryKey: ['quiz', 'generate', params],
    queryFn: () => generateQuiz(params),
    enabled: false, // Only run when explicitly called
  });
};

export const useSubmitQuizMutation = () => {
  return useMutation({
    mutationFn: submitQuiz,
  });
};

export const useQuizAnalyticsQuery = () => {
  return useQuery({
    queryKey: ['quiz', 'analytics'],
    queryFn: getQuizAnalytics,
  });
}; 