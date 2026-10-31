import assert from 'node:assert/strict';
import { concepts } from '../lib/data.mjs';
import { conceptQuizzes, quizRevision } from '../lib/concept-quizzes.mjs';
import { learningLessons } from '../lib/learning-data.mjs';
import {
  applyLearningAction, commitLearningAction, emptyLearningProgress, getLessonProgress,
  learningStorageKey, loadLearningProgress, nextLearningLesson, normalizeLearningProgress,
  parseLearningProgress, summarizeLearning,
} from '../lib/learning-progress.mjs';

assert.deepEqual(Object.keys(conceptQuizzes), concepts.map(concept => concept.id));
const ids = new Set();
const prompts = new Set();
const anchors = new Set(['what', 'why', 'how', 'structure', 'misconceptions', 'question']);
const answerPositions = { a: 0, b: 0, c: 0 };
for (const concept of concepts) {
  const questions = conceptQuizzes[concept.id];
  assert.equal(questions.length, 3, concept.id);
  for (const question of questions) {
    assert(!ids.has(question.id) && !prompts.has(question.question), question.id);
    ids.add(question.id); prompts.add(question.question);
    assert(question.question.length > 10 && question.explanation.length > 35, question.id);
    assert.equal(question.options.length, 3);
    assert.equal(new Set(question.options.map(option => option.text)).size, 3);
    assert.equal(question.options.filter(option => option.id === question.correct).length, 1);
    assert(anchors.has(question.review));
    answerPositions[question.correct]++;
  }
}
assert.equal(ids.size, 90);
assert.deepEqual(Object.values(answerPositions), [30, 30, 30]);
assert.equal(learningLessons.length, 30);
assert(Buffer.byteLength(JSON.stringify(learningLessons)) < 20000, 'Global store uses compact rules.');

const time = '2026-10-31T00:00:00.000Z';
const later = '2026-10-31T00:01:00.000Z';
const hbm = learningLessons.find(lesson => lesson.id === 'hbm');
const dram = learningLessons.find(lesson => lesson.id === 'dram');
let progress = emptyLearningProgress();
const act = (state, action, at = time) => applyLearningAction(state, { conceptId: hbm.id, ...action }, learningLessons, at);
assert.equal(nextLearningLesson(progress, learningLessons).lesson.id, 'semiconductor');
progress = act(progress, { type: 'visit' });
assert.equal(getLessonProgress(progress, hbm).read, false, 'A visit is not reading completion.');
assert.equal(nextLearningLesson(progress, learningLessons).lesson.id, 'hbm');
assert.equal(act(progress, { type: 'submit' }), progress, 'Incomplete submissions are rejected.');
const firstQuestion = hbm.questions[0];
progress = act(progress, { type: 'answer', questionId: firstQuestion.id, optionId: firstQuestion.correct });
assert.equal(getLessonProgress(progress, hbm).draftCount, 1);
progress = parseLearningProgress(JSON.stringify(progress), learningLessons).progress;
assert.equal(getLessonProgress(progress, hbm).draftCount, 1, 'Partial draft survives serialization.');
for (const question of hbm.questions.slice(1)) progress = act(progress, { type: 'answer', questionId: question.id, optionId: question.options.find(option => option !== question.correct) });
progress = act(progress, { type: 'submit' });
assert.equal(getLessonProgress(progress, hbm).score, 1);
assert.equal(getLessonProgress(progress, hbm).needsReview, true);
assert.equal(getLessonProgress(progress, hbm).read, false, 'A quiz does not silently mark reading complete.');
assert.equal(act(progress, { type: 'answer', questionId: firstQuestion.id, optionId: 'b' }), progress, 'Checked answers require an explicit retry.');
progress = act(progress, { type: 'retry' });
assert.equal(getLessonProgress(progress, hbm).score, 1, 'Retry preserves the last completed attempt.');
assert.deepEqual(getLessonProgress(progress, hbm).draft, {});
for (const question of hbm.questions) progress = act(progress, { type: 'answer', questionId: question.id, optionId: question.correct });
progress = act(progress, { type: 'submit' }, later);
progress = act(progress, { type: 'read', done: true }, later);
assert.equal(getLessonProgress(progress, hbm).score, 3);
assert.equal(getLessonProgress(progress, hbm).mastered, true);
assert.equal(nextLearningLesson(progress, learningLessons).lesson.id, 'integration');
assert.deepEqual(summarizeLearning(progress, learningLessons), { read: 1, checked: 1, mastered: 1, review: 0, inProgress: 0 });
progress = act(progress, { type: 'read', done: false });
assert.equal(getLessonProgress(progress, hbm).read, false);
assert.equal(getLessonProgress(progress, hbm).mastered, true, 'Undoing reading preserves the quiz result.');

