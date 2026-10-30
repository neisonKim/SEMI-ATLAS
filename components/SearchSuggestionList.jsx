'use client';

import { useEffect, useRef } from 'react';

export default function SearchSuggestionList({ id, items, activeIndex, onActiveChange, href, className = '' }) {
  const activeRef = useRef(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return (
    <div className={`autocomplete-panel unified-suggestions ${className}`.trim()}>
      <div className="autocomplete-kicker">개념·기업 통합 검색</div>
      <div id={id} role="listbox" aria-label="개념·기업 검색 추천">
        {items.map((item, index) => (
          <a
            id={`${id}-${index}`}
            key={item.key}
            ref={activeIndex === index ? activeRef : null}
            href={item.href}
            role="option"
            aria-selected={activeIndex === index}
            className={`autocomplete-item unified-suggestion${activeIndex === index ? ' active' : ''}`}
            onMouseDown={event => event.preventDefault()}
            onMouseEnter={() => onActiveChange(index)}
          >
            <span className={`search-kind search-kind-${item.kind}`}>{item.kind === 'concept' ? '개념' : '기업'}</span>
            <span className="autocomplete-copy">
              <strong>{item.title}</strong>
              <small>{item.en}</small>
            </span>
            <span className="search-result-arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
      <p className={items.length ? 'sr-only' : 'autocomplete-empty'} role="status" aria-live="polite">
        {items.length ? `${items.length}개 추천. 위아래 방향키로 선택하고 Enter로 이동하세요.` : '일치하는 개념이나 기업이 없어요. 다른 이름이나 짧은 검색어를 입력해보세요.'}
      </p>
      <a className="autocomplete-all" href={href}>전체 검색 결과 보기 <span aria-hidden="true">→</span></a>
    </div>
  );
}
