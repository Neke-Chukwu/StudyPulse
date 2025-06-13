import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  questions: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    userAnswer: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
quizAttemptSchema.index({ user: 1, topic: 1, createdAt: -1 });

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

export default QuizAttempt; 