'use client';

import { useEffect, useRef } from 'react';
import { useLearning } from './LearningProvider';
import { getLessonProgress } from '@/lib/learning-progress.mjs';

export default function LessonProgress({ conceptId }) {
  const { progress, lessons, ready, dispatch } = useLearning();
  const visited = useRef(false);
  const lesson = lessons.find(item => item.id === conceptId);
  const status = getLessonProgress(progress, lesson);
  useEffect(() => {
    if (ready && !visited.current) {
      visited.current = true;
      dispatch({ type: 'visit', conceptId });
    }
  }, [ready, conceptId, dispatch]);
  return (
    <div className="lesson-progress-strip" aria-label="이 개념의 학습 기록">
      <span data-reading-status={status.read ? 'complete' : 'incomplete'}>{ready ? (status.read ? '✓ 읽기 완료' : '읽는 중') : '학습 기록 불러오는 중…'}</span>
      {ready && <span>{status.checked ? `최근 퀴즈 ${status.score}/${status.total}` : status.draftCount ? `퀴즈 ${status.draftCount}/${status.total} 답변 중` : '퀴즈 미응시'}</span>}
      <a href="#quiz">학습 확인 ↓</a><a href="/learn/#my-progress">내 학습 현황 ↗</a>
    </div>
  );
}

export function ReadCompletionButton({ conceptId }) {
  const { progress, lessons, ready, dispatch } = useLearning();
  const status = getLessonProgress(progress, lessons.find(item => item.id === conceptId));
  return <button className={`button ${status.read ? 'learning-read-done' : 'navy'}`} type="button"
    disabled={!ready} aria-pressed={status.read} data-read-complete={conceptId}
    onClick={() => dispatch({ type: 'read', conceptId, done: !status.read })}>
    {status.read ? '✓ 읽기 완료 · 표시 취소' : '이 개념 읽기 완료로 표시'}
  </button>;
}

export function LessonBadge({ conceptId }) {
  const { progress, lessons, ready } = useLearning();
  if (!ready) return null;
  const status = getLessonProgress(progress, lessons.find(item => item.id === conceptId));
  if (!status.visited && !status.read && !status.checked && status.draft === null) return null;
  return <span className="lesson-learning-badge" data-lesson-badge={conceptId}>
    {status.read ? '읽기 완료' : '읽는 중'}
    {status.checked ? ` · 퀴즈 ${status.score}/${status.total}` : status.draft !== null ? ` · ${status.draftCount}/${status.total} 답변 중` : ''}
    {status.needsReview ? ' · 복습 필요' : ''}
  </span>;
}
