import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  type: 'mcq' | 'theory';
  question: string;
  options?: string[];
  answer: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  type: {
    type: String,
    required: true,
    enum: ['mcq', 'theory'],
    index: true
  },
  question: {
    type: String,
    required: true,
    index: true
  },
  options: {
    type: [String],
    required: function(this: IQuestion) {
      return this.type === 'mcq';
    }
  },
  answer: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true,
    index: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for common queries
QuestionSchema.index({ topic: 1, type: 1 });
QuestionSchema.index({ topic: 1, difficulty: 1 });
QuestionSchema.index({ type: 1, difficulty: 1 });

// Text index for search functionality
QuestionSchema.index({ question: 'text', answer: 'text' });

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema); 