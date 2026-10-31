'use client';

import { useRef, useState } from 'react';
import { useLearning, LearningStorageNotice } from './LearningProvider';
import { ReadCompletionButton } from './LessonProgress';
import { getLessonProgress } from '@/lib/learning-progress.mjs';
import { explanationModeForReview, explanationModes } from '@/lib/concept-review.mjs';

const reviewLabels = { what: '무엇인가요?', why: '왜 필요한가요?', how: '작동 원리', structure: '구조', misconceptions: '흔한 오해', question: '자주 묻는 질문' };

export default function ConceptQuiz({ conceptId, questions }) {
  const { progress, lessons, ready, storageStatus, dispatch } = useLearning();
  const status = getLessonProgress(progress, lessons.find(item => item.id === conceptId));
  const showResult = Boolean(status.latest && status.draft === null);
  const answers = status.draft || status.latest?.answers || {};
  const [error, setError] = useState('');
  const resultRef = useRef(null);

  const submit = event => {
    event.preventDefault();
    const missing = questions.find(question => !answers[question.id]);
    if (missing) {
      setError('아직 답하지 않은 문항이 있어요. 모든 문항을 선택한 뒤 확인해주세요.');
      document.getElementById(`${missing.id}-a`)?.focus();
      return;
    }
    setError('');
    dispatch({ type: 'submit', conceptId });
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  const retry = () => {
    dispatch({ type: 'retry', conceptId });
    setError('');
    requestAnimationFrame(() => document.getElementById(`${questions[0].id}-a`)?.focus());
  };

  return (
    <section id="quiz" className="concept-quiz" aria-labelledby="quiz-title" data-quiz-concept={conceptId}>
      <span className="eyebrow">CHECK YOUR UNDERSTANDING</span>
      <h2 id="quiz-title">배운 내용을 확인해보세요.</h2>
      <p>짧은 {questions.length}문항으로 핵심을 점검합니다. 틀린 답은 해설을 읽고 다시 풀어보세요.</p>
      <LearningStorageNotice />
      <noscript><p>퀴즈 채점과 진도 저장을 사용하려면 JavaScript를 켜주세요.</p></noscript>
      {showResult && <div className={`quiz-result${status.mastered ? ' quiz-result-complete' : ''}`} role="status" tabIndex={-1} ref={resultRef} data-quiz-score={status.score}>
        <strong>최근 결과 · {status.score} / {status.total} 정답</strong>
        <p>{status.mastered ? '모든 문항을 맞혔어요. 연결된 다음 개념으로 이어가보세요.' : '아래 해설과 다시 읽기 링크로 헷갈린 내용을 확인해보세요.'}</p>
        <button type="button" className="text-button" onClick={retry}>다시 풀기</button>
      </div>}
      <form className="quiz-form" onSubmit={submit} aria-label="개념 확인 퀴즈">
        {questions.map((question, index) => {
          const selected = answers[question.id];
          const correct = selected === question.correct;
          return <div className="quiz-question" key={question.id} data-question-id={question.id}>
            <fieldset>
              <legend><span>{String(index + 1).padStart(2, '0')}</span> {question.question}</legend>
              <div className="quiz-options">
                {question.options.map(option => <label key={option.id} className={`quiz-option${selected === option.id ? ' is-selected' : ''}${showResult && question.correct === option.id ? ' is-correct' : ''}${showResult && selected === option.id && !correct ? ' is-wrong' : ''}`}>
                  <input type="radio" id={`${question.id}-${option.id}`} name={question.id} value={option.id}
                    checked={selected === option.id} disabled={!ready || showResult}
                    onChange={() => { setError(''); dispatch({ type: 'answer', conceptId, questionId: question.id, optionId: option.id }); }} />
                  <span>{option.text}</span>
                  {showResult && (selected === option.id || question.correct === option.id) && <b className="quiz-option-note">{selected === option.id ? '선택한 답' : ''}{selected === option.id && question.correct === option.id ? ' · ' : ''}{question.correct === option.id ? '정답' : ''}</b>}
                </label>)}
              </div>
            </fieldset>
            {showResult && <div className={`quiz-feedback${correct ? ' correct' : ' incorrect'}`}>
              <strong>{correct ? '정답이에요.' : '다시 확인해보세요.'}</strong>
              <p>{question.explanation}</p>
              <div className="quiz-review-links">
                <a href={`#${question.review}`}>다시 읽기 · {reviewLabels[question.review]} ↑</a>
                <a href={`#explain-${explanationModeForReview(question.review)}`}>관련 설명 · {explanationModes.find(mode => mode.id === explanationModeForReview(question.review)).label} ↑</a>
                <a href="#concept-diagram">구조도로 확인 ↑</a>
              </div>
            </div>}
          </div>;
        })}
        {error && <p className="quiz-error" role="alert">{error}</p>}
        {!showResult && <div className="quiz-submit-row">
          <span>{ready ? `${status.draftCount} / ${questions.length}문항 선택` : '학습 기록을 불러오는 중입니다.'}</span>
          <button type="submit" className="button navy" disabled={!ready}>정답과 해설 확인</button>
        </div>}
      </form>
      <div className="lesson-completion">
        <div><strong>{status.read ? '읽기 완료로 기록했어요.' : '설명을 모두 읽었나요?'}</strong><p>읽기 완료와 퀴즈 결과는 각각 기록합니다.</p></div>
        <ReadCompletionButton conceptId={conceptId} />
      </div>
      <p className="learning-save-note">{storageStatus === 'saved' ? '선택한 답안과 결과는 이 브라우저에 자동 저장됩니다. ' : ''}<a href="/learn/#my-progress">내 학습 현황 보기 →</a></p>
    </section>
  );
}
