import { QuizAttempt } from '../models/QuizAttempt';
import { Question } from '../models/Question';
import { Types } from 'mongoose';

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number;
  questions: {
    questionId: Types.ObjectId;
    userAnswer: string;
    isCorrect: boolean;
    correctAnswer: string;
  }[];
}

interface QuizAnalytics {
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  accuracy: number;
  recentAttempts: any[];
  topicPerformance: {
    topic: string;
    averageScore: number;
    totalAttempts: number;
  }[];
  difficultyPerformance: {
    difficulty: string;
    averageScore: number;
    totalAttempts: number;
  }[];
}

const validateQuizSubmission = (
  answers: { questionId: string; answer: string }[],
  timeSpent: number
): { isValid: boolean; error?: string } => {
  if (!Array.isArray(answers) || answers.length === 0) {
    return { isValid: false, error: 'No answers provided' };
  }

  if (timeSpent < 0) {
    return { isValid: false, error: 'Invalid time spent' };
  }

  for (const answer of answers) {
    if (!answer.questionId || !answer.answer) {
      return { isValid: false, error: 'Invalid answer format' };
    }
  }

  return { isValid: true };
};

const calculateScore = async (
  userId: Types.ObjectId,
  answers: { questionId: string; answer: string }[],
  timeSpent: number
): Promise<QuizResult> => {
  try {
    const validation = validateQuizSubmission(answers, timeSpent);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const questionIds = answers.map(a => new Types.ObjectId(a.questionId));
    const questions = await Question.find({ _id: { $in: questionIds } });
    
    if (questions.length !== answers.length) {
      throw new Error('Some questions were not found');
    }

    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));
    let correctAnswers = 0;
    const detailedResults = [];

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (!question) continue;

      const isCorrect = question.answer.toLowerCase() === answer.answer.toLowerCase();
      if (isCorrect) correctAnswers++;

      detailedResults.push({
        questionId: question._id,
        userAnswer: answer.answer,
        isCorrect,
        correctAnswer: question.answer
      });
    }

    const totalQuestions = questions.length;
    const score = (correctAnswers / totalQuestions) * 100;

    const quizAttempt = new QuizAttempt({
      user: userId,
      score,
      totalQuestions,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      timeSpent,
      questions: detailedResults,
      completed: true
    });

    await quizAttempt.save();

    return {
      score,
      totalQuestions,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      timeSpent,
      questions: detailedResults
    };
  } catch (error) {
    console.error('Error calculating quiz score:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to calculate quiz score');
  }
};

const getQuizAnalytics = async (userId: Types.ObjectId): Promise<QuizAnalytics> => {
  try {
    const attempts = await QuizAttempt.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const totalAttempts = attempts.length;
    const averageScore = attempts.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts;
    const highestScore = Math.max(...attempts.map(a => a.score));
    const totalQuestionsAnswered = attempts.reduce((acc, curr) => acc + curr.totalQuestions, 0);
    const totalCorrectAnswers = attempts.reduce((acc, curr) => acc + curr.correctAnswers, 0);

    // Get topic performance
    const topicPerformance = await QuizAttempt.aggregate([
      { $match: { user: userId } },
      { $unwind: '$questions' },
      {
        $lookup: {
          from: 'questions',
          localField: 'questions.questionId',
          foreignField: '_id',
          as: 'questionDetails'
        }
      },
      { $unwind: '$questionDetails' },
      {
        $group: {
          _id: '$questionDetails.topic',
          averageScore: { $avg: { $cond: ['$questions.isCorrect', 100, 0] } },
          totalAttempts: { $sum: 1 }
        }
      },
      {
        $project: {
          topic: '$_id',
          averageScore: 1,
          totalAttempts: 1,
          _id: 0
        }
      }
    ]);

    // Get difficulty performance
    const difficultyPerformance = await QuizAttempt.aggregate([
      { $match: { user: userId } },
      { $unwind: '$questions' },
      {
        $lookup: {
          from: 'questions',
          localField: 'questions.questionId',
          foreignField: '_id',
          as: 'questionDetails'
        }
      },
      { $unwind: '$questionDetails' },
      {
        $group: {
          _id: '$questionDetails.difficulty',
          averageScore: { $avg: { $cond: ['$questions.isCorrect', 100, 0] } },
          totalAttempts: { $sum: 1 }
        }
      },
      {
        $project: {
          difficulty: '$_id',
          averageScore: 1,
          totalAttempts: 1,
          _id: 0
        }
      }
    ]);

    return {
      totalAttempts,
      averageScore,
      highestScore,
      totalQuestionsAnswered,
      totalCorrectAnswers,
      accuracy: (totalCorrectAnswers / totalQuestionsAnswered) * 100,
      recentAttempts: attempts,
      topicPerformance,
      difficultyPerformance
    };
  } catch (error) {
    console.error('Error fetching quiz analytics:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch quiz analytics');
  }
};

const getQuestionAnalytics = async (userId: Types.ObjectId) => {
  try {
    const attempts = await QuizAttempt.find({ user: userId });
    const questionStats = new Map();

    attempts.forEach(attempt => {
      attempt.questions.forEach(q => {
        const key = q.questionId.toString();
        if (!questionStats.has(key)) {
          questionStats.set(key, {
            totalAttempts: 0,
            correctAttempts: 0,
            difficulty: 0
          });
        }
        const stats = questionStats.get(key);
        stats.totalAttempts++;
        if (q.isCorrect) stats.correctAttempts++;
      });
    });

    const analytics = Array.from(questionStats.entries()).map(([questionId, stats]) => ({
      questionId,
      totalAttempts: stats.totalAttempts,
      correctAttempts: stats.correctAttempts,
      successRate: (stats.correctAttempts / stats.totalAttempts) * 100
    }));

    return analytics;
  } catch (error) {
    console.error('Error fetching question analytics:', error);
    throw new Error('Failed to fetch question analytics');
  }
};

export { calculateScore, getQuizAnalytics, getQuestionAnalytics, validateQuizSubmission }; 