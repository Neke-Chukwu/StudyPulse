import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from './client';
import { API_ENDPOINTS } from '../constants';

interface Question {
  id: string;
  type: 'mcq' | 'theory';
  question: string;
  options?: string[];
  answer: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuestionsResponse {
  questions: Question[];
  total: number;
  page: number;
  totalPages: number;
}

interface UploadPDFResponse {
  message: string;
  questionsCount: number;
}

const uploadPDF = async (file: File): Promise<UploadPDFResponse> => {
  const formData = new FormData();
  formData.append('pdf', file);

  const { data } = await apiClient.post<UploadPDFResponse>(
    API_ENDPOINTS.ADMIN.UPLOAD_PDF,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
};

const getQuestions = async (params: {
  topic?: string;
  type?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
}): Promise<QuestionsResponse> => {
  const { data } = await apiClient.get<QuestionsResponse>(API_ENDPOINTS.ADMIN.GET_QUESTIONS, {
    params,
  });
  return data;
};

const deleteQuestion = async (id: string): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.ADMIN.DELETE_QUESTION}/${id}`);
};

export const useUploadPDFMutation = () => {
  return useMutation({
    mutationFn: uploadPDF,
  });
};

export const useQuestionsQuery = (params: {
  topic?: string;
  type?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => getQuestions(params),
  });
};

export const useDeleteQuestionMutation = () => {
  return useMutation({
    mutationFn: deleteQuestion,
  });
}; 