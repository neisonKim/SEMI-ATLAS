'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SearchIcon } from './Icons';
import { categories, concepts, levels } from '@/lib/data.mjs';
import { suggestConcepts } from '@/lib/search.mjs';

const navItems = [
  ['learn', '/learn/', '처음 배우기'],
  ['encyclopedia', '/encyclopedia/', '백과사전'],
  ['visual', '/visual/', '한눈에 보기'],
  ['industry', '/industry/', '산업 지도'],
];

const categoryNames = Object.fromEntries(categories.map((item) => [item.id, item.name]));

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);
  const [brandLoading, setBrandLoading] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const searchButtonRef = useRef(null);
  const searchPanelRef = useRef(null);
  const searchInputRef = useRef(null);

  const searchSuggestions = useMemo(
    () => suggestConcepts(concepts, { query: searchQuery, limit: 5 }),
    [searchQuery],
  );

  useEffect(() => {
    const onPointer = (event) => {
      if (!open) return;
      if (menuRef.current?.contains(event.target) || buttonRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const media = window.matchMedia('(min-width:851px)');
    const onMedia = (event) => {
      if (event.matches) setOpen(false);
    };
    document.addEventListener('click', onPointer);
    document.addEventListener('keydown', onKey);
    media.addEventListener('change', onMedia);
    return () => {
      document.removeEventListener('click', onPointer);
      document.removeEventListener('keydown', onKey);
      media.removeEventListener('change', onMedia);
    };
  }, [open]);

  useEffect(() => {
    const onPointer = (event) => {
      if (!searchOpen) return;
      if (searchPanelRef.current?.contains(event.target) || searchButtonRef.current?.contains(event.target)) return;
      setSearchOpen(false);
      setActiveSearchIndex(-1);
    };
    const onKey = (event) => {
      if (event.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        setActiveSearchIndex(-1);
        searchButtonRef.current?.focus();
      }
    };
    document.addEventListener('click', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [searchOpen]);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
    setActiveSearchIndex(-1);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const media = window.matchMedia('(max-width:850px)');
    if (!media.matches) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const openSearch = () => {
    setOpen(false);
    setSearchOpen(true);
    window.requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  const goToSearchSuggestion = (index = 0) => {
    const target = searchSuggestions[index]?.concept;
    if (!target) return false;
    window.location.assign(`/concept/${target.id}/`);
    return true;
  };

  const onSearchToggle = () => {
    if (!searchOpen) {
      openSearch();
      return;
    }
    if (searchQuery.trim() && goToSearchSuggestion(activeSearchIndex >= 0 ? activeSearchIndex : 0)) return;
    setSearchOpen(false);
    setActiveSearchIndex(-1);
  };

  const onSearchSubmit = (event) => {
    event.preventDefault();
    if (goToSearchSuggestion(activeSearchIndex >= 0 ? activeSearchIndex : 0)) return;
    searchInputRef.current?.focus();
  };

  const onSearchKeyDown = (event) => {
    if (event.key === 'ArrowDown' && searchSuggestions.length) {
      event.preventDefault();
      setActiveSearchIndex((current) => (current + 1) % searchSuggestions.length);
      return;
    }
    if (event.key === 'ArrowUp' && searchSuggestions.length) {
      event.preventDefault();
      setActiveSearchIndex((current) => (current <= 0 ? searchSuggestions.length - 1 : current - 1));
      return;
    }
    if (event.key === 'Enter' && searchSuggestions.length) {
      event.preventDefault();
      goToSearchSuggestion(activeSearchIndex >= 0 ? activeSearchIndex : 0);
    }
  };

  const onBrandClick = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (brandLoading) return;
    setOpen(false);
    setSearchOpen(false);
    setBrandLoading(true);
    window.setTimeout(() => {
      window.location.assign('/');
    }, 620);
  };

  const isActive = (key) => {
    if (key === 'learn') return pathname.startsWith('/learn');
    if (key === 'encyclopedia') return pathname.startsWith('/encyclopedia') || pathname.startsWith('/concept');
    if (key === 'visual') return pathname.startsWith('/visual') || pathname.startsWith('/process') || pathname.startsWith('/packaging');
    if (key === 'industry') return pathname.startsWith('/industry');
    return false;
  };

  return (
    <>
      <a href="#main" className="skip-link">본문 바로가기</a>
      <header className={`site-header${open ? ' menu-open' : ''}${searchOpen ? ' search-open' : ''}`}>
        <div className="header-inner">
          <a className="brand" href="/" aria-label="반도체 백과사전 홈" onClick={onBrandClick}>
            <img src="/favicon.svg" alt="" width="36" height="36" />
            <span>
              <b>반도체 백과사전</b>
              <small>SEMICONDUCTOR ENCYCLOPEDIA</small>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="주요 메뉴">
            {navItems.map(([key, href, label]) => (
              <a key={key} href={href} aria-current={isActive(key) ? 'page' : undefined}>{label}</a>
            ))}
          </nav>
          <div className="header-actions">
            <form
              ref={searchPanelRef}
              className={`header-direct-search${searchOpen ? ' is-open' : ''}`}
              role="search"
              onSubmit={onSearchSubmit}
            >
              <div className="header-direct-search-input-wrap" aria-hidden={!searchOpen}>
                <label className="sr-only" htmlFor="header-direct-search-input">반도체 용어 검색</label>
                <input
                  ref={searchInputRef}
                  id="header-direct-search-input"
                  type="search"
                  inputMode="search"
                  autoComplete="off"
                  placeholder="웨이퍼, HBM, 노광…"
                  value={searchQuery}
                  tabIndex={searchOpen ? 0 : -1}
                  aria-expanded={searchOpen && searchSuggestions.length > 0}
                  aria-controls="header-direct-search-suggestions"
                  aria-activedescendant={activeSearchIndex >= 0 ? `header-direct-search-suggestion-${activeSearchIndex}` : undefined}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setActiveSearchIndex(-1);
                  }}
                  onKeyDown={onSearchKeyDown}
                />
              </div>
              <button
                ref={searchButtonRef}
                className={`icon-button header-search-toggle${searchOpen ? ' is-open' : ''}`}
                type="button"
                aria-label={searchOpen ? '검색 실행 또는 닫기' : '용어 검색'}
                aria-expanded={searchOpen}
                aria-controls="header-direct-search-input"
                onClick={onSearchToggle}
              >
                <SearchIcon />
              </button>

              {searchOpen && searchQuery.trim() && searchSuggestions.length > 0 && (
                <div
                  className="autocomplete-panel header-direct-search-results"
                  id="header-direct-search-suggestions"
                  role="listbox"
                  aria-label="추천 개념"
                >
                  <div className="autocomplete-kicker">추천 개념</div>
                  {searchSuggestions.map(({ concept, reason }, index) => (
                    <a
                      id={`header-direct-search-suggestion-${index}`}
                      role="option"
                      aria-selected={activeSearchIndex === index}
                      className={`autocomplete-item${activeSearchIndex === index ? ' active' : ''}`}
                      href={`/concept/${concept.id}/`}
                      key={concept.id}
                      onMouseEnter={() => setActiveSearchIndex(index)}
                    >
                      <span className="autocomplete-index">{String(concept.num).padStart(2, '0')}</span>
                      <span className="autocomplete-copy">
                        <strong>{concept.title}</strong>
                        <small>{concept.en}</small>
                      </span>
                      <span className="autocomplete-meta">
                        <b>{reason === 'connected' ? '연결 개념' : categoryNames[concept.category]}</b>
                        <small>{levels[concept.level]}</small>
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </form>
            <a className="button mint header-start" href="/concept/semiconductor/">첫 개념 읽기</a>
            <button
              ref={buttonRef}
              id="menu-toggle"
              className={`icon-button menu-toggle${open ? ' is-open' : ''}`}
              type="button"
              aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => {
                setSearchOpen(false);
                setOpen((value) => !value);
              }}
            >
              <span className="menu-glyph" aria-hidden="true"><span /><span /><span /></span>
            </button>
          </div>
        </div>

        <nav
          ref={menuRef}
          id="mobile-nav"
          className={`mobile-nav${open ? ' is-open' : ''}`}
          aria-label="모바일 메뉴"
          aria-hidden={!open}
        >
          <a href="/learn/">처음 배우기</a>
          <a href="/encyclopedia/">백과사전</a>
          <a href="/visual/">한눈에 보기</a>
          <a href="/industry/">산업 지도</a>
          <a href="/process/">반도체 공정</a>
          <a href="/packaging/">패키징</a>
        </nav>
      </header>
      <button
        className={`mobile-menu-scrim${open ? ' is-open' : ''}`}
        type="button"
        aria-label="모바일 메뉴 닫기"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
      />
      {brandLoading && (
        <div className="brand-loading-overlay" role="status" aria-live="polite" aria-label="홈으로 이동 중">
          <div className="brand-loading-mark" aria-hidden="true">
            <span className="brand-loading-ring" />
            <span className="brand-loading-logo"><img src="/favicon.svg" alt="" width="54" height="54" /></span>
          </div>
          <div className="brand-loading-copy"><strong>SEMI ATLAS</strong><span>KNOWLEDGE, CONNECTED.</span></div>
        </div>
      )}
    </>
  );
}
