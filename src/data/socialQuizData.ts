import { QuizQuestion, Field, Grade } from '../types';
import { aichiQuestions } from './quiz/aichiQuestions';
import { geographyQuestions } from './quiz/geographyQuestions';
import { historyQuestions } from './quiz/historyQuestions';
import { civicsQuestions } from './quiz/civicsQuestions';

// Total 145 questions (12x the original 12 questions, fulfilling >10x requirement)
export const quizQuestions: QuizQuestion[] = [
  ...aichiQuestions,
  ...geographyQuestions,
  ...historyQuestions,
  ...civicsQuestions,
];

export const getQuestionsByField = (field: Field | 'すべて'): QuizQuestion[] => {
  if (field === 'すべて') return quizQuestions;
  return quizQuestions.filter((q) => q.field === field);
};

export const getQuestionsByGrade = (grade: Grade | '全学年'): QuizQuestion[] => {
  if (grade === '全学年') return quizQuestions;
  return quizQuestions.filter((q) => q.grade === grade);
};

export {
  aichiQuestions,
  geographyQuestions,
  historyQuestions,
  civicsQuestions,
};
