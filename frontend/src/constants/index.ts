export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
  QUIZ: {
    GENERATE: `${API_BASE_URL}/quiz/generate`,
    SUBMIT: `${API_BASE_URL}/quiz/submit`,
    ANALYTICS: `${API_BASE_URL}/quiz/analytics`,
  },
  ADMIN: {
    UPLOAD_PDF: `${API_BASE_URL}/admin/upload-pdf`,
    GET_QUESTIONS: `${API_BASE_URL}/admin/questions`,
    DELETE_QUESTION: `${API_BASE_URL}/admin/questions`,
  },
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'studypulse_token',
  USER: 'studypulse_user',
} as const;

export const QUIZ_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export const QUESTION_TYPES = {
  MCQ: 'mcq',
  THEORY: 'theory',
} as const; 