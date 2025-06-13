import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizAttempt extends Document {
  user: mongoose.Types.ObjectId;
  questions: {
    question: mongoose.Types.ObjectId;
    userAnswer: string;
    isCorrect: boolean;
  }[];
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuizAttemptSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    questions: [
      {
        question: {
          type: Schema.Types.ObjectId,
          ref: 'Question',
          required: true,
        },
        userAnswer: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    timeSpent: {
      type: Number,
      required: true,
      min: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
QuizAttemptSchema.index({ user: 1, createdAt: -1 });
QuizAttemptSchema.index({ score: -1 });

export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema); 