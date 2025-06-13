import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, staggerContainer, listItem } from '../utils/animations';

interface QuizResult {
  score: number;
  totalQuestions: number;
  answers: { [key: string]: string };
  questions: {
    _id: string;
    question: string;
    options?: string[];
    answer: string;
    type: 'mcq' | 'theory';
  }[];
}

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state as QuizResult;

  if (!result) {
    navigate('/dashboard');
    return null;
  }

  const percentageScore = Math.round((result.score / result.totalQuestions) * 100);
  const scoreColor =
    percentageScore >= 80
      ? 'text-green-600'
      : percentageScore >= 60
      ? 'text-yellow-600'
      : 'text-red-600';

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h2>
            <div className={`text-5xl font-bold ${scoreColor} mb-4`}>
              {percentageScore}%
            </div>
            <p className="text-gray-600">
              You got {result.score} out of {result.totalQuestions} questions correct
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            {result.questions.map((question, index) => (
              <motion.div
                key={question._id}
                variants={listItem}
                className="border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    Question {index + 1}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      result.answers[question._id] === question.answer
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.answers[question._id] === question.answer
                      ? 'Correct'
                      : 'Incorrect'}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{question.question}</p>
                {question.type === 'mcq' && (
                  <div className="space-y-2">
                    {question.options?.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded ${
                          option === question.answer
                            ? 'bg-green-50 border border-green-200'
                            : option === result.answers[question._id] &&
                              option !== question.answer
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
                {result.answers[question._id] !== question.answer && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Correct Answer:</span>{' '}
                      {question.answer}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="mt-8 flex justify-center space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Back to Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/theory-review')}
              className="btn-primary"
            >
              Review Theory
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizResults; 