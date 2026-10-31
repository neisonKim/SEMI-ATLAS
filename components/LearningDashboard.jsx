'use client';

import { useState } from 'react';
import { useLearning, LearningStorageNotice } from './LearningProvider';
import { getLessonProgress, nextLearningLesson, summarizeLearning } from '@/lib/learning-progress.mjs';

export default function LearningDashboard() {
  const { lessons, progress, ready } = useLearning();
  const [filter, setFilter] = useState('all');
  const summary = summarizeLearning(progress, lessons);
  const resume = nextLearningLesson(progress, lessons);
  const filters = [['all', '전체', lessons.length], ['read', '읽기 완료', summary.read], ['review', '복습 필요', summary.review], ['draft', '답변 중', summary.inProgress]];
  const matches = lessons.filter(lesson => {
    const status = getLessonProgress(progress, lesson);
    return filter === 'all' || (filter === 'read' && status.read) || (filter === 'review' && status.needsReview) || (filter === 'draft' && status.draft !== null);
  });
  return (
    <section className="container learning-dashboard" id="my-progress" aria-labelledby="learning-dashboard-title">
      <span className="eyebrow">YOUR LEARNING, SAVED</span>
      <div className="learning-dashboard-heading"><h2 id="learning-dashboard-title">내 학습 현황</h2><a href="#phase-basics">전체 학습 경로 ↓</a></div>
      <p className="learning-privacy">기록은 이 기기·브라우저에만 저장됩니다. 다른 기기와 동기화되지 않으며 브라우저 데이터를 삭제하면 기록도 지워집니다.</p>
      <LearningStorageNotice />
      {!ready ? <p className="learning-loading" role="status">저장된 학습 기록을 불러오는 중입니다.</p> : <>
        <div className="learning-stats" aria-label="학습 진행 요약">
          <div><span>읽기 완료</span><strong data-learning-count="read">{summary.read}<small> / {lessons.length}</small></strong></div>
          <div><span>퀴즈 확인</span><strong data-learning-count="checked">{summary.checked}<small> / {lessons.length}</small></strong></div>
          <div><span>모두 정답</span><strong data-learning-count="mastered">{summary.mastered}<small> / {lessons.length}</small></strong></div>
          <div><span>복습 필요</span><strong data-learning-count="review">{summary.review}<small>개 개념</small></strong></div>
        </div>
        <div className="learning-progress-meter"><label htmlFor="reading-progress">읽기 진행률 <b>{Math.round(summary.read / lessons.length * 100)}%</b></label><progress id="reading-progress" max={lessons.length} value={summary.read}>{summary.read} / {lessons.length}</progress></div>
        <div className="learning-resume">
          {resume ? <><div><span>{resume.reason === 'reading' ? (summary.read ? '이어서 읽어보세요' : '지금 시작하거나 이어서 읽기') : resume.reason === 'review' ? '이 개념을 복습해보세요' : '퀴즈로 학습을 확인해보세요'}</span><strong>{resume.lesson.title}</strong></div><a className="button navy" data-learning-resume={resume.lesson.id} href={`/concept/${resume.lesson.id}/${resume.reason !== 'reading' ? '#quiz' : ''}`}>{resume.reason === 'reading' ? '이어서 읽기' : '학습 확인'} →</a></>
            : <><div><span>전체 학습 확인 완료</span><strong>30개 개념을 읽고 모든 퀴즈를 맞혔어요.</strong></div><a className="button navy" href="/encyclopedia/">관심 개념 다시 보기</a></>}
        </div>
        <details className="learning-records">
          <summary>개념별 학습 기록 보기 <span>{summary.inProgress ? `답변 중 ${summary.inProgress}개 · ` : ''}복습 필요 {summary.review}개</span></summary>
          <div className="filter-chips learning-record-filters" role="group" aria-label="학습 기록 종류">
            {filters.map(([key, label, count]) => <button type="button" key={key} className={`filter${filter === key ? ' active' : ''}`} aria-pressed={filter === key} data-learning-filter={key} onClick={() => setFilter(key)}>{label} {count}</button>)}
          </div>
          <p className="sr-only" role="status">{matches.length}개 학습 기록</p>
          {matches.length ? <ul className="learning-record-list">{matches.map(lesson => {
            const status = getLessonProgress(progress, lesson);
            return <li key={lesson.id} data-learning-record={lesson.id}>
              <div><a href={`/concept/${lesson.id}/`}>{String(lesson.number).padStart(2, '0')} · {lesson.title}</a><p>{status.read ? '읽기 완료' : status.visited ? '읽는 중' : '아직 읽지 않음'} · {status.checked ? `최근 퀴즈 ${status.score}/${status.total}` : '퀴즈 미응시'}{status.draft !== null ? ` · ${status.draftCount}/${status.total} 답변 중` : ''}</p></div>
              <a className="learning-record-action" href={`/concept/${lesson.id}/#quiz`}>{status.draft !== null ? '퀴즈 이어 풀기' : status.needsReview ? '해설로 복습' : status.checked ? '결과 보기' : '퀴즈 풀기'} ↗</a>
            </li>;
          })}</ul> : <p className="learning-record-empty">이 조건에 해당하는 학습 기록이 없어요.</p>}
        </details>
      </>}
    </section>
  );
}
