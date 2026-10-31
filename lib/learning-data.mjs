import { concepts } from './data.mjs';
import { conceptQuizzes, quizRevision } from './concept-quizzes.mjs';

// Only compact lesson identities and grading rules go into the shared store.
// The full quiz text is passed only to its concept page.
export const learningLessons = concepts.map(concept => ({
  id: concept.id, title: concept.title, number: concept.num, category: concept.category,
  quizRevision,
  questions: conceptQuizzes[concept.id].map(question => ({
    id: question.id, correct: question.correct, options: question.options.map(option => option.id),
  })),
}));
