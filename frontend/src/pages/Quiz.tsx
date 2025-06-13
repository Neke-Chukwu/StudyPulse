import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { pageTransition, fadeIn, buttonHover, buttonTap } from '../utils/animations';

interface Question {
  _id: string;
  type: 'mcq' | 'theory';
  question: string;
  options?: string[];
  answer: string;
  topic: string;
}

const Quiz = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // TODO: Implement API call to fetch questions
        // For now, using sample data
        setQuestions([
          {
            _id: '1',
            type: 'mcq',
            question: 'What is the primary function of the heart?',
            options: [
              'Pumping blood throughout the body',
              'Filtering blood',
              'Producing blood cells',
              'Storing blood',
            ],
            answer: 'Pumping blood throughout the body',
            topic: 'Anatomy and Physiology',
          },
          // Add more sample questions here
        ]);
      } catch (error) {
        toast.error('Failed to load questions');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topicId, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion]._id]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(answers[questions[currentQuestion + 1]._id] || '');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(answers[questions[currentQuestion - 1]._id] || '');
    }
  };

  const handleSubmit = () => {
    const score = questions.reduce((acc, question) => {
      return acc + (answers[question._id] === question.answer ? 1 : 0);
    }, 0);

    navigate('/quiz-results', {
      state: {
        score,
        totalQuestions: questions.length,
        answers,
        questions,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <div className="text-lg font-medium text-gray-900">
            Time Left: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mb-8"
          >
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              {questions[currentQuestion].question}
            </h3>

            {questions[currentQuestion].type === 'mcq' && (
              <div className="space-y-4">
                {questions[currentQuestion].options?.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full p-4 text-left rounded-lg border ${
                      selectedAnswer === option
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between">
          <motion.button
            whileHover={buttonHover}
            whileTap={buttonTap}
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn-secondary disabled:opacity-50"
          >
            Previous
          </motion.button>

          {currentQuestion === questions.length - 1 ? (
            <motion.button
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={handleSubmit}
              className="btn-primary"
            >
              Submit Quiz
            </motion.button>
          ) : (
            <motion.button
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={handleNext}
              className="btn-primary"
            >
              Next
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Quiz; 