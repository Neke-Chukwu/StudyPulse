import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { pageTransition, fadeIn, staggerContainer, listItem } from '../utils/animations';

interface TheoryQuestion {
  _id: string;
  type: 'theory';
  question: string;
  answer: string;
  topic: string;
}

const TheoryReview = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<TheoryQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // TODO: Implement API call to fetch theory questions
        // For now, using sample data
        setQuestions([
          {
            _id: '1',
            type: 'theory',
            question: 'Explain the process of wound healing.',
            answer: 'Wound healing occurs in four phases: 1) Hemostasis - blood clotting to stop bleeding, 2) Inflammation - white blood cells clean the wound, 3) Proliferation - new tissue forms, and 4) Remodeling - scar tissue forms and strengthens.',
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

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
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
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Theory Review
            </h2>
            <p className="text-gray-600">
              Study and understand key concepts through detailed explanations
            </p>
          </motion.div>

          {questions.length === 0 ? (
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="text-center py-8"
            >
              <p className="text-gray-500">No theory questions available</p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-4"
            >
              {questions.map((question) => (
                <motion.div
                  key={question._id}
                  variants={listItem}
                  className="border rounded-lg overflow-hidden"
                >
                  <motion.button
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    onClick={() => toggleQuestion(question._id)}
                    className="w-full px-4 py-4 text-left flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-900">
                      {question.question}
                    </span>
                    <motion.span
                      animate={{
                        rotate: expandedQuestions.has(question._id) ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      ▼
                    </motion.span>
                  </motion.button>

                  <AnimatePresence>
                    {expandedQuestions.has(question._id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 py-4 bg-gray-50"
                      >
                        <div className="prose max-w-none">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Answer:
                          </h4>
                          <p className="text-gray-700">{question.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="mt-8 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TheoryReview; 