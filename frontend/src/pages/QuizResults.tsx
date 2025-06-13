import { useLocation, useNavigate } from 'react-router-dom';
import { useQuizAnalyticsQuery } from '../api/quiz';

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

export const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quizResult = location.state?.result as QuizResult;
  const { data: analytics } = useQuizAnalyticsQuery();

  if (!quizResult) {
    return <div>No quiz results found</div>;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6">Quiz Results</h1>
        
        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Score</h3>
            <p className={`text-4xl font-bold ${getScoreColor(quizResult.score)}`}>
              {quizResult.score.toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Correct Answers</h3>
            <p className="text-4xl font-bold text-green-600">
              {quizResult.correctAnswers}/{quizResult.totalQuestions}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Time Spent</h3>
            <p className="text-4xl font-bold text-blue-600">
              {Math.floor(quizResult.timeSpent / 60)}m {quizResult.timeSpent % 60}s
            </p>
          </div>
        </div>

        {/* Performance Comparison */}
        {analytics && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Performance Comparison</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span>Your Score</span>
                <span className="font-semibold">{quizResult.score.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Average Score</span>
                <span className="font-semibold">{analytics.averageScore.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Question Review */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Question Review</h2>
          <div className="space-y-6">
            {quizResult.questions.map((q, index) => (
              <div
                key={q.questionId}
                className={`p-4 rounded-lg border ${
                  q.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Question {index + 1}</h3>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      q.isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {q.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">Your Answer: {q.userAnswer}</p>
                  {!q.isCorrect && (
                    <p className="text-gray-600">Correct Answer: {q.correctAnswer}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => navigate('/quiz')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Take Another Quiz
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
        >
          View Dashboard
        </button>
      </div>
    </div>
  );
}; 