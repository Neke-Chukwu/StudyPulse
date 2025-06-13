import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'theory'],
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: function() {
      return this.type === 'mcq';
    }
  },
  answer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
questionSchema.index({ topic: 1, type: 1, difficulty: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question; 