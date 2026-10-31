export const learningStorageKey = 'semi-atlas.learning.v1';
export const emptyLearningProgress = () => ({ version: 1, lessons: {} });
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const timestamp = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
  && Number.isFinite(Date.parse(value)) ? value : null;

function cleanAnswers(value, lesson) {
  if (!object(value)) return {};
  return Object.fromEntries(lesson.questions.flatMap(question => (
    question.options.includes(value[question.id]) ? [[question.id, value[question.id]]] : []
  )));
}

export function normalizeLearningProgress(value, lessons) {
  const output = emptyLearningProgress();
  if (!object(value) || value.version !== 1 || !object(value.lessons)) return output;
  for (const lesson of lessons) {
    const raw = Object.hasOwn(value.lessons, lesson.id) ? value.lessons[lesson.id] : null;
    if (!object(raw)) continue;
    const visitedAt = timestamp(raw.visitedAt);
    const readAt = timestamp(raw.readAt);
    const compatible = raw.quizRevision === lesson.quizRevision;
    const draft = compatible && object(raw.draft) ? cleanAnswers(raw.draft, lesson) : null;
    const submittedAt = compatible && object(raw.latest) ? timestamp(raw.latest.at) : null;
    const latestAnswers = cleanAnswers(raw.latest?.answers, lesson);
    const latest = submittedAt && Object.keys(latestAnswers).length === lesson.questions.length
      ? { at: submittedAt, answers: latestAnswers } : null;
    if (visitedAt || readAt || draft !== null || latest) {
      output.lessons[lesson.id] = { visitedAt, readAt, quizRevision: lesson.quizRevision, draft, latest };
    }
  }
  return output;
}

export function parseLearningProgress(raw, lessons) {
  if (raw === null) return { progress: emptyLearningProgress(), issue: null };
  try {
    if (typeof raw !== 'string' || raw.length > 250000) throw new Error('Invalid record');
    const value = JSON.parse(raw);
    if (!object(value) || !object(value.lessons) || value.version !== 1) throw new Error('Unknown schema');
    return { progress: normalizeLearningProgress(value, lessons), issue: null };
  } catch {
    // Preserve unreadable/newer records instead of overwriting them on a visit.
    return { progress: emptyLearningProgress(), issue: 'unreadable' };
  }
}

export function applyLearningAction(progress, action, lessons, now = new Date().toISOString()) {
  const lesson = lessons.find(item => item.id === action.conceptId);
  if (!lesson || !timestamp(now)) return progress;
  const previous = progress.lessons[lesson.id] || {
    visitedAt: null, readAt: null, quizRevision: lesson.quizRevision, draft: null, latest: null,
  };
  const next = { ...previous, visitedAt: previous.visitedAt || now };
  if (action.type === 'visit') next.visitedAt = now;
  else if (action.type === 'read' && typeof action.done === 'boolean') next.readAt = action.done ? now : null;
  else if (action.type === 'answer') {
    const question = lesson.questions.find(item => item.id === action.questionId);
    if (!question?.options.includes(action.optionId) || (previous.latest && previous.draft === null)) return progress;
    next.draft = { ...previous.draft, [action.questionId]: action.optionId };
  } else if (action.type === 'retry') next.draft = {};
  else if (action.type === 'submit') {
    const answers = cleanAnswers(previous.draft, lesson);
    if (Object.keys(answers).length !== lesson.questions.length) return progress;
    next.latest = { answers, at: now };
    next.draft = null;
  } else return progress;
  return { version: 1, lessons: { ...progress.lessons, [lesson.id]: next } };
}

export function getLessonProgress(progress, lesson) {
  const record = progress.lessons[lesson.id];
  const latest = record?.latest || null;
  const score = latest ? lesson.questions.filter(question => latest.answers[question.id] === question.correct).length : 0;
  return {
    visited: Boolean(record?.visitedAt), read: Boolean(record?.readAt),
    draft: record?.draft ?? null, draftCount: Object.keys(record?.draft || {}).length,
    latest, score, total: lesson.questions.length,
    checked: Boolean(latest), needsReview: Boolean(latest && score < lesson.questions.length),
    mastered: Boolean(latest && score === lesson.questions.length),
  };
}

export function summarizeLearning(progress, lessons) {
  return lessons.reduce((counts, lesson) => {
    const status = getLessonProgress(progress, lesson);
    counts.read += Number(status.read);
    counts.checked += Number(status.checked);
    counts.mastered += Number(status.mastered);
    counts.review += Number(status.needsReview);
    counts.inProgress += Number(status.draft !== null);
    return counts;
  }, { read: 0, checked: 0, mastered: 0, review: 0, inProgress: 0 });
}

export function nextLearningLesson(progress, lessons) {
  const visited = lessons.filter(lesson => progress.lessons[lesson.id]?.visitedAt)
    .sort((a, b) => progress.lessons[b.id].visitedAt.localeCompare(progress.lessons[a.id].visitedAt))[0];
  if (visited && !getLessonProgress(progress, visited).read) return { lesson: visited, reason: 'reading' };
  const start = visited ? lessons.findIndex(item => item.id === visited.id) + 1 : 0;
  const unread = [...lessons.slice(start), ...lessons.slice(0, start)].find(item => !getLessonProgress(progress, item).read);
  if (unread) return { lesson: unread, reason: 'reading' };
  const review = lessons.find(item => getLessonProgress(progress, item).needsReview);
  if (review) return { lesson: review, reason: 'review' };
  const unchecked = lessons.find(item => !getLessonProgress(progress, item).checked || getLessonProgress(progress, item).draft !== null);
  return unchecked ? { lesson: unchecked, reason: 'quiz' } : null;
}

export function loadLearningProgress(storage, lessons) {
  try {
    const result = parseLearningProgress(storage.getItem(learningStorageKey), lessons);
    return { progress: result.progress, status: result.issue ? 'unreadable' : 'saved' };
  } catch {
    return { progress: emptyLearningProgress(), status: 'temporary' };
  }
}

export function commitLearningAction(storage, memory, action, lessons, now) {
  let base = memory;
  let next;
  try {
    if (!storage) throw new Error('Temporary session');
    const loaded = loadLearningProgress(storage, lessons);
    if (loaded.status !== 'saved') return {
      progress: applyLearningAction(memory, action, lessons, now), status: loaded.status,
    };
    // Read just before each mutation so changes to other lessons in another tab
    // are not replaced by this tab's older snapshot.
    base = loaded.progress;
    next = applyLearningAction(base, action, lessons, now);
    storage.setItem(learningStorageKey, JSON.stringify(next));
    return { progress: next, status: 'saved' };
  } catch {
    return { progress: next || applyLearningAction(base, action, lessons, now), status: 'temporary' };
  }
}
