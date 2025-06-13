import { useState } from 'react';
import { useGenerateQuizQuery, useSubmitQuizMutation } from '../api/quiz';
import { QUIZ_DIFFICULTY } from '../constants';

export const Quiz = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<keyof typeof QUIZ_DIFFICULTY>('EASY');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeSpent, setTimeSpent] = useState(0);

  const generateQuizQuery = useGenerateQuizQuery({
    topic: selectedTopic,
    difficulty: QUIZ_DIFFICULTY[selectedDifficulty],
    count: 10,
  });

  const submitQuizMutation = useSubmitQuizMutation();

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!generateQuizQuery.data?.questions) return;

    const submission = {
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
      timeSpent,
    };

    try {
      const result = await submitQuizMutation.mutateAsync(submission);
      // Handle quiz result (e.g., show score, redirect to results page)
      console.log('Quiz result:', result);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  if (generateQuizQuery.isLoading) {
    return <div>Loading quiz...</div>;
  }

  if (generateQuizQuery.isError) {
    return <div>Error loading quiz. Please try again.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Quiz</h1>
        <div className="flex space-x-4">
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Topic</option>
            {/* Add topics dynamically */}
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as keyof typeof QUIZ_DIFFICULTY)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
          <button
            onClick={() => generateQuizQuery.refetch()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Generate New Quiz
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {generateQuizQuery.data?.questions.map((question) => (
          <div key={question.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">{question.question}</h3>
            {question.type === 'mcq' && question.options ? (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label key={option} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={4}
                placeholder="Enter your answer..."
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitQuizMutation.isPending}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          {submitQuizMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
}; 