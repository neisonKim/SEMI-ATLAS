'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { commitLearningAction, emptyLearningProgress, learningStorageKey, loadLearningProgress } from '@/lib/learning-progress.mjs';

const LearningContext = createContext(null);

export default function LearningProvider({ lessons, children }) {
  const [progress, setProgress] = useState(emptyLearningProgress);
  const [storageStatus, setStorageStatus] = useState('loading');
  const memory = useRef(progress);
  const storageRef = useRef(null);
  const ready = storageStatus !== 'loading';

  useEffect(() => {
    const load = () => {
      let result;
      try {
        storageRef.current = window.localStorage;
        result = loadLearningProgress(storageRef.current, lessons);
      } catch {
        result = { progress: emptyLearningProgress(), status: 'temporary' };
      }
      if (result.status !== 'saved') storageRef.current = null;
      memory.current = result.progress;
      setProgress(result.progress);
      setStorageStatus(result.status);
    };
    load();
    const onStorage = event => {
      if (event.key === learningStorageKey || event.key === null) load();
    };
    const onPageShow = event => { if (event.persisted) load(); };
    window.addEventListener('storage', onStorage);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [lessons]);

  const dispatch = useCallback(action => {
    const result = commitLearningAction(storageRef.current, memory.current, action, lessons);
    memory.current = result.progress;
    if (result.status !== 'saved') storageRef.current = null;
    setProgress(result.progress);
    setStorageStatus(current => current === 'unreadable' ? current : result.status);
  }, [lessons]);

  const value = useMemo(() => ({ progress, lessons, ready, storageStatus, dispatch }), [progress, lessons, ready, storageStatus, dispatch]);
  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const value = useContext(LearningContext);
  if (!value) throw new Error('LearningProvider is required.');
  return value;
}

export function LearningStorageNotice() {
  const { storageStatus } = useLearning();
  if (storageStatus === 'saved' || storageStatus === 'loading') return null;
  return <p className="learning-storage-notice" role="status">{storageStatus === 'unreadable'
    ? '이전에 저장된 기록을 읽을 수 없어 이번 학습은 임시로 기록 중입니다. 기존 기록은 덮어쓰지 않으며, 페이지를 떠나면 새 기록이 사라질 수 있습니다.'
    : '이 브라우저에서 학습 기록을 저장할 수 없어 임시로 기록 중입니다. 페이지를 떠나거나 새로고침하면 기록이 사라질 수 있습니다.'}</p>;
}