const forged = JSON.parse(JSON.stringify(progress));
forged.lessons.hbm.latest.score = 99;
forged.lessons.hbm.latest.answers[firstQuestion.id] = 'not-an-option';
forged.lessons.hbm.draft = { [firstQuestion.id]: 'bad', unknown: 'a' };
const sanitized = normalizeLearningProgress(forged, learningLessons);
assert.equal(getLessonProgress(sanitized, hbm).checked, false, 'Invalid/incomplete saved attempts cannot claim completion.');
assert.equal(getLessonProgress(sanitized, hbm).draftCount, 0);
const outdated = JSON.parse(JSON.stringify(progress));
outdated.lessons.hbm.readAt = time;
outdated.lessons.hbm.quizRevision = 'old-revision';
const migrated = normalizeLearningProgress(outdated, learningLessons);
assert.equal(getLessonProgress(migrated, hbm).read, true);
assert.equal(getLessonProgress(migrated, hbm).checked, false, 'Changed quizzes need a new attempt.');
assert.equal(quizRevision, hbm.quizRevision);
assert.equal(parseLearningProgress('{broken', learningLessons).issue, 'unreadable');
assert.equal(parseLearningProgress(JSON.stringify({ version: 99, lessons: {} }), learningLessons).issue, 'unreadable');
const prototype = JSON.parse('{"version":1,"lessons":{"__proto__":{"readAt":"2026-10-31T00:00:00.000Z"},"constructor":{"readAt":"2026-10-31T00:00:00.000Z"}}}');
assert.deepEqual(normalizeLearningProgress(prototype, learningLessons).lessons, {});
assert.equal(applyLearningAction(progress, { type: 'read', done: true, conceptId: 'constructor' }, learningLessons), progress);

const values = new Map([['unrelated-setting', 'keep-me']]);
const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
let firstTab = commitLearningAction(storage, emptyLearningProgress(), { type: 'read', conceptId: hbm.id, done: true }, learningLessons, time);
let secondTab = commitLearningAction(storage, emptyLearningProgress(), { type: 'read', conceptId: dram.id, done: true }, learningLessons, later);
assert.equal(summarizeLearning(secondTab.progress, learningLessons).read, 2, 'Another tab retains the first tab lesson.');
firstTab = commitLearningAction(storage, firstTab.progress, { type: 'visit', conceptId: hbm.id }, learningLessons, later);
assert.equal(summarizeLearning(firstTab.progress, learningLessons).read, 2, 'Stale tab mutations merge persisted lessons.');
assert.equal(values.get('unrelated-setting'), 'keep-me');
assert.equal(loadLearningProgress(storage, learningLessons).status, 'saved');
const blockedStorage = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
assert.equal(loadLearningProgress(blockedStorage, learningLessons).status, 'temporary');
const quotaStorage = { ...storage, setItem() { throw new Error('quota'); } };
const quota = commitLearningAction(quotaStorage, secondTab.progress, { type: 'answer', conceptId: dram.id, questionId: dram.questions[0].id, optionId: 'a' }, learningLessons, time);
assert.equal(quota.status, 'temporary');
assert.equal(getLessonProgress(quota.progress, dram).draftCount, 1, 'Write failures preserve an in-memory attempt.');
values.set(learningStorageKey, '{broken');
const preserved = commitLearningAction(storage, emptyLearningProgress(), { type: 'visit', conceptId: hbm.id }, learningLessons, time);
assert.equal(preserved.status, 'unreadable');
assert.equal(values.get(learningStorageKey), '{broken', 'Unreadable records are not overwritten.');

let complete = emptyLearningProgress();
for (const lesson of learningLessons) {
  complete = applyLearningAction(complete, { type: 'read', conceptId: lesson.id, done: true }, learningLessons, time);
  for (const question of lesson.questions) complete = applyLearningAction(complete, { type: 'answer', conceptId: lesson.id, questionId: question.id, optionId: question.correct }, learningLessons, time);
  complete = applyLearningAction(complete, { type: 'submit', conceptId: lesson.id }, learningLessons, time);
}
assert.deepEqual(summarizeLearning(complete, learningLessons), { read: 30, checked: 30, mastered: 30, review: 0, inProgress: 0 });
assert.equal(nextLearningLesson(complete, learningLessons), null);
console.log('Learning PASS: 30 lessons, 90 unique questions/explanations/review targets; separate reading/quiz progress, drafts, retries, grading, schema/revision validation, storage failure fallback, cross-tab merge and full-course completion.');
