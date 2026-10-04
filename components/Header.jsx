'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MenuIcon, SearchIcon } from './Icons';

const navItems = [
  ['learn', '/learn/', '처음 배우기'],
  ['encyclopedia', '/encyclopedia/', '백과사전'],
  ['visual', '/visual/', '한눈에 보기'],
  ['industry', '/industry/', '산업 지도'],
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [brandLoading, setBrandLoading] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

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

  useEffect(() => setOpen(false), [pathname]);

  const onBrandClick = (event) => {
    // Preserve normal browser behavior for open-in-new-tab / modified clicks.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

    event.preventDefault();
    if (brandLoading) return;

    setOpen(false);
    setBrandLoading(true);

    // Keep the transition visible briefly so the brand motion feels intentional,
    // then perform a normal navigation that also works with static export hosting.
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
      <header className="site-header">
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
            <a className="icon-button" href="/encyclopedia/#search" aria-label="용어 검색"><SearchIcon /></a>
            <a className="button mint header-start" href="/concept/semiconductor/">첫 개념 읽기</a>
            <button
              ref={buttonRef}
              id="menu-toggle"
              className="icon-button menu-toggle"
              type="button"
              aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((value) => !value)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
        <nav ref={menuRef} id="mobile-nav" className="mobile-nav" aria-label="모바일 메뉴" hidden={!open}>
          <a href="/learn/">처음 배우기</a>
          <a href="/encyclopedia/">백과사전</a>
          <a href="/visual/">한눈에 보기</a>
          <a href="/industry/">산업 지도</a>
          <a href="/process/">반도체 공정</a>
          <a href="/packaging/">패키징</a>
        </nav>
      </header>
      {brandLoading && (
        <div className="brand-loading-overlay" role="status" aria-live="polite" aria-label="홈으로 이동 중">
          <div className="brand-loading-mark" aria-hidden="true">
            <span className="brand-loading-ring" />
            <span className="brand-loading-logo">
              <img src="/favicon.svg" alt="" width="54" height="54" />
            </span>
          </div>
          <div className="brand-loading-copy">
            <strong>SEMI ATLAS</strong>
            <span>KNOWLEDGE, CONNECTED.</span>
          </div>
        </div>
      )}
    </>
  );
}
